// Fraction Arithmetic & Question Engine for Grade 7 Fraction Equations
// Uses exact integer numerator/denominator pairs and GCD helper to prevent IEEE-754 float precision errors.

export function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a || 1;
}

export function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b);
}

export function simplify(num, den) {
  if (den === 0) return { num: 0, den: 1 };
  if (den < 0) {
    num = -num;
    den = -den;
  }
  const factor = gcd(num, den);
  return {
    num: num / factor,
    den: den / factor
  };
}

export function formatFraction(num, den) {
  if (den === 1) return `${num}`;
  if (num === 0) return '0';
  return `${num}/${den}`;
}

export function addFractions(n1, d1, n2, d2) {
  const commonDen = lcm(d1, d2);
  const sumNum = n1 * (commonDen / d1) + n2 * (commonDen / d2);
  return simplify(sumNum, commonDen);
}

export function subFractions(n1, d1, n2, d2) {
  const commonDen = lcm(d1, d2);
  const diffNum = n1 * (commonDen / d1) - n2 * (commonDen / d2);
  return simplify(diffNum, commonDen);
}

// 6 Question Generators

// 1. Add Like Fractions (e.g. 2/7 + 3/7 = 5/7)
export function genAddLikeFractions() {
  const den = [3, 4, 5, 6, 7, 8, 9, 10, 12][Math.floor(Math.random() * 9)];
  const n1 = Math.floor(Math.random() * (den - 2)) + 1;
  const n2 = Math.floor(Math.random() * (den - n1 - 1)) + 1;
  const sum = simplify(n1 + n2, den);
  const correctStr = formatFraction(sum.num, sum.den);

  const distractors = new Set();
  // Common error: add denominators (e.g. (n1+n2) / (den+den))
  distractors.add(formatFraction(n1 + n2, den * 2));
  // Subtract instead of add
  if (n1 !== n2) distractors.add(formatFraction(Math.abs(n1 - n2), den));
  // Multiply numerators
  distractors.add(formatFraction(n1 * n2, den));
  // Off by one
  distractors.add(formatFraction(n1 + n2 + 1, den));

  distractors.delete(correctStr);
  const options = Array.from(distractors).slice(0, 3);
  options.push(correctStr);
  options.sort(() => Math.random() - 0.5);

  return {
    type: 'addLikeFractions',
    badge: 'Like Denominators',
    question: `Calculate: ${n1}/${den} + ${n2}/${den} = ?`,
    displayEquation: `${n1}/${den} + ${n2}/${den} = \\frac{?}{?}`,
    model: {
      type: 'bar',
      fractions: [{ num: n1, den }, { num: n2, den }]
    },
    options,
    answer: correctStr,
    explanation: `When denominators are the same, add the numerators: ${n1} + ${n2} = ${n1 + n2}. The denominator stays ${den}. ${n1 + n2}/${den} simplifies to ${correctStr}.`,
    hint: "Keep the bottom number unchanged and add only the top numbers!"
  };
}

// 2. Add Unlike Fractions (e.g. 1/2 + 1/3 = 5/6)
export function genAddUnlikeFractions() {
  const pairs = [
    { d1: 2, d2: 3, n1: 1, n2: 1 },
    { d1: 2, d2: 4, n1: 1, n2: 1 },
    { d1: 3, d2: 6, n1: 1, n2: 1 },
    { d1: 4, d2: 8, n1: 1, n2: 3 },
    { d1: 2, d2: 5, n1: 1, n2: 2 },
    { d1: 3, d2: 4, n1: 2, n2: 1 },
    { d1: 5, d2: 10, n1: 2, n2: 3 },
    { d1: 3, d2: 5, n1: 1, n2: 2 },
    { d1: 4, d2: 6, n1: 1, n2: 1 }
  ];
  const p = pairs[Math.floor(Math.random() * pairs.length)];
  const result = addFractions(p.n1, p.d1, p.n2, p.d2);
  const correctStr = formatFraction(result.num, result.den);

  const distractors = new Set();
  // Classic student error: add tops and add bottoms! (e.g. 1/2 + 1/3 = 2/5)
  distractors.add(formatFraction(p.n1 + p.n2, p.d1 + p.d2));
  // Forgetting to scale numerator
  distractors.add(formatFraction(p.n1 + p.n2, lcm(p.d1, p.d2)));
  // Off by 1 in numerator
  distractors.add(formatFraction(result.num - 1 || 1, result.den));
  distractors.add(formatFraction(result.num + 1, result.den));

  distractors.delete(correctStr);
  const options = Array.from(distractors).slice(0, 3);
  options.push(correctStr);
  options.sort(() => Math.random() - 0.5);

  const commonD = lcm(p.d1, p.d2);

  return {
    type: 'addUnlikeFractions',
    badge: 'Unlike Denominators',
    question: `Calculate: ${p.n1}/${p.d1} + ${p.n2}/${p.d2} = ?`,
    displayEquation: `${p.n1}/${p.d1} + ${p.n2}/${p.d2} = \\frac{?}{?}`,
    model: {
      type: 'bar',
      fractions: [{ num: p.n1, den: p.d1 }, { num: p.n2, den: p.d2 }]
    },
    options,
    answer: correctStr,
    explanation: `Find the common denominator for ${p.d1} and ${p.d2}, which is ${commonD}. ${p.n1}/${p.d1} = ${(p.n1 * commonD) / p.d1}/${commonD}, and ${p.n2}/${p.d2} = ${(p.n2 * commonD) / p.d2}/${commonD}. Sum = ${correctStr}.`,
    hint: `First find the lowest common denominator (LCM) of ${p.d1} and ${p.d2}, then convert and add!`
  };
}

// 3. Find Missing Fraction / Solve for x (e.g. x + 1/4 = 3/4, or 1/3 + ? = 5/6)
export function genFindMissingFraction() {
  const templates = [
    { nTotal: 3, dTotal: 4, nPart: 1, dPart: 4, varName: 'x' },
    { nTotal: 5, dTotal: 6, nPart: 1, dPart: 3, varName: 'x' },
    { nTotal: 4, dTotal: 5, nPart: 2, dPart: 5, varName: 'x' },
    { nTotal: 7, dTotal: 8, nPart: 3, dPart: 8, varName: 'y' },
    { nTotal: 5, dTotal: 10, nPart: 1, dPart: 5, varName: 'n' },
    { nTotal: 2, dTotal: 3, nPart: 1, dPart: 6, varName: 'x' }
  ];
  const t = templates[Math.floor(Math.random() * templates.length)];
  const diff = subFractions(t.nTotal, t.dTotal, t.nPart, t.dPart);
  const correctStr = formatFraction(diff.num, diff.den);

  const distractors = new Set();
  // Error: add instead of subtract
  const sum = addFractions(t.nTotal, t.dTotal, t.nPart, t.dPart);
  distractors.add(formatFraction(sum.num, sum.den));
  // Invert result
  distractors.add(formatFraction(diff.den, diff.num));
  // Subtract direct numerators / denominators
  distractors.add(formatFraction(Math.abs(t.nTotal - t.nPart), Math.abs(t.dTotal - t.dPart) || 2));
  distractors.add(formatFraction(diff.num + 1, diff.den));

  distractors.delete(correctStr);
  const options = Array.from(distractors).slice(0, 3);
  options.push(correctStr);
  options.sort(() => Math.random() - 0.5);

  return {
    type: 'findMissingFraction',
    badge: 'Solve for Unknown',
    question: `Solve for ${t.varName}: ${t.varName} + ${t.nPart}/${t.dPart} = ${t.nTotal}/${t.dTotal}`,
    displayEquation: `${t.varName} + ${t.nPart}/${t.dPart} = ${t.nTotal}/${t.dTotal}`,
    model: {
      type: 'scale',
      left: `${t.varName} + ${t.nPart}/${t.dPart}`,
      right: `${t.nTotal}/${t.dTotal}`
    },
    options,
    answer: correctStr,
    explanation: `Subtract ${t.nPart}/${t.dPart} from both sides to isolate ${t.varName}: ${t.varName} = ${t.nTotal}/${t.dTotal} - ${t.nPart}/${t.dPart} = ${correctStr}.`,
    hint: `Use inverse operations! Subtract ${t.nPart}/${t.dPart} from both sides.`
  };
}

// 4. Equivalent & Simplify (e.g. 6/8 = ?/4, or simplify 6/9)
export function genEquivalentAndSimplify() {
  const cases = [
    { origN: 6, origD: 8, targetD: 4, missingN: 3 },
    { origN: 4, origD: 10, targetD: 5, missingN: 2 },
    { origN: 6, origD: 9, targetD: 3, missingN: 2 },
    { origN: 8, origD: 12, targetD: 3, missingN: 2 },
    { origN: 9, origD: 12, targetD: 4, missingN: 3 },
    { origN: 2, origD: 6, targetD: 3, missingN: 1 },
    { origN: 10, origD: 15, targetD: 3, missingN: 2 }
  ];
  const c = cases[Math.floor(Math.random() * cases.length)];
  const isFillMissing = Math.random() > 0.5;

  let question, displayEquation, correctStr, explanation;
  const distractors = new Set();

  if (isFillMissing) {
    question = `Find the missing numerator: ${c.origN}/${c.origD} = ?/${c.targetD}`;
    displayEquation = `\\frac{${c.origN}}{${c.origD}} = \\frac{?}{${c.targetD}}`;
    correctStr = `${c.missingN}`;
    distractors.add(`${c.missingN + 1}`);
    distractors.add(`${c.missingN - 1 || 4}`);
    distractors.add(`${c.origN - 1}`);
    explanation = `Divide top and bottom by ${c.origD / c.targetD}: ${c.origN} ÷ ${c.origD / c.targetD} = ${c.missingN}.`;
  } else {
    question = `Simplify the fraction to its lowest terms: ${c.origN}/${c.origD}`;
    displayEquation = `\\text{Simplify: } \\frac{${c.origN}}{${c.origD}}`;
    const simp = simplify(c.origN, c.origD);
    correctStr = formatFraction(simp.num, simp.den);
    distractors.add(formatFraction(simp.den, simp.num));
    distractors.add(formatFraction(c.origN - 1, c.origD - 1));
    distractors.add(formatFraction(simp.num + 1, simp.den));
    explanation = `Divide both numerator and denominator by their greatest common factor (${gcd(c.origN, c.origD)}) to get ${correctStr}.`;
  }

  distractors.delete(correctStr);
  const options = Array.from(distractors).slice(0, 3);
  options.push(correctStr);
  options.sort(() => Math.random() - 0.5);

  return {
    type: 'equivalentAndSimplify',
    badge: 'Equivalent & Simplest Form',
    question,
    displayEquation,
    model: {
      type: 'bar',
      fractions: [{ num: c.origN, den: c.origD }]
    },
    options,
    answer: correctStr,
    explanation,
    hint: "Divide both numerator and denominator by their greatest common factor (GCF)!"
  };
}

// 5. Singapore Context Word Problems
export function genWordProblem() {
  const problems = [
    {
      scenario: "Mei ate 1/4 of a pandan cake, and Ken ate 2/8 of the same cake. How much cake did they eat altogether?",
      equation: "1/4 + 2/8 = ?",
      ans: "1/2",
      dists: ["3/12", "3/8", "2/4"],
      expl: "2/8 simplifies to 1/4. 1/4 + 1/4 = 2/4 = 1/2 of the cake!"
    },
    {
      scenario: "Alex bought a ribbon of length 3/4 meter. He used 1/2 meter for a school project. How much ribbon does he have left?",
      equation: "3/4 - 1/2 = ?",
      ans: "1/4",
      dists: ["2/2", "1/2", "2/4"],
      expl: "1/2 is equivalent to 2/4. 3/4 - 2/4 = 1/4 meter left!"
    },
    {
      scenario: "At Maya's sticker stall, 1/3 of the stickers are glitter and 2/5 are holographic. What fraction of the stickers are glitter or holographic?",
      equation: "1/3 + 2/5 = ?",
      ans: "11/15",
      dists: ["3/8", "3/15", "7/15"],
      expl: "Common denominator is 15. 1/3 = 5/15, and 2/5 = 6/15. 5/15 + 6/15 = 11/15!"
    },
    {
      scenario: "Siti filled 2/3 of a water jug. After drinking some water, 1/6 of the jug remained. What fraction of water did Siti drink?",
      equation: "2/3 - x = 1/6",
      ans: "1/2",
      dists: ["1/3", "1/6", "3/6"],
      expl: "2/3 is 4/6. 4/6 - 1/6 = 3/6, which simplifies to 1/2 of the jug!"
    }
  ];
  const p = problems[Math.floor(Math.random() * problems.length)];
  const options = [...p.dists.slice(0, 3), p.ans].sort(() => Math.random() - 0.5);

  return {
    type: 'wordProblem',
    badge: 'Singapore Real-World',
    question: p.scenario,
    displayEquation: p.equation,
    options,
    answer: p.ans,
    explanation: p.expl,
    hint: "Identify the starting amount and the operation needed, then convert to a common denominator."
  };
}

// 6. Match Visual Fraction Model
export function genMatchModel() {
  const models = [
    {
      n: 3, d: 4,
      question: "Which equation matches a fraction bar shaded 3 out of 4 equal parts?",
      equation: "\\frac{3}{4} = \\frac{1}{4} + \\frac{1}{4} + \\frac{1}{4}",
      ans: "3/4",
      dists: ["1/4", "3/8", "4/3"]
    },
    {
      n: 2, d: 5,
      question: "If 2 out of 5 parts are shaded, what fraction remains unshaded?",
      equation: "1 - \\frac{2}{5} = ?",
      ans: "3/5",
      dists: ["2/5", "1/5", "3/10"]
    },
    {
      n: 4, d: 6,
      question: "A circular pizza has 4 out of 6 slices taken. What simplified fraction was taken?",
      equation: "\\frac{4}{6} = ?",
      ans: "2/3",
      dists: ["4/6", "1/2", "3/4"]
    }
  ];
  const m = models[Math.floor(Math.random() * models.length)];
  const options = [...m.dists.slice(0, 3), m.ans].sort(() => Math.random() - 0.5);

  return {
    type: 'matchModel',
    badge: 'Visual Model',
    question: m.question,
    displayEquation: m.equation,
    model: {
      type: 'bar',
      fractions: [{ num: m.n, den: m.d }]
    },
    options,
    answer: m.ans,
    explanation: `The model shows ${m.n} shaded parts out of ${m.d} equal pieces. In simplest form, the answer is ${m.ans}.`,
    hint: "Count the shaded pieces vs the total number of equal slices in the whole!"
  };
}

export const QUESTION_TYPES = [
  'addLikeFractions',
  'addUnlikeFractions',
  'findMissingFraction',
  'equivalentAndSimplify',
  'wordProblem',
  'matchModel'
];

export function generateQuestion(type) {
  switch (type) {
    case 'addLikeFractions':
      return genAddLikeFractions();
    case 'addUnlikeFractions':
      return genAddUnlikeFractions();
    case 'findMissingFraction':
      return genFindMissingFraction();
    case 'equivalentAndSimplify':
      return genEquivalentAndSimplify();
    case 'wordProblem':
      return genWordProblem();
    case 'matchModel':
      return genMatchModel();
    default:
      return genAddLikeFractions();
  }
}

export function generateQuestionSet(count = 10) {
  const set = [];
  for (let i = 0; i < count; i++) {
    const type = QUESTION_TYPES[i % QUESTION_TYPES.length];
    set.push({
      id: `q_${Date.now()}_${i}`,
      ...generateQuestion(type)
    });
  }
  return set;
}
