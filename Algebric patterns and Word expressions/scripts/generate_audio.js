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

const PHRASES = [
  // Wonder Phase
  {
    id: 'wonder_intro',
    text: "Look around you. Train carriages, floor tiles and stacked chairs all follow hidden rules. Can you find the rule and predict what comes next?",
    style: 'statement'
  },
  {
    id: 'wonder_hundredth',
    text: "Find the rule! Once you know how the pattern grows, you can jump straight to any position, no matter how far away.",
    style: 'statement'
  },
  {
    id: 'wonder_lessthan',
    text: "No! Five less than x means start with x and take away five. The order in the words is not the order in the symbols. Be careful!",
    style: 'emphasis'
  },
  {
    id: 'wonder_letters',
    text: "Yes! A letter can stand for any number we do not know yet. Then words like more than, twice and less than become plus, times and minus.",
    style: 'thinking'
  },

  // Story Phase
  {
    id: 'story_slide_1',
    text: "Maya and Ravi noticed a glowing sequence: 3, 5, 7, 9. Each number grows by adding two. This steady jump is called the common difference.",
    style: 'statement'
  },
  {
    id: 'story_slide_2',
    text: "Instead of adding two over and over, we can use the position number n. Multiply n by two and add one. For position ten, two times ten plus one gives twenty-one!",
    style: 'statement'
  },
  {
    id: 'story_slide_3',
    text: "Look at the matchstick squares. The first square needs four sticks. Every extra square only needs three more sticks. The rule is three n plus one.",
    style: 'statement'
  },
  {
    id: 'story_slide_4',
    text: "Turning words into algebra is like translating a secret code. Sum and more than mean addition. Twice means multiply by two. And five less than x means x minus five!",
    style: 'statement'
  },
  {
    id: 'story_slide_5',
    text: "Brackets change everything. Three times the sum of n and two means we must add first inside brackets: three times bracket n plus two bracket.",
    style: 'statement'
  },

  // Stations Phase
  {
    id: 'station_1',
    text: "Welcome to Station 1! Build the pattern, spot the rule, and test it on any position you choose.",
    style: 'instruction'
  },
  {
    id: 'station_2',
    text: "Welcome to Station 2! Turn each sentence into an expression. Watch out for tricky words like less than!",
    style: 'instruction'
  },
  {
    id: 'station_3',
    text: "Welcome to Station 3! Find patterns in Singapore tables, tiles and train lines, and write their rules.",
    style: 'instruction'
  },

  // Practice Phase
  {
    id: 'practice_welcome',
    text: "Time to test your pattern detective skills! Read each clue carefully.",
    style: 'instruction'
  },
  {
    id: 'practice_praise_1',
    text: "Super job! You cracked the rule perfectly!",
    style: 'celebration'
  },
  {
    id: 'practice_praise_2',
    text: "Spot on! That is the exact algebraic expression.",
    style: 'encouragement'
  },
  {
    id: 'practice_hint_1',
    text: "Not quite. Check the first two terms against your rule, then look at the words again.",
    style: 'thinking'
  },
  {
    id: 'practice_hint_2',
    text: "Watch out for the order of terms or the common difference!",
    style: 'emphasis'
  },

  // Reflect Phase
  {
    id: 'reflect_intro',
    text: "Think about today's discoveries. Which pattern rule or tricky phrase surprised you most?",
    style: 'thinking'
  },

  // Summary Phase
  {
    id: 'summary_celebration',
    text: "Congratulations! You have mastered algebraic patterns and word expressions and earned your Pattern Master badge!",
    style: 'celebration'
  }
];

const OUTPUT_DIR = path.resolve(__dirname, '../public/assets/audio/patterns');
const MANIFEST_PATH = path.resolve(__dirname, '../public/assets/audio/patterns/audio-manifest.json');
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
    const publicUrl = `/assets/audio/patterns/${filename}`;

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

  // Write manifest and audio map
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

  const audioMapContent = `/* Auto-generated audio map */
export const AUDIO_MAP = ${JSON.stringify(audioMap, null, 2)};
`;
  fs.writeFileSync(MAP_OUTPUT_PATH, audioMapContent);
  console.log(`\n✓ Audio map written to ${MAP_OUTPUT_PATH}`);
}

generateAudio();
