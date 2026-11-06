/* =========================================================
   NARRATION STRINGS & METADATA
   Spoken audio text for Alice / Speech Engine
   ========================================================= */

export const WONDER_NARRATION = {
  intro: {
    text: "Look around you. Train carriages, floor tiles and stacked chairs all follow hidden rules. Can you find the rule and predict what comes next?",
    style: "statement"
  },
  hundredth: {
    text: "Find the rule! Once you know how the pattern grows, you can jump straight to any position, no matter how far away.",
    style: "statement"
  },
  lessthan: {
    text: "No! Five less than x means start with x and take away five. The order in the words is not the order in the symbols. Be careful!",
    style: "emphasis"
  },
  letters: {
    text: "Yes! A letter can stand for any number we do not know yet. Then words like more than, twice and less than become plus, times and minus.",
    style: "thinking"
  }
};

export const STORY_SLIDES = [
  {
    id: 'slide-1',
    title: "Ravi Spots the Rule",
    teachingBeat: 'Number patterns & common difference',
    image: '/images/story/slide1.jpg',
    story: 'Maya and her detective partner Ravi are setting up an algebra mystery booth for the school fair. They discover a glowing sequence of numbers: 3, 5, 7, 9. Each number increases by a steady jump of +2, called the common difference!',
    spokenNarration: 'Maya and Ravi noticed a glowing sequence: 3, 5, 7, 9. Each number grows by adding two. This steady jump is called the common difference.',
    keyQuestion: 'How can we find the next number without counting on our fingers?',
    mascotHint: 'In math, the steady jump between consecutive terms is the common difference!'
  },
  {
    id: 'slide-2',
    title: "The Position Machine",
    teachingBeat: 'Term number n → nth term: 2n + 1',
    image: '/images/story/slide2.jpg',
    story: 'Maya feeds position numbers into the magical formula machine: for position n = 1, it outputs 3. For n = 2, it outputs 5. By multiplying n by 2 and adding 1 (2n + 1), she can instantly find position 100 is 201!',
    spokenNarration: 'Instead of adding two over and over, we can use the position number n. Multiply n by two and add one. For position ten, two times ten plus one gives twenty-one!',
    keyQuestion: 'How can we jump straight to position 100 without listing all 100 numbers?',
    mascotHint: "Substitute the position 'n' into the formula: 2(100) + 1 = 201!"
  },
  {
    id: 'slide-3',
    title: "Patterns Made of Shapes",
    teachingBeat: 'Matchstick squares in a row: 3n + 1',
    image: '/images/story/slide3.jpg',
    story: 'Maya constructs glowing squares on her desk. The first square requires 4 matchsticks. But every extra square shares a side and only needs 3 new sticks! The formula for n squares is 3n + 1.',
    spokenNarration: 'Look at the matchstick squares. The first square needs four sticks. Every extra square only needs three more sticks. The rule is three n plus one.',
    keyQuestion: 'Why does adding a new square only add 3 matchsticks instead of 4?',
    mascotHint: 'Shared edges save sticks! Always look for the overlap in growing shapes.'
  },
  {
    id: 'slide-4',
    title: "Words Become Symbols",
    teachingBeat: 'Translating phrases to expressions',
    image: '/images/story/slide1.jpg', // uses matching anime scene
    story: 'Turning English words into algebra is like cracking a secret code. Words like "sum" and "more than" mean (+), while "twice" means (× 2). But watch out: "5 less than x" means you start with x and take away 5 (x − 5)!',
    spokenNarration: 'Turning words into algebra is like translating a secret code. Sum and more than mean addition. Twice means multiply by two. And five less than x means x minus five!',
    keyQuestion: 'Why is "5 less than x" written as x − 5 and not 5 − x?',
    mascotHint: 'The phrase "less than" reverses the word order: start with x, then subtract 5!'
  },
  {
    id: 'slide-5',
    title: "Brackets Change the Meaning",
    teachingBeat: 'Grouping operations with brackets',
    image: '/images/story/slide2.jpg', // uses matching anime scene
    story: 'Brackets group steps together! "3 times the sum of n and 2" means we must add first inside brackets: 3(n + 2) = 3n + 6. This is totally different from 3n + 2 where you multiply first!',
    spokenNarration: 'Brackets change everything. Three times the sum of n and two means we must add first inside brackets: three times bracket n plus two bracket.',
    keyQuestion: 'When should you wrap numbers in brackets before multiplying?',
    mascotHint: 'If the words say "sum of" or "difference of" before multiplying, put brackets around it!'
  }
];

export const STATIONS_NARRATION = {
  station1: {
    text: "Welcome to Station 1! Build the pattern, spot the rule, and test it on any position you choose.",
    style: "instruction"
  },
  station2: {
    text: "Welcome to Station 2! Turn each sentence into an expression. Watch out for tricky words like less than!",
    style: "instruction"
  },
  station3: {
    text: "Welcome to Station 3! Find patterns in Singapore tables, tiles and train lines, and write their rules.",
    style: "instruction"
  }
};

export const PRACTICE_NARRATION = {
  welcome: {
    text: "Time to test your pattern detective skills! Read each clue carefully.",
    style: "instruction"
  },
  correct: [
    { text: "Super job! You cracked the rule perfectly!", style: "celebration" },
    { text: "Spot on! That is the exact algebraic expression.", style: "encouragement" }
  ],
  wrong: [
    { text: "Not quite. Check the first two terms against your rule, then look at the words again.", style: "thinking" },
    { text: "Watch out for the order of terms or the common difference!", style: "emphasis" }
  ]
};

export const REFLECT_NARRATION = {
  intro: {
    text: "Think about today's discoveries. Which pattern rule or tricky phrase surprised you most?",
    style: "thinking"
  }
};

export const SUMMARY_NARRATION = {
  celebration: {
    text: "Congratulations! You have mastered algebraic patterns and word expressions and earned your Pattern Master badge!",
    style: "celebration"
  }
};
