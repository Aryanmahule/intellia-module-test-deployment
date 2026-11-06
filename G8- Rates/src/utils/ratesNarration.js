// Spoken narration scripts and UI text for Rates (Grade 8)
// Characters: Maya (schoolgirl) & Ravi the Rate Racer (orange robot fox with racing helmet)

export const WONDER_NARRATION = {
  intro: {
    speaker: 'Ravi',
    text: "Welcome to Ravi's racetrack! Fast or slow, cheap or pricey, rates are everywhere. Can you work out who is really winning?",
    style: 'statement'
  },
  questions: [
    {
      id: 'rate',
      question: "What makes something a rate?",
      answer: "A rate compares two different kinds of things, like kilometres and hours, or dollars and kilograms. That is why the units matter so much!",
      style: 'statement',
      hint: "Think about comparing distance and time together."
    },
    {
      id: 'perone',
      question: "Why do we find the amount per one?",
      answer: "When everything is measured per one, comparing becomes fair. Per one kilogram, per one hour, per one litre. Then you can see the winner at once!",
      style: 'thinking',
      hint: "Unit rates make comparisons crystal clear."
    },
    {
      id: 'bigger',
      question: "Is the bigger pack always the better buy?",
      answer: "Not always! Compare the price for one unit, not the total price. Only then is the comparison fair.",
      style: 'emphasis',
      hint: "Calculate dollars per kilogram before deciding!"
    }
  ]
};

export const STORY_SLIDES = [
  {
    id: 1,
    title: "What Is a Rate?",
    subtitle: "Comparing Two Different Quantities",
    sceneImg: "/images/story/slide1_track.jpg",
    story: "Maya and Ravi watch a toy electric car zoom across the classroom track. In 2 hours, it covers 150 km! Ravi notes: 'Speed compares distance to time—two completely different units!'",
    question: "How do we write this rate?",
    capsule: "150 km in 2 h ➔ 150 ÷ 2 = 75 km/h",
    spoken: "Welcome to Ravi's racetrack of rates! A rate compares two completely different quantities, like distance and time. Whenever you see per, think for each one.",
    style: 'statement',
    unitsNote: "Unit: km/h (kilometres per hour)"
  },
  {
    id: 2,
    title: "Per One!",
    subtitle: "The Power of the Unit Rate",
    sceneImg: "/images/story/slide2_perone.jpg",
    story: "At the school tuckshop, 6 bottles of fruit tea cost $9.00. Maya wants to know how much just 1 bottle costs. Ravi pulls out a double number line: divide both 6 bottles and $9.00 by 6!",
    question: "What is the cost of 1 bottle?",
    capsule: "6 bottles cost $9 ➔ 9 ÷ 6 = $1.50 per bottle",
    spoken: "To find a unit rate, divide to scale down to just one. When both quantities change by the same factor, the rate stays exactly in proportion.",
    style: 'instruction',
    unitsNote: "$1.50 / bottle"
  },
  {
    id: 3,
    title: "Best Buy",
    subtitle: "Comparing Value Fairly",
    sceneImg: "/images/story/slide3_bestbuy.jpg",
    story: "At FairPrice supermarket, Maya sees two bags of Jasmine rice: a 5 kg bag for $12.50, and a 2 kg bag for $6.00. The 2 kg bag costs less money overall, but is it the better deal?",
    question: "Which bag gives more rice per dollar?",
    capsule: "5 kg for $12.50 ➔ $2.50/kg  |  2 kg for $6 ➔ $3.00/kg  ➔ 5 kg bag is the better buy!",
    spoken: "Never judge a bargain by the total price tag alone. Find the price per single kilogram or bottle. The lower unit rate is always the true best buy!",
    style: 'emphasis',
    unitsNote: "$2.50/kg vs $3.00/kg"
  },
  {
    id: 4,
    title: "Speed, Distance, Time",
    subtitle: "The Fundamental Rate Formula",
    sceneImg: "/images/story/slide4_speed.jpg",
    story: "Ravi sets the speed of the RC car to 60 km/h. If it runs for 2.5 hours, it covers 60 × 2.5 = 150 km! But what about in metres per second? 72 km/h converts to 20 m/s by dividing by 3.6.",
    question: "How do speed, distance, and time relate?",
    capsule: "d = r × t ➔ 60 km/h × 2.5 h = 150 km  |  72 km/h = 72,000 m ÷ 3,600 s = 20 m/s",
    spoken: "Speed tells you how fast distance changes over time. Multiply speed by time to get distance, and switch to metres per second by dividing by three point six.",
    style: 'instruction',
    unitsNote: "1 m/s = 3.6 km/h"
  },
  {
    id: 5,
    title: "Rates on a Graph",
    subtitle: "Proportional Lines & Slope",
    sceneImg: "/images/story/slide5_graph.jpg",
    story: "Maya graphs the car's trip on coordinate axes. At (0, 0) it hasn't started. At (1, 60), (2, 120), (3, 180), all points line up straight through the origin! The slope is the unit rate: 60 km/h.",
    question: "What does the slope of the line represent?",
    capsule: "Slope = Rise ÷ Run = 60 ÷ 1 = 60 km/h  ➔  d = 60t",
    spoken: "When you plot a rate on a graph starting at zero, the line is straight. The steepness or slope of the line is the unit rate itself!",
    style: 'celebration',
    unitsNote: "Slope = Unit Rate"
  }
];

export const STATIONS_NARRATION = {
  station1: {
    title: "Station 1: Per One",
    spoken: "Welcome to Station 1! Scale each rate down to one unit, then compare prices to find the best buy.",
    style: 'instruction'
  },
  station2: {
    title: "Station 2: Race Track",
    spoken: "Welcome to Station 2! Take the cars around the track. Find the speed, distance or time, and switch between units.",
    style: 'instruction'
  },
  station3: {
    title: "Station 3: Rates in Singapore",
    spoken: "Welcome to Station 3! Read graphs and real Singapore situations, and tell Ravi what each rate means.",
    style: 'instruction'
  }
};

export const PRACTICE_NARRATION = {
  welcome: {
    spoken: "Welcome to Practice Mode! Test your rate skills across six racing challenges. Calculate unit rates, spot the best buy, and convert units to build your streak!",
    style: 'instruction'
  },
  correct: [
    {
      spoken: "Outstanding calculation! You found the exact rate with the right units.",
      style: 'encouragement'
    },
    {
      spoken: "Spot on! Ravi the Rate Racer is thrilled with your speedy math.",
      style: 'celebration'
    }
  ],
  wrong: [
    {
      spoken: "Not quite. Divide to find the amount per one, and check that your units match the question.",
      style: 'thinking'
    },
    {
      spoken: "Take another look! Make sure you divide the right way around, or double-check your unit conversion.",
      style: 'thinking'
    }
  ]
};

export const REFLECT_NARRATION = {
  intro: {
    spoken: "Think about today's discoveries. Where in your own day do you meet a rate?",
    style: 'thinking'
  },
  prompts: [
    {
      id: 'unit_price_fair',
      prompt: "Why is comparing the unit price (price per 1) fairer than comparing total pack prices?",
      placeholder: "e.g., Because pack sizes can be different, so per-unit shows the true cost for each unit of product..."
    },
    {
      id: 'graph_slope',
      prompt: "How is the unit rate related to the slope of a proportional line on a graph?",
      placeholder: "e.g., The slope is the rise over run (change in y per 1 unit of x), which is exactly the unit rate..."
    },
    {
      id: 'real_world_rate',
      prompt: "Describe a rate you encounter in daily life in Singapore, and explain what its units mean.",
      placeholder: "e.g., EZ-Link bus fare per kilometre, mobile data at $10 per 20 GB, hawker chicken rice at $4.50 per plate..."
    }
  ]
};

export const SUMMARY_NARRATION = {
  congrats: {
    spoken: "Congratulations! You have mastered rates and earned your Rate Racer badge!",
    style: 'celebration'
  },
  badgeName: "Rate Racer",
  badgeIcon: "🏎️"
};

export const INTRO_MASCOT = {
  spoken: "Welcome to my racetrack! Can you calculate speeds, find the best supermarket buys, and master rates with me?",
  style: 'encouragement'
};
