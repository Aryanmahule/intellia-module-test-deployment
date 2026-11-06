// Intelligent Question Engine for Substitution and Formulae (Grade 7 / Lower Sec)
// Generates diverse questions with realistic distractor models based on authentic algebraic misconceptions.

export const QUESTION_TYPES = [
  { id: 'substituteOne', label: 'Substitute It', color: 'teal', icon: '🧮' },
  { id: 'substituteMany', label: 'Two Letters', color: 'purple', icon: '✨' },
  { id: 'orderOfOps', label: 'Order Matters', color: 'gold', icon: '⚡' },
  { id: 'negatives', label: 'Watch the Signs', color: 'coral', icon: '🛡️' },
  { id: 'wordFormula', label: 'Real-World Formulae', color: 'green', icon: '🏙️' },
  { id: 'spotTheSlip', label: 'Spot the Slip', color: 'teal', icon: '🔍' }
];

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Ensure unique non-empty options
function shuffleAndDeduplicate(correct, distractors) {
  const uniqueDistractors = Array.from(new Set(distractors.filter(d => d !== correct && d !== undefined && d !== null && !Number.isNaN(d))));
  
  // Fill up if fewer than 3 distractors
  let offset = 1;
  while (uniqueDistractors.length < 3) {
    const fallbackVal = typeof correct === 'number' ? correct + (offset % 2 === 0 ? offset : -offset) : `Option ${uniqueDistractors.length + 2}`;
    if (fallbackVal !== correct && !uniqueDistractors.includes(fallbackVal)) {
      uniqueDistractors.push(fallbackVal);
    }
    offset++;
  }

  const selectedDistractors = uniqueDistractors.slice(0, 3);
  const options = [correct, ...selectedDistractors].sort(() => Math.random() - 0.5);
  return {
    options,
    correctAnswer: correct
  };
}

export function generateQuestion(index = 0, specificType = null) {
  const typeObj = specificType
    ? QUESTION_TYPES.find(t => t.id === specificType) || QUESTION_TYPES[index % QUESTION_TYPES.length]
    : QUESTION_TYPES[index % QUESTION_TYPES.length];

  const type = typeObj.id;

  switch (type) {
    case 'substituteOne': {
      const a = randomChoice([2, 3, 4, 5, 6]);
      const x = randomChoice([2, 3, 4, 5, 6]);
      const b = randomChoice([3, 5, 7, 8, 10]);
      const isAdd = Math.random() > 0.4;
      
      const expr = isAdd ? `${a}x + ${b}` : `${a}x − ${b}`;
      const correct = isAdd ? a * x + b : a * x - b;

      // Misconceptions:
      // 1. Concatenation: e.g. 3x, x=4 -> 34 (+ b)
      const concatVal = isAdd ? parseInt(`${a}${x}`, 10) + b : parseInt(`${a}${x}`, 10) - b;
      // 2. Precedence slip: (a + b) * x
      const precedenceSlip = isAdd ? (a + b) * x : (a - b) * x;
      // 3. Multiplication only or off by one
      const wrongOp = a * x;

      const { options, correctAnswer } = shuffleAndDeduplicate(correct, [concatVal, precedenceSlip, wrongOp, correct + a, correct - b]);

      return {
        id: `q_sub1_${Date.now()}_${Math.random()}`,
        type: 'substituteOne',
        typeLabel: typeObj.label,
        typeColor: typeObj.color,
        typeIcon: typeObj.icon,
        prompt: `Evaluate the expression when x = ${x}:`,
        formula: expr,
        variables: { x },
        options: options.map(String),
        correctAnswer: String(correctAnswer),
        explanation: `Substitute x = ${x} into ${expr} using brackets:\n${a}(${x}) ${isAdd ? '+' : '−'} ${b} = ${a * x} ${isAdd ? '+' : '−'} ${b} = ${correct}.`
      };
    }

    case 'substituteMany': {
      const a = randomChoice([2, 3, 4, 5]);
      const b = randomChoice([-3, -2, 2, 3, 4]);
      const template = randomChoice(['a2_b2', '2a_3b', 'ab_plus_a']);

      if (template === 'a2_b2') {
        const correct = a * a + b * b;
        const slipSign = a * a - (b * b); // dropping negative square
        const slipAddThenSquare = (a + b) * (a + b);
        const slipConcat = a * 2 + b * 2;

        const { options, correctAnswer } = shuffleAndDeduplicate(correct, [slipSign, slipAddThenSquare, slipConcat, correct + 2]);

        return {
          id: `q_submany_${Date.now()}_${Math.random()}`,
          type: 'substituteMany',
          typeLabel: typeObj.label,
          typeColor: typeObj.color,
          typeIcon: typeObj.icon,
          prompt: `Find the value of a² + b² when a = ${a} and b = ${b}:`,
          formula: 'a² + b²',
          variables: { a, b },
          options: options.map(String),
          correctAnswer: String(correctAnswer),
          explanation: `Substitute with brackets: (${a})² + (${b})² = ${a * a} + ${b * b} = ${correct}. Remember that (${b})² is always positive (+${b * b})!`
        };
      } else if (template === '2a_3b') {
        const correct = 2 * a + 3 * b;
        const slipSign = 2 * a - 3 * Math.abs(b);
        const slipConcat = parseInt(`${a}${Math.abs(b)}`, 10);
        const slipMult = 6 * a * b;

        const { options, correctAnswer } = shuffleAndDeduplicate(correct, [slipSign, slipConcat, slipMult, correct + 4, correct - 3]);

        return {
          id: `q_submany_${Date.now()}_${Math.random()}`,
          type: 'substituteMany',
          typeLabel: typeObj.label,
          typeColor: typeObj.color,
          typeIcon: typeObj.icon,
          prompt: `Find the value of 2a + 3b when a = ${a} and b = ${b}:`,
          formula: '2a + 3b',
          variables: { a, b },
          options: options.map(String),
          correctAnswer: String(correctAnswer),
          explanation: `Substitute with brackets: 2(${a}) + 3(${b}) = ${2 * a} + (${3 * b}) = ${correct}.`
        };
      } else {
        const correct = a * b + a;
        const slipNoMult = a + b + a;
        const slipSign = -Math.abs(a * b) - a;

        const { options, correctAnswer } = shuffleAndDeduplicate(correct, [slipNoMult, slipSign, correct + 5, correct - 2]);

        return {
          id: `q_submany_${Date.now()}_${Math.random()}`,
          type: 'substituteMany',
          typeLabel: typeObj.label,
          typeColor: typeObj.color,
          typeIcon: typeObj.icon,
          prompt: `Evaluate ab + a when a = ${a} and b = ${b}:`,
          formula: 'ab + a',
          variables: { a, b },
          options: options.map(String),
          correctAnswer: String(correctAnswer),
          explanation: `Substitute values: (${a})(${b}) + (${a}) = ${a * b} + ${a} = ${correct}.`
        };
      }
    }

    case 'orderOfOps': {
      const k = randomChoice([2, 3, 4]);
      const x = randomChoice([3, 4, 5]);
      const isBracketFirst = Math.random() > 0.5;

      if (isBracketFirst) {
        // (kx)^2
        const correct = Math.pow(k * x, 2);
        const slipSquaringOnlyX = k * (x * x); // e.g. 2(5)^2 = 50 instead of (2*5)^2 = 100
        const slipMult2 = 2 * k * x;
        const slipAdd = Math.pow(k + x, 2);

        const { options, correctAnswer } = shuffleAndDeduplicate(correct, [slipSquaringOnlyX, slipMult2, slipAdd, correct + 10]);

        return {
          id: `q_order_${Date.now()}_${Math.random()}`,
          type: 'orderOfOps',
          typeLabel: typeObj.label,
          typeColor: typeObj.color,
          typeIcon: typeObj.icon,
          prompt: `Evaluate (${k}x)² when x = ${x}:`,
          formula: `(${k}x)²`,
          variables: { x },
          options: options.map(String),
          correctAnswer: String(correctAnswer),
          explanation: `Inside the brackets first (BODMAS): (${k} × ${x})² = (${k * x})² = ${correct}. (Notice how this differs from ${k}x² which would be ${slipSquaringOnlyX}).`
        };
      } else {
        // kx^2
        const correct = k * (x * x);
        const slipBracketFirst = Math.pow(k * x, 2); // e.g. (kx)^2
        const slipMultiplyPower = k * x * 2;
        const slipConcat = parseInt(`${k}${x * x}`, 10);

        const { options, correctAnswer } = shuffleAndDeduplicate(correct, [slipBracketFirst, slipMultiplyPower, slipConcat, correct + 8]);

        return {
          id: `q_order_${Date.now()}_${Math.random()}`,
          type: 'orderOfOps',
          typeLabel: typeObj.label,
          typeColor: typeObj.color,
          typeIcon: typeObj.icon,
          prompt: `Evaluate ${k}x² when x = ${x}:`,
          formula: `${k}x²`,
          variables: { x },
          options: options.map(String),
          correctAnswer: String(correctAnswer),
          explanation: `Orders / Powers come before multiplication (BODMAS)! Square x first: ${k}(${x})² = ${k}(${x * x}) = ${correct}.`
        };
      }
    }

    case 'negatives': {
      const x = randomChoice([-5, -4, -3, -2]);
      const variant = randomChoice(['minus_x2', 'bracket_minus_x2', 'linear_sub']);

      if (variant === 'minus_x2') {
        const correct = -(x * x); // -(-3)^2 = -9
        const slipPos = x * x; // 9
        const slipDoubleNeg = -x;
        const slipAdd = x - 2;

        const { options, correctAnswer } = shuffleAndDeduplicate(correct, [slipPos, slipDoubleNeg, slipAdd, correct - 4]);

        return {
          id: `q_neg_${Date.now()}_${Math.random()}`,
          type: 'negatives',
          typeLabel: typeObj.label,
          typeColor: typeObj.color,
          typeIcon: typeObj.icon,
          prompt: `Find the value of −x² when x = ${x}:`,
          formula: '−x²',
          variables: { x },
          options: options.map(String),
          correctAnswer: String(correctAnswer),
          explanation: `In −x², the minus is outside the squaring operation! −(${x})² = −(${x * x}) = ${correct}.`
        };
      } else if (variant === 'bracket_minus_x2') {
        const correct = Math.pow(x, 2); // (-3)^2 = 9
        const slipNeg = -(x * x); // -9
        const slipMult = 2 * x;
        const slipAbs = Math.abs(x) * 2;

        const { options, correctAnswer } = shuffleAndDeduplicate(correct, [slipNeg, slipMult, slipAbs, correct + 5]);

        return {
          id: `q_neg_${Date.now()}_${Math.random()}`,
          type: 'negatives',
          typeLabel: typeObj.label,
          typeColor: typeObj.color,
          typeIcon: typeObj.icon,
          prompt: `Evaluate (x)² when x = ${x}:`,
          formula: '(x)²',
          variables: { x },
          options: options.map(String),
          correctAnswer: String(correctAnswer),
          explanation: `The entire negative number is squared inside brackets: (${x}) × (${x}) = +${correct}. Negative times negative equals positive!`
        };
      } else {
        const c = randomChoice([6, 8, 10, 12]);
        const correct = c - 2 * x; // e.g. 10 - 2(-3) = 10 - (-6) = 16
        const slipSubDirect = c - 2 * Math.abs(x); // 10 - 6 = 4
        const slipSign = -c - 2 * x;
        const slipConcat = c - parseInt(`2${Math.abs(x)}`, 10);

        const { options, correctAnswer } = shuffleAndDeduplicate(correct, [slipSubDirect, slipSign, slipConcat, correct + 3]);

        return {
          id: `q_neg_${Date.now()}_${Math.random()}`,
          type: 'negatives',
          typeLabel: typeObj.label,
          typeColor: typeObj.color,
          typeIcon: typeObj.icon,
          prompt: `Find the value of ${c} − 2x when x = ${x}:`,
          formula: `${c} − 2x`,
          variables: { x },
          options: options.map(String),
          correctAnswer: String(correctAnswer),
          explanation: `Substitute using brackets: ${c} − 2(${x}) = ${c} − (${2 * x}) = ${c} + ${Math.abs(2 * x)} = ${correct}. Subtracting a negative is adding!`
        };
      }
    }

    case 'wordFormula': {
      const scenario = randomChoice(['perimeter', 'triangle', 'taxi', 'mrt']);

      if (scenario === 'perimeter') {
        const l = randomChoice([6, 7, 8, 9, 10]);
        const w = randomChoice([3, 4, 5, 6]);
        const correct = 2 * (l + w);
        const slipNoBrackets = 2 * l + w; // 2l + w
        const slipArea = l * w;
        const slipSumOnly = l + w;

        const { options, correctAnswer } = shuffleAndDeduplicate(correct, [slipNoBrackets, slipArea, slipSumOnly, correct + 4]);

        return {
          id: `q_word_${Date.now()}_${Math.random()}`,
          type: 'wordFormula',
          typeLabel: typeObj.label,
          typeColor: typeObj.color,
          typeIcon: typeObj.icon,
          prompt: `A park in Bishan has length l = ${l} m and width w = ${w} m. Calculate its perimeter P = 2(l + w):`,
          formula: 'P = 2(l + w)',
          variables: { l, w },
          options: options.map(String),
          correctAnswer: String(correctAnswer),
          explanation: `Substitute l = ${l} and w = ${w}:\nP = 2(${l} + ${w}) = 2(${l + w}) = ${correct} m.`
        };
      } else if (scenario === 'triangle') {
        const b = randomChoice([6, 8, 10, 12]);
        const h = randomChoice([4, 5, 6, 7]);
        const correct = 0.5 * b * h;
        const slipForgetHalf = b * h; // forgetting 1/2
        const slipSum = b + h;
        const slipHalfBOnly = b / 2 + h;

        const { options, correctAnswer } = shuffleAndDeduplicate(correct, [slipForgetHalf, slipSum, slipHalfBOnly, correct + 5]);

        return {
          id: `q_word_${Date.now()}_${Math.random()}`,
          type: 'wordFormula',
          typeLabel: typeObj.label,
          typeColor: typeObj.color,
          typeIcon: typeObj.icon,
          prompt: `A triangular solar canopy at Gardens by the Bay has base b = ${b} m and height h = ${h} m. Find its area A = ½bh:`,
          formula: 'A = ½bh',
          variables: { b, h },
          options: options.map(String),
          correctAnswer: String(correctAnswer),
          explanation: `Substitute b = ${b} and h = ${h}:\nA = ½ × (${b}) × (${h}) = ½ × ${b * h} = ${correct} m².\n(Don't forget to multiply by ½!).`
        };
      } else if (scenario === 'mrt') {
        const n = randomChoice([3, 4, 5, 6, 7]);
        const correct = 3 * n + 5; // e.g. 3 min per stop + 5 min walking
        const slipNoWalk = 3 * n;
        const slipAddStopsFirst = 3 * (n + 5);
        const slipConcat = parseInt(`3${n}`, 10) + 5;

        const { options, correctAnswer } = shuffleAndDeduplicate(correct, [slipNoWalk, slipAddStopsFirst, slipConcat, correct + 3]);

        return {
          id: `q_word_${Date.now()}_${Math.random()}`,
          type: 'wordFormula',
          typeLabel: typeObj.label,
          typeColor: typeObj.color,
          typeIcon: typeObj.icon,
          prompt: `Travel time on the Singapore MRT is estimated by T = 3n + 5 minutes, where n is the number of stations. Calculate the travel time for n = ${n} stations:`,
          formula: 'T = 3n + 5',
          variables: { n },
          options: options.map(String),
          correctAnswer: String(correctAnswer),
          explanation: `Substitute n = ${n}:\nT = 3(${n}) + 5 = ${3 * n} + 5 = ${correct} minutes.`
        };
      } else {
        const d = randomChoice([5, 10, 15, 20]);
        // F = 4 + 2d for easy integer math
        const correct = 4 + 2 * d;
        const slipPrecedence = (4 + 2) * d; // 6 * d
        const slipConcat = parseInt(`4${d}`, 10) + 2;
        const slipNoFlag = 2 * d;

        const { options, correctAnswer } = shuffleAndDeduplicate(correct, [slipPrecedence, slipConcat, slipNoFlag, correct + 6]);

        return {
          id: `q_word_${Date.now()}_${Math.random()}`,
          type: 'wordFormula',
          typeLabel: typeObj.label,
          typeColor: typeObj.color,
          typeIcon: typeObj.icon,
          prompt: `A Singapore taxi calculates fare in dollars using F = 4 + 2d, where d is the distance in km. Find the fare for a trip of d = ${d} km:`,
          formula: 'F = 4 + 2d',
          variables: { d },
          options: options.map(String),
          correctAnswer: String(correctAnswer),
          explanation: `Substitute d = ${d}:\nF = 4 + 2(${d}) = 4 + ${2 * d} = $${correct}.`
        };
      }
    }

    case 'spotTheSlip':
    default: {
      const slipScenarios = [
        {
          expr: '3x',
          val: 'x = 4',
          wrongWorking: 'Ravi wrote: 3x = 34',
          fix: '3x = 3(4) = 12',
          distractors: [
            '3x = 3 + 4 = 7',
            '3x = 3⁴ = 81',
            '3x = 4 / 3'
          ],
          explanation: '3x means 3 multiplied by x. When x = 4, 3(4) = 12, not 34!'
        },
        {
          expr: '2 + 5x',
          val: 'x = 3',
          wrongWorking: 'Ravi wrote: (2 + 5) × 3 = 7 × 3 = 21',
          fix: '2 + 5(3) = 2 + 15 = 17',
          distractors: [
            '2 + 53 = 55',
            '2 × 5 + 3 = 13',
            '(2 × 3) + 5 = 11'
          ],
          explanation: 'Multiplication comes before addition (BODMAS). Multiply 5(3) first to get 15, then add 2 to get 17.'
        },
        {
          expr: '−x²',
          val: 'x = −3',
          wrongWorking: 'Ravi wrote: −x² = +9',
          fix: '−x² = −(−3)² = −(9) = −9',
          distractors: [
            '−x² = −3 × 2 = −6',
            '−x² = (−3) + 2 = −1',
            '−x² = +6'
          ],
          explanation: 'In −x², square the value first: (−3)² = 9. Then apply the negative sign on the outside: −(9) = −9.'
        },
        {
          expr: '2(l + w)',
          val: 'l = 5, w = 3',
          wrongWorking: 'Ravi wrote: 2(5) + 3 = 10 + 3 = 13',
          fix: '2(5 + 3) = 2(8) = 16',
          distractors: [
            '2 + 5 + 3 = 10',
            '2 × 5 × 3 = 30',
            '2(5) × 3 = 30'
          ],
          explanation: 'Add the terms inside brackets first (5 + 3 = 8), then multiply by 2 to get 16.'
        }
      ];

      const item = randomChoice(slipScenarios);
      const { options, correctAnswer } = shuffleAndDeduplicate(item.fix, item.distractors);

      return {
        id: `q_slip_${Date.now()}_${Math.random()}`,
        type: 'spotTheSlip',
        typeLabel: typeObj.label,
        typeColor: typeObj.color,
        typeIcon: typeObj.icon,
        prompt: `Ravi made a mistake while evaluating ${item.expr} for ${item.val}. ${item.wrongWorking}. Which line shows the correct working?`,
        formula: item.expr,
        variables: {},
        options,
        correctAnswer,
        explanation: item.explanation
      };
    }
  }
}

export function generateQuestionSet(count = 6) {
  const set = [];
  for (let i = 0; i < count; i++) {
    set.push(generateQuestion(i));
  }
  return set;
}
