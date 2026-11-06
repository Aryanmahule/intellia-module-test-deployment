// Narration script and instructional content for Fraction Equations (Grade 7)
// Fractions in spoken text are written as words ('one half', 'three fourths') for clear speech synthesis.

export const NARRATION = {
  wonder: {
    intro: {
      id: 'wonder_intro',
      text: "Look at these fraction bars and the balance scale. When two fractions cover the exact same space, they are equivalent. How do we keep equations balanced when fractions are involved?",
      spoken: "Look at these fraction bars and the balance scale. When two fractions cover the exact same space, they are equivalent. How do we keep equations balanced when fractions are involved?",
      style: "statement"
    },
    pizza: {
      id: 'wonder_pizza',
      question: "Is 1/2 of a pizza the same as 2/4 of the same pizza?",
      answer: "Yes, exactly! Even though 2/4 is cut into more slices, both represent the exact same amount of pizza. They are equivalent fractions!",
      spoken: "Yes, exactly! Even though two fourths is cut into more slices, both represent the exact same amount of pizza. They are equivalent fractions!",
      style: "statement"
    },
    differentsizes: {
      id: 'wonder_differentsizes',
      question: "Can you add fractions when the pieces are different sizes?",
      answer: "Not directly! You cannot add halves and thirds until you slice them into equal-sized pieces using a common denominator (like sixths).",
      spoken: "Not directly! You cannot add halves and thirds until you slice them into equal sized pieces using a common denominator, like sixths.",
      style: "emphasis"
    },
    denominator: {
      id: 'wonder_denominator',
      question: "What does the bottom number (denominator) tell you?",
      answer: "The denominator tells you the total number of equal parts that make up one whole. It determines the size of each slice!",
      spoken: "The denominator tells you the total number of equal parts that make up one whole. It determines the size of each slice!",
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
      title: "Sharing the Sticker Sheets",
      badge: "Equivalent Fractions",
      image: "/images/story/slide2.jpg",
      story: "Maya divides a sticker sheet into 4 equal strips and gives 2 strips to Alex. That is 2/4 of the sheet! Maya notices that 2/4 covers the exact same area as 1/2. Multiplying or dividing the top and bottom by 2 creates an equivalent fraction without changing its true value!",
      narration: "Two fourths covers the exact same area as one half. When you multiply or divide the top and bottom by the same number, the fraction stays equivalent.",
      style: "statement",
      quote: "Why do two fourths and one half represent the exact same amount?",
      capsule: "Equivalent fractions look different, but they take up the exact same amount of space!"
    },
    {
      id: 'story_slide3',
      title: "Combining Matching Slices",
      badge: "Like Denominators",
      image: "/images/story/slide3.jpg",
      story: "Alex has 1/5 of a sticker roll, and Maya adds 2/5 more. Because each piece is the exact same size (fifths), we simply add the top numbers: 1/5 + 2/5 = 3/5! The bottom number stays 5 because the slice size never changes.",
      narration: "Because each piece is the exact same size, we only add the numerators. One fifth plus two fifths equals three fifths.",
      style: "statement",
      quote: "Why do we only add the numerators, and never the denominators?",
      capsule: "The denominator is the name and size of the slice—never add the denominators together!"
    },
    {
      id: 'story_slide4',
      title: "Finding the Common Ground",
      badge: "Unlike Denominators",
      image: "/images/story/slide4_balance.jpg",
      story: "What if Alex has 1/2 and Maya has 1/3? You cannot directly add halves and thirds because the pieces are different sizes! We must cut them into identical smaller pieces using a common denominator: sixths! 1/2 becomes 3/6, and 1/3 becomes 2/6. Together they make 5/6!",
      narration: "You cannot add halves and thirds directly. First find a common denominator of sixths, so all pieces are the same size.",
      style: "emphasis",
      quote: "How can we combine pieces of different sizes fairly?",
      capsule: "Always find a common denominator first, so every slice is identical in size!"
    },
    {
      id: 'story_slide5',
      title: "Balancing the Fraction Scale",
      badge: "Solving for x",
      image: "/images/story/slide5_words.jpg",
      story: "Maya places an unknown mystery box 'x' plus 1/4 of a sheet on the scale. The other side balances at 3/4! To isolate x, we subtract 1/4 from both sides: x = 3/4 - 1/4 = 2/4. Simplifying 2/4 by dividing by 2 gives x = 1/2! The scale stays in perfect balance.",
      narration: "To isolate x, subtract one fourth from both sides. Three fourths minus one fourth equals two fourths, which simplifies to one half.",
      style: "thinking",
      quote: "How does the balance scale help us isolate the unknown fraction?",
      capsule: "Do the exact same inverse operation to both sides, and always simplify your final answer!"
    }
  ],

  stations: {
    station1: {
      title: "Station 1: Build the Fraction Bar",
      subtitle: "Visualizing Equivalent Fractions",
      instruction: "Select different denominators to see how fractions align. Match 1/2 with equivalent bars!",
      spoken: "Welcome to Station 1. Adjust the slices to build equivalent fraction bars and watch them align perfectly."
    },
    station2: {
      title: "Station 2: Common Denominator Machine",
      subtitle: "Uniting Unlike Fractions",
      instruction: "Find the lowest common denominator (LCM) to combine two fractions into equal parts!",
      spoken: "Station 2 is the Common Denominator Machine. Find the matching common denominator so you can add the fractions."
    },
    station3: {
      title: "Station 3: Singapore Story Equations",
      subtitle: "Real-World Fraction Problem",
      instruction: "Help Maya and Alex solve fair-sharing challenges using fraction equations!",
      spoken: "In Station 3, help Maya and Alex solve real world fraction equations at the school fair."
    }
  },

  reflect: {
    intro: "Time to reflect on your journey through fraction equations! Pause, connect the concepts, and see how much you've discovered.",
    title: "Reflection & Mastery Check",
    prompts: [
      {
        id: 'r1',
        question: "When adding 2/7 + 3/7, why is the answer 5/7 and not 5/14?",
        hint: "Think about slice size: if you have 2 slices of a 7-slice pizza and get 3 more, what size are the slices?",
        options: [
          "Because the denominator tells the slice size; only the number of slices changes!",
          "Because 7 is an odd number and cannot be added.",
          "Because 14 is too big to be a denominator."
        ],
        correct: 0,
        explanation: "The denominator 'sevenths' tells us the size of each piece. 2 sevenths plus 3 sevenths is 5 sevenths! You never add the denominators."
      },
      {
        id: 'r2',
        question: "To solve the equation x + 1/3 = 5/6, what is your first move?",
        hint: "Use inverse operations! To undo addition of 1/3, subtract 1/3 from both sides using a common denominator.",
        options: [
          "Subtract 1/3 from both sides using a common denominator of 6.",
          "Multiply both sides by 5/6.",
          "Add 1/3 to both sides directly."
        ],
        correct: 0,
        explanation: "Inverse operations! Subtract 1/3 (which is 2/6) from both sides: x = 5/6 - 2/6 = 3/6 = 1/2."
      },
      {
        id: 'r3',
        question: "How do you know if a fraction is in its simplest form?",
        hint: "Look at the common factors between the numerator and denominator.",
        options: [
          "When the greatest common divisor (GCD) of numerator and denominator is 1.",
          "When both numbers are even.",
          "When the numerator is 1."
        ],
        correct: 0,
        explanation: "When numerator and denominator share no common factors other than 1, the fraction is in simplest form!"
      }
    ]
  },

  summary: {
    badge: "Fraction Master",
    congrats: "Outstanding work! You have successfully mastered equivalent fractions, common denominators, and balanced fraction equations!",
    takeaways: [
      "Equivalent Fractions: Multiply or divide numerator & denominator by the same number.",
      "Unlike Denominators: Always find the common denominator (LCM) before adding or subtracting.",
      "Balanced Scales: Isolate unknown x by performing the exact same inverse fractional operation on both sides!"
    ]
  }
};
