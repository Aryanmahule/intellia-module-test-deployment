// Narration script and instructional content for Bracket Equations module
// Adheres strictly to Section 3 and Section 4 of Implementation Plan:
// Spoken narration body text, clear conceptual models, Singapore Grade 7 curriculum

export const WONDER_NARRATION = {
  intro: {
    text: "Brackets are mathematical superpowers. They command operations to stop, reorder, and group together. Can you discover how they transform simple numbers into equations?",
    style: "statement"
  },
  order: {
    question: "Why do brackets exist? Compare 2 + 3 × 4 with (2 + 3) × 4.",
    answer: "Without brackets, multiplication takes priority, giving 14. With brackets, they order you to add first, giving 20! Brackets dictate the rules of calculation.",
    style: "thinking"
  },
  distributive: {
    question: "Does a number outside brackets multiply everything inside?",
    answer: "Yes! The outside number knocks on every single door inside. 3 times bracket x plus 4 bracket means 3x plus 12. If you forget to multiply the 4, the whole equation breaks!",
    style: "emphasis"
  },
  twopaths: {
    question: "For 4(x + 2) = 24, should you expand first or divide first?",
    answer: "Both paths reach x = 4! Expanding gives 4x + 8 = 24. Dividing first gives x + 2 = 6. When the outside number divides cleanly, dividing first is a brilliant shortcut.",
    style: "statement"
  }
};

export const STORY_SLIDES = [
  {
    id: 'slide-1',
    title: "Maya's Gift Bags",
    badge: "Grouping Quantities",
    image: "/images/story/slide1_bags.jpg",
    story: "Maya is packing 4 gift bags for the school carnival. Inside each bag, she places 1 mystery crystal 'x' and 3 silver coins. Maya counts 28 items in total across all 4 bags! Since each bag is identical, we write this as 4(x + 3) = 28.",
    spokenNarration: "Maya is packing four identical gift bags. Each bag holds one mystery crystal x and three silver coins. Across all four bags, there are twenty-eight items. We write this as four times bracket x plus three bracket equals twenty-eight!",
    style: "statement",
    keyQuestion: "Why does the 4 multiply both the mystery crystal and the 3 coins?",
    mascotHint: "Because every single bag has both items! That is the distributive property in action.",
    capsule: "4(x + 3) = 28  →  4 bags of [ x + 3 ]"
  },
  {
    id: 'slide-2',
    title: "The Distributive Knock",
    badge: "The Distributive Law",
    image: "/images/story/slide2_distributive.jpg",
    story: "Archie shows Maya the golden distributive rule: a(b + c) = ab + ac. When a number sits outside a bracket, it multiplies EVERY term inside! For 3(2x + 5), 3 multiplies 2x to make 6x, and 3 multiplies 5 to make 15. The brackets vanish safely into 6x + 15.",
    spokenNarration: "The number outside knocks on every door inside! Three times two x is six x, and three times five is fifteen. Always multiply every term inside the brackets.",
    style: "emphasis",
    keyQuestion: "What is the number one mistake students make when expanding brackets?",
    mascotHint: "Forgetting to multiply the second term! Always draw rainbow arrows to both terms.",
    capsule: "a(b + c) = ab + ac  ·  3(2x + 5) = 6x + 15"
  },
  {
    id: 'slide-3',
    title: "Two Paths to the Truth",
    badge: "Solving Strategies",
    image: "/images/story/slide3_twopaths.jpg",
    story: "Maya asks: 'Must we always expand first?' Archie smiles. For 4(x + 3) = 28, you can expand to 4x + 12 = 28, subtract 12 to get 4x = 16, and divide by 4 to get x = 4. OR, divide both sides by 4 first! That gives x + 3 = 7, so x = 4 in two quick steps!",
    spokenNarration: "You have two paths to solve! You can expand the brackets first, or divide both sides by the outside number first. When twenty-eight divides nicely by four, dividing first is lightning fast!",
    style: "thinking",
    keyQuestion: "When is dividing both sides first better than expanding?",
    mascotHint: "Divide first when the outside number divides the right-hand side with no remainders or fractions!",
    capsule: "Path A: 4x + 12 = 28 → x = 4  vs  Path B: x + 3 = 7 → x = 4"
  },
  {
    id: 'slide-4',
    title: "The Sneaky Negative Sign",
    badge: "Negative Multipliers",
    image: "/images/story/slide4_negative.jpg",
    story: "Archie points to a tricky trap: −2(x − 5) = 14. When multiplying by negative two, watch the signs closely! −2 times x is −2x. But −2 times negative 5 is POSITIVE 10! So −2x + 10 = 14, giving −2x = 4, and dividing by −2 reveals x = −2.",
    spokenNarration: "Beware of negative numbers outside brackets! Negative two times negative five creates a positive ten. Minus times minus becomes plus!",
    style: "emphasis",
    keyQuestion: "Why does multiplying a minus inside by a minus outside turn positive?",
    mascotHint: "Remember your sign rules: two negative factors multiply to make a positive product!",
    capsule: "−2(x − 5) = 14  →  −2x + 10 = 14  →  −2x = 4  →  x = −2"
  },
  {
    id: 'slide-5',
    title: "Brackets on Both Sides",
    badge: "The Master Challenge",
    image: "/images/story/slide5_balance.jpg",
    story: "In the carnival finale, Maya faces a double balance puzzle: 3(x + 2) = 2(x + 5). First, expand both brackets: 3x + 6 = 2x + 10. Next, subtract 2x from both sides: x + 6 = 10. Finally, subtract 6: x = 4! Both sides equal 18, in perfect equilibrium.",
    spokenNarration: "When brackets appear on both sides, expand both sides first! Three x plus six equals two x plus ten. Gather x on one side, numbers on the other, and x equals four!",
    style: "celebration",
    keyQuestion: "What is the systematic order for solving equations with brackets on both sides?",
    mascotHint: "Step 1: Expand brackets. Step 2: Collect like terms. Step 3: Move variables to one side. Step 4: Solve!",
    capsule: "3(x + 2) = 2(x + 5)  →  3x + 6 = 2x + 10  →  x = 4"
  }
];

export const STATIONS_NARRATION = {
  station1: {
    title: "The Distributive Area & Bag Model 📦",
    desc: "Visualize how outside multipliers multiply each section of the area and bundles of bags.",
    narration: "Welcome to Station 1! Explore how multiplying a bracket corresponds to finding areas and counting bags. Expand each term to reveal the whole!",
    style: "instruction"
  },
  station2: {
    title: "The Two-Way Equation Solver ⚖️",
    desc: "Compare Method 1 (Expand First) vs Method 2 (Divide First) side by side to choose the best strategy.",
    narration: "Welcome to Station 2! Compare solving by expanding versus dividing first. Discover which strategy is faster for different numbers!",
    style: "instruction"
  },
  station3: {
    title: "Singapore Balance Beam with Brackets 🏙️",
    desc: "Balance bracketed packages on a scale and perform inverse operations to isolate x.",
    narration: "Welcome to Station 3! Balance bracketed packages on the scale. Open the bags or divide both sides to find the mystery weight.",
    style: "instruction"
  }
};

export const PRACTICE_NARRATION = {
  intro: "Welcome to Practice Mode! Test your skills on expanding, simplifying, and solving equations with brackets. Keep your streak alive!",
  correct: [
    "Brilliant! You expanded and solved with perfect algebraic precision.",
    "Spot on! Both sides remain in flawless equilibrium.",
    "Outstanding! You handled the distributive law like a true master."
  ],
  wrong: [
    "Not quite. Remember: the number outside multiplies EVERY term inside the bracket. Check your signs!",
    "Take a breath. If expanding, multiply both terms. If dividing first, ensure both sides are divided cleanly."
  ]
};

export const REFLECT_NARRATION = {
  intro: "Think about today's discoveries. When is it smarter to divide first instead of expanding brackets?",
  prompts: [
    {
      id: 'distributive',
      question: "Why does a(b + c) equal ab + ac instead of ab + c?",
      hint: "Think about rectangular area or bags: the outside factor multiplies the whole group, not just the first item."
    },
    {
      id: 'strategy',
      question: "How do you decide whether to expand first or divide both sides first?",
      hint: "Check if the right-hand number divides evenly by the bracket's multiplier without producing messy fractions."
    },
    {
      id: 'signs',
      question: "What must you watch out for when expanding an expression like −3(2x − 4)?",
      hint: "Multiplying negative 3 by negative 4 results in a positive 12: sign flips are crucial!"
    }
  ]
};

export const SUMMARY_NARRATION = {
  congrats: "Congratulations! You have mastered Bracket Equations and earned your Bracket Master badge!",
  badge: "Bracket Master 🛡️"
};
