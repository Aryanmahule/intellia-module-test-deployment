// ElevenLabs batch audio generator for Rates (Grade 8) module
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
const OUTPUT_DIR = path.join(__dirname, '../public/assets/audio/rates');
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

export const PHRASES = [
  // WONDER PHASE
  { id: 'wonder_intro', text: "Welcome to Ravi's racetrack! Fast or slow, cheap or pricey, rates are everywhere. Can you work out who is really winning?", style: 'statement' },
  { id: 'wonder_rate', text: "A rate compares two different kinds of things, like kilometres and hours, or dollars and kilograms. That is why the units matter so much!", style: 'statement' },
  { id: 'wonder_perone', text: "When everything is measured per one, comparing becomes fair. Per one kilogram, per one hour, per one litre. Then you can see the winner at once!", style: 'thinking' },
  { id: 'wonder_bigger', text: "Not always! Compare the price for one unit, not the total price. Only then is the comparison fair.", style: 'emphasis' },

  // STORY PHASE (SLIDES 1 to 5)
  { id: 'story_slide1', text: "Welcome to Ravi's racetrack of rates! A rate compares two completely different quantities, like distance and time. Whenever you see per, think for each one.", style: 'statement' },
  { id: 'story_slide2', text: "To find a unit rate, divide to scale down to just one. When both quantities change by the same factor, the rate stays exactly in proportion.", style: 'instruction' },
  { id: 'story_slide3', text: "Never judge a bargain by the total price tag alone. Find the price per single kilogram or bottle. The lower unit rate is always the true best buy!", style: 'emphasis' },
  { id: 'story_slide4', text: "Speed tells you how fast distance changes over time. Multiply speed by time to get distance, and switch to metres per second by dividing by three point six.", style: 'instruction' },
  { id: 'story_slide5', text: "When you plot a rate on a graph starting at zero, the line is straight. The steepness or slope of the line is the unit rate itself!", style: 'celebration' },

  // STATIONS PHASE
  { id: 'station1_intro', text: "Welcome to Station 1! Scale each rate down to one unit, then compare prices to find the best buy.", style: 'instruction' },
  { id: 'station2_intro', text: "Welcome to Station 2! Take the cars around the track. Find the speed, distance or time, and switch between units.", style: 'instruction' },
  { id: 'station3_intro', text: "Welcome to Station 3! Read graphs and real Singapore situations, and tell Ravi what each rate means.", style: 'instruction' },

  // PRACTICE PHASE
  { id: 'practice_welcome', text: "Welcome to Practice Mode! Test your rate skills across six racing challenges. Calculate unit rates, spot the best buy, and convert units to build your streak!", style: 'instruction' },
  { id: 'practice_correct_1', text: "Outstanding calculation! You found the exact rate with the right units.", style: 'encouragement' },
  { id: 'practice_correct_2', text: "Spot on! Ravi the Rate Racer is thrilled with your speedy math.", style: 'celebration' },
  { id: 'practice_wrong_1', text: "Not quite. Divide to find the amount per one, and check that your units match the question.", style: 'thinking' },
  { id: 'practice_wrong_2', text: "Take another look! Make sure you divide the right way around, or double-check your unit conversion.", style: 'thinking' },

  // REFLECT & SUMMARY
  { id: 'reflect_intro', text: "Think about today's discoveries. Where in your own day do you meet a rate?", style: 'thinking' },
  { id: 'summary_congrats', text: "Congratulations! You have mastered rates and earned your Rate Racer badge!", style: 'celebration' },

  // INTRO MASCOT
  { id: 'intro_mascot', text: "Welcome to my racetrack! Can you calculate speeds, find the best supermarket buys, and master rates with me?", style: 'encouragement' }
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
    const publicUrl = `/assets/audio/rates/${filename}`;
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

    console.log(`🎙️ Generating: ${filename} ("${item.text.substring(0, 35)}...")`);

    const preset = PRESETS[item.style] || PRESETS.statement;

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'xi-api-key': API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg'
        },
        body: JSON.stringify({
          text: item.text,
          model_id: MODEL_ID,
          voice_settings: {
            stability: preset.stability,
            similarity_boost: preset.similarity_boost
          }
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error(`❌ Error generating ${filename}: HTTP ${response.status}`, errText);
        continue;
      }

      const arrayBuffer = await response.arrayBuffer();
      fs.writeFileSync(filePath, Buffer.from(arrayBuffer));
      manifest[item.id] = hash;
      console.log(`✓ Saved ${filename}`);
    } catch (err) {
      console.error(`❌ Network error generating ${filename}:`, err.message);
    }
  }

  // Save updated manifest
  fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2));

  // Write audioMap.js
  const mapContent = `// Auto-generated audio map for Rates (Grade 8) module\n\nconst audioMap = ${JSON.stringify(mapEntries, null, 2)};\n\nexport default audioMap;\n`;
  fs.writeFileSync(AUDIO_MAP_FILE, mapContent);
  console.log('✓ Updated src/utils/audioMap.js successfully.');
}

generateAll().catch(console.error);
