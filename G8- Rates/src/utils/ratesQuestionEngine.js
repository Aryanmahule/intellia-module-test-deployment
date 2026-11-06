// Practice Question Engine for Rates (Grade 8)
// Generates 6 question types with realistic misconception distractors and exact arithmetic

export const QUESTION_TYPES = [
  { id: 'unitRate', label: 'Per One', color: 'teal', icon: '🧮' },
  { id: 'bestBuy', label: 'Best Buy', color: 'purple', icon: '🏆' },
  { id: 'speedDistTime', label: 'Speed Trio', color: 'gold', icon: '🏎️' },
  { id: 'convertRate', label: 'Switch Units', color: 'coral', icon: '🔄' },
  { id: 'readGraph', label: 'Graph Rate', color: 'teal', icon: '📈' },
  { id: 'wordProblem', label: 'Real-World', color: 'green', icon: '🏙️' }
];

// Helper to shuffle array
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 1. UNIT RATE GENERATOR
function generateUnitRate(seed = 0) {
  const scenarios = [
    { item: 'bottles of fresh juice', qty: 6, totalCents: 900, unitSingular: 'bottle' },
    { item: 'boxes of colored markers', qty: 4, totalCents: 1400, unitSingular: 'box' },
    { item: 'notebooks', qty: 5, totalCents: 1250, unitSingular: 'notebook' },
    { item: 'kilograms of apples', qty: 3, totalCents: 750, unitSingular: 'kg' },
    { item: 'hours of tutoring', qty: 4, totalCents: 12000, unitSingular: 'hour' },
    { item: 'tickets to the science museum', qty: 5, totalCents: 6500, unitSingular: 'ticket' }
  ];

  const pick = scenarios[seed % scenarios.length];
  const unitPrice = pick.totalCents / pick.qty / 100;
  const totalFormatted = (pick.totalCents / 100).toFixed(2);
  const correct = `$${unitPrice.toFixed(2)} per ${pick.unitSingular}`;

  // Misconceptions
  const inverted = (pick.qty / (pick.totalCents / 100)).toFixed(2);
  const slip1 = `$${inverted} per ${pick.unitSingular}`; // Divided qty by price
  const slip2 = `$${(unitPrice * 1.5).toFixed(2)} per ${pick.unitSingular}`;
  const slip3 = `$${(unitPrice * 0.8).toFixed(2)} per ${pick.unitSingular}`;

  const options = Array.from(new Set([correct, slip1, slip2, slip3]));
  while (options.length < 4) {
    options.push(`$${(unitPrice + options.length).toFixed(2)} per ${pick.unitSingular}`);
  }

  return {
    type: 'unitRate',
    prompt: `A student buys ${pick.qty} ${pick.item} for a total cost of $${totalFormatted}. What is the unit rate?`,
    options: shuffle(options),
    correctAnswer: correct,
    explanation: `Divide the total cost by the number of units: $${totalFormatted} ÷ ${pick.qty} = $${unitPrice.toFixed(2)} per ${pick.unitSingular}.`
  };
}

// 2. BEST BUY GENERATOR
function generateBestBuy(seed = 0) {
  const pairs = [
    { item: 'Jasmine Rice', packA: '5 kg for $12.50', qtyA: 5, priceA: 12.50, packB: '2 kg for $6.00', qtyB: 2, priceB: 6.00, unit: 'kg' },
    { item: 'Olive Oil', packA: '750 mL for $9.00', qtyA: 750, priceA: 9.00, packB: '500 mL for $7.00', qtyB: 500, priceB: 7.00, unit: 'mL' },
    { item: 'Granola Cereal', packA: '800 g for $9.60', qtyA: 800, priceA: 9.60, packB: '400 g for $5.60', qtyB: 400, priceB: 5.60, unit: 'g' },
    { item: 'Laundry Detergent', packA: '3 L for $15.00', qtyA: 3, priceA: 15.00, packB: '1.5 L for $9.00', qtyB: 1.5, priceB: 9.00, unit: 'L' }
  ];

  const pick = pairs[seed % pairs.length];
  const rateA = pick.priceA / pick.qtyA;
  const rateB = pick.priceB / pick.qtyB;
  const isAWin = rateA < rateB;

  const correct = isAWin ? `${pick.packA}` : `${pick.packB}`;
  const wrongOption = isAWin ? `${pick.packB}` : `${pick.packA}`;
  const equalOption = 'Both offers provide identical value per unit';
  const dependOption = 'Cannot be determined without knowing the total brand';

  return {
    type: 'bestBuy',
    prompt: `Which offer represents the better value (Best Buy) for ${pick.item}?\nOffer A: ${pick.packA}  vs  Offer B: ${pick.packB}`,
    options: shuffle([correct, wrongOption, equalOption, dependOption]),
    correctAnswer: correct,
    explanation: `Offer A rate: $${pick.priceA} ÷ ${pick.qtyA} = $${rateA.toFixed(3)}/${pick.unit}. Offer B rate: $${pick.priceB} ÷ ${pick.qtyB} = $${rateB.toFixed(3)}/${pick.unit}. ${correct} has the lower unit cost!`
  };
}

// 3. SPEED DISTANCE TIME GENERATOR
function generateSpeedDistTime(seed = 0) {
  const problems = [
    { speed: 80, time: 3.5, dist: 280, asks: 'dist' },
    { speed: 65, time: 2, dist: 130, asks: 'dist' },
    { speed: 70, time: 3, dist: 210, asks: 'speed' },
    { speed: 90, time: 4, dist: 360, asks: 'time' },
    { speed: 50, time: 2.5, dist: 125, asks: 'dist' }
  ];

  const pick = problems[seed % problems.length];

  if (pick.asks === 'dist') {
    const correct = `${pick.dist} km`;
    const slip1 = `${(pick.speed / pick.time).toFixed(0)} km`; // Divided instead of multiplied
    const slip2 = `${pick.dist - 20} km`;
    const slip3 = `${pick.dist + 30} km`;
    return {
      type: 'speedDistTime',
      prompt: `An electric car travels at a constant speed of ${pick.speed} km/h for ${pick.time} hours. What distance does it cover?`,
      options: shuffle([correct, slip1, slip2, slip3]),
      correctAnswer: correct,
      explanation: `Distance = Speed × Time = ${pick.speed} km/h × ${pick.time} h = ${pick.dist} km.`
    };
  } else if (pick.asks === 'speed') {
    const correct = `${pick.speed} km/h`;
    const slip1 = `${pick.dist * pick.time} km/h`;
    const slip2 = `${pick.speed - 15} km/h`;
    const slip3 = `${pick.speed + 20} km/h`;
    return {
      type: 'speedDistTime',
      prompt: `A delivery van travels ${pick.dist} km in ${pick.time} hours. What is its average speed?`,
      options: shuffle([correct, slip1, slip2, slip3]),
      correctAnswer: correct,
      explanation: `Speed = Distance ÷ Time = ${pick.dist} km ÷ ${pick.time} h = ${pick.speed} km/h.`
    };
  } else {
    const correct = `${pick.time} hours`;
    const slip1 = `${pick.time + 1} hours`;
    const slip2 = `${pick.dist * pick.speed} hours`;
    const slip3 = `${(pick.speed / pick.dist).toFixed(1)} hours`;
    return {
      type: 'speedDistTime',
      prompt: `How long does it take an express train travelling at ${pick.speed} km/h to cover a journey of ${pick.dist} km?`,
      options: shuffle([correct, slip1, slip2, slip3]),
      correctAnswer: correct,
      explanation: `Time = Distance ÷ Speed = ${pick.dist} km ÷ ${pick.speed} km/h = ${pick.time} hours.`
    };
  }
}

// 4. UNIT CONVERSION GENERATOR
function generateConvertRate(seed = 0) {
  const conversions = [
    { kmh: 18, ms: 5 },
    { kmh: 36, ms: 10 },
    { kmh: 54, ms: 15 },
    { kmh: 72, ms: 20 },
    { kmh: 90, ms: 25 },
    { kmh: 108, ms: 30 }
  ];

  const pick = conversions[seed % conversions.length];
  const toMs = seed % 2 === 0;

  if (toMs) {
    const correct = `${pick.ms} m/s`;
    const slipMultiply = `${(pick.kmh * 3.6).toFixed(1)} m/s`; // Multiplied instead of divided
    const slipOnly1000 = `${pick.kmh * 1000} m/s`;
    const slipDivide60 = `${(pick.kmh / 60).toFixed(1)} m/s`;

    return {
      type: 'convertRate',
      prompt: `Convert a speed of ${pick.kmh} km/h into metres per second (m/s):`,
      options: shuffle([correct, slipMultiply, slipOnly1000, slipDivide60]),
      correctAnswer: correct,
      explanation: `${pick.kmh} km/h = (${pick.kmh} × 1,000 m) ÷ 3,600 s = ${pick.ms} m/s (Shortcut: ${pick.kmh} ÷ 3.6 = ${pick.ms} m/s).`
    };
  } else {
    const correct = `${pick.kmh} km/h`;
    const slipDivide = `${(pick.ms / 3.6).toFixed(1)} km/h`;
    const slipPlus = `${pick.kmh + 10} km/h`;
    const slipMinus = `${pick.kmh - 8} km/h`;

    return {
      type: 'convertRate',
      prompt: `A sprinter runs at a speed of ${pick.ms} m/s. What is this speed in km/h?`,
      options: shuffle([correct, slipDivide, slipPlus, slipMinus]),
      correctAnswer: correct,
      explanation: `To convert m/s to km/h, multiply by 3.6: ${pick.ms} m/s × 3.6 = ${pick.kmh} km/h.`
    };
  }
}

// 5. GRAPH RATE GENERATOR
function generateReadGraph(seed = 0) {
  const rates = [40, 50, 60, 75, 80];
  const rate = rates[seed % rates.length];
  const p1 = [1, rate];
  const p2 = [2, rate * 2];
  const p3 = [3, rate * 3];

  const correct = `${rate} km/h`;
  const slipLastY = `${rate * 3} km/h`; // Read last point y
  const slipInvert = `${(1 / rate).toFixed(3)} km/h`; // Inverted slope
  const slipDouble = `${rate * 2} km/h`;

  return {
    type: 'readGraph',
    prompt: `A distance-time graph passes through (0, 0), (${p1[0]}, ${p1[1]}), (${p2[0]}, ${p2[1]}), and (${p3[0]}, ${p3[1]}). What is the unit rate (speed)?`,
    options: shuffle([correct, slipLastY, slipInvert, slipDouble]),
    correctAnswer: correct,
    explanation: `Slope = Rise ÷ Run = (${p2[1]} - ${p1[1]}) ÷ (${p2[0]} - ${p1[0]}) = ${rate} ÷ 1 = ${rate} km/h. On a proportional graph, slope is the unit rate!`
  };
}

// 6. WORD PROBLEM GENERATOR (SINGAPORE CONTEXT)
function generateWordProblem(seed = 0) {
  const problems = [
    {
      story: "A SBS Transit bus travels 45 km from Jurong to Changi in 45 minutes.",
      question: "What is the average speed of the bus in km/h?",
      correct: "60 km/h",
      distractors: ["45 km/h", "100 km/h", "75 km/h"],
      explanation: "45 minutes = 45/60 hours = 0.75 hours. Speed = 45 km ÷ 0.75 h = 60 km/h."
    },
    {
      story: "A mobile plan in Singapore charges $12 for 30 GB of data.",
      question: "What is the cost per gigabyte (GB) of data?",
      correct: "$0.40 per GB",
      distractors: ["$2.50 per GB", "$0.25 per GB", "$4.00 per GB"],
      explanation: "$12.00 ÷ 30 GB = $0.40 per GB."
    },
    {
      story: "At a fruit stall in Chinatown, 8 passionfruits cost $6.00.",
      question: "How much would 12 passionfruits cost at the same rate?",
      correct: "$9.00",
      distractors: ["$8.00", "$10.50", "$7.50"],
      explanation: "Unit rate = $6.00 ÷ 8 = $0.75 per fruit. For 12 fruits: 12 × $0.75 = $9.00."
    },
    {
      story: "A taxi charges a flat starting fee, then $0.60 for every 400 metres travelled.",
      question: "What is the taxi rate per kilometre?",
      correct: "$1.50 per km",
      distractors: ["$2.40 per km", "$1.20 per km", "$0.90 per km"],
      explanation: "1 km = 1,000 metres. (1,000 ÷ 400) × $0.60 = 2.5 × $0.60 = $1.50 per km."
    }
  ];

  const pick = problems[seed % problems.length];
  return {
    type: 'wordProblem',
    prompt: `${pick.story}\n${pick.question}`,
    options: shuffle([pick.correct, ...pick.distractors]),
    correctAnswer: pick.correct,
    explanation: pick.explanation
  };
}

export function generateQuestion(index, type = null) {
  const typeList = ['unitRate', 'bestBuy', 'speedDistTime', 'convertRate', 'readGraph', 'wordProblem'];
  const chosenType = type || typeList[index % typeList.length];

  switch (chosenType) {
    case 'unitRate':
      return generateUnitRate(index);
    case 'bestBuy':
      return generateBestBuy(index);
    case 'speedDistTime':
      return generateSpeedDistTime(index);
    case 'convertRate':
      return generateConvertRate(index);
    case 'readGraph':
      return generateReadGraph(index);
    case 'wordProblem':
      return generateWordProblem(index);
    default:
      return generateUnitRate(index);
  }
}

export function generateQuestionSet(count = 6) {
  const set = [];
  for (let i = 0; i < count; i++) {
    set.push(generateQuestion(i));
  }
  return set;
}
