// Equations Engine: procedural generation, solver verification, step validation and distractor modeling

export const QUESTION_TYPES = [
  'isSolution',
  'oneStep',
  'twoStep',
  'balanceStep',
  'formEquation',
  'wordProblem'
];

export const TYPE_CONFIG = {
  isSolution: {
    label: 'Is It True?',
    color: 'teal',
    icon: '🔮'
  },
  oneStep: {
    label: 'Undo It',
    color: 'purple',
    icon: '⚡'
  },
  twoStep: {
    label: 'Two Steps',
    color: 'gold',
    icon: '⚖️'
  },
  balanceStep: {
    label: 'Keep the Balance',
    color: 'coral',
    icon: '🎯'
  },
  formEquation: {
    label: 'Words to Equation',
    color: 'teal',
    icon: '📝'
  },
  wordProblem: {
    label: 'Real-World SG',
    color: 'green',
    icon: '🍜'
  }
};

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function shuffleArray(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Generate a procedural one-step or two-step equation with guaranteed integer solutions
 */
export function genEquation({ op = 'add', difficulty = 1 } = {}) {
  let a = 1;
  let b = 0;
  let x = randomInt(2, 9);
  let text = '';

  if (difficulty === 1) {
    a = randomInt(2, 8);
    if (op === 'add') {
      b = x + a;
      text = `x + ${a} = ${b}`;
    } else {
      b = x;
      const total = x + a;
      text = `x - ${a} = ${b}`;
      x = total;
    }
  } else if (difficulty === 2) {
    if (op === 'mul' || Math.random() > 0.5) {
      a = randomInt(2, 6);
      b = a * x;
      text = `${a}x = ${b}`;
      op = 'mul';
    } else {
      a = randomInt(8, 25);
      b = x + a;
      text = `x + ${a} = ${b}`;
      op = 'add';
    }
  } else if (difficulty === 3) {
    if (op === 'div' || Math.random() > 0.5) {
      a = randomInt(2, 6);
      b = randomInt(3, 9);
      x = a * b;
      text = `x ÷ ${a} = ${b}`;
      op = 'div';
    } else {
      a = randomInt(4, 9);
      b = a * x;
      text = `${a}x = ${b}`;
      op = 'mul';
    }
  } else if (difficulty === 4) {
    a = randomInt(2, 5);
    b = randomInt(2, 8);
    const isAdd = Math.random() > 0.4;
    if (isAdd) {
      const c = a * x + b;
      text = `${a}x + ${b} = ${c}`;
      op = 'twoStepAdd';
    } else {
      const c = a * x - b;
      text = `${a}x - ${b} = ${c}`;
      op = 'twoStepSub';
    }
  } else {
    a = randomInt(3, 8);
    b = randomInt(10, 24);
    const c = a * x + b;
    text = `${a}x + ${b} = ${c}`;
    op = 'twoStepAdd';
  }

  return { a, b, x, text, op, difficulty };
}

export function solveStep(eq, action) {
  if (action.sides !== 'both') {
    return {
      valid: false,
      feedbackKey: 'one_side_error',
      message: 'Scale tipped! Whatever you do to one side, you must do to the other side.'
    };
  }

  let expectedOp = '';
  let expectedVal = eq.a;

  if (eq.op === 'add') {
    expectedOp = 'sub';
    expectedVal = eq.a;
  } else if (eq.op === 'sub') {
    expectedOp = 'add';
    expectedVal = eq.a;
  } else if (eq.op === 'mul') {
    expectedOp = 'div';
    expectedVal = eq.a;
  } else if (eq.op === 'div') {
    expectedOp = 'mul';
    expectedVal = eq.a;
  }

  if (action.op === expectedOp && Number(action.val) === Number(expectedVal)) {
    return {
      valid: true,
      feedbackKey: 'step_correct',
      newEq: { ...eq, isolated: true, xVal: eq.x },
      message: `Spot on! Undoing with ${expectedOp} ${expectedVal} leaves x = ${eq.x}.`
    };
  }

  return {
    valid: false,
    feedbackKey: 'wrong_inverse',
    message: `Not quite! Remember that ${eq.op === 'add' ? 'addition is undone by subtraction' : eq.op === 'sub' ? 'subtraction is undone by addition' : eq.op === 'mul' ? 'multiplication is undone by division' : 'division is undone by multiplication'}.`
  };
}

export function isSolved(eq) {
  return !!eq?.isolated;
}

export function check(eq, guess) {
  return Number(guess) === Number(eq.x);
}

export function distractors(eq) {
  const correct = eq.x;
  const set = new Set();
  set.add(correct);

  if (eq.op === 'add') set.add(eq.b + eq.a);
  if (eq.op === 'sub') set.add(Math.abs(eq.b - eq.a));
  if (eq.op === 'mul') set.add(eq.b * eq.a);
  if (eq.op === 'div') set.add(Math.max(1, Math.floor(eq.b / eq.a)));

  set.add(correct + 1);
  set.add(Math.max(1, correct - 1));
  set.add(correct + 2);
  set.add(Math.max(1, correct - 2));

  const wrongOptions = Array.from(set).filter(v => v !== correct && Number.isFinite(v) && v > 0);
  return shuffleArray(wrongOptions).slice(0, 3);
}

// ----------------------------------------------------
// Procedural Practice Question Generators (6 Categories)
// ----------------------------------------------------

function generateIsSolution() {
  const x = randomInt(2, 8);
  const a = randomInt(2, 5);
  const b = randomInt(1, 9);
  const isAdd = Math.random() > 0.4;
  const rhs = isAdd ? (a * x + b) : (a * x - b);
  const sign = isAdd ? '+' : '−';
  const equationStr = `${a}x ${sign} ${b} = ${rhs}`;

  const isActuallyTrue = Math.random() > 0.5;
  const testVal = isActuallyTrue ? x : (x + (Math.random() > 0.5 ? 1 : -1));

  const options = ['True (It is a solution)', 'False (It is not a solution)'];
  const correctIndex = (testVal === x) ? 0 : 1;
  const correctAnswer = options[correctIndex];

  const leftValue = isAdd ? (a * testVal + b) : (a * testVal - b);
  const explanation = testVal === x
    ? `Correct! Substituting ${testVal} gives ${a}(${testVal}) ${sign} ${b} = ${leftValue}, which equals ${rhs}. Both sides balance!`
    : `Incorrect candidate! Substituting ${testVal} gives ${a}(${testVal}) ${sign} ${b} = ${leftValue}, which does not equal ${rhs}. The scale tilts.`;

  return {
    type: 'isSolution',
    typeLabel: TYPE_CONFIG.isSolution.label,
    typeColor: TYPE_CONFIG.isSolution.color,
    typeIcon: TYPE_CONFIG.isSolution.icon,
    prompt: `Test if x = ${testVal} is a solution to the equation:`,
    equation: equationStr,
    options,
    correctIndex,
    correctAnswer,
    explanation,
    hint: `Substitute ${testVal} in place of x and compute the left side. Does it equal ${rhs}?`
  };
}

function generateOneStep() {
  const opChoice = ['add', 'sub', 'mul', 'div'][randomInt(0, 3)];
  const a = randomInt(3, 9);
  const x = randomInt(2, 9);
  let equation = '';
  let hint = '';

  if (opChoice === 'add') {
    const total = x + a;
    equation = `x + ${a} = ${total}`;
    hint = `To undo + ${a}, subtract ${a} from both sides.`;
  } else if (opChoice === 'sub') {
    const rhs = x;
    const total = x + a;
    equation = `x - ${a} = ${rhs}`;
    hint = `To undo − ${a}, add ${a} to both sides.`;
  } else if (opChoice === 'mul') {
    const total = a * x;
    equation = `${a}x = ${total}`;
    hint = `To undo multiplying by ${a}, divide both sides by ${a}.`;
  } else {
    equation = `x ÷ ${a} = ${x}`;
    hint = `To undo dividing by ${a}, multiply both sides by ${a}.`;
  }

  const correct = (opChoice === 'sub') ? (x + a) : (opChoice === 'div') ? (x * a) : x;

  const distractorSet = new Set();
  distractorSet.add(correct + 1);
  distractorSet.add(Math.max(1, correct - 1));
  distractorSet.add(correct + a);
  distractorSet.add(Math.max(1, Math.abs(correct - a)));

  const distractorsArr = Array.from(distractorSet).filter(v => v !== correct).slice(0, 3);
  const allOptions = shuffleArray([correct, ...distractorsArr]);

  return {
    type: 'oneStep',
    typeLabel: TYPE_CONFIG.oneStep.label,
    typeColor: TYPE_CONFIG.oneStep.color,
    typeIcon: TYPE_CONFIG.oneStep.icon,
    prompt: `Solve the one-step equation for x:`,
    equation,
    options: allOptions.map(String),
    correctIndex: allOptions.indexOf(correct),
    correctAnswer: String(correct),
    explanation: `Excellent! Doing the inverse operation to both sides isolates x = ${correct}. Check: substitute ${correct} back in to confirm balance.`,
    hint
  };
}

function generateTwoStep() {
  const a = randomInt(2, 5);
  const b = randomInt(2, 8);
  const x = randomInt(2, 8);
  const isAdd = Math.random() > 0.4;
  const rhs = isAdd ? (a * x + b) : (a * x - b);
  const sign = isAdd ? '+' : '−';
  const equation = `${a}x ${sign} ${b} = ${rhs}`;

  const correct = x;
  const wrong1 = x + 1;
  const wrong2 = Math.max(1, x - 1);
  const wrong3 = isAdd ? Math.floor((rhs + b) / a) : Math.floor(Math.abs(rhs - b) / a);

  const opts = Array.from(new Set([correct, wrong1, wrong2, wrong3])).filter(v => v > 0);
  while (opts.length < 4) {
    opts.push(correct + opts.length + 1);
  }
  const shuffled = shuffleArray(opts.slice(0, 4));

  return {
    type: 'twoStep',
    typeLabel: TYPE_CONFIG.twoStep.label,
    typeColor: TYPE_CONFIG.twoStep.color,
    typeIcon: TYPE_CONFIG.twoStep.icon,
    prompt: `Solve the two-step linear equation for x:`,
    equation,
    options: shuffled.map(String),
    correctIndex: shuffled.indexOf(correct),
    correctAnswer: String(correct),
    explanation: `Spot on! Step 1: Undo ${sign} ${b} on both sides (${a}x = ${a * x}). Step 2: Divide both sides by ${a} to get x = ${correct}.`,
    hint: `Undo ${sign} ${b} first on both sides, then divide by ${a}.`
  };
}

function generateBalanceStep() {
  const a = randomInt(3, 9);
  const b = randomInt(12, 35);
  const ops = [
    { text: `Subtract ${a} from the right side`, correct: true },
    { text: `Add ${a} to the right side`, correct: false },
    { text: `Divide the right side by ${a}`, correct: false },
    { text: `Leave the right side unchanged`, correct: false }
  ];

  const shuffled = shuffleArray(ops);
  const correctIndex = shuffled.findIndex(o => o.correct);

  return {
    type: 'balanceStep',
    typeLabel: TYPE_CONFIG.balanceStep.label,
    typeColor: TYPE_CONFIG.balanceStep.color,
    typeIcon: TYPE_CONFIG.balanceStep.icon,
    prompt: `In the equation x + ${a} = ${b}, you subtract ${a} from the left side to isolate x. What MUST you do to the right side to preserve equality?`,
    equation: `x + ${a} - ${a} = ${b} ... ?`,
    options: shuffled.map(o => o.text),
    correctIndex,
    correctAnswer: shuffled[correctIndex].text,
    explanation: `Golden Rule of Algebra: You must do the exact same operation (subtract ${a}) to both sides, otherwise the scale tips!`,
    hint: "An equation is a balance scale. Any change on the left must be matched exactly on the right."
  };
}

function generateFormEquation() {
  const a = randomInt(2, 5);
  const b = randomInt(3, 9);
  const total = randomInt(15, 35);

  const scenario = `Maya thinks of a mystery number x. She multiplies it by ${a}, then adds ${b}. The final result is ${total}.`;
  const correct = `${a}x + ${b} = ${total}`;
  const wrong1 = `${a}(x + ${b}) = ${total}`;
  const wrong2 = `x + ${a * b} = ${total}`;
  const wrong3 = `${b}x + ${a} = ${total}`;

  const shuffled = shuffleArray([correct, wrong1, wrong2, wrong3]);

  return {
    type: 'formEquation',
    typeLabel: TYPE_CONFIG.formEquation.label,
    typeColor: TYPE_CONFIG.formEquation.color,
    typeIcon: TYPE_CONFIG.formEquation.icon,
    prompt: `Which equation correctly represents this story?`,
    equation: `"${scenario}"`,
    options: shuffled,
    correctIndex: shuffled.indexOf(correct),
    correctAnswer: correct,
    explanation: `Multiplying x by ${a} gives ${a}x. Adding ${b} gives ${a}x + ${b}. The result equals ${total}, yielding ${correct}.`,
    hint: "Notice the order of operations: multiply x first, then add the constant."
  };
}

function generateWordProblem() {
  const scenarios = [
    {
      story: "Uncle Tan bought 3 bowls of laksa and a $2 drink at Amoy Street Food Centre. His total bill was $17. If each bowl of laksa costs $x, find x.",
      equation: "3x + 2 = 17",
      ans: 5,
      unit: "$",
      step: "3x = 17 - 2 = 15 → x = 15 ÷ 3 = $5"
    },
    {
      story: "Ahmad's MRT card had an initial balance of $x. He topped up $20, then took 4 trips costing $2.50 each ($10 total). His balance is now $28. Find x.",
      equation: "x + 20 - 10 = 28 → x + 10 = 28",
      ans: 18,
      unit: "$",
      step: "x + 10 = 28 → x = 28 - 10 = $18"
    },
    {
      story: "At a prata stall, 4 plain pratas and 1 egg prata ($3) cost $9 in total. If each plain prata costs $p, find p.",
      equation: "4p + 3 = 9",
      ans: 1.5,
      ansStr: "$1.50",
      unit: "$",
      step: "4p = 9 - 3 = 6 → p = 6 ÷ 4 = $1.50"
    }
  ];

  const item = scenarios[randomInt(0, scenarios.length - 1)];
  const correctStr = item.ansStr || `${item.unit}${item.ans}`;
  
  let options = [];
  if (item.ans === 5) {
    options = ['$4', '$5', '$6', '$7'];
  } else if (item.ans === 18) {
    options = ['$14', '$16', '$18', '$22'];
  } else {
    options = ['$1.20', '$1.50', '$1.80', '$2.00'];
  }

  const shuffled = shuffleArray(options);

  return {
    type: 'wordProblem',
    typeLabel: TYPE_CONFIG.wordProblem.label,
    typeColor: TYPE_CONFIG.wordProblem.color,
    typeIcon: TYPE_CONFIG.wordProblem.icon,
    prompt: item.story,
    equation: item.equation,
    options: shuffled,
    correctIndex: shuffled.indexOf(correctStr),
    correctAnswer: correctStr,
    explanation: `Brilliant! Setting up the equation ${item.equation} and isolating the variable gives ${correctStr}. (${item.step})`,
    hint: "Form the equation first: cost of items + extra = total bill. Then solve!"
  };
}

export function generateQuestion(type = null) {
  const chosenType = type || QUESTION_TYPES[randomInt(0, QUESTION_TYPES.length - 1)];

  switch (chosenType) {
    case 'isSolution': return generateIsSolution();
    case 'oneStep': return generateOneStep();
    case 'twoStep': return generateTwoStep();
    case 'balanceStep': return generateBalanceStep();
    case 'formEquation': return generateFormEquation();
    case 'wordProblem': return generateWordProblem();
    default: return generateOneStep();
  }
}

export function generateQuestionSet(count = 6) {
  const set = [];
  QUESTION_TYPES.forEach(t => {
    set.push(generateQuestion(t));
  });

  while (set.length < count) {
    set.push(generateQuestion());
  }

  return shuffleArray(set);
}
