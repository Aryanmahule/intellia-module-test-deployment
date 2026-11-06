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
      id: 'sticker_stall',
      title: "Maya's Sticker Stall",
      badge: "The Mystery Unknown",
      image: "/images/story/slide1.jpg",
      story: "Maya and her brother Alex are setting up a sticker stall for the school fair. Maya brings a mystery box filled with stickers. Since we don't know how many stickers are inside, we call this unknown quantity 'x'!",
      narration: "Maya and her brother Alex are setting up a sticker stall for the school fair. Maya brings a mystery box filled with stickers. Since we don't know how many stickers are inside, we call this unknown quantity x.",
      style: "statement",
      quote: "How can we describe a secret quantity without knowing its exact number?",
      capsule: "In math, a letter like 'x' is just a placeholder for any secret number!"
    },
    {
      id: 'machine',
      title: "Two Things Happened to x",
      badge: "The Forward Machine",
      image: "/images/story/slide2.jpg",
      story: "Ravi places the mystery stickers inside a two-layer machine: first x was multiplied by 2, then 3 extra bonus stickers were added to total 11 stickers! That gives us the equation: 2x + 3 = 11.",
      narration: "Two things happened to our mystery number: first it was multiplied by 2, then 3 was added to make 11.",
      style: "statement",
      quote: "What happened first, and what happened second to our mystery x?",
      capsule: "Forward order: x was multiplied by 2, then 3 was added to make 11!"
    },
    {
      id: 'reverse',
      title: "Undo in Reverse: Socks & Shoes",
      badge: "Reverse Unwrapping",
      image: "/images/story/slide3.jpg",
      story: "Think of putting on socks then shoes! To take them off, shoes come off first. In 2x + 3 = 11, the last operation was adding 3, so we undo it first by subtracting 3 from both sides, leaving 2x = 8!",
      narration: "Think of socks and shoes. Shoes go on last, so shoes come off first! Undo the addition before dividing.",
      style: "thinking",
      quote: "Which layer do we unwrap first: the addition or the multiplication?",
      capsule: "Undo the last step first: subtract 3 from both sides before dividing by 2!"
    },
    {
      id: 'balance',
      title: "Keep the Balance! Both Sides",
      badge: "The Golden Rule",
      image: "/images/story/slide4_balance.jpg",
      story: "To keep the scale level, whatever you do to one side, you MUST do to the other side! We divide both sides of 2x = 8 by 2. That reveals the mystery value: x = 4 stickers!",
      narration: "Whatever operation you apply to one side, you must apply to the other to keep the scale balanced.",
      style: "emphasis",
      quote: "Why must every operation be done to both sides of the equals sign?",
      capsule: "The Golden Rule: Whatever operation you do to the left, do to the right!"
    },
    {
      id: 'check',
      title: "Check by Substitution",
      badge: "Proof & Verification",
      image: "/images/story/slide5_words.jpg",
      story: "How do we know x = 4 is correct? Substitute 4 back into the original equation! 2(4) + 3 = 8 + 3 = 11. Since both sides equal 11, both pans stay in perfect balance and our answer is 100% verified!",
      narration: "Put your answer back in place of the letter. If both sides match, your answer is verified!",
      style: "statement",
      quote: "How can you be completely confident your algebraic answer is right?",
      capsule: "Substitute your solution back into x: if both sides match, it's correct!"
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
