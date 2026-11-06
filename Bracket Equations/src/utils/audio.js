// Audio subsystem: Static MP3 playback + Web Audio API Synthesizer + SpeechSynthesis fallback
// Bug #2 Fix: Exact and normalized matching only, no hardcoded triangle keywords or erratic substring fallbacks.

import audioMap from './audioMap.js';

let audioContext = null;
let currentAudio = null;
let currentUtterance = null;
let isMuted = false;
let isAudioUnlocked = false;

// Normalize string for robust lookup (ignores casing, punctuation, extra whitespace)
function normalizeText(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Build normalized audio lookup table
const normalizedAudioMap = {};
Object.entries(audioMap).forEach(([text, file]) => {
  normalizedAudioMap[normalizeText(text)] = file;
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
      // ignore
    }
    currentAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
    currentUtterance = null;
  }
}

// Select natural sounding voice for preview / fallback
function getBestVoice() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const preferredNames = [
    'Google UK English Female',
    'Google US English',
    'Microsoft Sonia Online (Natural) - English (United Kingdom)',
    'Microsoft Libby Online (Natural) - English (United Kingdom)',
    'Microsoft Jenny Online (Natural) - English (United States)',
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

// Unlock audio playback on first interaction
export function unlockAudio() {
  if (isAudioUnlocked) return;
  isAudioUnlocked = true;

  try {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  } catch {
    // ignore
  }
}

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioContext) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      audioContext = new AudioCtx();
    }
  }
  return audioContext;
}

// Web Audio API Procedural Sound Effects
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
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // ignore
    }
  },

  pop: () => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(350, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // ignore
    }
  },

  ding: () => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, ctx.currentTime); // B5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // ignore
    }
  },

  correct: () => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      [
        { f: 523.25, t: 0.0, d: 0.12 }, // C5
        { f: 659.25, t: 0.08, d: 0.14 }, // E5
        { f: 783.99, t: 0.16, d: 0.18 }, // G5
        { f: 1046.50, t: 0.24, d: 0.35 } // C6
      ].forEach(n => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.f, now + n.t);
        gain.gain.setValueAtTime(0.12, now + n.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + n.t);
        osc.stop(now + n.t + n.d);
      });
    } catch {
      // ignore
    }
  },

  wrong: () => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      [
        { f: 311.13, t: 0.0, d: 0.15 }, // Eb4
        { f: 293.66, t: 0.12, d: 0.22 } // D4
      ].forEach(n => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(n.f, now + n.t);
        gain.gain.setValueAtTime(0.08, now + n.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + n.t);
        osc.stop(now + n.t + n.d);
      });
    } catch {
      // ignore
    }
  },

  levelup: () => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const chords = [
        { f: 523.25, t: 0.0 },
        { f: 659.25, t: 0.07 },
        { f: 783.99, t: 0.14 },
        { f: 1046.50, t: 0.21 },
        { f: 1318.51, t: 0.32 }
      ];
      chords.forEach(c => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(c.f, now + c.t);
        gain.gain.setValueAtTime(0.14, now + c.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + c.t + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + c.t);
        osc.stop(now + c.t + 0.4);
      });
    } catch {
      // ignore
    }
  }
};

/**
 * Play narration text:
 * 1. Checks exact match or normalized match in audioMap
 * 2. If an audio file path exists, tries to play it
 * 3. If file fails or is missing, falls back cleanly to Web Speech API
 */
export function narrate(text, style = 'statement', onEnd = null) {
  if (isMuted || !text) {
    if (onEnd) onEnd();
    return;
  }

  stopNarration();

  // Try static audio clip
  const norm = normalizeText(text);
  const audioFilePath = audioMap[text] || normalizedAudioMap[norm];

  if (audioFilePath) {
    const audio = new Audio(audioFilePath);
    currentAudio = audio;

    audio.onended = () => {
      currentAudio = null;
      if (onEnd) onEnd();
    };

    audio.onerror = () => {
      // Static audio failed (e.g. 404), fall back to SpeechSynthesis
      currentAudio = null;
      speakWithSpeechSynthesis(text, style, onEnd);
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy or fetch error
        currentAudio = null;
        speakWithSpeechSynthesis(text, style, onEnd);
      });
    }
  } else {
    // No static audio file mapped
    speakWithSpeechSynthesis(text, style, onEnd);
  }
}

function speakWithSpeechSynthesis(text, style, onEnd) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  try {
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = getBestVoice();
    if (voice) {
      utterance.voice = voice;
    }

    // Set pitch & rate based on style preset
    switch (style) {
      case 'question':
        utterance.rate = 0.98;
        utterance.pitch = 1.1;
        break;
      case 'encouragement':
        utterance.rate = 1.05;
        utterance.pitch = 1.15;
        break;
      case 'celebration':
        utterance.rate = 1.08;
        utterance.pitch = 1.25;
        break;
      case 'thinking':
        utterance.rate = 0.92;
        utterance.pitch = 0.98;
        break;
      case 'emphasis':
        utterance.rate = 0.95;
        utterance.pitch = 1.05;
        break;
      default:
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
    }

    utterance.onend = () => {
      currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      currentUtterance = null;
      if (onEnd) onEnd();
    };

    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  } catch {
    if (onEnd) onEnd();
  }
}
