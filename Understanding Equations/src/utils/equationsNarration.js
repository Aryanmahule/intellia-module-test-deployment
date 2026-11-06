// Narration script and instructional content for Understanding Equations

export const NARRATION = {
  wonder: {
    intro: {
      text: "Look at this balance scale. When both sides weigh the same, it sits perfectly level. That is exactly what an equation is. Can you keep it balanced?",
      style: "statement"
    },
    equals: {
      question: "What does the equals sign really mean?",
      answer: "The equals sign says both sides have the same value, like a scale in balance. It does not just mean the answer comes next!",
      style: "statement"
    },
    bothsides: {
      question: "Can you change only one side of an equation?",
      answer: "No! If you take something off one side, the scale tips. To keep it balanced, you must do the very same thing to both sides.",
      style: "emphasis"
    },
    check: {
      question: "How can you be sure your answer is right?",
      answer: "Put your answer back in place of the letter. If both sides match, the scale stays level and your answer is correct!",
      style: "thinking"
    }
  },

  story: [
    {
      id: 'scale',
      title: "Ravi's Balance Scale",
      badge: "Core Concept",
      image: "/images/story/slide1_scale.jpg",
      story: "Welcome to our maths lab! Look at this scale. An expression like x + 3 is just a pile of items. But an equation like x + 3 = 8 has an equals sign balancing both sides perfectly!",
      narration: "Welcome to our maths lab! Look at this scale. An expression is just a pile of items, but an equation has an equals sign balancing both sides perfectly.",
      style: "statement",
      question: "What is the single feature that turns an expression into an equation?",
      capsule: "x + 3 is an expression; x + 3 = 8 is an equation (balanced scale)"
    },
    {
      id: 'test',
      title: "Is It True? The Solution",
      badge: "Testing Values",
      image: "/images/story/slide2_test.jpg",
      story: "A solution is the exact number that makes the equation true. If we test x = 5 in x + 3 = 8, 5 + 3 = 8, so the scale stays level! But testing x = 4 gives 7 ≠ 8, so the scale tilts.",
      narration: "A solution is the exact number that makes both sides equal. When we test five, five plus three equals eight, so five is the true solution!",
      style: "statement",
      question: "How can you verify if x = 6 is a solution to 2x + 1 = 13?",
      capsule: "x = 5: 5 + 3 = 8 ✓ · x = 4: 4 + 3 = 7 ≠ 8 ✗"
    },
    {
      id: 'undo',
      title: "Undo It! Inverse Operations",
      badge: "One-Step Equations",
      image: "/images/story/slide3_undo.jpg",
      story: "To isolate x and find its value, undo operations using inverse pairs! Undo addition with subtraction, and undo multiplication with division. Whatever you do, do it to both sides!",
      narration: "To solve an equation, undo operations one by one. Undo addition with subtraction, and undo multiplication with division.",
      style: "instruction",
      question: "What is the inverse operation needed to solve 4x = 24?",
      capsule: "x + 7 = 15 → x = 8 · 3x = 18 → x = 6 · x ÷ 4 = 5 → x = 20"
    },
    {
      id: 'balance',
      title: "Keep the Balance! Two Steps",
      badge: "Two-Step Equations",
      image: "/images/story/slide4_balance.jpg",
      story: "For two-step equations like 2x + 3 = 11, undo addition or subtraction first to get 2x = 8. Then undo multiplication by dividing both sides by 2 to get x = 4!",
      narration: "Always keep the balance! Whatever you do to one side, you must do to the other side. Undo plus or minus first, then undo multiply or divide.",
      style: "emphasis",
      question: "In 3x − 4 = 14, which operation should you undo first?",
      capsule: "2x + 3 = 11 → 2x = 8 → x = 4 (check: 2(4) + 3 = 11 ✓)"
    },
    {
      id: 'words',
      title: "Words Become Equations",
      badge: "Real-World Translation",
      image: "/images/story/slide5_words.jpg",
      story: "We can translate English clues into algebraic equations! 'Double a number, add 5, get 17' translates to 2x + 5 = 17. Solving gives x = 6, and checking confirms 2(6) + 5 = 17!",
      narration: "Real-world problems can be translated into equations. Double a number and add five to get seventeen becomes two x plus five equals seventeen!",
      style: "statement",
      question: "How would you write: 'Multiply a number by 4, subtract 3, result is 21'?",
      capsule: "\"Double a number, add 5, get 17\" → 2x + 5 = 17 → x = 6"
    }
  ],

  stations: {
    station1: {
      title: "Balance the Scale ⚖️",
      intro: "Welcome to Station 1! Put weights on the scale, do the same to both sides, and find the mystery bag.",
      style: "instruction"
    },
    station2: {
      title: "Undo & Fix 🔧",
      intro: "Welcome to Station 2! Undo each step in the right order. Ravi made some slips, so can you spot them?",
      style: "instruction"
    },
    station3: {
      title: "Equations in Singapore 🏙️",
      intro: "Welcome to Station 3! Turn real Singapore situations into equations and solve them.",
      style: "instruction"
    }
  },

  practice: {
    welcome: "Welcome to Practice Mode! Test your skills solving linear equations. Remember to keep both sides balanced and test your answers!",
    correct: [
      "Spot on! You balanced both sides and found the exact solution.",
      "Brilliant work! Your algebraic thinking is rock solid."
    ],
    wrong: [
      "Not quite. Check that you did the same thing to both sides, then put your answer back in to test it.",
      "Watch out for inverse operations! Undo addition with subtraction, and multiplication with division."
    ]
  },

  reflect: {
    intro: "Think about today's discoveries. Which idea about keeping the balance made the most sense to you?",
    style: "thinking",
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
    congrats: "Congratulations! You have mastered understanding equations and earned your Balance Master badge!",
    style: "celebration",
    badgeName: "Balance Master",
    badgeDesc: "You proved that equations are balanced scales, mastered inverse operations, and solved real Singapore mysteries!"
  }
};
