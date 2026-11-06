// Question engine for Bracket Equations (Grade 7)
// Generates diverse questions with plausible distractors, hints, and step-by-step solutions.

export const QUESTION_TYPES = [
  'distributiveExpansion',
  'singleBracketSolve',
  'negativeMultiplier',
  'findMissingNumber',
  'bracketsBothSides',
  'wordProblem'
];

// Helper to shuffle options deterministically
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 1. Distributive Expansion: e.g. Expand 4(2x + 3)
function generateDistributiveExpansion() {
  const a = Math.floor(Math.random() * 5) + 2; // 2 to 6
  const coeff = Math.floor(Math.random() * 3) + 1; // 1 to 3
  const b = Math.floor(Math.random() * 8) + 2; // 2 to 9
  const isMinus = Math.random() > 0.5;

  const sign = isMinus ? '−' : '+';
  const varPart = coeff === 1 ? 'x' : `${coeff}x`;
  const expr = `${a}(${varPart} ${sign} ${b})`;

  const finalCoeff = a * coeff;
  const finalConst = a * b;
  const correct = `${finalCoeff}x ${sign} ${finalConst}`;

  // Distractors based on common student mistakes
  const d1 = `${finalCoeff}x ${sign} ${b}`; // forgot to multiply second term (#1 error!)
  const d2 = `${coeff}x ${sign} ${finalConst}`; // forgot to multiply first term
  const d3 = `${finalCoeff}x ${isMinus ? '+' : '−'} ${finalConst}`; // wrong sign

  const rawOptions = [correct, d1, d2, d3];
  const uniqueOptions = Array.from(new Set(rawOptions));
  while (uniqueOptions.length < 4) {
    uniqueOptions.push(`${finalCoeff + 2}x ${sign} ${finalConst + 2}`);
  }

  const options = shuffle(uniqueOptions);

  return {
    type: 'distributiveExpansion',
    badge: 'Distributive Law',
    prompt: `Expand the brackets:`,
    equation: expr,
    options,
    answerIndex: options.indexOf(correct),
    hint: `Multiply the outside number ${a} by EVERY term inside: ${a} × ${varPart} and ${a} × ${b}.`,
    explanation: `Using the distributive law: ${a} × ${varPart} = ${finalCoeff}x, and ${a} × (${sign}${b}) = ${sign}${finalConst}. So the expanded form is ${correct}.`
  };
}

// 2. Single Bracket Equation: e.g. Solve 3(x + 4) = 27
function generateSingleBracketSolve() {
  const a = Math.floor(Math.random() * 4) + 2; // 2 to 5
  const xVal = Math.floor(Math.random() * 8) + 2; // 2 to 9
  const b = Math.floor(Math.random() * 7) + 1; // 1 to 7
  const isMinus = Math.random() > 0.6;

  let eqConst, rightSide;
  if (isMinus) {
    if (xVal <= b) {
      // Keep x positive
      return generateSingleBracketSolve();
    }
    eqConst = `x − ${b}`;
    rightSide = a * (xVal - b);
  } else {
    eqConst = `x + ${b}`;
    rightSide = a * (xVal + b);
  }

  const eq = `${a}(${eqConst}) = ${rightSide}`;
  const correct = `${xVal}`;

  // Distractors
  const d1 = `${xVal + a}`; // arithmetic error
  const d2 = `${Math.max(1, xVal - b)}`; // forgot bracket
  const d3 = `${Math.floor(rightSide / a)}`; // forgot inner term

  const rawOptions = [correct, d1, d2, d3];
  const uniqueOptions = Array.from(new Set(rawOptions));
  while (uniqueOptions.length < 4) {
    uniqueOptions.push(`${xVal + uniqueOptions.length + 1}`);
  }

  const options = shuffle(uniqueOptions);

  return {
    type: 'singleBracketSolve',
    badge: 'Solve with Brackets',
    prompt: `Solve for x:`,
    equation: eq,
    options,
    answerIndex: options.indexOf(correct),
    hint: `Method 1: Divide both sides by ${a} first (${eqConst} = ${rightSide / a}), then undo the ${b}.`,
    explanation: `Divide both sides by ${a}: ${eqConst} = ${rightSide / a}. Then isolate x by ${isMinus ? 'adding' : 'subtracting'} ${b}: x = ${correct}.`
  };
}

// 3. Negative Outside Bracket: e.g. −2(x − 5) = 14 or −3(x + 2) = −21
function generateNegativeMultiplier() {
  const a = -(Math.floor(Math.random() * 3) + 2); // -2, -3, -4
  const xVal = Math.floor(Math.random() * 7) + 2; // 2 to 8
  const b = Math.floor(Math.random() * 5) + 1; // 1 to 5
  const isMinus = Math.random() > 0.5;

  const innerStr = isMinus ? `x − ${b}` : `x + ${b}`;
  const innerVal = isMinus ? (xVal - b) : (xVal + b);
  const rightSide = a * innerVal;

  const eq = `${a}(${innerStr}) = ${rightSide}`;
  const correct = `${xVal}`;

  // Common sign errors as distractors
  const d1 = `${-xVal}`; // sign error
  const d2 = `${xVal + 2}`;
  const d3 = `${Math.abs(innerVal)}`;

  const rawOptions = [correct, d1, d2, d3];
  const uniqueOptions = Array.from(new Set(rawOptions));
  while (uniqueOptions.length < 4) {
    uniqueOptions.push(`${xVal + uniqueOptions.length + 3}`);
  }

  const options = shuffle(uniqueOptions);

  return {
    type: 'negativeMultiplier',
    badge: 'Negative Signs',
    prompt: `Solve for x:`,
    equation: eq,
    options,
    answerIndex: options.indexOf(correct),
    hint: `Divide both sides by ${a} first: ${rightSide} ÷ (${a}) = ${innerVal}. Then solve ${innerStr} = ${innerVal}.`,
    explanation: `Divide both sides by ${a}: ${innerStr} = ${rightSide} ÷ (${a}) = ${innerVal}. Then solve for x: x = ${correct}.`
  };
}

// 4. Find Missing Number: e.g. (? + 4) × 3 = 24 or 4(x + ?) = 4x + 28
function generateFindMissingNumber() {
  const isExpansion = Math.random() > 0.5;

  if (isExpansion) {
    const a = Math.floor(Math.random() * 4) + 2;
    const b = Math.floor(Math.random() * 6) + 3;
    const ab = a * b;
    const eq = `${a}(x + ?) = ${a}x + ${ab}`;
    const correct = `${b}`;
    const d1 = `${ab}`;
    const d2 = `${ab - a}`;
    const d3 = `${b + a}`;

    const options = shuffle(Array.from(new Set([correct, d1, d2, d3])));
    while (options.length < 4) options.push(`${b + options.length}`);

    return {
      type: 'findMissingNumber',
      badge: 'Find the Missing Value',
      prompt: `Find the missing number '?' that makes the statement true:`,
      equation: eq,
      options,
      answerIndex: options.indexOf(correct),
      hint: `Since ${a} × ? must equal ${ab}, divide ${ab} by ${a}.`,
      explanation: `By distributive expansion: ${a} × ? = ${ab}. Therefore ? = ${ab} ÷ ${a} = ${b}.`
    };
  } else {
    const a = Math.floor(Math.random() * 4) + 2;
    const xVal = Math.floor(Math.random() * 6) + 2;
    const b = Math.floor(Math.random() * 5) + 1;
    const rightSide = a * (xVal + b);
    const eq = `(? + ${b}) × ${a} = ${rightSide}`;
    const correct = `${xVal}`;
    const d1 = `${xVal + b}`;
    const d2 = `${rightSide / a}`;
    const d3 = `${Math.max(1, xVal - 2)}`;

    const options = shuffle(Array.from(new Set([correct, d1, d2, d3])));
    while (options.length < 4) options.push(`${xVal + options.length}`);

    return {
      type: 'findMissingNumber',
      badge: 'Find the Unknown',
      prompt: `Find the value of '?' that balances the equation:`,
      equation: eq,
      options,
      answerIndex: options.indexOf(correct),
      hint: `Undo the multiplication first: divide ${rightSide} by ${a} to get ? + ${b} = ${rightSide / a}.`,
      explanation: `Divide both sides by ${a}: ? + ${b} = ${rightSide / a}. Subtract ${b}: ? = ${correct}.`
    };
  }
}

// 5. Brackets on Both Sides: e.g. 3(x + 2) = 2(x + 5)
function generateBracketsBothSides() {
  const pairs = [
    { a: 3, b: 2, c: 2, d: 5, x: 4 }, // 3(x+2) = 2(x+5) -> 3x+6 = 2x+10 -> x = 4
    { a: 4, b: 1, c: 2, d: 5, x: 3 }, // 4(x+1) = 2(x+5) -> 4x+4 = 2x+10 -> 2x = 6 -> x = 3
    { a: 5, b: 2, c: 3, d: 6, x: 4 }, // 5(x+2) = 3(x+6) -> 5x+10 = 3x+18 -> 2x = 8 -> x = 4
    { a: 3, b: 4, c: 2, d: 8, x: 4 }, // 3(x+4) = 2(x+8) -> 3x+12 = 2x+16 -> x = 4
    { a: 4, b: 2, c: 3, d: 4, x: 4 }, // 4(x+2) = 3(x+4) -> 4x+8 = 3x+12 -> x = 4
    { a: 2, b: 7, c: 3, d: 3, x: 5 }, // 2(x+7) = 3(x+3) -> 2x+14 = 3x+9 -> x = 5
    { a: 5, b: 1, c: 2, d: 7, x: 3 }  // 5(x+1) = 2(x+7) -> 5x+5 = 2x+14 -> 3x = 9 -> x = 3
  ];

  const item = pairs[Math.floor(Math.random() * pairs.length)];
  const eq = `${item.a}(x + ${item.b}) = ${item.c}(x + ${item.d})`;
  const correct = `${item.x}`;

  const d1 = `${item.x + 1}`;
  const d2 = `${Math.max(1, item.x - 1)}`;
  const d3 = `${item.x + 2}`;

  const options = shuffle([correct, d1, d2, d3]);

  const expL = `${item.a}x + ${item.a * item.b}`;
  const expR = `${item.c}x + ${item.c * item.d}`;

  return {
    type: 'bracketsBothSides',
    badge: 'Brackets on Both Sides',
    prompt: `Solve for x:`,
    equation: eq,
    options,
    answerIndex: options.indexOf(correct),
    hint: `Expand both sides first: ${expL} = ${expR}. Then collect variable terms on one side.`,
    explanation: `1. Expand brackets: ${expL} = ${expR}. 2. Subtract ${item.c}x from both sides: ${item.a - item.c}x + ${item.a * item.b} = ${item.c * item.d}. 3. Solve for x: x = ${correct}.`
  };
}

// 6. Word Problem (Singapore Context)
function generateWordProblem() {
  const problems = [
    {
      story: "Maya buys 4 cups of bubble tea for her friends. Each cup costs $d and has an added $2 topping fee. The total bill is $24.",
      equation: "4(d + 2) = 24",
      correct: "4",
      options: ["4", "5", "6", "3"],
      hint: "Divide $24 by 4 cups to find the price of 1 cup with toppings, then subtract the $2 topping.",
      explanation: "Equation: 4(d + 2) = 24. Divide both sides by 4: d + 2 = 6. Subtract 2: d = 4. Each drink costs $4."
    },
    {
      story: "Archie packs 3 identical gift boxes for a charity drive. Each box has 1 board game costing $g and 5 storybooks costing $2 each. The total cost is $45.",
      equation: "3(g + 10) = 45",
      correct: "5",
      options: ["5", "4", "7", "6"],
      hint: "5 storybooks cost $10 per box. Divide $45 by 3 boxes, then subtract $10.",
      explanation: "Equation: 3(g + 10) = 45. Divide by 3: g + 10 = 15. Subtract 10: g = 5. The board game costs $5."
    },
    {
      story: "A community garden in Jurong has a length of (x + 3) meters and a width of 5 meters. The perimeter is 28 meters. Formula: 2(length + width) = Perimeter.",
      equation: "2(x + 3 + 5) = 28  →  2(x + 8) = 28",
      correct: "6",
      options: ["6", "5", "7", "8"],
      hint: "Divide perimeter by 2 to get (length + width) = 14, then subtract 8.",
      explanation: "2(x + 8) = 28. Divide by 2: x + 8 = 14. Subtract 8: x = 6 meters."
    },
    {
      story: "Mr. Tan buys 5 sets of markers for his art students. Each set has m colored markers and 2 black outline pens. He receives 35 pens in total.",
      equation: "5(m + 2) = 35",
      correct: "5",
      options: ["5", "7", "4", "6"],
      hint: "Divide total 35 pens by 5 sets to get markers plus outline pens in 1 set.",
      explanation: "5(m + 2) = 35. Divide by 5: m + 2 = 7. Subtract 2: m = 5 markers."
    }
  ];

  const p = problems[Math.floor(Math.random() * problems.length)];
  const options = shuffle(p.options);

  return {
    type: 'wordProblem',
    badge: 'Real-World Application',
    prompt: p.story,
    equation: p.equation,
    options,
    answerIndex: options.indexOf(p.correct),
    hint: p.hint,
    explanation: p.explanation
  };
}

// Master Generator
export function generateQuestion(type) {
  switch (type) {
    case 'distributiveExpansion':
      return generateDistributiveExpansion();
    case 'singleBracketSolve':
      return generateSingleBracketSolve();
    case 'negativeMultiplier':
      return generateNegativeMultiplier();
    case 'findMissingNumber':
      return generateFindMissingNumber();
    case 'bracketsBothSides':
      return generateBracketsBothSides();
    case 'wordProblem':
      return generateWordProblem();
    default:
      return generateSingleBracketSolve();
  }
}

// Generate set of 10 balanced questions for practice
export function generateQuestionSet(count = 10) {
  const set = [];
  const types = [...QUESTION_TYPES];

  // Guarantee at least one of each type
  types.forEach(t => set.push(generateQuestion(t)));

  // Fill the rest randomly
  while (set.length < count) {
    const randomType = types[Math.floor(Math.random() * types.length)];
    set.push(generateQuestion(randomType));
  }

  return shuffle(set);
}
