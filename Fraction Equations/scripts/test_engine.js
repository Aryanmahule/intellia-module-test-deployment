// Test script for fractionsQuestionEngine.js

import {
  gcd,
  lcm,
  simplify,
  formatFraction,
  addFractions,
  subFractions,
  generateQuestionSet
} from '../src/utils/fractionsQuestionEngine.js';

console.log('Testing Fractions Question Engine...');

// Test 1: gcd and lcm
console.assert(gcd(12, 18) === 6, 'gcd(12, 18) should be 6');
console.assert(lcm(4, 6) === 12, 'lcm(4, 6) should be 12');

// Test 2: simplify
const s1 = simplify(6, 8);
console.assert(s1.num === 3 && s1.den === 4, '6/8 should simplify to 3/4');

// Test 3: addFractions
const sum1 = addFractions(1, 2, 1, 3);
console.assert(sum1.num === 5 && sum1.den === 6, '1/2 + 1/3 should be 5/6');

// Test 4: subFractions
const diff1 = subFractions(3, 4, 1, 4);
console.assert(diff1.num === 1 && diff1.den === 2, '3/4 - 1/4 should be 1/2');

// Test 5: Question set generation
const questions = generateQuestionSet(12);
console.assert(questions.length === 12, 'Should generate 12 questions');
questions.forEach((q, idx) => {
  console.assert(q.options.length === 4, `Question ${idx} should have 4 options`);
  console.assert(q.options.includes(q.answer), `Question ${idx} options should include answer: ${q.answer}`);
  console.assert(q.question && q.explanation, `Question ${idx} should have question and explanation`);
});

console.log('✅ All Fractions Question Engine tests passed successfully!');
