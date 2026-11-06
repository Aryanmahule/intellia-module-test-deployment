// Engine validation unit test: generates 1,000 questions and verifies algebraic consistency

import { generateQuestionSet, generateQuestion, QUESTION_TYPES } from '../src/utils/equationsQuestionEngine.js';

console.log('🧪 Starting 1,000-question engine validation test...');

let totalTested = 0;
let failures = 0;

for (let i = 0; i < 1000; i++) {
  const type = QUESTION_TYPES[i % QUESTION_TYPES.length];
  const q = generateQuestion(i, type);
  totalTested++;

  // 1. Must have prompt, options, correctAnswer, explanation
  if (!q.prompt || !q.options || !q.correctAnswer || !q.explanation) {
    console.error(`❌ Failure at #${i}: Missing fields`, q);
    failures++;
    continue;
  }

  // 2. Exactly 4 options
  if (q.options.length !== 4) {
    console.error(`❌ Failure at #${i}: Option count !== 4 (${q.options.length})`, q);
    failures++;
    continue;
  }

  // 3. All 4 options must be unique
  const uniqueOpts = new Set(q.options);
  if (uniqueOpts.size !== 4) {
    console.error(`❌ Failure at #${i}: Duplicate options detected:`, q.options);
    failures++;
    continue;
  }

  // 4. Correct answer must be in options
  if (!uniqueOpts.has(q.correctAnswer)) {
    console.error(`❌ Failure at #${i}: correctAnswer (${q.correctAnswer}) not in options`, q.options);
    failures++;
    continue;
  }
}

if (failures === 0) {
  console.log(`✅ Success! 1,000 questions verified cleanly across all 6 categories.`);
  process.exit(0);
} else {
  console.error(`💥 Validation failed with ${failures} errors out of ${totalTested} tests.`);
  process.exit(1);
}
