// Audio subsystem: Static ElevenLabs MP3 playback + Web Audio API synthesizer + Natural Fallback

import audioMap from './audioMap.js';

let audioContext = null;
let currentAudio = null;
let currentUtterance = null;
let isMuted = false;
let isAudioUnlocked = false;

// Normalize string for robust audio lookup (ignores casing, punctuation, and extra whitespace)
function normalizeText(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Build normalized audio map for text lookups
const normalizedAudioMap = {};
Object.entries(audioMap).forEach(([key, file]) => {
  normalizedAudioMap[normalizeText(key)] = file;
});

export function isNarrationMuted() {
  return isMuted;
}

export function setNarrationMuted(muted) {
  isMuted = muted;
  if (isMuted) {
    stopNarration();
  }
}

export function stopNarration() {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch {
      // Audio pause error ignored
    }
    currentAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // cancel error ignored
    }
    currentUtterance = null;
  }
}

// Select natural sounding voice for preview/fallback
function getBestVoice() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const preferredNames = [
    'Google UK English Female',
    'Google US English',
    'Microsoft Sonia Online (Natural)',
    'Microsoft Libby Online (Natural)',
    'Microsoft Jenny Online (Natural)',
    'Samantha',
    'Victoria',
    'Karen'
  ];

  for (const name of preferredNames) {
    const found = voices.find(v => v.name.includes(name) && v.lang.startsWith('en'));
    if (found) return found;
  }

  const enVoice = voices.find(v => v.lang.startsWith('en'));
  return enVoice || voices[0];
}

export function unlockAudio() {
  if (isAudioUnlocked) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      if (!audioContext) {
        audioContext = new AudioCtx();
      }
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
    }
    // Also trigger voices load if needed
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
    isAudioUnlocked = true;
  } catch (e) {
    console.warn('Audio unlock warning:', e);
  }
}

function getAudioContext() {
  if (!audioContext) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      audioContext = new AudioCtx();
    }
  }
  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

// Spoken voice narration (Checks ID first, then text, then falls back to SpeechSynthesis)
export function narrate(keyOrText, style = 'statement') {
  if (isMuted || !keyOrText) return;
  stopNarration();
  unlockAudio();

  // 1. Direct ID lookup
  let audioSrc = audioMap[keyOrText];

  // 2. Normalized Text lookup
  if (!audioSrc) {
    const norm = normalizeText(keyOrText);
    audioSrc = normalizedAudioMap[norm];
  }

  // If static MP3 found in audioMap, attempt playback
  if (audioSrc) {
    try {
      const audio = new Audio(audioSrc);
      currentAudio = audio;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          // If MP3 file missing or network error, fallback to browser SpeechSynthesis
          console.info(`Static audio not ready (${audioSrc}), using natural speech fallback.`);
          fallbackSpeech(keyOrText, style);
        });
      }
      return;
    } catch {
      fallbackSpeech(keyOrText, style);
      return;
    }
  }

  // 3. Fallback to SpeechSynthesis
  fallbackSpeech(keyOrText, style);
}

function fallbackSpeech(text, style) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  if (isMuted) return;

  try {
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = getBestVoice();
    if (voice) utterance.voice = voice;

    // Apply voice preset properties
    switch (style) {
      case 'question':
        utterance.pitch = 1.15;
        utterance.rate = 0.96;
        break;
      case 'encouragement':
      case 'celebration':
        utterance.pitch = 1.2;
        utterance.rate = 1.04;
        break;
      case 'instruction':
        utterance.pitch = 1.05;
        utterance.rate = 0.94;
        break;
      case 'thinking':
        utterance.pitch = 0.95;
        utterance.rate = 0.9;
        break;
      case 'emphasis':
        utterance.pitch = 1.1;
        utterance.rate = 0.92;
        break;
      default:
        utterance.pitch = 1.08;
        utterance.rate = 0.98;
    }

    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('SpeechSynthesis error:', e);
  }
}

// Synthesized Web Audio SFX (Harmonic, warm, modern)
export const sounds = {
  click: () => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {}
  },

  ding: () => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      [880, 1320].forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      });
    } catch {}
  },

  pop: () => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(740, now + 0.08);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch {}
  },

  correct: () => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      // Warm major third chord arpeggio
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0, now + idx * 0.07);
        gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.32);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.35);
      });
    } catch {}
  },

  wrong: () => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.linearRampToValueAtTime(170, now + 0.22);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    } catch {}
  },

  celebration: () => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const fanfare = [
        { f: 523.25, t: 0.0, d: 0.12 },
        { f: 659.25, t: 0.12, d: 0.12 },
        { f: 783.99, t: 0.24, d: 0.12 },
        { f: 1046.50, t: 0.36, d: 0.38 }
      ];
      fanfare.forEach(({ f, t, d }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + t);

        gain.gain.setValueAtTime(0, now + t);
        gain.gain.linearRampToValueAtTime(0.2, now + t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + t + d);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + t);
        osc.stop(now + t + d);
      });
    } catch {}
  }
};
