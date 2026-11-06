/* =========================================================
   AUDIO & SYNTHETIC SOUND ENGINE + ALICE NARRATION PLAYER
   Voice: Alice Only (ElevenLabs Voice ID: Xb7hH8MSUJpSbSDYk0k2)
   ========================================================= */

import { AUDIO_MAP } from './audioMap';

class SoundEffectsEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
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
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
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
      osc.frequency.setValueAtTime(350, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
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

        gain.gain.setValueAtTime(0.18, now + idx * 0.07);
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

        gain.gain.setValueAtTime(0.12, now + idx * 0.12);
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
          gain.gain.setValueAtTime(0.18, now + i * 0.12);
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

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {}
  }
}

export const sounds = new SoundEffectsEngine();

// Narration State
let currentAudio = null;
let isNarrationMuted = false;

// Ensure any browser speech synthesis is permanently silenced
if (typeof window !== 'undefined' && window.speechSynthesis) {
  try {
    window.speechSynthesis.cancel();
  } catch (e) {}
}

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
 * Play narration EXCLUSIVELY with Alice's ElevenLabs Audio MP3s
 * Never uses the system's default browser voices.
 */
export function playNarration(text, style = 'statement', onEnded = null) {
  if (isNarrationMuted || !text) {
    if (onEnded) onEnded();
    return;
  }

  stopNarration();

  // Look up exact audio file in AUDIO_MAP
  const audioSrc = AUDIO_MAP && AUDIO_MAP[text];
  if (audioSrc) {
    const audio = new Audio(audioSrc);
    currentAudio = audio;

    audio.onended = () => {
      currentAudio = null;
      if (onEnded) onEnded();
    };

    audio.onerror = (e) => {
      console.warn(`Audio playback issue for "${audioSrc}":`, e);
      currentAudio = null;
      if (onEnded) onEnded();
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        // User hasn't interacted with document yet or browser blocked autoplay
        console.warn('Autoplay prevented by browser:', err);
        currentAudio = null;
        if (onEnded) onEnded();
      });
    }
    return;
  }

  // If text not mapped, do not play any fallback robot voice
  if (onEnded) onEnded();
}
