// ElevenLabs batch audio generator for Substitution & Formulae module
// Voice ID: Xb7hH8MSUJpSbSDYk0k2 ("Alice")
// Model: eleven_multilingual_v2

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';
const MODEL_ID = 'eleven_multilingual_v2';
const OUTPUT_DIR = path.join(__dirname, '../public/assets/audio/formulae');
const AUDIO_MAP_FILE = path.join(__dirname, '../src/utils/audioMap.js');
const MANIFEST_FILE = path.join(__dirname, 'audio-manifest.json');

const PRESETS = {
  statement: { stability: 0.50, similarity_boost: 0.75 },
  question: { stability: 0.40, similarity_boost: 0.80 },
  encouragement: { stability: 0.35, similarity_boost: 0.85 },
  celebration: { stability: 0.30, similarity_boost: 0.90 },
  emphasis: { stability: 0.45, similarity_boost: 0.80 },
  thinking: { stability: 0.60, similarity_boost: 0.70 },
  instruction: { stability: 0.55, similarity_boost: 0.75 },
};

const PHRASES = [
  // WONDER PHASE
  { id: 'wonder_intro', text: "Look around you. A taxi meter, a phone plan and the weather app all use hidden rules called formulae. How do they turn numbers into answers?", style: 'statement' },
  { id: 'wonder_meter', text: "A formula is a rule with letters standing in for numbers. Put in the distance, and the rule gives back the price every single time!", style: 'statement' },
  { id: 'wonder_letters', text: "Not at all! Three x means three times x. If x is four, that is twelve, not thirty-four. Letters next to numbers mean multiply!", style: 'emphasis' },
  { id: 'wonder_same', text: "Yes! The rule never changes. Only the numbers you substitute in change. That is what makes formulae so powerful.", style: 'thinking' },

  // STORY PHASE (SLIDES 1 to 5)
  { id: 'story_slide1', text: "Welcome to our math lab! A formula is like a magical recipe machine. The letters are just empty slots waiting for you to drop in numbers.", style: 'statement' },
  { id: 'story_slide2', text: "Whenever you replace a letter with a number, wrap it in brackets! Writing three with four in brackets clearly means three times four, not thirty-four.", style: 'instruction' },
  { id: 'story_slide3', text: "Order of operations is crucial. In two x squared, square the number first, then multiply by two. But with brackets around two x, multiply first, then square the whole thing!", style: 'emphasis' },
  { id: 'story_slide4', text: "Negative numbers need extra care. Always put a protective bracket shield around a negative number when you substitute it in.", style: 'thinking' },
  { id: 'story_slide5', text: "From Singapore taxi meters to calculating the area of a bridge, the formula stays exactly the same. You just substitute the fresh measurements to find the exact answer!", style: 'celebration' },

  // STATIONS PHASE
  { id: 'station1_intro', text: "Welcome to Station 1! Feed numbers into the formula machine and watch how the answer changes.", style: 'instruction' },
  { id: 'station2_intro', text: "Welcome to Station 2! Ravi made some mistakes in his working. Can you spot the slip and fix the line?", style: 'instruction' },
  { id: 'station3_intro', text: "Welcome to Station 3! Use real formulae from around Singapore to solve everyday problems.", style: 'instruction' },

  // PRACTICE PHASE
  { id: 'practice_welcome', text: "Welcome to Practice Mode! Test your skills across six dynamic substitution challenges. Take your time, use brackets, and aim for a high streak!", style: 'instruction' },
  { id: 'practice_correct_1', text: "Brilliant substitution! You followed the order of operations perfectly.", style: 'encouragement' },
  { id: 'practice_correct_2', text: "Spot on! Your algebraic calculations are rock solid.", style: 'celebration' },
  { id: 'practice_wrong_1', text: "Not quite. Replace the letter with its number using brackets, then follow BODMAS order.", style: 'thinking' },
  { id: 'practice_wrong_2', text: "Watch out for signs and powers! Brackets make all the difference.", style: 'thinking' },

  // REFLECT & SUMMARY
  { id: 'reflect_intro', text: "Think about today's discoveries. Which substitution mistake would you be most likely to make?", style: 'thinking' },
  { id: 'summary_congrats', text: "Congratulations! You have mastered substitution and formulae and earned your Formula Master badge!", style: 'celebration' }
];

function computeHash(text, style) {
  return crypto.createHash('sha1').update(`${text}::${style}`).digest('hex');
}

async function generateAll() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  let manifest = {};
  if (fs.existsSync(MANIFEST_FILE)) {
    try {
      manifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf-8'));
    } catch {
      manifest = {};
    }
  }

  console.log(`Found ${PHRASES.length} phrases to process using Voice ID: ${VOICE_ID}`);

  const mapEntries = {};

  for (const item of PHRASES) {
    const filename = `${item.id}.mp3`;
    const filePath = path.join(OUTPUT_DIR, filename);
    const publicUrl = `/assets/audio/formulae/${filename}`;
    mapEntries[item.text] = publicUrl;

    const hash = computeHash(item.text, item.style);

    if (fs.existsSync(filePath) && manifest[item.id] === hash) {
      console.log(`✓ Unchanged & cached: ${filename}`);
      continue;
    }

    if (!API_KEY) {
      console.warn(`⚠️ ELEVENLABS_API_KEY is not set. Skipping API call for ${filename}.`);
      continue;
    }

    console.log(`Generating: ${filename}...`);
    try {
      const voiceSettings = PRESETS[item.style] || PRESETS.statement;
      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'xi-api-key': API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg'
        },
        body: JSON.stringify({
          text: item.text,
          model_id: MODEL_ID,
          voice_settings: voiceSettings
        })
      });

      if (!res.ok) {
        throw new Error(`ElevenLabs API error: ${res.status} ${res.statusText}`);
      }

      const buffer = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(filePath, buffer);
      manifest[item.id] = hash;
      console.log(`✓ Saved: ${filename}`);
    } catch (e) {
      console.error(`❌ Failed generating ${filename}:`, e.message);
    }
  }

  // Save hash manifest
  fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2), 'utf-8');

  // Update audioMap.js
  const mapContent = `// Audio map matching exact spoken phrases to static ElevenLabs audio assets
// Generated with Voice ID: ${VOICE_ID}

const audioMap = ${JSON.stringify(mapEntries, null, 2)};

export default audioMap;
`;
  fs.writeFileSync(AUDIO_MAP_FILE, mapContent, 'utf-8');
  console.log('✓ Updated audioMap.js successfully!');
  console.log('🎉 Audio generation script process finished.');
}

generateAll();
