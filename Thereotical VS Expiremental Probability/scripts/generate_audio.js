/* =========================================================
   ELEVENLABS AUDIO GENERATOR SCRIPT
   Voice: Alice (ElevenLabs Voice ID: Xb7hH8MSUJpSbSDYk0k2)
   Model: eleven_multilingual_v2
   Lesson: Theoretical vs Experimental Probability (Grade 7)
   ========================================================= */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice
const MODEL_ID = 'eleven_multilingual_v2';

const PRESETS = {
  statement: { stability: 0.50, similarity_boost: 0.75 },
  question: { stability: 0.40, similarity_boost: 0.80 },
  encouragement: { stability: 0.35, similarity_boost: 0.85 },
  celebration: { stability: 0.30, similarity_boost: 0.90 },
  emphasis: { stability: 0.45, similarity_boost: 0.80 },
  thinking: { stability: 0.60, similarity_boost: 0.70 },
  instruction: { stability: 0.55, similarity_boost: 0.75 }
};

// All fixed spoken phrases
const PHRASES = [
  // Wonder Phase
  {
    id: 'wonder_intro',
    text: "Imagine flipping a coin ten times. Will you always get exactly five heads and five tails? What does it truly mean for a dice or spinner to be fair?",
    style: 'statement'
  },
  {
    id: 'wonder_coin_flip',
    text: "Not always! Even with a fair coin, getting four heads or seven heads in ten flips is totally normal. Ten flips is a small sample!",
    style: 'emphasis'
  },
  {
    id: 'wonder_fair_meaning',
    text: "A fair device gives every single outcome an equal chance of happening. No sides are weighted, sticky, or favoured!",
    style: 'statement'
  },
  {
    id: 'wonder_trustworthy',
    text: "Both are valuable! Theoretical probability gives the exact mathematical expectation, while experimental probability shows what actually happened in reality!",
    style: 'thinking'
  },

  // Story Phase
  {
    id: 'story_slide_1',
    text: "Maya and Archie are setting up a carnival booth. Probability measures how likely an event is, on a scale from zero, which is impossible, to one, which is absolutely certain.",
    style: 'statement'
  },
  {
    id: 'story_slide_2',
    text: "Archie rolls a standard six-sided dice. Theoretical probability is calculated by dividing favourable outcomes by the total number of possible outcomes. For rolling a six, that is one out of six.",
    style: 'statement'
  },
  {
    id: 'story_slide_3',
    text: "Maya flips a coin ten times and gets seven heads. Experimental probability is the number of times an event happens divided by the total number of trials. In small trials, chance has natural variation.",
    style: 'statement'
  },
  {
    id: 'story_slide_4',
    text: "As Archie and Maya run hundreds of trials, something amazing happens. The experimental probability gets closer and closer to the theoretical prediction. This powerful principle is called the Law of Large Numbers.",
    style: 'statement'
  },
  {
    id: 'story_slide_5',
    text: "By comparing theoretical expectations with experimental results, Archie and Maya can spot whether a dice or spinner is fair or rigged. When thousands of trials stay far from theory, the game is biased.",
    style: 'statement'
  },

  // Stations Phase
  {
    id: 'station_1',
    text: "Welcome to the Probability Lab! Flip coins, roll dice, and spin the wheel. Watch the running graph converge to the theoretical line as trials grow!",
    style: 'instruction'
  },
  {
    id: 'station_2',
    text: "Welcome to Predict then Test! Select your theoretical prediction first, launch trials, and measure how close reality comes to your calculation.",
    style: 'instruction'
  },
  {
    id: 'station_3',
    text: "Welcome to Detective Fairness Test! Inspect experimental trial tables from carnival games and decide whether they are fair or biased.",
    style: 'instruction'
  },

  // Practice Phase
  {
    id: 'practice_welcome',
    text: "Welcome to the Probability Practice Arena! Read each clue carefully and calculate favourable outcomes and relative frequencies.",
    style: 'instruction'
  },
  {
    id: 'practice_praise_1',
    text: "Outstanding calculation! You have mastered the laws of probability!",
    style: 'celebration'
  },
  {
    id: 'practice_praise_2',
    text: "Spot on! That is the exact theoretical probability.",
    style: 'encouragement'
  },
  {
    id: 'practice_praise_3',
    text: "Brilliant! You calculated the relative frequency perfectly!",
    style: 'celebration'
  },
  {
    id: 'practice_hint_1',
    text: "Not quite. Remember: divide favourable outcomes by the total possible outcomes.",
    style: 'thinking'
  },
  {
    id: 'practice_hint_2',
    text: "Careful with the denominator! Total trials belongs on the bottom.",
    style: 'emphasis'
  },
  {
    id: 'practice_hint_3',
    text: "Remember, theoretical is what should happen, and experimental is what actually occurred in trials.",
    style: 'thinking'
  },

  // Reflect Phase
  {
    id: 'reflect_intro',
    text: "Take a moment to reflect on your probability experiments. How does the Law of Large Numbers shape real-world predictions?",
    style: 'thinking'
  },

  // Summary Phase
  {
    id: 'summary_celebration',
    text: "Congratulations! You have mastered Theoretical and Experimental Probability and earned your Probability Pro badge!",
    style: 'celebration'
  }
];

const OUTPUT_DIR = path.resolve(__dirname, '../public/assets/audio/probability');
const MANIFEST_PATH = path.resolve(__dirname, '../public/assets/audio/probability/audio-manifest.json');
const MAP_OUTPUT_PATH = path.resolve(__dirname, '../src/utils/audioMap.js');

async function generateAudio() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.warn('\n⚠️ [ElevenLabs Generator] process.env.ELEVENLABS_API_KEY is not set.');
    console.warn('To generate high quality Alice voice files, set the key and run:');
    console.warn('  $env:ELEVENLABS_API_KEY="your-api-key"; npm run gen-audio\n');
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  let manifest = {};
  if (fs.existsSync(MANIFEST_PATH)) {
    try {
      manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
    } catch (e) {
      manifest = {};
    }
  }

  const audioMap = {};

  for (const phrase of PHRASES) {
    const preset = PRESETS[phrase.style] || PRESETS.statement;
    const hash = crypto.createHash('sha1').update(`${phrase.text}_${phrase.style}_${VOICE_ID}`).digest('hex');
    const filename = `${phrase.id}.mp3`;
    const filepath = path.join(OUTPUT_DIR, filename);
    const publicUrl = `/assets/audio/probability/${filename}`;

    audioMap[phrase.text] = publicUrl;

    if (apiKey && (!fs.existsSync(filepath) || manifest[phrase.id] !== hash)) {
      console.log(`Generating audio for "${phrase.id}" with Alice (${VOICE_ID})...`);
      try {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': apiKey
          },
          body: JSON.stringify({
            text: phrase.text,
            model_id: MODEL_ID,
            voice_settings: {
              stability: preset.stability,
              similarity_boost: preset.similarity_boost
            }
          })
        });

        if (!response.ok) {
          const errBody = await response.text();
          throw new Error(`ElevenLabs API returned ${response.status}: ${errBody}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        fs.writeFileSync(filepath, Buffer.from(arrayBuffer));
        manifest[phrase.id] = hash;
        console.log(`✓ Saved ${filename}`);
      } catch (err) {
        console.error(`✗ Failed to generate "${phrase.id}":`, err.message);
      }
    }
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

  const audioMapContent = `/* Auto-generated audio map */
export const AUDIO_MAP = ${JSON.stringify(audioMap, null, 2)};
`;
  fs.writeFileSync(MAP_OUTPUT_PATH, audioMapContent);
  console.log(`\n✓ Audio map written to ${MAP_OUTPUT_PATH}`);
}

generateAudio();
