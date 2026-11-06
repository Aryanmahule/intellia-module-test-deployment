/**
 * Build-time audio generator for ElevenLabs MP3s
 * Voice: Alice (Voice ID: Xb7hH8MSUJpSbSDYk0k2)
 * Model: eleven_multilingual_v2
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import https from 'https';

const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';
const MODEL_ID = 'eleven_multilingual_v2';
const OUTPUT_DIR = path.resolve('public/assets/audio/ratios');
const MANIFEST_PATH = path.resolve('public/assets/audio/ratios/audio-manifest.json');
const AUDIO_MAP_PATH = path.resolve('src/utils/audioMap.js');

const PRESETS = {
  statement: { stability: 0.50, similarity_boost: 0.75 },
  question: { stability: 0.40, similarity_boost: 0.80 },
  encouragement: { stability: 0.35, similarity_boost: 0.85 },
  celebration: { stability: 0.30, similarity_boost: 0.90 },
  emphasis: { stability: 0.45, similarity_boost: 0.80 },
  thinking: { stability: 0.60, similarity_boost: 0.70 },
  instruction: { stability: 0.55, similarity_boost: 0.75 }
};

export const PHRASES = [
  {
    id: 'wonder_intro',
    text: "Welcome to Ravi's kitchen! A good recipe needs the right ratio of ingredients. Get it wrong, and the whole batch tastes off!",
    style: 'statement'
  },
  {
    id: 'wonder_meaning',
    text: "For every three parts of one thing, there are five parts of another. A ratio compares amounts, and the order matters!",
    style: 'statement'
  },
  {
    id: 'wonder_same',
    text: "Multiply or divide both parts by the same number and the ratio stays the same. It is just a bigger or smaller batch of the same recipe.",
    style: 'thinking'
  },
  {
    id: 'wonder_adding',
    text: "No! Ratios grow by multiplying, not by adding. Adding the same amount to both parts changes the mix.",
    style: 'emphasis'
  },
  {
    id: 'story_slide_1',
    text: "Maya and Ravi are organizing their workshop supplies. Maya lays out three blue tiles and five yellow tiles. Ravi asks, 'How do these two groups compare?' This is a ratio: three to five, written as three colon five! The whole group has eight parts.",
    style: 'statement'
  },
  {
    id: 'story_slide_2',
    text: "Ravi is baking kueh in the kitchen! The recipe calls for two cups of flour for every three cups of milk. To make a big party batch four times bigger, Ravi multiplies both amounts by four to get eight cups of flour and twelve cups of milk.",
    style: 'statement'
  },
  {
    id: 'story_slide_3',
    text: "Maya and Ravi are mixing paint for a mural. Sky blue requires blue and white paint in the ratio two to five. Maya has six tins of blue paint. Since two times three is six, she multiplies five by three to get fifteen tins of white paint!",
    style: 'statement'
  },
  {
    id: 'story_slide_4',
    text: "Maya and Ravi won seventy-two dollars in a contest! They share the prize in the ratio three to five. Splitting the total into eight equal parts means each part is worth nine dollars. Maya gets twenty-seven dollars and Ravi gets forty-five dollars!",
    style: 'statement'
  },
  {
    id: 'story_slide_5',
    text: "At the sports carnival, Maya and Ravi prepare two batches of rose syrup drink. Batch A has four parts syrup to nine parts water. Batch B has three parts syrup to five parts water. Calculating the syrup share shows Batch B has a larger share of syrup, so it is stronger!",
    style: 'statement'
  },
  {
    id: 'station_1',
    text: "Welcome to Station 1! Build each ratio with tiles, then scale it up or down to find the missing amount.",
    style: 'instruction'
  },
  {
    id: 'station_2',
    text: "Welcome to Station 2! Share each amount using the bar model. Find the value of one part first.",
    style: 'instruction'
  },
  {
    id: 'station_3',
    text: "Welcome to Station 3! Compare mixes and solve real Singapore problems using ratios.",
    style: 'instruction'
  },
  {
    id: 'practice_welcome',
    text: "Welcome to Practice Mode! Test your skills on real-world ratio problems. Remember: add the parts, find one part, and scale!",
    style: 'instruction'
  },
  {
    id: 'practice_praise_1',
    text: "Outstanding! You nailed the ratio calculations!",
    style: 'celebration'
  },
  {
    id: 'practice_praise_2',
    text: "Brilliant work! You scaled the parts accurately!",
    style: 'celebration'
  },
  {
    id: 'practice_hint_1',
    text: "Not quite. Add up the parts, find the value of one part, then scale to the amount you need.",
    style: 'thinking'
  },
  {
    id: 'practice_hint_2',
    text: "Remember, ratios change by multiplying or dividing both parts, never by adding!",
    style: 'thinking'
  },
  {
    id: 'reflect_intro',
    text: "Think about today's discoveries. Where would a wrong ratio cause a problem in real life?",
    style: 'thinking'
  },
  {
    id: 'summary_celebration',
    text: "Congratulations! You have mastered ratios in real world problems and earned your Ratio Master badge!",
    style: 'celebration'
  }
];

async function generate() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error('Error: ELEVENLABS_API_KEY environment variable is required to generate audio.');
    console.log('Static MP3s will be retained and simulated fallback will be used in development.');
    return;
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  let manifest = {};
  if (fs.existsSync(MANIFEST_PATH)) {
    try {
      manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
    } catch (e) {}
  }

  const audioMapEntries = {};

  for (const phrase of PHRASES) {
    const hash = crypto.createHash('sha1').update(`${phrase.text}:${phrase.style}`).digest('hex');
    const filename = `${phrase.id}.mp3`;
    const filePath = path.join(OUTPUT_DIR, filename);
    const audioUrl = `/assets/audio/ratios/${filename}`;

    audioMapEntries[phrase.text] = audioUrl;

    if (manifest[phrase.id] === hash && fs.existsSync(filePath)) {
      console.log(`[Cache Hit] ${phrase.id}`);
      continue;
    }

    console.log(`[Generating] ${phrase.id}...`);
    // ElevenLabs API call
    const preset = PRESETS[phrase.style] || PRESETS.statement;
    // ... API call handler
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log('Audio generation completed.');
}

if (process.argv[1] && process.argv[1].endsWith('generate_audio.js')) {
  generate().catch(console.error);
}
