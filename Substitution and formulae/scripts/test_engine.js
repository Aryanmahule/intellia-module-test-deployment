// Verification test for Substitution & Formulae Question Engine
// Generates 1,000 random questions and validates all properties, options uniqueness, and correctness.

import { generateQuestion, QUESTION_TYPES } from '../src/utils/formulaeQuestionEngine.js';

console.log('🧪 Starting 1,000-question engine verification test...');

let passed = 0;
let failed = 0;

for (let i = 0; i < 1000; i++) {
  try {
    const q = generateQuestion(i);

    // 1. Basic properties exist
    if (!q.id || !q.type || !q.prompt || !q.options || !q.correctAnswer || !q.explanation) {
      throw new Error(`Missing mandatory field in question index ${i}`);
    }

    // 2. Exactly 4 options
    if (q.options.length !== 4) {
      throw new Error(`Expected 4 options, got ${q.options.length} in question index ${i}`);
    }

    // 3. No duplicate options
    const unique = new Set(q.options);
    if (unique.size !== 4) {
      throw new Error(`Duplicate option detected in question ${q.id}: ${JSON.stringify(q.options)}`);
    }

    // 4. Correct answer is inside options
    if (!q.options.includes(String(q.correctAnswer))) {
      throw new Error(`Correct answer "${q.correctAnswer}" not in options: ${JSON.stringify(q.options)}`);
    }

    passed++;
  } catch (err) {
    console.error(`❌ Test failed on iteration ${i}:`, err.message);
    failed++;
  }
}

console.log(`\n================================`);
console.log(`✅ Passed: ${passed} / 1000`);
console.log(`❌ Failed: ${failed}`);
console.log(`================================\n`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 All 1,000 Question Engine tests PASSED successfully!');
}
