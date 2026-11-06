/* =========================================================
   PRACTICE QUESTION ENGINE (6 Question Types & Misconceptions)
   ========================================================= */

export const QUESTION_TYPES = {
  nextTerms: { id: 'nextTerms', label: 'Continue It', color: '#00e5ff', bg: 'rgba(0, 229, 255, 0.15)' },
  findRule: { id: 'findRule', label: 'Find the Rule', color: '#c084fc', bg: 'rgba(192, 132, 252, 0.15)' },
  nthTermValue: { id: 'nthTermValue', label: 'Jump Ahead', color: '#ffb800', bg: 'rgba(255, 184, 0, 0.15)' },
  shapePattern: { id: 'shapePattern', label: 'Shape Patterns', color: '#ff5e62', bg: 'rgba(255, 94, 98, 0.15)' },
  wordToExpression: { id: 'wordToExpression', label: 'Words to Symbols', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)' },
  wordProblem: { id: 'wordProblem', label: 'Real-World Context', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' }
};

const SHAPE_PATTERNS = [
  {
    family: 'matchSquares',
    name: 'Matchstick Squares',
    formula: (n) => 3 * n + 1,
    ruleStr: '3n + 1',
    description: 'Squares joined in a single line. Figure 1 needs 4 sticks; each extra square shares a side and needs 3 sticks.'
  },
  {
    family: 'matchTriangles',
    name: 'Matchstick Triangles',
    formula: (n) => 2 * n + 1,
    ruleStr: '2n + 1',
    description: 'Triangles joined in a row. Figure 1 needs 3 sticks; each extra triangle needs 2 sticks.'
  },
  {
    family: 'tables',
    name: 'Hawker Joined Tables',
    formula: (n) => 2 * n + 2,
    ruleStr: '2n + 2',
    description: 'Square tables placed end-to-end. 1 person sits at each top/bottom side plus 1 person at each end.'
  },
  {
    family: 'tiles',
    name: 'L-Shape Floor Tiles',
    formula: (n) => 2 * n - 1,
    ruleStr: '2n − 1',
    description: 'L-shaped corner tiles in an HDB void deck pattern with n rows and n columns sharing a corner.'
  }
];

const WORD_TEMPLATES = [
  {
    phrase: '7 less than k',
    correct: 'k − 7',
    distractors: ['7 − k', '7k', 'k + 7'],
    explanation: '"Less than" reverses the word order: start with k, then subtract 7.'
  },
  {
    phrase: '5 more than twice x',
    correct: '2x + 5',
    distractors: ['2(x + 5)', '5x + 2', 'x + 10'],
    explanation: '"Twice x" is 2x, and "5 more than" means add 5: 2x + 5.'
  },
  {
    phrase: '3 times the sum of m and 4',
    correct: '3(m + 4)',
    distractors: ['3m + 4', 'm + 12', '3m + 12 without brackets'],
    explanation: 'The words "sum of m and 4" come first, so they must be bracketed before multiplying by 3: 3(m + 4).'
  },
  {
    phrase: 'The total cost of p pens at $3 each and a notebook for $5',
    correct: '3p + 5',
    distractors: ['5p + 3', '3(p + 5)', '3p − 5'],
    explanation: 'p pens at $3 each cost 3 × p = 3p. Adding the $5 notebook gives 3p + 5.'
  },
  {
    phrase: 'y divided by 4, then decreased by 9',
    correct: 'y/4 − 9',
    distractors: ['9 − y/4', '(y − 9)/4', '4/y − 9'],
    explanation: 'Divide y by 4 first (y/4), then decrease by 9 gives y/4 − 9.'
  },
  {
    phrase: 'Subtract 8 from the product of 6 and w',
    correct: '6w − 8',
    distractors: ['8 − 6w', '6(w − 8)', '6/w − 8'],
    explanation: 'The product of 6 and w is 6w. Subtracting 8 from it gives 6w − 8.'
  }
];

function shuffle(arr) {
  const res = [...arr];
  for (let i = res.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [res[i], res[j]] = [res[j], res[i]];
  }
  return res;
}

export function generateQuestion(index = 0, specificType = null) {
  const typeKeys = Object.keys(QUESTION_TYPES);
  const typeId = specificType || typeKeys[index % typeKeys.length];

  switch (typeId) {
    case 'nextTerms': {
      // a * n + b
      const a = 2 + Math.floor(Math.random() * 5); // 2, 3, 4, 5, 6
      const b = Math.floor(Math.random() * 7) - 2; // -2 to 4
      const terms = [1, 2, 3, 4].map(n => a * n + b);
      const nextTerm = a * 5 + b;

      const distractors = [
        nextTerm + a, // skipped one ahead
        nextTerm - 1, // arithmetic slip
        terms[3] + (a - 1), // wrong common difference
        nextTerm + 2
      ].filter(d => d !== nextTerm);

      const uniqueOptions = Array.from(new Set([String(nextTerm), ...distractors.map(String)])).slice(0, 4);

      return {
        id: `q-${Date.now()}-${Math.random()}`,
        type: 'nextTerms',
        typeMeta: QUESTION_TYPES.nextTerms,
        prompt: `Find the next term in the sequence: ${terms.join(', ')}, ?`,
        contextInfo: `Common difference = +${a}`,
        options: shuffle(uniqueOptions),
        correctAnswer: String(nextTerm),
        explanation: `Each number increases by +${a}. The last term is ${terms[3]}, so the next term is ${terms[3]} + ${a} = ${nextTerm}.`
      };
    }

    case 'findRule': {
      const a = 2 + Math.floor(Math.random() * 5);
      const b = 1 + Math.floor(Math.random() * 5); // e.g. 3n + 2
      const terms = [1, 2, 3, 4].map(n => a * n + b);
      const correctRule = `${a}n + ${b}`;

      const distractors = [
        `${a}n`, // forgot constant
        `n + ${a}`, // difference added to n
        `${a}n − ${b}`, // wrong sign
        `${a + 1}n + ${b}` // wrong multiplier
      ].filter(d => d !== correctRule);

      const uniqueOptions = Array.from(new Set([correctRule, ...distractors])).slice(0, 4);

      return {
        id: `q-${Date.now()}-${Math.random()}`,
        type: 'findRule',
        typeMeta: QUESTION_TYPES.findRule,
        prompt: `Which formula gives the nth term for the sequence: ${terms.join(', ')}?`,
        contextInfo: `Terms: T₁=${terms[0]}, T₂=${terms[1]}, T₃=${terms[2]}`,
        options: shuffle(uniqueOptions),
        correctAnswer: correctRule,
        explanation: `The common difference is ${a}, so the rule starts with ${a}n. When n = 1: ${a}(1) + ${b} = ${terms[0]}. Thus, the rule is ${correctRule}.`
      };
    }

    case 'nthTermValue': {
      const a = 2 + Math.floor(Math.random() * 4);
      const b = 1 + Math.floor(Math.random() * 5);
      const targetN = [10, 15, 20, 25][Math.floor(Math.random() * 4)];
      const correctVal = a * targetN + b;

      const distractors = [
        a * targetN, // forgot constant b
        a * (targetN + 1) + b, // off by one
        a + targetN + b, // added instead of multiplied
        correctVal - a
      ].filter(d => d !== correctVal);

      const uniqueOptions = Array.from(new Set([String(correctVal), ...distractors.map(String)])).slice(0, 4);

      return {
        id: `q-${Date.now()}-${Math.random()}`,
        type: 'nthTermValue',
        typeMeta: QUESTION_TYPES.nthTermValue,
        prompt: `The rule for a pattern is ${a}n + ${b}. What is the value of the term when n = ${targetN}?`,
        contextInfo: `Substitute n = ${targetN} into ${a}n + ${b}`,
        options: shuffle(uniqueOptions),
        correctAnswer: String(correctVal),
        explanation: `Substitute n = ${targetN}: (${a} × ${targetN}) + ${b} = ${a * targetN} + ${b} = ${correctVal}.`
      };
    }

    case 'shapePattern': {
      const pattern = SHAPE_PATTERNS[Math.floor(Math.random() * SHAPE_PATTERNS.length)];
      const targetFig = [5, 8, 10, 12][Math.floor(Math.random() * 4)];
      const correctCount = pattern.formula(targetFig);

      const distractors = [
        pattern.formula(targetFig - 1),
        pattern.formula(targetFig + 1),
        targetFig * 4, // naive multiplier
        correctCount + 2
      ].filter(d => d !== correctCount);

      const uniqueOptions = Array.from(new Set([String(correctCount), ...distractors.map(String)])).slice(0, 4);

      return {
        id: `q-${Date.now()}-${Math.random()}`,
        type: 'shapePattern',
        typeMeta: QUESTION_TYPES.shapePattern,
        patternMeta: pattern,
        targetFig: targetFig,
        prompt: `For the "${pattern.name}" pattern with rule ${pattern.ruleStr}, how many elements are needed for Figure ${targetFig}?`,
        contextInfo: pattern.description,
        options: shuffle(uniqueOptions),
        correctAnswer: String(correctCount),
        explanation: `Using the rule ${pattern.ruleStr} for Figure ${targetFig}: evaluate at n = ${targetFig} to get ${correctCount}.`
      };
    }

    case 'wordToExpression': {
      const template = WORD_TEMPLATES[Math.floor(Math.random() * WORD_TEMPLATES.length)];
      const uniqueOptions = Array.from(new Set([template.correct, ...template.distractors])).slice(0, 4);

      return {
        id: `q-${Date.now()}-${Math.random()}`,
        type: 'wordToExpression',
        typeMeta: QUESTION_TYPES.wordToExpression,
        prompt: `Translate this phrase into an algebraic expression: "${template.phrase}"`,
        contextInfo: 'Pay close attention to operation keywords and order!',
        options: shuffle(uniqueOptions),
        correctAnswer: template.correct,
        explanation: template.explanation
      };
    }

    case 'wordProblem': {
      const hawkerTablesN = 8 + Math.floor(Math.random() * 8); // e.g. 10
      const seats = 2 * hawkerTablesN + 2;

      const distractors = [
        4 * hawkerTablesN, // 4 seats per table without shared ends
        2 * hawkerTablesN, // forgot end seats
        seats - 2,
        seats + 4
      ].filter(d => d !== seats);

      const uniqueOptions = Array.from(new Set([String(seats), ...distractors.map(String)])).slice(0, 4);

      return {
        id: `q-${Date.now()}-${Math.random()}`,
        type: 'wordProblem',
        typeMeta: QUESTION_TYPES.wordProblem,
        prompt: `At an East Coast Lagoon Hawker Centre, square dining tables are joined in a long line. Each table fits 1 person on the top and 1 on the bottom, plus 2 people on the ends. How many people can sit at ${hawkerTablesN} joined tables?`,
        contextInfo: `Formula: 2n + 2 for n joined tables`,
        options: shuffle(uniqueOptions),
        correctAnswer: String(seats),
        explanation: `Rule is 2n + 2. For n = ${hawkerTablesN}: (2 × ${hawkerTablesN}) + 2 = ${2 * hawkerTablesN} + 2 = ${seats} seats.`
      };
    }

    default:
      return generateQuestion(0, 'nextTerms');
  }
}

export function generateQuestionSet(count = 6) {
  const set = [];
  const typeKeys = Object.keys(QUESTION_TYPES);
  for (let i = 0; i < count; i++) {
    const type = typeKeys[i % typeKeys.length];
    set.push(generateQuestion(i, type));
  }
  return set;
}
