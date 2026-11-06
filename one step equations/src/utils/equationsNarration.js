// Narration script and instructional content for One-Step Equations (Grade 7)

export const NARRATION = {
  wonder: {
    intro: {
      id: 'wonder_intro',
      text: "Look at this balance scale. When both sides weigh the same, it sits perfectly level. That is exactly what an equation is. Can you keep it balanced?",
      style: "statement"
    },
    equals: {
      id: 'wonder_equals',
      question: "What does the equals sign really mean?",
      answer: "The equals sign says both sides have the same value, like a scale in balance. It does not just mean the answer comes next!",
      style: "statement"
    },
    bothsides: {
      id: 'wonder_bothsides',
      question: "Can you change only one side of an equation?",
      answer: "No! If you take something off one side, the scale tips. To keep it balanced, you must do the very same thing to both sides.",
      style: "emphasis"
    },
    check: {
      id: 'wonder_check',
      question: "How can you be sure your answer is right?",
      answer: "Put your answer back in place of the letter. If both sides match, the scale stays level and your answer is correct!",
      style: "thinking"
    }
  },

  story: [
    {
      id: 'story_slide1',
      title: "Maya's Sticker Stall",
      badge: "The Mystery Unknown",
      image: "/images/story/slide1.jpg",
      story: "Maya and her brother Alex are setting up a sticker stall for the school fair. Maya brings a mystery box filled with stickers. Since we don't know how many stickers are inside, we call this unknown quantity 'x'!",
      narration: "Maya brings a mystery box filled with stickers. Since we don't know how many stickers are inside, we call this unknown quantity x.",
      style: "statement",
      quote: "How can we describe a secret quantity without knowing its exact number?",
      capsule: "In math, a letter like 'x' is just a placeholder for any secret number!"
    },
    {
      id: 'story_slide2',
      title: "The Scale of Equality",
      badge: "The Equals Sign",
      image: "/images/story/slide2.jpg",
      story: "Look at this balance scale! An expression like x + 3 is just a pile of items. But an equation like x + 3 = 8 has an equals sign balancing both sides perfectly. An equation is always a statement of balance!",
      narration: "An equation has an equals sign balancing both sides perfectly, like a scale sitting completely level.",
      style: "statement",
      quote: "What does the equals sign really tell us about both sides?",
      capsule: "The equals sign '=' means 'same as' — both sides have identical value!"
    },
    {
      id: 'story_slide3',
      title: "Undo It! Inverse Operations",
      badge: "Opposite Pairs",
      image: "/images/story/slide3.jpg",
      story: "To crack the mystery box and find x, we undo whatever happened to it using inverse operations! Addition is undone by subtraction (+ ↔ −), and multiplication is undone by division (× ↔ ÷).",
      narration: "To solve an equation, undo operations one by one. Undo addition with subtraction, and undo multiplication with division.",
      style: "instruction",
      quote: "How do we isolate x when a number is added or multiplied with it?",
      capsule: "Inverse operations are opposite pairs: + cancels −, and × cancels ÷!"
    },
    {
      id: 'story_slide4',
      title: "Keep the Balance! Both Sides",
      badge: "The Golden Rule",
      image: "/images/story/slide4_balance.jpg",
      story: "If you take 3 weights off only the left pan, the scale immediately tilts! To keep perfect equality, you MUST perform the exact same operation on both sides of the equation.",
      narration: "Always keep the balance! Whatever you do to one side, you must do to the other side.",
      style: "emphasis",
      quote: "Why does the scale tip if you only change one side?",
      capsule: "The Golden Rule: Whatever you do to one side, you MUST do to the other!"
    },
    {
      id: 'story_slide5',
      title: "Check by Substitution",
      badge: "Proof & Verification",
      image: "/images/story/slide5_words.jpg",
      story: "Once you isolate x (like x = 5), test your solution! Substitute 5 back into the original equation: 5 + 3 = 8. Since both sides equal 8, the scale stays level and your answer is 100% verified!",
      narration: "Put your answer back in place of the letter. If both sides match, your answer is verified!",
      style: "statement",
      quote: "How can you be completely confident your algebraic answer is right?",
      capsule: "Substitute your number back into x: if both sides match, it's correct!"
    }
  ],

  stations: {
    station1: {
      id: 'station1_intro',
      title: "Balance the Scale ⚖️",
      intro: "Welcome to Station 1! Put weights on the scale, do the same to both sides, and find the mystery bag.",
      style: "instruction"
    },
    station2: {
      id: 'station2_intro',
      title: "Undo Machine 🔐",
      intro: "Welcome to Station 2! Crack the vault by applying inverse cards to both sides and isolate x.",
      style: "instruction"
    },
    station3: {
      id: 'station3_intro',
      title: "Hawker Stall Rush 🍜",
      intro: "Welcome to Station 3! Turn real Singapore situations into equations and solve them.",
      style: "instruction"
    }
  },

  practice: {
    welcome: {
      id: 'practice_welcome',
      text: "Welcome to Practice Mode! Test your skills solving linear equations. Remember to keep both sides balanced and test your answers!",
      style: "instruction"
    },
    correctPool: [
      { id: 'practice_correct_1', text: "Spot on! You balanced both sides and found the exact solution." },
      { id: 'practice_correct_2', text: "Brilliant work! Your algebraic thinking is rock solid." }
    ],
    wrongPool: [
      { id: 'practice_wrong_1', text: "Not quite. Check that you did the same thing to both sides, then put your answer back in to test it." },
      { id: 'practice_wrong_2', text: "Watch out for inverse operations! Undo addition with subtraction, and multiplication with division." }
    ]
  },

  reflect: {
    intro: {
      id: 'reflect_intro',
      text: "Think about today's discoveries. Which idea about keeping the balance made the most sense to you?",
      style: "thinking"
    },
    prompts: [
      {
        id: 'bothsides',
        question: "Why must you do the very same operation to both sides of an equation?",
        hint: "Think of what happens to a physical balance scale when one pan changes."
      },
      {
        id: 'check',
        question: "How do you check that an algebraic answer is correct?",
        hint: "Substitute the number back into the original equation and evaluate."
      },
      {
        id: 'diff',
        question: "What is the key difference between an expression and an equation?",
        hint: "One has an equals sign showing balance; the other is just a mathematical phrase."
      }
    ]
  },

  summary: {
    congrats: {
      id: 'summary_congrats',
      text: "Congratulations! You have mastered understanding equations and earned your Balance Master badge!",
      style: "celebration"
    },
    badgeName: "Balance Master",
    badgeDesc: "You proved that equations are balanced scales, mastered inverse operations, and solved real Singapore mysteries!"
  }
};
