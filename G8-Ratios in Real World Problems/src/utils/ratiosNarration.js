/* =========================================================
   RATIOS NARRATION & LESSON CURRICULUM DATA
   Topic: Ratios in Real World Problems (Grade 8)
   ========================================================= */

export const WONDER_QUESTIONS = [
  {
    id: 'meaning',
    icon: '🔍',
    question: 'What does a ratio like 3 : 5 tell us?',
    spokenAnswer:
      'For every three parts of one thing, there are five parts of another. A ratio compares amounts, and the order matters!',
    capsule: '3 parts : 5 parts • compares amounts • order matters',
    detail:
      'A ratio compares quantities of the same kind. If there are 3 boys to 5 girls, the ratio of boys to girls is 3 : 5. Order is crucial: 5 : 3 would mean 5 boys to 3 girls!'
  },
  {
    id: 'same',
    icon: '⚖️',
    question: 'How can two different-looking ratios be the same?',
    spokenAnswer:
      'Multiply or divide both parts by the same number and the ratio stays the same. It is just a bigger or smaller batch of the same recipe.',
    capsule: '2 : 3 = 8 : 12 (× 4) • 24 : 36 = 2 : 3 (÷ 12)',
    detail:
      'Equivalent ratios have the same proportion. Multiplying or dividing both terms by the same non-zero number scales the batch up or down without altering the flavour or colour!'
  },
  {
    id: 'adding',
    icon: '🚫',
    question: 'If I add the same number to both parts, is it the same ratio?',
    spokenAnswer:
      'No! Ratios grow by multiplying, not by adding. Adding the same amount to both parts changes the mix.',
    capsule: '3 : 5 (+ 2 to each) → 5 : 7 ≠ 3 : 5 • Multiplicative, not additive!',
    detail:
      'Adding numbers changes the relative proportions! 3/5 is 60%, but (3+2)/(5+2) = 5/7 is about 71.4%. The mix gets thrown off completely.'
  }
];

export const STORY_SLIDES = [
  {
    id: 'slide_1',
    title: 'What Is a Ratio?',
    story:
      "Maya and her robot fox partner Ravi are setting up their workshop. Maya arranges 3 glowing blue tiles and 5 golden yellow tiles on the bench. Ravi asks: 'How do these groups compare?' In math, we compare them with a ratio: 3 to 5, written 3 : 5. The total has 3 + 5 = 8 parts!",
    keyQuestion:
      'How does a part-to-part ratio compare to a part-to-whole fraction?',
    capsule: '3 boys : 5 girls • whole class = 3 + 5 = 8 parts • boys are 3 out of 8',
    mascotHint:
      'In a ratio, order is everything! Part-to-part is 3 : 5. Part-to-whole is 3 out of 8 (3/8)!',
    spokenNarration:
      "Maya and Ravi are organizing their workshop supplies. Maya lays out three blue tiles and five yellow tiles. Ravi asks, 'How do these two groups compare?' This is a ratio: three to five, written as three colon five! The whole group has eight parts.",
    image: '/images/story/slide1.jpg',
    ratio: [3, 5],
    labels: ['Blue Tiles', 'Yellow Tiles'],
    mode: 'parts'
  },
  {
    id: 'slide_2',
    title: 'Same Ratio, Bigger Batch',
    story:
      "Ravi puts on his chef hat to bake delicious Singapore rainbow kueh! The classic recipe requires 2 cups of rice flour for every 3 cups of coconut milk (2 : 3). For a massive school festival order 4 times bigger, Ravi multiplies both by 4: 8 cups flour and 12 cups coconut milk! 8 : 12 is equivalent to 2 : 3.",
    keyQuestion:
      'How can we scale up a recipe while keeping the exact same taste?',
    capsule: 'Flour : sugar = 2 : 3 → 8 : 12 (× 4) • 24 : 36 = 2 : 3 (÷ 12)',
    mascotHint:
      'Always multiply or divide both terms by the same number. Never add ingredients!',
    spokenNarration:
      'Ravi is baking kueh in the kitchen! The recipe calls for two cups of flour for every three cups of milk. To make a big party batch four times bigger, Ravi multiplies both amounts by four to get eight cups of flour and twelve cups of milk.',
    image: '/images/story/slide2.jpg',
    ratio: [2, 3],
    labels: ['Flour (cups)', 'Coconut Milk (cups)'],
    mode: 'table'
  },
  {
    id: 'slide_3',
    title: 'Find the Missing Amount',
    story:
      "Maya and Ravi are mixing paint to restore the school community mural. Perfect sky blue paint needs blue and white paint mixed in the ratio 2 : 5. Maya has 6 tins of blue paint. How many tins of white paint are needed? Find the scale multiplier: 6 ÷ 2 = 3! So white paint = 5 × 3 = 15 tins!",
    keyQuestion:
      'How do we find an unknown quantity using a ratio scale factor?',
    capsule: 'Blue : white = 2 : 5; 6 tins blue → × 3 → 15 tins white',
    mascotHint:
      'Find the scale factor first! 6 divided by 2 is 3. Then scale the other side: 5 × 3 = 15!',
    spokenNarration:
      'Maya and Ravi are mixing paint for a mural. Sky blue requires blue and white paint in the ratio two to five. Maya has six tins of blue paint. Since two times three is six, she multiplies five by three to get fifteen tins of white paint!',
    image: '/images/story/slide3.jpg',
    ratio: [2, 5],
    labels: ['Blue Paint (tins)', 'White Paint (tins)'],
    mode: 'table'
  },
  {
    id: 'slide_4',
    title: 'Share It in a Ratio',
    story:
      "Maya and Ravi won $72 in the youth innovation challenge! They agree to divide the prize money in the ratio 3 : 5. Using a bar model, they divide the total into 3 + 5 = 8 equal blocks. Each block is worth $72 ÷ 8 = $9! Maya receives 3 × $9 = $27, and Ravi receives 5 × $9 = $45.",
    keyQuestion:
      'What is the three-step secret to sharing any quantity in a given ratio?',
    capsule: '$72 in 3 : 5 → 8 parts → 1 part = $9 → $27 and $45',
    mascotHint:
      'The 3 Golden Steps: 1) Add parts (3+5=8). 2) Find 1 part ($72÷8=$9). 3) Multiply each share!',
    spokenNarration:
      'Maya and Ravi won seventy-two dollars in a contest! They share the prize in the ratio three to five. Splitting the total into eight equal parts means each part is worth nine dollars. Maya gets twenty-seven dollars and Ravi gets forty-five dollars!',
    image: '/images/story/slide1_track.jpg',
    ratio: [3, 5],
    labels: ["Maya's Share", "Ravi's Share"],
    total: 72,
    mode: 'bar'
  },
  {
    id: 'slide_5',
    title: 'Which Mix Is Stronger?',
    story:
      "At the school sports carnival refreshment stand, Maya and Ravi mix two dispensers of Bandung rose syrup. Dispenser A has 4 cups syrup to 9 cups water (4 : 9, syrup fraction 4/13 ≈ 30.8%). Dispenser B has 3 cups syrup to 5 cups water (3 : 5, syrup fraction 3/8 = 37.5%). Dispenser B has a larger share of syrup, so it is stronger and sweeter!",
    keyQuestion:
      'Why can we not just compare the first numbers in each ratio?',
    capsule: 'Syrup : water A = 4 : 9, B = 3 : 5 → syrup share 4/13 ≈ 0.31, 3/8 = 0.375 → B is stronger',
    mascotHint:
      "Don't get tricked! Even though 4 > 3, Dispenser B is sweeter because 3/8 is larger than 4/13!",
    spokenNarration:
      'At the sports carnival, Maya and Ravi prepare two batches of rose syrup drink. Batch A has four parts syrup to nine parts water. Batch B has three parts syrup to five parts water. Calculating the syrup share shows Batch B has a larger share of syrup, so it is stronger!',
    image: '/images/story/slide3_bestbuy.jpg',
    mixes: [
      { name: 'Dispenser A', a: 4, b: 9, labelA: 'Syrup', labelB: 'Water' },
      { name: 'Dispenser B', a: 3, b: 5, labelA: 'Syrup', labelB: 'Water' }
    ],
    mode: 'mix'
  }
];

export const REFLECT_PROMPTS = [
  {
    id: 'onePart',
    prompt: 'Why do we always find the value of "one part" first in ratio problems?',
    placeholder: 'Explain the power of finding the unit value...'
  },
  {
    id: 'addingMisconception',
    prompt: 'Why does adding the same number to both terms change the ratio, while multiplying keeps it the same?',
    placeholder: 'Explain multiplicative scaling versus additive shift...'
  },
  {
    id: 'realWorld',
    prompt: 'Describe a real situation in daily life where using the wrong ratio would cause a serious problem.',
    placeholder: 'Think about cooking recipes, medicine mixing, construction cement, or money sharing...'
  }
];
