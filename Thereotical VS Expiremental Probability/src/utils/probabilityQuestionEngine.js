/* =========================================================
   PROBABILITY QUESTION ENGINE
   Grade 7: Theoretical vs Experimental Probability
   Features:
   - Exact fraction math with GCD reduction
   - Mulberry32 seeded PRNG for reproducible testable sets
   - 6 Core Question Types with authentic distractors
   ========================================================= */

// GCD helper for fraction reduction
export function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

export function simplifyFraction(num, den) {
  if (den === 0) return '0';
  if (num === 0) return '0';
  const divisor = gcd(num, den);
  const sNum = num / divisor;
  const sDen = den / divisor;
  if (sDen === 1) return `${sNum}`;
  return `${sNum}/${sDen}`;
}

// Seeded PRNG (Mulberry32)
export function createMulberry32(seed) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const QUESTION_TYPES = [
  {
    type: 'theoreticalProbability',
    label: 'Theoretical Probability',
    color: 'var(--teal-400)',
    bg: 'rgba(0, 229, 255, 0.15)'
  },
  {
    type: 'experimentalProbability',
    label: 'Experimental Probability',
    color: 'var(--coral-400)',
    bg: 'rgba(255, 94, 98, 0.15)'
  },
  {
    type: 'findMissingValue',
    label: 'Find Missing Value',
    color: 'var(--gold-400)',
    bg: 'rgba(255, 184, 0, 0.15)'
  },
  {
    type: 'compareBoth',
    label: 'Compare Theoretical & Experimental',
    color: 'var(--purple-300)',
    bg: 'rgba(168, 85, 247, 0.15)'
  },
  {
    type: 'wordProblem',
    label: 'Real-World Word Problem',
    color: 'var(--emerald-400)',
    bg: 'rgba(16, 185, 129, 0.15)'
  },
  {
    type: 'fairOrBiased',
    label: 'Detective: Fair or Biased?',
    color: 'var(--gold-300)',
    bg: 'rgba(255, 201, 51, 0.15)'
  }
];

function shuffleArray(arr, rng) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// 1. Theoretical Probability Generator
function genTheoretical(rng) {
  const scenarios = [
    () => {
      // Marble Bag
      const red = 3 + Math.floor(rng() * 4);
      const blue = 4 + Math.floor(rng() * 5);
      const green = 2 + Math.floor(rng() * 3);
      const total = red + blue + green;
      const targetColor = rng() > 0.5 ? 'blue' : 'red';
      const targetCount = targetColor === 'blue' ? blue : red;
      const correctFrac = simplifyFraction(targetCount, total);

      // Distractors
      const d1 = simplifyFraction(targetCount, total - targetCount); // favourable / unfavourable
      const d2 = simplifyFraction(total - targetCount, total); // unfavourable / total
      const d3 = simplifyFraction(targetCount + 1, total);

      const prompt = `A bag contains ${red} red marbles, ${blue} blue marbles, and ${green} green marbles. If Maya picks one marble at random without looking, what is the theoretical probability of picking a ${targetColor} marble?`;

      return {
        prompt,
        correctAnswer: correctFrac,
        distractors: [d1, d2, d3],
        explanation: `Total marbles = ${red} + ${blue} + ${green} = ${total}. Favourable ${targetColor} marbles = ${targetCount}. P(${targetColor}) = ${targetCount}/${total} = ${correctFrac}.`,
        contextInfo: `Bag of Marbles (n = ${total})`
      };
    },
    () => {
      // 6-sided Dice Event
      const events = [
        { desc: 'rolling an even number', fav: [2, 4, 6], count: 3 },
        { desc: 'rolling a prime number (2, 3, or 5)', fav: [2, 3, 5], count: 3 },
        { desc: 'rolling a number strictly greater than 4', fav: [5, 6], count: 2 },
        { desc: 'rolling a multiple of 3 (3 or 6)', fav: [3, 6], count: 2 }
      ];
      const ev = events[Math.floor(rng() * events.length)];
      const total = 6;
      const correctFrac = simplifyFraction(ev.count, total);

      const d1 = simplifyFraction(total - ev.count, total);
      const d2 = simplifyFraction(ev.count, 5);
      const d3 = `${ev.count}/10`;

      return {
        prompt: `Archie rolls a fair standard six-sided dice once. What is the theoretical probability of ${ev.desc}?`,
        correctAnswer: correctFrac,
        distractors: [d1, d2, d3],
        explanation: `A standard dice has 6 equally likely outcomes {1, 2, 3, 4, 5, 6}. The favourable outcomes are ${ev.count} out of 6. P(E) = ${ev.count}/6 = ${correctFrac}.`,
        contextInfo: 'Fair 6-Sided Dice'
      };
    },
    () => {
      // 8-Sector Spinner
      const colors = [
        { color: 'Yellow', count: 2 },
        { color: 'Purple', count: 3 },
        { color: 'Cyan', count: 1 }
      ];
      const pick = colors[Math.floor(rng() * colors.length)];
      const total = 8;
      const correctFrac = simplifyFraction(pick.count, total);

      const d1 = simplifyFraction(pick.count, total - pick.count);
      const d2 = simplifyFraction(total - pick.count, total);
      const d3 = simplifyFraction(pick.count + 1, total);

      return {
        prompt: `A carnival spinner is divided into 8 equal sectors: 3 are Purple, 2 are Yellow, 2 are Green, and 1 is Cyan. What is the theoretical probability of landing on ${pick.color}?`,
        correctAnswer: correctFrac,
        distractors: [d1, d2, d3],
        explanation: `There are 8 equal sectors in total. Favourable sectors for ${pick.color} = ${pick.count}. P(${pick.color}) = ${pick.count}/8 = ${correctFrac}.`,
        contextInfo: '8-Sector Spinner'
      };
    }
  ];

  return scenarios[Math.floor(rng() * scenarios.length)]();
}

// 2. Experimental Probability Generator
function genExperimental(rng) {
  const scenarios = [
    () => {
      const flips = 50 * (1 + Math.floor(rng() * 3)); // 50, 100, or 150
      const heads = Math.round(flips * (0.42 + rng() * 0.16));
      const correctFrac = simplifyFraction(heads, flips);
      const dec = (heads / flips).toFixed(2);

      const d1 = simplifyFraction(flips - heads, flips);
      const d2 = simplifyFraction(heads, flips - heads);
      const d3 = '1/2';

      return {
        prompt: `In an experiment, Maya flips a coin ${flips} times. It lands on Heads exactly ${heads} times. What is the experimental probability of landing on Heads?`,
        correctAnswer: correctFrac,
        distractors: [d1, d2, d3],
        explanation: `Experimental probability = (Number of times Heads occurred) ÷ (Total flips) = ${heads}/${flips} = ${correctFrac} (or ${dec}). Note: 1/2 is the theoretical probability, but experimental is based on the actual recorded trial!`,
        contextInfo: `${flips} Coin Trials`
      };
    },
    () => {
      const totalSpins = 40;
      const blueSpins = 12 + Math.floor(rng() * 8); // e.g. 14, 16
      const correctFrac = simplifyFraction(blueSpins, totalSpins);

      const d1 = simplifyFraction(totalSpins - blueSpins, totalSpins);
      const d2 = simplifyFraction(blueSpins, totalSpins - blueSpins);
      const d3 = '1/4';

      return {
        prompt: `Archie spins a mystery spinner ${totalSpins} times. The spinner lands on Blue ${blueSpins} times. What is the experimental probability of landing on Blue?`,
        correctAnswer: correctFrac,
        distractors: [d1, d2, d3],
        explanation: `Experimental probability = (Observed Blue count) ÷ (Total spins) = ${blueSpins}/${totalSpins} = ${correctFrac}.`,
        contextInfo: `${totalSpins} Mystery Spins`
      };
    },
    () => {
      const tested = 200;
      const defective = 6 + Math.floor(rng() * 6); // 6 to 11
      const correctFrac = simplifyFraction(defective, tested);
      const dec = (defective / tested).toFixed(3);

      const d1 = simplifyFraction(tested - defective, tested);
      const d2 = `${defective}/100`;
      const d3 = simplifyFraction(defective, 100);

      return {
        prompt: `A Singapore smart-tech factory inspects a random batch of ${tested} microchips and discovers ${defective} defective chips. What is the experimental probability that a randomly chosen chip from this batch is defective?`,
        correctAnswer: correctFrac,
        distractors: [d1, d2, d3],
        explanation: `Experimental probability = (Defective chips) ÷ (Total tested) = ${defective}/${tested} = ${correctFrac} (which is ${dec} or ${(Number(dec)*100).toFixed(1)}%).`,
        contextInfo: `QC Batch Inspection (n = ${tested})`
      };
    }
  ];

  return scenarios[Math.floor(rng() * scenarios.length)]();
}

// 3. Find Missing Value Generator
function genFindMissing(rng) {
  const scenarios = [
    () => {
      // Find frequency given probability and total
      const total = [40, 50, 60, 80, 100][Math.floor(rng() * 5)];
      const dec = [0.25, 0.35, 0.40, 0.60][Math.floor(rng() * 4)];
      const count = Math.round(total * dec);

      const d1 = `${count + 5}`;
      const d2 = `${Math.round(total * (1 - dec))}`;
      const d3 = `${Math.max(1, count - 6)}`;

      return {
        prompt: `In a carnival game with ${total} players, the experimental probability of winning a plush bear was ${dec}. How many players actually won a plush bear?`,
        correctAnswer: `${count}`,
        distractors: [d1, d2, d3],
        explanation: `Number of winners = Total trials × Experimental probability = ${total} × ${dec} = ${count} players.`,
        contextInfo: `Frequency from Probability`
      };
    },
    () => {
      // Find total trials given frequency and probability
      const count = 15;
      const prob = 0.3; // total = 50
      const total = Math.round(count / prob);

      const d1 = `${Math.round(count * prob)}`; // multiplied instead of divided
      const d2 = `${total + 10}`;
      const d3 = `${count * 2}`;

      return {
        prompt: `Archie conducted an experiment rolling a weighted dice. The outcome '6' appeared 15 times. If the experimental probability of rolling '6' was calculated as 0.3, how many total rolls were made?`,
        correctAnswer: `${total}`,
        distractors: [d1, d2, d3],
        explanation: `Since Experimental Probability = Frequency ÷ Total Trials, Total Trials = Frequency ÷ Probability = 15 ÷ 0.3 = ${total} rolls.`,
        contextInfo: `Total Trials Calculation`
      };
    }
  ];

  return scenarios[Math.floor(rng() * scenarios.length)]();
}

// 4. Compare Theoretical & Experimental
function genCompare(rng) {
  const diceTotal = 120;
  // Rolling a 6 on fair dice: theoretical is 1/6 = 20 times in 120 rolls
  const theoreticalCount = 20;
  const actualCount = 28; // experimental is 28/120 = 7/30 (~0.233)
  const diff = actualCount - theoreticalCount;

  const correct = `Experimental is higher by 8/120 (1/15)`;
  const d1 = `Theoretical is higher by 8/120 (1/15)`;
  const d2 = `Both are exactly equal`;
  const d3 = `Experimental is higher by 28/120`;

  return {
    prompt: `Archie rolls a standard six-sided dice 120 times. It lands on '6' exactly 28 times. The theoretical probability of rolling a '6' is 1/6 (or 20/120). How does the experimental probability compare to the theoretical probability?`,
    correctAnswer: correct,
    distractors: [d1, d2, d3],
    explanation: `Theoretical expected count = 1/6 × 120 = 20. Experimental count = 28. The experimental probability (28/120) is higher than the theoretical probability (20/120) by (28 − 20)/120 = 8/120, which simplifies to 1/15.`,
    contextInfo: `120 Dice Rolls Comparison`
  };
}

// 5. Real-World Word Problem
function genWordProblem(rng) {
  const problems = [
    () => {
      return {
        prompt: `At the Changi Airport transit lounge, 100 passengers were asked whether they prefer tea or coffee. 65 chose coffee, 25 chose tea, and 10 chose fruit juice. What is the experimental probability that a randomly chosen passenger prefers tea?`,
        correctAnswer: '1/4',
        distractors: ['1/2', '25/65', '1/5'],
        explanation: `Total passengers = 100. Passengers who prefer tea = 25. Experimental probability = 25/100 = 1/4 (or 25% or 0.25).`,
        contextInfo: `Changi Passenger Survey (n = 100)`
      };
    },
    () => {
      return {
        prompt: `According to Meteorological Service Singapore, historically in November it rains on 18 out of 30 days. Based on this historical data, what is the experimental probability of rain on any chosen November day?`,
        correctAnswer: '3/5',
        distractors: ['18/12', '2/5', '1/2'],
        explanation: `Favourable rainy days = 18. Total days = 30. Probability = 18/30 = 3/5 (or 60% or 0.60).`,
        contextInfo: `Singapore Weather History`
      };
    },
    () => {
      return {
        prompt: `A bus at Jurong East Interchange arrives strictly on time on 72 out of 80 recorded mornings. What is the experimental probability that the bus will be late tomorrow morning?`,
        correctAnswer: '1/10',
        distractors: ['9/10', '8/72', '1/8'],
        explanation: `Late mornings = 80 − 72 = 8 mornings. Total mornings = 80. Experimental probability of being late = 8/80 = 1/10 (or 10%).`,
        contextInfo: `Bus Punctuality Audit`
      };
    }
  ];

  return problems[Math.floor(rng() * problems.length)]();
}

// 6. Detective: Fair or Biased?
function genFairOrBiased(rng) {
  const isBiased = rng() > 0.5;

  if (isBiased) {
    const trials = 600;
    // Expected on fair 6-sided dice = 100 each.
    // Biased dice has '6' way too high: 210, others ~78
    return {
      prompt: `Maya suspects a carnival game uses a loaded six-sided dice. She tests it by rolling it 600 times and records the frequencies:\n\n• Face 1: 76 times\n• Face 2: 78 times\n• Face 3: 80 times\n• Face 4: 75 times\n• Face 5: 81 times\n• Face 6: 210 times (35%)\n\nIs this dice fair or biased?`,
      correctAnswer: 'Biased — Face 6 appears far more often than theoretical 1/6 (16.7%)',
      distractors: [
        'Fair — Every number appeared at least once',
        'Fair — 600 trials is too small to judge',
        'Biased — Only because Face 1 has the lowest count'
      ],
      explanation: `For 600 rolls of a fair dice, every face has a theoretical probability of 1/6, so we expect roughly 100 rolls per face. Face 6 occurred 210 times (over double the expectation)! In a large trial of 600 rolls, this massive deviation proves the dice is heavily biased.`,
      contextInfo: '600 Rolls Frequency Audit'
    };
  } else {
    // Fair dice
    return {
      prompt: `Archie tests a standard six-sided dice by rolling it 600 times. The frequencies are:\n\n• Face 1: 98 times\n• Face 2: 104 times\n• Face 3: 97 times\n• Face 4: 102 times\n• Face 5: 99 times\n• Face 6: 100 times\n\nIs this dice fair or biased?`,
      correctAnswer: 'Fair — All faces are very close to the theoretical expectation of 100 (1/6)',
      distractors: [
        'Biased — Because the counts are not all exactly identical to 100',
        'Biased — Because Face 2 is higher than Face 3',
        'Cannot be determined without 10,000 rolls'
      ],
      explanation: `On a fair dice, the theoretical probability of each face is 1/6 = 16.7%, which predicts about 100 rolls per face out of 600. The observed counts (97 to 104) are extremely close to 100 with only minor natural random variation. The dice is fair!`,
      contextInfo: '600 Rolls Frequency Audit'
    };
  }
}

// Master question generator
export function generateQuestion(type, seed = Math.floor(Math.random() * 1000000)) {
  const rng = createMulberry32(seed);
  const typeMeta = QUESTION_TYPES.find(t => t.type === type) || QUESTION_TYPES[0];

  let qData;
  switch (type) {
    case 'theoreticalProbability':
      qData = genTheoretical(rng);
      break;
    case 'experimentalProbability':
      qData = genExperimental(rng);
      break;
    case 'findMissingValue':
      qData = genFindMissing(rng);
      break;
    case 'compareBoth':
      qData = genCompare(rng);
      break;
    case 'wordProblem':
      qData = genWordProblem(rng);
      break;
    case 'fairOrBiased':
      qData = genFairOrBiased(rng);
      break;
    default:
      qData = genTheoretical(rng);
  }

  // Combine and shuffle options
  const uniqueDistractors = Array.from(new Set(qData.distractors.filter(d => d !== qData.correctAnswer))).slice(0, 3);
  while (uniqueDistractors.length < 3) {
    uniqueDistractors.push(`Option ${uniqueDistractors.length + 2}`);
  }

  const allOptions = shuffleArray([qData.correctAnswer, ...uniqueDistractors], rng);

  return {
    id: `q_${type}_${seed}`,
    type,
    typeMeta,
    prompt: qData.prompt,
    options: allOptions,
    correctAnswer: qData.correctAnswer,
    explanation: qData.explanation,
    contextInfo: qData.contextInfo
  };
}

export function generateQuestionSet(count = 6, baseSeed = Date.now()) {
  const types = [
    'theoreticalProbability',
    'experimentalProbability',
    'findMissingValue',
    'compareBoth',
    'wordProblem',
    'fairOrBiased'
  ];

  const questions = [];
  for (let i = 0; i < count; i++) {
    const qType = types[i % types.length];
    questions.push(generateQuestion(qType, baseSeed + i * 997));
  }

  return questions;
}
