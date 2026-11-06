/* =========================================================
   NARRATION STRINGS & TEXT SCRIPT
   Voice: Alice (ElevenLabs Voice ID: Xb7hH8MSUJpSbSDYk0k2)
   Lesson: Theoretical vs Experimental Probability (Grade 7)
   ========================================================= */

export const WONDER_NARRATION = {
  intro: {
    id: 'wonder_intro',
    text: "Imagine flipping a coin ten times. Will you always get exactly five heads and five tails? What does it truly mean for a dice or spinner to be fair?",
    style: 'statement'
  },
  coinFlip: {
    id: 'wonder_coin_flip',
    text: "Not always! Even with a fair coin, getting four heads or seven heads in ten flips is totally normal. Ten flips is a small sample!",
    style: 'emphasis'
  },
  fairMeaning: {
    id: 'wonder_fair_meaning',
    text: "A fair device gives every single outcome an equal chance of happening. No sides are weighted, sticky, or favoured!",
    style: 'statement'
  },
  trustworthy: {
    id: 'wonder_trustworthy',
    text: "Both are valuable! Theoretical probability gives the exact mathematical expectation, while experimental probability shows what actually happened in reality!",
    style: 'thinking'
  }
};

export const STORY_SLIDES = [
  {
    id: 'story_slide_1',
    title: "Maya's Carnival Spinner",
    image: "/images/story/slide1.jpg",
    story: "Maya and Archie are designing an exciting game booth for the school carnival. Maya creates a colorful spinner divided into four equal sections: Red, Blue, Green, and Yellow. She wonders: what is the true chance that a player will land on Red?",
    keyQuestion: "What is probability, and how do we measure the chance of an event?",
    mascotHint: "Probability is a number between 0 (impossible) and 1 (certain). An even chance is 0.5 or 50%!",
    spokenNarration: "Maya and Archie are setting up a carnival booth. Probability measures how likely an event is, on a scale from zero, which is impossible, to one, which is absolutely certain."
  },
  {
    id: 'story_slide_2',
    title: "Archie's Fair Dice Roll",
    image: "/images/story/slide2.jpg",
    story: "Archie inspects a standard six-sided dice. Before rolling even once, he calculates the theoretical probability. Since all six faces are equally likely, the chance of rolling a six is exactly one out of six. This is calculated purely through math, before any trial begins!",
    keyQuestion: "How do we calculate theoretical probability before any trials?",
    mascotHint: "Theoretical probability equals favourable outcomes divided by total possible outcomes: P(E) = n(E) / n(S)!",
    spokenNarration: "Archie rolls a standard six-sided dice. Theoretical probability is calculated by dividing favourable outcomes by the total number of possible outcomes. For rolling a six, that is one out of six."
  },
  {
    id: 'story_slide_3',
    title: "The Coin Toss Marathon",
    image: "/images/story/slide3.jpg",
    story: "Maya tests reality by flipping a fair coin 10 times. She tallies the results: 7 Heads and 3 Tails! Her experimental probability for heads is 7 out of 10, or 70%. Archie asks: 'Did the coin break? Why didn't we get exactly 50%?'",
    keyQuestion: "What is experimental probability, and why does it differ from theory?",
    mascotHint: "Experimental probability is relative frequency: observed occurrences divided by total trials. Small samples naturally bounce around!",
    spokenNarration: "Maya flips a coin ten times and gets seven heads. Experimental probability is the number of times an event happens divided by the total number of trials. In small trials, chance has natural variation."
  },
  {
    id: 'story_slide_4',
    title: "The Law of Large Numbers",
    image: "/images/story/slide4.jpg",
    story: "Archie and Maya don't stop at 10 flips. They use a computer lab to simulate 50 flips, then 100, then 1,000 flips! Amazingly, as the number of trials skyrockets, the percentage of heads drops from 70% to 54%, and then settles right at 50.1%!",
    keyQuestion: "What happens to experimental probability as we run more trials?",
    mascotHint: "The Law of Large Numbers states that as the number of trials increases, experimental probability gets closer and closer to theoretical probability!",
    spokenNarration: "As Archie and Maya run hundreds of trials, something amazing happens. The experimental probability gets closer and closer to the theoretical prediction. This powerful principle is called the Law of Large Numbers."
  },
  {
    id: 'story_slide_5',
    title: "The Detective's Test: Fair or Biased?",
    image: "/images/story/slide5.jpg",
    story: "Now Archie and Maya are probability detectives! A suspicious game booth claims their six-sided dice is fair, but in 500 rolls, the number 6 appears 260 times (52%). Archie compares this to the theoretical 16.7%. 'Aha!' says Maya, 'This dice is heavily rigged!'",
    keyQuestion: "How does comparing theoretical and experimental probability expose unfair games?",
    mascotHint: "If experimental results in a large experiment stray far from theoretical probability, the device is biased or loaded!",
    spokenNarration: "By comparing theoretical expectations with experimental results, Archie and Maya can spot whether a dice or spinner is fair or rigged. When thousands of trials stay far from theory, the game is biased."
  }
];

export const STATIONS_NARRATION = {
  station1: {
    id: 'station_1',
    text: "Welcome to the Probability Lab! Flip coins, roll dice, and spin the wheel. Watch the running graph converge to the theoretical line as trials grow!",
    style: 'instruction'
  },
  station2: {
    id: 'station_2',
    text: "Welcome to Predict then Test! Select your theoretical prediction first, launch trials, and measure how close reality comes to your calculation.",
    style: 'instruction'
  },
  station3: {
    id: 'station_3',
    text: "Welcome to Detective Fairness Test! Inspect experimental trial tables from carnival games and decide whether they are fair or biased.",
    style: 'instruction'
  }
};

export const PRACTICE_NARRATION = {
  welcome: {
    id: 'practice_welcome',
    text: "Welcome to the Probability Practice Arena! Read each clue carefully and calculate favourable outcomes and relative frequencies.",
    style: 'instruction'
  },
  correct: [
    {
      id: 'practice_praise_1',
      text: "Outstanding calculation! You have mastered the laws of probability!",
      style: 'celebration'
    },
    {
      id: 'practice_praise_2',
      text: "Spot on! That is the exact theoretical probability.",
      style: 'encouragement'
    },
    {
      id: 'practice_praise_3',
      text: "Brilliant! You calculated the relative frequency perfectly!",
      style: 'celebration'
    }
  ],
  wrong: [
    {
      id: 'practice_hint_1',
      text: "Not quite. Remember: divide favourable outcomes by the total possible outcomes.",
      style: 'thinking'
    },
    {
      id: 'practice_hint_2',
      text: "Careful with the denominator! Total trials belongs on the bottom.",
      style: 'emphasis'
    },
    {
      id: 'practice_hint_3',
      text: "Remember, theoretical is what should happen, and experimental is what actually occurred in trials.",
      style: 'thinking'
    }
  ]
};

export const REFLECT_NARRATION = {
  intro: {
    id: 'reflect_intro',
    text: "Take a moment to reflect on your probability experiments. How does the Law of Large Numbers shape real-world predictions?",
    style: 'thinking'
  }
};

export const SUMMARY_NARRATION = {
  celebration: {
    id: 'summary_celebration',
    text: "Congratulations! You have mastered Theoretical and Experimental Probability and earned your Probability Pro badge!",
    style: 'celebration'
  }
};
