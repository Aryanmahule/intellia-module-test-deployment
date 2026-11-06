// Practice question generator for Two-Step Equations
// Section 6 Implementation Plan: 6 types with realistic misconception distractors & integer solutions

export const QUESTION_TYPES = [
  { id: 'undoOrder', label: 'Undo Order', color: 'teal', desc: 'Determine the correct first inverse operation' },
  { id: 'solveAddSub', label: 'Add & Subtract', color: 'purple', desc: 'Solve equations of the form ax + b = c and ax − b = c' },
  { id: 'solveDivide', label: 'Share It', color: 'gold', desc: 'Solve equations of the form x ÷ a + b = c and x ÷ a − b = c' },
  { id: 'spotTheSlip', label: 'Spot the Slip', color: 'coral', desc: 'Identify the common algebraic error in the working' },
  { id: 'formEquation', label: 'Words to Equation', color: 'teal', desc: 'Translate word descriptions into two-step equations' },
  { id: 'wordProblem', label: 'Real-World', color: 'green', desc: 'Solve real-life Singapore word problems with equations' }
];

// Random helpers
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 1. Undo Order Generator
function genUndoOrder() {
  const isMult = Math.random() > 0.4;
  const isAdd = Math.random() > 0.5;
  const a = randInt(2, 6);
  const b = randInt(2, 9);
  const x = randInt(2, 8);

  if (isMult) {
    const c = isAdd ? a * x + b : a * x - b;
    const eq = `${a}x ${isAdd ? '+' : '−'} ${b} = ${c}`;
    const correct = isAdd ? `Subtract ${b} from both sides` : `Add ${b} to both sides`;
    const wrong1 = isAdd ? `Add ${b} to both sides` : `Subtract ${b} from both sides`;
    const wrong2 = `Divide both sides by ${a}`;
    const wrong3 = `Multiply both sides by ${a}`;

    return {
      type: 'undoOrder',
      typeLabel: 'Undo Order',
      typeColor: 'teal',
      equation: { a, op1: 'mul', b, op2: isAdd ? 'add' : 'sub', c, x },
      prompt: `What is the correct FIRST step to solve the equation: ${eq}?`,
      displayEquation: eq,
      options: shuffle([correct, wrong1, wrong2, wrong3]),
      correctAnswer: correct,
      explanation: `Think socks and shoes: undo the ${isAdd ? 'addition (+ ' + b + ')' : 'subtraction (− ' + b + ')'} first by applying its inverse (${correct}) to both sides before dealing with the coefficient ${a}.`
    };
  } else {
    // Division
    const c = isAdd ? x + b : x - b;
    const eq = `x ÷ ${a} ${isAdd ? '+' : '−'} ${b} = ${c}`;
    const correct = isAdd ? `Subtract ${b} from both sides` : `Add ${b} to both sides`;
    const wrong1 = `Multiply both sides by ${a}`;
    const wrong2 = isAdd ? `Add ${b} to both sides` : `Subtract ${b} from both sides`;
    const wrong3 = `Divide both sides by ${a}`;

    return {
      type: 'undoOrder',
      typeLabel: 'Undo Order',
      typeColor: 'teal',
      equation: { a, op1: 'div', b, op2: isAdd ? 'add' : 'sub', c, x: x * a },
      prompt: `What is the correct FIRST step to solve the equation: ${eq}?`,
      displayEquation: eq,
      options: shuffle([correct, wrong1, wrong2, wrong3]),
      correctAnswer: correct,
      explanation: `Always undo the constant term first! ${correct} leaves the term x ÷ ${a} by itself.`
    };
  }
}

// 2. Solve Add & Subtract Generator (ax ± b = c)
function genSolveAddSub() {
  const a = randInt(2, 5);
  const x = randInt(3, 9);
  const b = randInt(2, 10);
  const isAdd = Math.random() > 0.45;
  const c = isAdd ? a * x + b : a * x - b;
  const eq = `${a}x ${isAdd ? '+' : '−'} ${b} = ${c}`;

  const correct = x.toString();

  // Distractors from realistic slips
  const distractors = new Set();
  // Slip 1: Forgets division (leaves ax as answer)
  const slip1 = isAdd ? c - b : c + b;
  if (slip1 !== x && slip1 > 0) distractors.add(slip1.toString());

  // Slip 2: Inverted sign for constant
  const slip2 = isAdd ? Math.floor((c + b) / a) : Math.floor((c - b) / a);
  if (slip2 > 0 && slip2 !== x) distractors.add(slip2.toString());

  // Slip 3: Subtracts coefficient instead of dividing
  const slip3 = (isAdd ? c - b : c + b) - a;
  if (slip3 > 0 && slip3 !== x) distractors.add(slip3.toString());

  // Fallbacks if set size < 3
  [-1, 1, 2, -2, 3].forEach(offset => {
    if (distractors.size < 3 && x + offset > 0 && x + offset !== x) {
      distractors.add((x + offset).toString());
    }
  });

  const distArray = Array.from(distractors).slice(0, 3);

  return {
    type: 'solveAddSub',
    typeLabel: 'Add & Subtract',
    typeColor: 'purple',
    equation: { a, op1: 'mul', b, op2: isAdd ? 'add' : 'sub', c, x },
    prompt: `Solve for x: ${eq}`,
    displayEquation: eq,
    options: shuffle([correct, ...distArray]),
    correctAnswer: correct,
    explanation: `Step 1: ${isAdd ? 'Subtract ' + b : 'Add ' + b} from both sides → ${a}x = ${isAdd ? c - b : c + b}. Step 2: Divide both sides by ${a} → x = ${x}. Check: ${a}(${x}) ${isAdd ? '+' : '−'} ${b} = ${c} ✓.`
  };
}

// 3. Solve Divide Generator (x ÷ a ± b = c)
function genSolveDivide() {
  const a = randInt(2, 5);
  const x = randInt(2, 6) * a; // ensures whole number
  const b = randInt(2, 7);
  const isAdd = Math.random() > 0.5;
  const innerVal = x / a;
  const c = isAdd ? innerVal + b : innerVal - b;

  if (c <= 0) {
    // Retry with safe positive
    return genSolveDivide();
  }

  const eq = `x ÷ ${a} ${isAdd ? '+' : '−'} ${b} = ${c}`;
  const correct = x.toString();

  const distractors = new Set();
  // Slip 1: Forgets to multiply by a (leaves x ÷ a result)
  const slip1 = isAdd ? c - b : c + b;
  if (slip1 > 0 && slip1 !== x) distractors.add(slip1.toString());

  // Slip 2: Multiplies c first before undoing b
  const slip2 = isAdd ? c * a - b : c * a + b;
  if (slip2 > 0 && slip2 !== x) distractors.add(slip2.toString());

  // Slip 3: Wrong sign when undoing b
  const slip3 = isAdd ? (c + b) * a : (c - b) * a;
  if (slip3 > 0 && slip3 !== x) distractors.add(slip3.toString());

  [-a, a, 2 * a].forEach(offset => {
    if (distractors.size < 3 && x + offset > 0 && x + offset !== x) {
      distractors.add((x + offset).toString());
    }
  });

  const distArray = Array.from(distractors).slice(0, 3);

  return {
    type: 'solveDivide',
    typeLabel: 'Share It',
    typeColor: 'gold',
    equation: { a, op1: 'div', b, op2: isAdd ? 'add' : 'sub', c, x },
    prompt: `Solve for x: ${eq}`,
    displayEquation: eq,
    options: shuffle([correct, ...distArray]),
    correctAnswer: correct,
    explanation: `Step 1: ${isAdd ? 'Subtract ' + b : 'Add ' + b} from both sides → x ÷ ${a} = ${isAdd ? c - b : c + b}. Step 2: Multiply both sides by ${a} → x = ${x}. Check: (${x} ÷ ${a}) ${isAdd ? '+' : '−'} ${b} = ${c} ✓.`
  };
}

// 4. Spot the Slip Generator
function genSpotTheSlip() {
  const slips = [
    {
      eq: '2x + 5 = 17',
      line1: '2x = 22',
      slip: 'Added 5 instead of subtracting 5',
      options: [
        'Added 5 instead of subtracting 5',
        'Forgot to divide by 2',
        'Subtracted 5 from only the left side',
        'Multiplied by 2 instead of dividing'
      ],
      explanation: 'To undo + 5 on the left, we must SUBTRACT 5 from both sides: 17 − 5 = 12. Ravi mistakenly added 5 to get 22!'
    },
    {
      eq: '3x − 4 = 14',
      line1: '3x = 10',
      slip: 'Subtracted 4 instead of adding 4',
      options: [
        'Subtracted 4 instead of adding 4',
        'Divided by 3 too early',
        'Forgot to do the same to both sides',
        'Divided 14 by 3 directly'
      ],
      explanation: 'To undo − 4, we must ADD 4 to both sides: 14 + 4 = 18. Ravi subtracted 4 to get 10!'
    },
    {
      eq: 'x ÷ 3 + 4 = 9',
      line1: 'x + 4 = 27',
      slip: 'Multiplied before undoing the addition',
      options: [
        'Multiplied before undoing the addition',
        'Subtracted 4 incorrectly',
        'Did not multiply both sides',
        'Divided 9 by 3'
      ],
      explanation: 'Always undo addition/subtraction FIRST! First subtract 4 to get x ÷ 3 = 5, then multiply by 3 to get x = 15.'
    },
    {
      eq: '4x + 8 = 24',
      line1: '4x = 16  →  x = 12',
      slip: 'Subtracted 4 instead of dividing by 4',
      options: [
        'Subtracted 4 instead of dividing by 4',
        'Subtracted 8 incorrectly',
        'Forgot to check the solution',
        'Divided 16 by 8 instead of 4'
      ],
      explanation: 'From 4x = 16, 4 is multiplied by x. The inverse operation is division: 16 ÷ 4 = 4, not subtraction (16 − 4 = 12)!'
    }
  ];

  const pick = slips[randInt(0, slips.length - 1)];

  return {
    type: 'spotTheSlip',
    typeLabel: 'Spot the Slip',
    typeColor: 'coral',
    prompt: `Ravi tried to solve ${pick.eq}:\nLine 1: "${pick.line1}". What slip did Ravi make?`,
    displayEquation: pick.eq,
    options: shuffle(pick.options),
    correctAnswer: pick.slip,
    explanation: pick.explanation
  };
}

// 5. Form Equation Generator
function genFormEquation() {
  const problems = [
    {
      phrase: 'Triple a number, then subtract 5, giving 19.',
      correct: '3x − 5 = 19',
      distractors: ['3(x − 5) = 19', 'x ÷ 3 − 5 = 19', '3x + 5 = 19'],
      explanation: '"Triple a number" is 3x. "Subtract 5" gives 3x − 5. "Giving 19" equals 19.'
    },
    {
      phrase: 'A number divided by 4, plus 3, equals 8.',
      correct: 'x ÷ 4 + 3 = 8',
      distractors: ['(x + 3) ÷ 4 = 8', '4x + 3 = 8', 'x ÷ 4 − 3 = 8'],
      explanation: '"Divided by 4" is x ÷ 4. Then "plus 3" makes x ÷ 4 + 3 = 8.'
    },
    {
      phrase: 'Double a number, add 7, the result is 23.',
      correct: '2x + 7 = 23',
      distractors: ['2(x + 7) = 23', 'x ÷ 2 + 7 = 23', '2x − 7 = 23'],
      explanation: '"Double a number" is 2x. "Add 7" gives 2x + 7 = 23.'
    },
    {
      phrase: '5 times a number minus 8 equals 27.',
      correct: '5x − 8 = 27',
      distractors: ['5(x − 8) = 27', '5x + 8 = 27', 'x ÷ 5 − 8 = 27'],
      explanation: '"5 times a number" is 5x. "Minus 8" gives 5x − 8 = 27.'
    }
  ];

  const pick = problems[randInt(0, problems.length - 1)];

  return {
    type: 'formEquation',
    typeLabel: 'Words to Equation',
    typeColor: 'teal',
    prompt: `Choose the correct algebraic equation for: "${pick.phrase}"`,
    options: shuffle([pick.correct, ...pick.distractors]),
    correctAnswer: pick.correct,
    explanation: pick.explanation
  };
}

// 6. Word Problem (Real-World Singapore Context)
function genWordProblem() {
  const problems = [
    {
      context: 'Maya buys 3 concert tickets online. There is a single $4 booking fee. If her total bill is $25, what is the cost of each ticket (x)?',
      eq: '3x + 4 = 25',
      ans: '$7',
      options: ['$7', '$6', '$8', '$9'],
      explanation: '3x + 4 = 25 → 3x = 21 → x = 7. Each concert ticket costs $7. (Check: 3 × $7 + $4 = $25 ✓)'
    },
    {
      context: 'A taxi ride in Singapore has a flag-down fare of $4. Each kilometer costs $2. If the total fare is $20, how many kilometers (k) was the trip?',
      eq: '2k + 4 = 20',
      ans: '8 km',
      options: ['8 km', '7 km', '10 km', '6 km'],
      explanation: '2k + 4 = 20 → 2k = 16 → k = 8. The taxi trip was 8 km. (Check: 2(8) + 4 = 20 ✓)'
    },
    {
      context: 'Ravi orders 4 cups of bubble tea plus a $3 delivery fee. The total paid was $23. How much was each cup of bubble tea (b)?',
      eq: '4b + 3 = 23',
      ans: '$5',
      options: ['$5', '$4.50', '$6', '$5.50'],
      explanation: '4b + 3 = 23 → 4b = 20 → b = 5. Each cup of bubble tea was $5.'
    },
    {
      context: 'A box of 40 curry puffs was shared equally among p friends, and 4 puffs were left over. If each friend received 6 puffs, solve: 6p + 4 = 40 for p.',
      eq: '6p + 4 = 40',
      ans: '6 friends',
      options: ['6 friends', '5 friends', '7 friends', '8 friends'],
      explanation: '6p + 4 = 40 → 6p = 36 → p = 6. There were 6 friends.'
    }
  ];

  const pick = problems[randInt(0, problems.length - 1)];

  return {
    type: 'wordProblem',
    typeLabel: 'Real-World',
    typeColor: 'green',
    prompt: pick.context,
    displayEquation: pick.eq,
    options: shuffle(pick.options),
    correctAnswer: pick.ans,
    explanation: pick.explanation
  };
}

// Main Dispatcher
export function generateQuestion(index = 0, specificType = null) {
  const typeId = specificType || QUESTION_TYPES[index % QUESTION_TYPES.length].id;

  switch (typeId) {
    case 'undoOrder':
      return genUndoOrder();
    case 'solveAddSub':
      return genSolveAddSub();
    case 'solveDivide':
      return genSolveDivide();
    case 'spotTheSlip':
      return genSpotTheSlip();
    case 'formEquation':
      return genFormEquation();
    case 'wordProblem':
      return genWordProblem();
    default:
      return genSolveAddSub();
  }
}

export function generateQuestionSet(count = 6) {
  const set = [];
  for (let i = 0; i < count; i++) {
    const type = QUESTION_TYPES[i % QUESTION_TYPES.length].id;
    set.push(generateQuestion(i, type));
  }
  return set;
}
