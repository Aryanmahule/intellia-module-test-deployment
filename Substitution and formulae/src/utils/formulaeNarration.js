// Narration lines and transcript data for Substitution and Formulae
// Voice: "Alice" (ElevenLabs ID: Xb7hH8MSUJpSbSDYk0k2, Model: eleven_multilingual_v2)

export const NARRATION = {
  wonder: {
    intro: {
      text: "Look around you. A taxi meter, a phone plan and the weather app all use hidden rules called formulae. How do they turn numbers into answers?",
      style: "statement"
    },
    meter: {
      question: "How does a taxi meter know your fare?",
      answer: "A formula is a rule with letters standing in for numbers. Put in the distance, and the rule gives back the price every single time!",
      style: "statement"
    },
    letters: {
      question: "Is 3x the same as 3 plus x?",
      answer: "Not at all! Three x means three times x. If x is four, that is twelve, not thirty-four. Letters next to numbers mean multiply!",
      style: "emphasis"
    },
    same: {
      question: "Does a formula work for every number?",
      answer: "Yes! The rule never changes. Only the numbers you substitute in change. That is what makes formulae so powerful.",
      style: "thinking"
    }
  },

  story: [
    {
      id: 1,
      title: "Ravi's Formula Machine",
      subtitle: "Variables are placeholders for changing numbers",
      capsule: "Letters stand for numbers that can change",
      story: "Ravi the robot fox has built a fantastic Formula Machine! In algebra, a letter like x or y is just a placeholder—an empty slot waiting for a number to drop in.",
      question: "What happens when you drop a number into Ravi's hopper?",
      narration: "Welcome to our math lab! A formula is like a magical recipe machine. The letters are just empty slots waiting for you to drop in numbers.",
      style: "statement",
      image: "/images/story/slide1_machine.jpg",
      badge: "Concept 01"
    },
    {
      id: 2,
      title: "Swap It In",
      subtitle: "Substitution means replacing letters with numbers using brackets",
      capsule: "3x, when x = 4, becomes 3(4) = 12",
      story: "Maya demonstrates how to substitute. Whenever you swap a letter for a number, wrap the number in brackets! For example, 3x with x = 4 becomes 3(4), which means 3 times 4 = 12.",
      question: "Why should we always use brackets when substituting?",
      narration: "Whenever you replace a letter with a number, wrap it in brackets! Writing three with four in brackets clearly means three times four, not thirty-four.",
      style: "instruction",
      image: "/images/story/slide2_swap.jpg",
      badge: "Concept 02"
    },
    {
      id: 3,
      title: "Order Matters",
      subtitle: "Follow BODMAS / PEMDAS: Brackets, Orders, Multiply & Divide, Add & Subtract",
      capsule: "For x = 5: 2x² = 50, but (2x)² = 100",
      story: "Look at two different expressions: 2x² and (2x)². If x = 5, 2x² means 2 × (5)² = 2 × 25 = 50. But (2x)² means (2 × 5)² = 10² = 100! Brackets change everything.",
      question: "Which operation do we perform first in 2x²?",
      narration: "Order of operations is crucial. In two x squared, square the number first, then multiply by two. But with brackets around two x, multiply first, then square the whole thing!",
      style: "emphasis",
      image: "/images/story/slide3_order.jpg",
      badge: "Concept 03"
    },
    {
      id: 4,
      title: "Negative Numbers, Careful!",
      subtitle: "The Bracket Shield protects negative signs from getting lost",
      capsule: "For x = −3: −x² = −9, but (−x)² = 9",
      story: "Negative numbers require special care! If x = −3, then (−x)² means (−(−3))² = (+3)² = 9. However, −x² means −(3²) = −9. Always put a bracket shield around negative inputs!",
      question: "What is the square of negative three with brackets?",
      narration: "Negative numbers need extra care. Always put a protective bracket shield around a negative number when you substitute it in.",
      style: "thinking",
      image: "/images/story/slide4_negative.jpg",
      badge: "Concept 04"
    },
    {
      id: 5,
      title: "Real Formulae in Action",
      subtitle: "Perimeters, taxi fares, temperatures, and geometry across Singapore",
      capsule: "Area = ½bh: when b = 8, h = 5 → Area = 20",
      story: "Everywhere around Singapore, formulae run the city! From calculating the perimeter of a park P = 2(l + w), to Marina Bay temperatures F = 9/5 C + 32, the rule stays constant while numbers change.",
      question: "How does one single formula solve countless real-world problems?",
      narration: "From Singapore taxi meters to calculating the area of a bridge, the formula stays exactly the same. You just substitute the fresh measurements to find the exact answer!",
      style: "celebration",
      image: "/images/story/slide5_formulas.jpg",
      badge: "Concept 05"
    }
  ],

  stations: {
    station1: {
      title: "Plug It In",
      subtitle: "Interactive Formula Machine",
      intro: "Welcome to Station 1! Feed numbers into the formula machine and watch how the answer changes.",
      style: "instruction"
    },
    station2: {
      title: "Spot the Slip",
      subtitle: "Detect & Correct Algebraic Misconceptions",
      intro: "Welcome to Station 2! Ravi made some mistakes in his working. Can you spot the slip and fix the line?",
      style: "instruction"
    },
    station3: {
      title: "Formulae in Singapore",
      subtitle: "Solve Everyday Singapore Problems",
      intro: "Welcome to Station 3! Use real formulae from around Singapore to solve everyday problems.",
      style: "instruction"
    }
  },

  practice: {
    welcome: "Welcome to Practice Mode! Test your skills across six dynamic substitution challenges. Take your time, use brackets, and aim for a high streak!",
    correct: [
      "Brilliant substitution! You followed the order of operations perfectly.",
      "Spot on! Your algebraic calculations are rock solid."
    ],
    wrong: [
      "Not quite. Replace the letter with its number using brackets, then follow BODMAS order.",
      "Watch out for signs and powers! Brackets make all the difference."
    ]
  },

  reflect: {
    intro: "Think about today's discoveries. Which substitution mistake would you be most likely to make?",
    style: "thinking",
    prompts: [
      {
        id: "negatives",
        question: "Why do we put brackets around a negative number when substituting?",
        hint: "Consider the difference between -3² and (-3)²"
      },
      {
        id: "order",
        question: "Why is 2x² different from (2x)² when x = 5?",
        hint: "Think about BODMAS and whether squaring happens before or after multiplication."
      },
      {
        id: "realworld",
        question: "Where in daily life around Singapore have you seen a formula used?",
        hint: "Examples: Taxi fares, MRT transit, mobile data plans, temperature, cooking recipes."
      }
    ]
  },

  summary: {
    congrats: "Congratulations! You have mastered substitution and formulae and earned your Formula Master badge!",
    style: "celebration",
    badgeName: "Formula Master",
    badgeDesc: "Expert at substituting values and evaluating algebraic formulae accurately."
  }
};
