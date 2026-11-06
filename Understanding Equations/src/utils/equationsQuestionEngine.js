// Question Generator Engine with Authentic Distractor Models for Understanding Equations

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
    icon: '🔍'
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
    icon: '🏙️'
  }
};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// 1. Is It True? (Test Candidate Solutions)
function generateIsSolution() {
  const x = randomInt(2, 9);
  const a = randomInt(2, 5);
  const b = randomInt(1, 10);
  const isAdd = Math.random() > 0.4;

  let prompt = '';
  let equationStr = '';
  let rhs = 0;

  if (isAdd) {
    rhs = a * x + b;
    equationStr = `${a}x + ${b} = ${rhs}`;
  } else {
    rhs = a * x - b;
    equationStr = `${a}x − ${b} = ${rhs}`;
  }

  prompt = `Which value of x makes the equation ${equationStr} true?`;
  const correctAnswer = String(x);

  // Distractors from common calculation errors
  const distractors = new Set();
  distractors.add(String(x + 1));
  distractors.add(String(Math.max(1, x - 1)));
  distractors.add(String(x + 2));
  distractors.add(String(Math.round(rhs / a)));

  const optionsSet = new Set([correctAnswer]);
  distractors.forEach(d => {
    if (d !== correctAnswer && optionsSet.size < 4) {
      optionsSet.add(d);
    }
  });

  let fill = 1;
  while (optionsSet.size < 4) {
    const candidate = String(x + fill * (optionsSet.size % 2 === 0 ? 1 : -1) + 3);
    if (candidate !== correctAnswer && parseInt(candidate, 10) > 0) {
      optionsSet.add(candidate);
    }
    fill++;
  }

  return {
    type: 'isSolution',
    typeLabel: TYPE_CONFIG.isSolution.label,
    typeColor: TYPE_CONFIG.isSolution.color,
    typeIcon: TYPE_CONFIG.isSolution.icon,
    prompt,
    equation: equationStr,
    options: shuffleArray(Array.from(optionsSet)),
    correctAnswer,
    explanation: `Substitute ${x} into ${equationStr}: ${isAdd ? `${a}(${x}) + ${b} = ${a*x} + ${b} = ${rhs}` : `${a}(${x}) − ${b} = ${a*x} − ${b} = ${rhs}`} ✓. Both sides are equal!`
  };
}

// 2. One-Step Equation (Undo It)
function generateOneStep() {
  const opType = randomInt(1, 4);
  let prompt = '';
  let equationStr = '';
  let correctAnswer = '';
  let explanation = '';
  const distractors = new Set();

  if (opType === 1) {
    // x + a = b
    const x = randomInt(3, 15);
    const a = randomInt(2, 12);
    const b = x + a;
    equationStr = `x + ${a} = ${b}`;
    prompt = `Solve the one-step equation: ${equationStr}`;
    correctAnswer = String(x);
    explanation = `Subtract ${a} from both sides: x = ${b} − ${a} = ${x}.`;
    distractors.add(String(b + a)); // added instead of subtracted
    distractors.add(String(b));
    distractors.add(String(x + 2));
  } else if (opType === 2) {
    // ax = b
    const x = randomInt(3, 10);
    const a = randomInt(2, 7);
    const b = a * x;
    equationStr = `${a}x = ${b}`;
    prompt = `Solve the one-step equation: ${equationStr}`;
    correctAnswer = String(x);
    explanation = `Divide both sides by ${a}: x = ${b} ÷ ${a} = ${x}.`;
    distractors.add(String(b * a)); // multiplied
    distractors.add(String(b - a)); // subtracted
    distractors.add(String(x + 1));
  } else if (opType === 3) {
    // x - a = b
    const x = randomInt(8, 20);
    const a = randomInt(3, 9);
    const b = x - a;
    equationStr = `x − ${a} = ${b}`;
    prompt = `Solve the one-step equation: ${equationStr}`;
    correctAnswer = String(x);
    explanation = `Add ${a} to both sides: x = ${b} + ${a} = ${x}.`;
    distractors.add(String(Math.max(1, b - a))); // subtracted instead of added
    distractors.add(String(b));
    distractors.add(String(x + 2));
  } else {
    // x / a = b
    const x_val = randomInt(2, 8);
    const a = randomInt(2, 6);
    const b = x_val;
    const actual_x = a * b;
    equationStr = `x ÷ ${a} = ${b}`;
    prompt = `Solve the one-step equation: ${equationStr}`;
    correctAnswer = String(actual_x);
    explanation = `Multiply both sides by ${a}: x = ${b} × ${a} = ${actual_x}.`;
    distractors.add(String(Math.round(b / a))); // divided
    distractors.add(String(b + a));
    distractors.add(String(actual_x - a));
  }

  const optionsSet = new Set([correctAnswer]);
  distractors.forEach(d => {
    if (d !== correctAnswer && optionsSet.size < 4) {
      optionsSet.add(d);
    }
  });

  let bump = 1;
  while (optionsSet.size < 4) {
    const num = parseInt(correctAnswer, 10) + bump * (optionsSet.size % 2 === 0 ? 2 : -2);
    if (num > 0 && String(num) !== correctAnswer) {
      optionsSet.add(String(num));
    }
    bump++;
  }

  return {
    type: 'oneStep',
    typeLabel: TYPE_CONFIG.oneStep.label,
    typeColor: TYPE_CONFIG.oneStep.color,
    typeIcon: TYPE_CONFIG.oneStep.icon,
    prompt,
    equation: equationStr,
    options: shuffleArray(Array.from(optionsSet)),
    correctAnswer,
    explanation
  };
}

// 3. Two-Step Equation
function generateTwoStep() {
  const x = randomInt(2, 8);
  const a = randomInt(2, 6);
  const b = randomInt(1, 9);
  const isAdd = Math.random() > 0.5;

  let equationStr = '';
  let rhs = 0;
  let explanation = '';
  const distractors = new Set();

  if (isAdd) {
    rhs = a * x + b;
    equationStr = `${a}x + ${b} = ${rhs}`;
    explanation = `Step 1: Subtract ${b} from both sides → ${a}x = ${rhs - b}. Step 2: Divide by ${a} → x = ${x}.`;
    distractors.add(String(rhs - b)); // stopped after step 1
    distractors.add(String((rhs + b) / a)); // wrong sign
    distractors.add(String(Math.round(rhs / a))); // ignored constant
  } else {
    rhs = a * x - b;
    equationStr = `${a}x − ${b} = ${rhs}`;
    explanation = `Step 1: Add ${b} to both sides → ${a}x = ${rhs + b}. Step 2: Divide by ${a} → x = ${x}.`;
    distractors.add(String(rhs + b)); // stopped after step 1
    distractors.add(String(Math.max(1, Math.round((rhs - b) / a)))); // wrong sign
    distractors.add(String(Math.round(rhs / a)));
  }

  const correctAnswer = String(x);
  const optionsSet = new Set([correctAnswer]);
  distractors.forEach(d => {
    if (d !== correctAnswer && parseInt(d, 10) > 0 && optionsSet.size < 4) {
      optionsSet.add(d);
    }
  });

  let bump = 1;
  while (optionsSet.size < 4) {
    const candidate = String(x + bump * (optionsSet.size % 2 === 0 ? 1 : -1));
    if (candidate !== correctAnswer && parseInt(candidate, 10) > 0) {
      optionsSet.add(candidate);
    }
    bump++;
  }

  return {
    type: 'twoStep',
    typeLabel: TYPE_CONFIG.twoStep.label,
    typeColor: TYPE_CONFIG.twoStep.color,
    typeIcon: TYPE_CONFIG.twoStep.icon,
    prompt: `Solve the two-step equation: ${equationStr}`,
    equation: equationStr,
    options: shuffleArray(Array.from(optionsSet)),
    correctAnswer,
    explanation
  };
}

// 4. Keep the Balance (Identify Correct Transformation Step)
function generateBalanceStep() {
  const templates = [
    {
      eq: '2x + 5 = 15',
      question: 'To start solving 2x + 5 = 15, what is the first balanced step?',
      correct: 'Subtract 5 from both sides',
      distractors: [
        'Subtract 5 from the left side only',
        'Divide both sides by 2 first',
        'Add 5 to both sides'
      ],
      explanation: 'To isolate the variable term 2x, undo addition by subtracting 5 from BOTH sides to keep the scale balanced.'
    },
    {
      eq: '3x − 4 = 17',
      question: 'To solve 3x − 4 = 17, what should you do first to keep the balance?',
      correct: 'Add 4 to both sides',
      distractors: [
        'Subtract 4 from both sides',
        'Divide both sides by 3',
        'Add 4 to the right side only'
      ],
      explanation: 'Inverse of − 4 is + 4. Adding 4 to both sides gives 3x = 21.'
    },
    {
      eq: '4x = 28',
      question: 'What operation balances the scale and isolates x in 4x = 28?',
      correct: 'Divide both sides by 4',
      distractors: [
        'Multiply both sides by 4',
        'Subtract 4 from both sides',
        'Divide the left side by 4 only'
      ],
      explanation: '4x means 4 multiplied by x. The inverse operation is dividing BOTH sides by 4.'
    },
    {
      eq: 'x ÷ 3 = 7',
      question: 'What balanced step isolates x in x ÷ 3 = 7?',
      correct: 'Multiply both sides by 3',
      distractors: [
        'Divide both sides by 3',
        'Multiply the left side by 3 only',
        'Subtract 3 from both sides'
      ],
      explanation: 'The inverse of dividing by 3 is multiplying BOTH sides by 3, giving x = 21.'
    }
  ];

  const item = templates[randomInt(0, templates.length - 1)];
  const options = shuffleArray([item.correct, ...item.distractors]);

  return {
    type: 'balanceStep',
    typeLabel: TYPE_CONFIG.balanceStep.label,
    typeColor: TYPE_CONFIG.balanceStep.color,
    typeIcon: TYPE_CONFIG.balanceStep.icon,
    prompt: item.question,
    equation: item.eq,
    options,
    correctAnswer: item.correct,
    explanation: item.explanation
  };
}

// 5. Words to Equation
function generateFormEquation() {
  const scenarios = [
    {
      sentence: 'I think of a number x, multiply it by 3, and add 4. The result is 19.',
      correct: '3x + 4 = 19',
      distractors: ['3(x + 4) = 19', '3x − 4 = 19', '4x + 3 = 19'],
      explanation: 'Multiply x by 3 gives 3x. Add 4 gives 3x + 4. Equals 19 gives 3x + 4 = 19.'
    },
    {
      sentence: 'Double a number n, then subtract 7 to get 15.',
      correct: '2n − 7 = 15',
      distractors: ['2n + 7 = 15', '2(n − 7) = 15', '7n − 2 = 15'],
      explanation: 'Double n is 2n. Subtract 7 is 2n − 7. Equal to 15 is 2n − 7 = 15.'
    },
    {
      sentence: 'Add 5 to a mystery number y, then multiply the whole sum by 2 to get 24.',
      correct: '2(y + 5) = 24',
      distractors: ['2y + 5 = 24', 'y + 10 = 24', '2y − 5 = 24'],
      explanation: 'Because we add 5 first before multiplying the whole sum, we use brackets: 2(y + 5) = 24.'
    },
    {
      sentence: 'A number k divided by 4, plus 3, equals 9.',
      correct: '(k ÷ 4) + 3 = 9',
      distractors: ['k ÷ (4 + 3) = 9', '4k + 3 = 9', '(k + 3) ÷ 4 = 9'],
      explanation: 'Divide k by 4 gives k ÷ 4. Then add 3 gives (k ÷ 4) + 3 = 9.'
    }
  ];

  const item = scenarios[randomInt(0, scenarios.length - 1)];
  const options = shuffleArray([item.correct, ...item.distractors]);

  return {
    type: 'formEquation',
    typeLabel: TYPE_CONFIG.formEquation.label,
    typeColor: TYPE_CONFIG.formEquation.color,
    typeIcon: TYPE_CONFIG.formEquation.icon,
    prompt: `Translate into an algebraic equation: "${item.sentence}"`,
    options,
    correctAnswer: item.correct,
    explanation: item.explanation
  };
}

// 6. Real-World Singapore Context
function generateWordProblem() {
  const problems = [
    {
      context: 'EZ-Link Card',
      prompt: 'Maya tops up her EZ-Link card with $x. After taking 3 bus rides costing $1.60 each ($4.80 total), she has $15.20 remaining. Find x.',
      eq: 'x − 4.80 = 15.20',
      correct: '$20.00',
      distractors: ['$10.40', '$18.00', '$24.00'],
      explanation: 'Equation: x − 4.80 = 15.20. Add 4.80 to both sides: x = 15.20 + 4.80 = $20.00.'
    },
    {
      context: 'Maxwell Food Centre',
      prompt: 'Ravi and 3 friends (4 people total) share chicken rice sets costing $x each, plus $4 for drinks. The total bill was $28. How much did each chicken rice set cost?',
      eq: '4x + 4 = 28',
      correct: '$6.00',
      distractors: ['$7.00', '$5.00', '$8.00'],
      explanation: 'Equation: 4x + 4 = 28 → 4x = 24 → x = 24 ÷ 4 = $6.00.'
    },
    {
      context: 'School Hall Event',
      prompt: 'At Clementi Secondary Hall, there are 5 long tables with x chairs each, plus 8 extra chairs on stage. If there are 48 chairs in total, find x.',
      eq: '5x + 8 = 48',
      correct: '8 chairs',
      distractors: ['6 chairs', '10 chairs', '12 chairs'],
      explanation: 'Equation: 5x + 8 = 48. Subtract 8: 5x = 40. Divide by 5: x = 8 chairs per table.'
    },
    {
      context: 'Gong Cha Order',
      prompt: 'Maya buys 3 cups of bubble tea for $x each with a $2 discount voucher and pays $13. What is the standard price of one cup?',
      eq: '3x − 2 = 13',
      correct: '$5.00',
      distractors: ['$4.00', '$6.00', '$3.50'],
      explanation: 'Equation: 3x − 2 = 13 → 3x = 15 → x = 15 ÷ 3 = $5.00.'
    }
  ];

  const item = problems[randomInt(0, problems.length - 1)];
  const options = shuffleArray([item.correct, ...item.distractors]);

  return {
    type: 'wordProblem',
    typeLabel: TYPE_CONFIG.wordProblem.label,
    typeColor: TYPE_CONFIG.wordProblem.color,
    typeIcon: TYPE_CONFIG.wordProblem.icon,
    prompt: `[${item.context}] ${item.prompt}`,
    equation: item.eq,
    options,
    correctAnswer: item.correct,
    explanation: item.explanation
  };
}

export function generateQuestion(index = 0, specificType = null) {
  const type = specificType || QUESTION_TYPES[index % QUESTION_TYPES.length];

  switch (type) {
    case 'isSolution':
      return generateIsSolution();
    case 'oneStep':
      return generateOneStep();
    case 'twoStep':
      return generateTwoStep();
    case 'balanceStep':
      return generateBalanceStep();
    case 'formEquation':
      return generateFormEquation();
    case 'wordProblem':
      return generateWordProblem();
    default:
      return generateOneStep();
  }
}

export function generateQuestionSet(count = 6) {
  const set = [];
  const types = shuffleArray([...QUESTION_TYPES]);

  for (let i = 0; i < count; i++) {
    const qType = types[i % types.length];
    set.push(generateQuestion(i, qType));
  }

  return set;
}
