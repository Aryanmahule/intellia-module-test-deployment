// src/lib/compileWorkflow.js
import OpenAI from 'openai';
import { SYSTEM_PROMPT } from './systemPrompt.js';
import { validateWorkflow } from './workflowSchema.js';

export const DEFAULT_MODEL = 'gpt-4o-mini';
const MAX_ATTEMPTS = 2; // first try + one repair pass

function extractJson(text) {
  if (!text || !text.trim()) throw new Error('Model returned an empty response.');
  let t = text.trim();
  // defensive: strip code fences if the model ignored instructions
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) t = fence[1].trim();
  const first = t.indexOf('{');
  const last = t.lastIndexOf('}');
  if (first === -1 || last === -1 || last < first) throw new Error('No JSON object found in response.');
  return JSON.parse(t.slice(first, last + 1));
}

function friendlyApiError(err) {
  const status = err?.status;
  if (status === 401) return new Error('Authentication failed (401). Check your OpenAI API key.');
  if (status === 403) return new Error('Access denied (403). Your key may lack access to this model.');
  if (status === 404) return new Error('Model not found (404). Pick a model your account can use.');
  if (status === 429) return new Error('Rate limit or quota exceeded (429). Wait a moment or check billing.');
  if (status >= 500) return new Error(`OpenAI server error (${status}). Try again shortly.`);
  return new Error(err?.message || 'Unknown API error.');
}

/**
 * Compiles natural language into a validated workflow object.
 * @returns {Promise<{workflow, warnings: string[], attempts: number, usage?: object}>}
 */
export async function compileWorkflow({
  apiKey,
  model = DEFAULT_MODEL,
  prompt,
  signal,
  onLog = () => {},
}) {
  const client = new OpenAI({
    apiKey: apiKey.trim(),
    dangerouslyAllowBrowser: true,
  });

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: prompt.trim() },
  ];

  let lastProblems = [];

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    onLog('info', `Attempt ${attempt}/${MAX_ATTEMPTS}: requesting ${model}…`);

    let completion;
    try {
      completion = await client.chat.completions.create(
        {
          model,
          temperature: 0,
          response_format: { type: 'json_object' }, // strict JSON mode
          messages,
        },
        { signal }
      );
    } catch (err) {
      if (signal?.aborted) throw err;
      throw friendlyApiError(err);
    }

    const choice = completion.choices?.[0];
    const content = choice?.message?.content ?? '';

    if (choice?.finish_reason === 'length') {
      onLog('warn', 'Response was truncated by the token limit.');
    }

    let parsed;
    try {
      parsed = extractJson(content);
    } catch (e) {
      lastProblems = [`Invalid JSON: ${e.message}`];
      onLog('warn', lastProblems[0]);
      messages.push(
        { role: 'assistant', content: content || '(empty)' },
        {
          role: 'user',
          content: `Your previous reply was not valid JSON (${e.message}). Return the COMPLETE corrected JSON object only.`,
        }
      );
      continue;
    }

    const { workflow, errors, warnings } = validateWorkflow(parsed);

    if (errors.length === 0) {
      return { workflow, warnings, attempts: attempt, usage: completion.usage };
    }

    lastProblems = errors;
    onLog('warn', `Validation failed: ${errors.join(' | ')}`);
    messages.push(
      { role: 'assistant', content },
      {
        role: 'user',
        content:
          `Your JSON failed validation with these problems:\n- ${errors.join('\n- ')}\n` +
          `Fix every problem and return the COMPLETE corrected JSON object only. ` +
          `Remember: every condition has exactly two outgoing edges (branch "true" and branch "false").`,
      }
    );
  }

  throw new Error(
    `The model could not produce a valid workflow after ${MAX_ATTEMPTS} attempts. ${lastProblems.join(' ')}`
  );
}
