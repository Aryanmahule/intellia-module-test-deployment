/* =========================================================
   RATIOS QUESTION ENGINE
   Generates 6 question types with realistic misconception distractors
   ========================================================= */

export const QUESTION_TYPES = {
  partWhole: { id: 'partWhole', label: 'Parts & Whole', color: '#00e5ff' },
  equivalent: { id: 'equivalent', label: 'Same Ratio', color: '#a855f7' },
  missingValue: { id: 'missingValue', label: 'Fill the Gap', color: '#ffb800' },
  shareRatio: { id: 'shareRatio', label: 'Share It', color: '#ff5e62' },
  compareRatios: { id: 'compareRatios', label: 'Which Is Stronger?', color: '#00e5ff' },
  wordProblem: { id: 'wordProblem', label: 'Real-World', color: '#10b981' }
};

// Helper: GCD
function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

// Helper: Shuffle array
function shuffle(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// 1. Part-to-Whole generator
function genPartWhole() {
  const pairs = [
    { a: 2, b: 3, labelA: 'red counters', labelB: 'blue counters' },
    { a: 3, b: 5, labelA: 'boys', labelB: 'girls' },
    { a: 1, b: 4, labelA: 'apple pies', labelB: 'berry pies' },
    { a: 5, b: 7, labelA: 'fiction books', labelB: 'science books' }
  ];
  const item = pairs[Math.floor(Math.random() * pairs.length)];
  const total = item.a + item.b;
  const correct = `${item.a}/${total}`;

  // Misconception distractors:
  // - Part-to-part as fraction: a/b
  // - Inverted part-to-whole: b/total
  // - Inverted part-to-part: b/a
  const distractors = [
    `${item.a}/${item.b}`,
    `${item.b}/${total}`,
    `${item.b}/${item.a}`
  ];

  const uniqueOpts = Array.from(new Set([correct, ...distractors]));

  return {
    type: 'partWhole',
    prompt: `The ratio of ${item.labelA} to ${item.labelB} is ${item.a} : ${item.b}. What fraction of the whole collection is ${item.labelA}?`,
    correctAnswer: correct,
    options: shuffle(uniqueOpts),
    explanation: `Total parts = ${item.a} + ${item.b} = ${total}. Since ${item.labelA} make up ${item.a} parts, the fraction is ${item.a}/${total}.`,
    visualRatio: [item.a, item.b],
    visualLabels: [item.labelA, item.labelB]
  };
}

// 2. Equivalent & Simplest Form generator
function genEquivalent() {
  const bases = [
    [2, 3],
    [3, 5],
    [4, 7],
    [5, 8],
    [1, 4]
  ];
  const [a, b] = bases[Math.floor(Math.random() * bases.length)];
  const multiplier = [4, 6, 8, 12][Math.floor(Math.random() * 4)];
  const unsimplifiedA = a * multiplier;
  const unsimplifiedB = b * multiplier;
  const correct = `${a} : ${b}`;

  // Slips: partially simplified, inverted, subtractive error
  const partialK = Math.floor(multiplier / 2);
  const distractors = [
    `${unsimplifiedA / partialK} : ${unsimplifiedB / partialK}`,
    `${b} : ${a}`,
    `${a * 2} : ${b * 3}`
  ].filter(d => d !== correct);

  const uniqueOpts = Array.from(new Set([correct, ...distractors]));
  while (uniqueOpts.length < 4) {
    uniqueOpts.push(`${a + uniqueOpts.length} : ${b}`);
  }

  return {
    type: 'equivalent',
    prompt: `Express the ratio ${unsimplifiedA} : ${unsimplifiedB} in its simplest form:`,
    correctAnswer: correct,
    options: shuffle(uniqueOpts),
    explanation: `Divide both terms by their greatest common factor (${multiplier}): ${unsimplifiedA} ÷ ${multiplier} = ${a}, and ${unsimplifiedB} ÷ ${multiplier} = ${b}. Simplest form: ${correct}.`,
    visualRatio: [a, b],
    visualLabels: ['Term A', 'Term B']
  };
}

// 3. Missing Value generator (Fill the gap)
function genMissingValue() {
  const pairs = [
    { a: 2, b: 5, k: 3, labelA: 'blue tins', labelB: 'white tins' },
    { a: 3, b: 4, k: 4, labelA: 'lemons', labelB: 'cups of water' },
    { a: 2, b: 3, k: 5, labelA: 'cups flour', labelB: 'cups milk' },
    { a: 5, b: 6, k: 3, labelA: 'pens', labelB: 'rulers' }
  ];
  const p = pairs[Math.floor(Math.random() * pairs.length)];
  const scaledA = p.a * p.k;
  const correctNum = p.b * p.k;
  const correct = `${correctNum}`;

  // Slips:
  // Additive thinking slip: adding (scaledA - p.a) to p.b
  const addDiff = scaledA - p.a;
  const additiveSlip = `${p.b + addDiff}`;
  // Reversal slip: scaledA * p.a / p.b
  const slip2 = `${correctNum - p.k}`;
  const slip3 = `${correctNum + p.k * 2}`;

  const distractors = [additiveSlip, slip2, slip3].filter(d => d !== correct);
  const uniqueOpts = Array.from(new Set([correct, ...distractors]));

  return {
    type: 'missingValue',
    prompt: `Find the missing value in the equivalent ratio: ${p.a} : ${p.b} = ${scaledA} : ?`,
    correctAnswer: correct,
    options: shuffle(uniqueOpts),
    explanation: `Notice that ${p.a} was multiplied by ${p.k} to get ${scaledA}. Multiply the second term by ${p.k}: ${p.b} × ${p.k} = ${correct}. (Watch out: never add ${addDiff}!)`,
    visualRatio: [p.a, p.b],
    visualLabels: [p.labelA, p.labelB]
  };
}

// 4. Share It generator
function genShareRatio() {
  const scenarios = [
    { a: 3, b: 5, unit: 9, item: 'prize money', unitSymbol: '$' },
    { a: 2, b: 3, unit: 8, item: 'marbles', unitSymbol: '' },
    { a: 1, b: 4, unit: 12, item: 'bonus points', unitSymbol: '' },
    { a: 4, b: 5, unit: 6, item: 'stickers', unitSymbol: '' }
  ];
  const sc = scenarios[Math.floor(Math.random() * scenarios.length)];
  const totalParts = sc.a + sc.b;
  const totalAmount = totalParts * sc.unit;
  const shareA = sc.a * sc.unit;
  const shareB = sc.b * sc.unit;

  const correct = `${sc.unitSymbol}${shareB}`;

  // Slips:
  // - Value of 1 single part: unit
  // - The smaller share: shareA
  // - Dividing total by 2: totalAmount / 2
  const distractors = [
    `${sc.unitSymbol}${sc.unit}`,
    `${sc.unitSymbol}${shareA}`,
    `${sc.unitSymbol}${Math.round(totalAmount / 2)}`
  ].filter(d => d !== correct);

  const uniqueOpts = Array.from(new Set([correct, ...distractors]));

  return {
    type: 'shareRatio',
    prompt: `Share ${sc.unitSymbol}${totalAmount} in the ratio ${sc.a} : ${sc.b}. What is the value of the larger share?`,
    correctAnswer: correct,
    options: shuffle(uniqueOpts),
    explanation: `Total parts = ${sc.a} + ${sc.b} = ${totalParts}. 1 part = ${sc.unitSymbol}${totalAmount} ÷ ${totalParts} = ${sc.unitSymbol}${sc.unit}. Larger share = ${sc.b} × ${sc.unitSymbol}${sc.unit} = ${correct}.`,
    visualRatio: [sc.a, sc.b],
    total: totalAmount
  };
}

// 5. Compare Ratios generator
function genCompareRatios() {
  const setups = [
    {
      mixA: { a: 4, b: 9, name: 'Batch A' },
      mixB: { a: 3, b: 5, name: 'Batch B' },
      correctWinner: 'Batch B',
      expl: 'Batch A has syrup fraction 4/13 ≈ 30.8%. Batch B has syrup fraction 3/8 = 37.5%. Batch B is sweeter and stronger!'
    },
    {
      mixA: { a: 5, b: 8, name: 'Juice A' },
      mixB: { a: 3, b: 4, name: 'Juice B' },
      correctWinner: 'Juice B',
      expl: 'Juice A has concentrate fraction 5/13 ≈ 38.5%. Juice B has 3/7 ≈ 42.9%. Juice B is stronger!'
    },
    {
      mixA: { a: 2, b: 3, name: 'Mix 1' },
      mixB: { a: 5, b: 7, name: 'Mix 2' },
      correctWinner: 'Mix 2',
      expl: 'Mix 1 syrup share is 2/5 = 40.0%. Mix 2 is 5/12 ≈ 41.7%. Mix 2 is stronger!'
    }
  ];

  const item = setups[Math.floor(Math.random() * setups.length)];
  const options = [
    `${item.correctWinner} (higher active fraction)`,
    `${item.mixA.name} (has larger first number)`,
    'Both batches are equally strong',
    'Cannot be determined without volumes'
  ];

  return {
    type: 'compareRatios',
    prompt: `${item.mixA.name} mixes syrup to water in ratio ${item.mixA.a} : ${item.mixA.b}. ${item.mixB.name} mixes syrup to water in ratio ${item.mixB.a} : ${item.mixB.b}. Which mix is sweeter?`,
    correctAnswer: options[0],
    options: shuffle(options),
    explanation: item.expl
  };
}

// 6. Real-World Word Problem generator
function genWordProblem() {
  const problems = [
    {
      story: 'For a school renovation, concrete is made by mixing cement and sand in the ratio 1 : 3. If a builder uses 12 bags of sand, how many bags of cement are needed?',
      correct: '4 bags',
      options: ['4 bags', '3 bags', '9 bags', '36 bags'],
      expl: 'Sand represents 3 parts. 1 part = 12 ÷ 3 = 4 bags of cement.'
    },
    {
      story: 'A bakery makes curry puffs and sardine puffs in the ratio 4 : 1. If they baked 100 puffs in total, how many curry puffs were baked?',
      correct: '80',
      options: ['80', '20', '25', '75'],
      expl: 'Total parts = 4 + 1 = 5 parts. 1 part = 100 ÷ 5 = 20. Curry puffs = 4 × 20 = 80.'
    },
    {
      story: 'The ratio of cats to dogs in an animal shelter is 2 : 5. If there are 30 dogs, how many cats are in the shelter?',
      correct: '12',
      options: ['12', '10', '15', '25'],
      expl: 'Dogs = 5 parts = 30 → 1 part = 30 ÷ 5 = 6. Cats = 2 parts = 2 × 6 = 12 cats.'
    }
  ];

  const p = problems[Math.floor(Math.random() * problems.length)];
  return {
    type: 'wordProblem',
    prompt: p.story,
    correctAnswer: p.correct,
    options: shuffle(p.options),
    explanation: p.expl
  };
}

export function generateQuestion(index = 0, specificType = null) {
  const typeKeys = ['partWhole', 'equivalent', 'missingValue', 'shareRatio', 'compareRatios', 'wordProblem'];
  const typeKey = specificType || typeKeys[index % typeKeys.length];

  switch (typeKey) {
    case 'partWhole':
      return genPartWhole();
    case 'equivalent':
      return genEquivalent();
    case 'missingValue':
      return genMissingValue();
    case 'shareRatio':
      return genShareRatio();
    case 'compareRatios':
      return genCompareRatios();
    case 'wordProblem':
    default:
      return genWordProblem();
  }
}

export function generateQuestionSet(count = 10) {
  const set = [];
  for (let i = 0; i < count; i++) {
    set.push(generateQuestion(i));
  }
  return set;
}
