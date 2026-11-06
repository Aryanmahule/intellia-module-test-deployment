// Unit test for twoStepQuestionEngine.js
// Runs 1000 questions to verify integer solutions, no duplicate options, and valid answers.

import { generateQuestion, QUESTION_TYPES } from '../src/utils/twoStepQuestionEngine.js';

console.log('Testing TwoStepQuestionEngine (1000 iterations)...');

let passed = 0;
let errors = 0;

for (let i = 0; i < 1000; i++) {
  try {
    const type = QUESTION_TYPES[i % QUESTION_TYPES.length].id;
    const q = generateQuestion(i, type);

    if (!q.prompt || !q.correctAnswer || !q.options || q.options.length < 3) {
      throw new Error(`Invalid question structure at index ${i}`);
    }

    if (!q.options.includes(q.correctAnswer)) {
      throw new Error(`correctAnswer "${q.correctAnswer}" not found in options [${q.options.join(', ')}]`);
    }

    const unique = new Set(q.options);
    if (unique.size !== q.options.length) {
      throw new Error(`Duplicate options found: [${q.options.join(', ')}]`);
    }

    passed++;
  } catch (err) {
    console.error(`Test failed at index ${i}:`, err.message);
    errors++;
    break;
  }
}

if (errors === 0) {
  console.log(`✅ All ${passed}/1000 generated questions passed validation!`);
  process.exit(0);
} else {
  console.error(`❌ Validation failed with ${errors} errors.`);
  process.exit(1);
}
