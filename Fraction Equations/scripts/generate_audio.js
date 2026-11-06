// Audio generation script using ElevenLabs Alice voice
// Rule: Read key ONLY from process.env.ELEVENLABS_API_KEY. Never commit keys.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { NARRATION } from '../src/utils/fractionsNarration.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice
const MODEL_ID = 'eleven_multilingual_v2';

const OUTPUT_DIR = path.resolve(__dirname, '../public/assets/audio/fractions');
const AUDIO_MAP_FILE = path.resolve(__dirname, '../src/utils/audioMap.js');

const VOICE_PRESETS = {
  statement: { stability: 0.50, similarity_boost: 0.75, style: 0.00 },
  question: { stability: 0.45, similarity_boost: 0.75, style: 0.15 },
  encouragement: { stability: 0.40, similarity_boost: 0.80, style: 0.25 },
  celebration: { stability: 0.35, similarity_boost: 0.85, style: 0.35 },
  emphasis: { stability: 0.55, similarity_boost: 0.80, style: 0.10 },
  thinking: { stability: 0.60, similarity_boost: 0.70, style: 0.05 },
  instruction: { stability: 0.50, similarity_boost: 0.75, style: 0.00 }
};

async function generateClip(text, presetName, filename) {
  if (!API_KEY) {
    console.warn(`[SKIP] No ELEVENLABS_API_KEY set. Skipping clip: ${filename}`);
    return null;
  }

  const voiceSettings = VOICE_PRESETS[presetName] || VOICE_PRESETS.statement;
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': API_KEY
      },
      body: JSON.stringify({
        text,
        model_id: MODEL_ID,
        voice_settings: voiceSettings
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error(`[ERROR] ElevenLabs API error for ${filename}:`, err);
      return null;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const destPath = path.join(OUTPUT_DIR, filename);
    fs.writeFileSync(destPath, buffer);
    console.log(`[SUCCESS] Generated: ${filename}`);
    return `/assets/audio/fractions/${filename}`;
  } catch (e) {
    console.error(`[EXCEPTION] Failed to generate ${filename}:`, e.message);
    return null;
  }
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const clipsToGenerate = [];

  // Wonder lines
  clipsToGenerate.push({
    text: NARRATION.wonder.intro.spoken || NARRATION.wonder.intro.text,
    keyText: NARRATION.wonder.intro.text,
    style: NARRATION.wonder.intro.style,
    file: 'wonder_intro.mp3'
  });

  Object.values(NARRATION.wonder).forEach((item, idx) => {
    if (item.spoken || item.answer) {
      clipsToGenerate.push({
        text: item.spoken || item.answer,
        keyText: item.answer || item.text,
        style: item.style || 'statement',
        file: `wonder_${idx}.mp3`
      });
    }
  });

  // Story slides
  NARRATION.story.forEach((slide, idx) => {
    clipsToGenerate.push({
      text: slide.narration,
      keyText: slide.narration,
      style: slide.style || 'statement',
      file: `story_slide_${idx + 1}.mp3`
    });
  });

  const audioMap = {};

  for (const clip of clipsToGenerate) {
    const webPath = await generateClip(clip.text, clip.style, clip.file);
    if (webPath) {
      audioMap[clip.keyText] = webPath;
    }
  }

  // Update audioMap.js
  const mapContent = `// Auto-generated audio map for Fraction Equations\n\nexport default ${JSON.stringify(audioMap, null, 2)};\n`;
  fs.writeFileSync(AUDIO_MAP_FILE, mapContent, 'utf-8');
  console.log(`Updated ${AUDIO_MAP_FILE}`);
}

main();
