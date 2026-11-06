// Audio generator script for Understanding Equations using ElevenLabs API (Voice: Alice)
// Safe key handling: reads ONLY from process.env.ELEVENLABS_API_KEY with NO hardcoded fallbacks
// Hash manifest tracks text changes so edited scripts are cleanly regenerated

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice
const MODEL_ID = 'eleven_multilingual_v2';
const OUTPUT_DIR = path.join(__dirname, '../public/assets/audio/equations');
const MANIFEST_PATH = path.join(__dirname, 'audio-manifest.json');
const MAP_PATH = path.join(__dirname, '../src/utils/audioMap.js');

const PRESETS = {
  statement: { stability: 0.50, similarity_boost: 0.75 },
  question: { stability: 0.40, similarity_boost: 0.80 },
  encouragement: { stability: 0.35, similarity_boost: 0.85 },
  celebration: { stability: 0.30, similarity_boost: 0.90 },
  emphasis: { stability: 0.45, similarity_boost: 0.80 },
  thinking: { stability: 0.60, similarity_boost: 0.70 },
  instruction: { stability: 0.55, similarity_boost: 0.75 },
};

export const PHRASES = [
  // Wonder
  { id: 'wonder_intro', text: "Look at this balance scale. When both sides weigh the same, it sits perfectly level. That is exactly what an equation is. Can you keep it balanced?", style: 'statement' },
  { id: 'wonder_equals', text: "The equals sign says both sides have the same value, like a scale in balance. It does not just mean the answer comes next!", style: 'statement' },
  { id: 'wonder_bothsides', text: "No! If you take something off one side, the scale tips. To keep it balanced, you must do the very same thing to both sides.", style: 'emphasis' },
  { id: 'wonder_check', text: "Put your answer back in place of the letter. If both sides match, the scale stays level and your answer is correct!", style: 'thinking' },

  // Story
  { id: 'story_slide1', text: "Welcome to our maths lab! Look at this scale. An expression is just a pile of items, but an equation has an equals sign balancing both sides perfectly.", style: 'statement' },
  { id: 'story_slide2', text: "A solution is the exact number that makes both sides equal. When we test five, five plus three equals eight, so five is the true solution!", style: 'statement' },
  { id: 'story_slide3', text: "To solve an equation, undo operations one by one. Undo addition with subtraction, and undo multiplication with division.", style: 'instruction' },
  { id: 'story_slide4', text: "Always keep the balance! Whatever you do to one side, you must do to the other side. Undo plus or minus first, then undo multiply or divide.", style: 'emphasis' },
  { id: 'story_slide5', text: "Real-world problems can be translated into equations. Double a number and add five to get seventeen becomes two x plus five equals seventeen!", style: 'statement' },

  // Stations
  { id: 'station1_intro', text: "Welcome to Station 1! Put weights on the scale, do the same to both sides, and find the mystery bag.", style: 'instruction' },
  { id: 'station2_intro', text: "Welcome to Station 2! Undo each step in the right order. Ravi made some slips, so can you spot them?", style: 'instruction' },
  { id: 'station3_intro', text: "Welcome to Station 3! Turn real Singapore situations into equations and solve them.", style: 'instruction' },

  // Practice
  { id: 'practice_welcome', text: "Welcome to Practice Mode! Test your skills solving linear equations. Remember to keep both sides balanced and test your answers!", style: 'instruction' },
  { id: 'practice_correct_1', text: "Spot on! You balanced both sides and found the exact solution.", style: 'encouragement' },
  { id: 'practice_correct_2', text: "Brilliant work! Your algebraic thinking is rock solid.", style: 'encouragement' },
  { id: 'practice_wrong_1', text: "Not quite. Check that you did the same thing to both sides, then put your answer back in to test it.", style: 'thinking' },
  { id: 'practice_wrong_2', text: "Watch out for inverse operations! Undo addition with subtraction, and multiplication with division.", style: 'thinking' },

  // Reflect & Summary
  { id: 'reflect_intro', text: "Think about today's discoveries. Which idea about keeping the balance made the most sense to you?", style: 'thinking' },
  { id: 'summary_congrats', text: "Congratulations! You have mastered understanding equations and earned your Balance Master badge!", style: 'celebration' }
];

function sha1(str) {
  return crypto.createHash('sha1').update(str).digest('hex');
}

async function run() {
  const API_KEY = process.env.ELEVENLABS_API_KEY;
  if (!API_KEY) {
    console.warn('⚠️  ELEVENLABS_API_KEY environment variable not found.');
    console.log('ℹ️  The application includes built-in Natural Speech Synthesis fallback for all audio narration and Web Audio harmonic SFX.');
    return;
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  let manifest = {};
  if (fs.existsSync(MANIFEST_PATH)) {
    try {
      manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    } catch {
      manifest = {};
    }
  }

  const mapEntries = {};

  for (const phrase of PHRASES) {
    const filename = `${phrase.id}.mp3`;
    const filepath = path.join(OUTPUT_DIR, filename);
    const textHash = sha1(phrase.text);
    const audioUrl = `/assets/audio/equations/${filename}`;

    mapEntries[phrase.id] = audioUrl;
    mapEntries[phrase.text] = audioUrl;

    if (fs.existsSync(filepath) && manifest[phrase.id] === textHash) {
      console.log(`⏩ [Cache] ${phrase.id}`);
      continue;
    }

    console.log(`🎙️ [ElevenLabs] Generating ${phrase.id}...`);
    try {
      const preset = PRESETS[phrase.style] || PRESETS.statement;
      const resp = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'xi-api-key': API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg'
        },
        body: JSON.stringify({
          text: phrase.text,
          model_id: MODEL_ID,
          voice_settings: preset
        })
      });

      if (!resp.ok) {
        const errText = await resp.text();
        console.error(`❌ Failed ${phrase.id} (${resp.status}): ${errText}`);
        continue;
      }

      const buffer = Buffer.from(await resp.arrayBuffer());
      fs.writeFileSync(filepath, buffer);
      manifest[phrase.id] = textHash;
      console.log(`✅ Saved ${filename} (${buffer.length} bytes)`);
    } catch (err) {
      console.error(`❌ Error on ${phrase.id}:`, err.message);
    }
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

  // Write audioMap.js
  const mapContent = `// Generated Audio Map for Understanding Equations
export default ${JSON.stringify(mapEntries, null, 2)};
`;
  fs.writeFileSync(MAP_PATH, mapContent);
  console.log(`🎉 Audio generation complete! Updated ${MAP_PATH}`);
}

run();
