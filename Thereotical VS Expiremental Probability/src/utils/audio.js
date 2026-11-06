/* =========================================================
   AUDIO & SYNTHETIC SOUND ENGINE + SMART NARRATION PLAYER
   Voice: ElevenLabs Alice (MP3 with seamless Web Speech fallback)
   ========================================================= */

import { AUDIO_MAP } from './audioMap';

class SoundEffectsEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    this.getAudioContext();
    this.initialized = true;
  }

  getAudioContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  setMuted(muted) {
    this.muted = muted;
  }

  click() {
    if (this.muted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.14, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {}
  }

  pop() {
    if (this.muted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(380, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(950, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {}
  }

  correct() {
    if (this.muted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0.2, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.22);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.25);
      });
    } catch (e) {}
  }

  wrong() {
    if (this.muted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const notes = [320, 240];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0.14, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.2);
      });
    } catch (e) {}
  }

  fanfare() {
    if (this.muted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const chords = [
        [523.25, 659.25],
        [587.33, 698.46],
        [659.25, 783.99],
        [783.99, 1046.50]
      ];
      chords.forEach((chord, i) => {
        chord.forEach(freq => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.12);

          const duration = i === 3 ? 0.6 : 0.2;
          gain.gain.setValueAtTime(0.2, now + i * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + duration);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.12);
          osc.stop(now + i * 0.12 + duration);
        });
      });
    } catch (e) {}
  }

  chime() {
    if (this.muted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {}
  }
}

export const sounds = new SoundEffectsEngine();

// Auto-unlock AudioContext on first user interaction anywhere on the window
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    sounds.init();
    window.removeEventListener('pointerdown', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
  };
  window.addEventListener('pointerdown', unlockAudio, { once: true });
  window.addEventListener('keydown', unlockAudio, { once: true });
}

// Narration State
let currentAudio = null;
let isNarrationMuted = false;

export function setNarrationMuted(muted) {
  isNarrationMuted = muted;
  sounds.setMuted(muted);
  if (muted) {
    stopNarration();
  }
}

export function stopNarration() {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch (e) {}
    currentAudio = null;
  }
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }
}

/**
 * Intelligent Speech Synthesis fallback when pre-rendered audio is missing/loading
 */
function speakWithSynthesis(text, style = 'statement', onEnded = null) {
  if (isNarrationMuted || typeof window === 'undefined' || !window.speechSynthesis) {
    if (onEnded) onEnded();
    return;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    // Pick articulate female voice matching Alice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      (v.name.includes('Alice') || v.name.includes('Zira') || v.name.includes('Samantha') || 
       v.name.includes('Victoria') || v.name.includes('Karen') || v.name.includes('Female')) &&
      v.lang.startsWith('en')
    ) || voices.find(v => v.lang.startsWith('en')) || voices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.rate = style === 'emphasis' ? 0.9 : 0.95;
    utterance.pitch = style === 'celebration' ? 1.15 : 1.05;
    utterance.volume = 1.0;

    utterance.onend = () => {
      if (onEnded) onEnded();
    };

    utterance.onerror = (e) => {
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        console.warn('Speech synthesis error:', e);
      }
      if (onEnded) onEnded();
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis fallback failed:', err);
    if (onEnded) onEnded();
  }
}

/**
 * Play narration with pre-rendered ElevenLabs MP3, or seamless speech synthesis fallback
 */
export function playNarration(text, style = 'statement', onEnded = null) {
  if (isNarrationMuted || !text) {
    if (onEnded) onEnded();
    return;
  }

  stopNarration();

  // Look up pre-rendered audio clip in AUDIO_MAP
  const audioSrc = AUDIO_MAP && AUDIO_MAP[text];

  if (audioSrc) {
    const audio = new Audio(audioSrc);
    currentAudio = audio;

    let hasEnded = false;
    const safeEnd = () => {
      if (!hasEnded) {
        hasEnded = true;
        currentAudio = null;
        if (onEnded) onEnded();
      }
    };

    audio.onended = safeEnd;

    // If pre-rendered MP3 fails (e.g., 404 file not found), fall back to Speech Synthesis
    audio.onerror = () => {
      currentAudio = null;
      speakWithSynthesis(text, style, onEnded);
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay prevented or file error -> trigger speech synthesis
        currentAudio = null;
        speakWithSynthesis(text, style, onEnded);
      });
    }
  } else {
    // No direct MP3 mapped -> use speech synthesis
    speakWithSynthesis(text, style, onEnded);
  }
}
