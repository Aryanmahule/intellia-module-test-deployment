// Narration script and instructional content for Two-Step Equations module
// Adheres strictly to Section 4 of Implementation Plan:
// "Only body text is spoken; never headings, and never numbers/equations shown on screen."

export const NARRATION = {
  wonder: {
    intro: {
      text: "Ravi has hidden a mystery number inside a parcel wrapped in two layers. Can you unwrap it without tearing anything?",
      style: "statement"
    },
    order: {
      question: "Which do you undo first, the adding or the multiplying?",
      answer: "Think of socks and shoes. Socks go on first, shoes go on last, so shoes come off first. Undo the last step first!",
      style: "thinking"
    },
    dividing: {
      question: "Can you divide just the x part and leave the rest?",
      answer: "No! Whatever you do, you must do to both sides of the equation, and to every part. That is how the balance stays true.",
      style: "emphasis"
    },
    check: {
      question: "How do you know your answer is right?",
      answer: "Put your answer back into the equation. If both sides match, you have unwrapped the number correctly!",
      style: "statement"
    }
  },

  story: [
    {
      id: 'machine',
      title: "Two Things Happened to x",
      badge: "The Forward Machine",
      image: "/images/story/slide1_scale.jpg",
      story: "Ravi placed a mystery number into a machine. Two things happened in order: first x was multiplied by two, then three was added to make eleven.",
      narration: "Look at this equation machine. Two things happened to our mystery number x: first it was multiplied by two, then three was added to make eleven.",
      style: "statement",
      question: "What were the two operations done to x?",
      capsule: "x → [ × 2 ] → [ + 3 ] → 11"
    },
    {
      id: 'reverse',
      title: "Undo in Reverse",
      badge: "Reverse Unwrapping",
      image: "/images/story/slide2_test.jpg",
      story: "To unwrap x, run the machine backwards! Undo the last step first: subtract three from eleven to get eight, then divide eight by two to reveal x equals four.",
      narration: "To find x, we run the machine backwards! We subtract three first to get eight, then divide by two to uncover x equals four.",
      style: "thinking",
      question: "Why do we undo the plus three before the times two?",
      capsule: "11 → [ − 3 ] → 8 → [ ÷ 2 ] → 4"
    },
    {
      id: 'lines',
      title: "Same to Both Sides",
      badge: "Algebraic Lines",
      image: "/images/story/slide3_undo.jpg",
      story: "In algebra, we write each undo step neatly line by line. Whatever operation we apply to the left side, we must apply to the right side to keep the equation balanced.",
      narration: "In algebra, we write each undo step on a new line. Subtract three from both sides, then divide both sides by two. Perfect balance!",
      style: "statement",
      question: "What keeps the balance level at every step?",
      capsule: "2x + 3 = 11  →  2x = 8  →  x = 4"
    },
    {
      id: 'variations',
      title: "Take Away and Share",
      badge: "Subtractions & Divisions",
      image: "/images/story/slide4_balance.jpg",
      story: "Equations can also have subtractions and fractions! Undo addition or subtraction first, then undo multiplication or division. The inverse pattern always holds.",
      narration: "Whether we have subtraction or division, the golden rule never changes: undo addition or subtraction first, then undo multiplication or division.",
      style: "emphasis",
      question: "What are the two inverse steps for x divided by four plus two equals five?",
      capsule: "3x − 4 = 14 → 3x = 18 → x = 6  ·  x ÷ 4 + 2 = 5 → x ÷ 4 = 3 → x = 12"
    },
    {
      id: 'words',
      title: "Words Become Equations",
      badge: "Form & Check",
      image: "/images/story/slide5_words.jpg",
      story: "Real situations turn into two-step equations! When Maya triples her stickers and gives away four, she has twenty left. We solve it and substitute eight back to check.",
      narration: "Real life problems become equations! Triple my stickers minus four equals twenty. We solve it step by step, and substitute eight back to check!",
      style: "statement",
      question: "How do we check that x = 8 is correct?",
      capsule: "\"Triple my stickers, give away 4, have 20 left\": 3x − 4 = 20 → x = 8  (Check: 3(8) − 4 = 20 ✓)"
    }
  ],

  stations: {
    station1: {
      title: "Reverse the Machine 🔁",
      desc: "Step through inverse operations in reverse order to unwrap mystery numbers.",
      narration: "Welcome to Station 1! Run the machine backwards. Undo the steps one at a time, starting with the last one.",
      style: "instruction"
    },
    station2: {
      title: "Balance & Solve ⚖️",
      desc: "Apply inverse operations to both sides of the balance scale simultaneously.",
      narration: "Welcome to Station 2! Apply each step to both sides of the scale until the mystery number stands alone.",
      style: "instruction"
    },
    station3: {
      title: "Two Steps in Singapore 🏙️",
      desc: "Form two-step equations from real-life scenarios and solve for the unknown.",
      narration: "Welcome to Station 3! Build and solve two-step equations from real situations around Singapore.",
      style: "instruction"
    }
  },

  practice: {
    intro: "Welcome to Practice Mode! Test your skills on undoing two-step equations. Keep your streak alive!",
    correct: [
      "Brilliant! You unwrapped the mystery number with perfect precision.",
      "Spot on! Both sides remain balanced.",
      "Great work! You followed the inverse order flawlessly."
    ],
    wrong: [
      "Not quite. Undo the last step first, and do the same thing to both sides. Then put your answer back in to check.",
      "Take a breath. Remember socks and shoes: shoes come off first! Undo addition or subtraction before division or multiplication."
    ]
  },

  reflect: {
    intro: "Think about today's discoveries. Which step in unwrapping a two-step equation feels trickiest to you?",
    prompts: [
      {
        id: 'order',
        question: "Why do we undo the adding or subtracting before the multiplying or dividing?",
        hint: "Think about socks and shoes: the last operation applied is the first one undone."
      },
      {
        id: 'balance',
        question: "How can you check that your answer is correct without a teacher?",
        hint: "Substitute your solved value back into the original equation to see if left equals right."
      },
      {
        id: 'realworld',
        question: "Describe a real situation in Singapore that could be written as a two-step equation.",
        hint: "For example: taxi flag-down fare plus kilometer charge, or buying 3 drinks plus a delivery fee."
      }
    ]
  },

  summary: {
    congrats: "Congratulations! You have mastered two-step equations and earned your Two-Step Master badge!",
    badge: "Two-Step Master"
  }
};
