import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { NARRATION } from '../../utils/fractionsNarration.js';
import { narrate, sounds, unlockAudio } from '../../utils/audio.js';

export default function SummaryScreen({ state, onRestart, onPracticeAgain }) {
  useEffect(() => {
    try {
      sounds.celebration();
    } catch (e) {
      console.warn('Audio celebration failed:', e);
    }

    // Fire celebration confetti safely
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 300);
    } catch (e) {
      console.warn('Confetti effect failed gracefully:', e);
    }

    if (NARRATION.summary?.congrats) {
      narrate(NARRATION.summary.congrats, 'celebration');
    }
  }, []);

  const practiceStats = state?.practiceStats || {};
  const attempted = practiceStats.attempted || 0;
  const correct = practiceStats.correct || 0;
  const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 100;
  const bestStreak = practiceStats.bestStreak || state?.highestStreak || state?.streak || 0;
  const stationsProgress = state?.stationsProgress || {};
  const stationsDoneCount = Object.values(stationsProgress).filter(Boolean).length;
  const xp = state?.xp || 0;

  return (
    <div className="phase-container summary-screen">
      <div className="summary-card glass-panel">
        {/* Celebration Trophy & Badge Header */}
        <div className="summary-badge-header">
          <div className="trophy-avatar glow-pulse" role="img" aria-label="Trophy">
            🏆
          </div>
          <span className="summary-tag">Mission Accomplished!</span>
          <h2 className="summary-title">{NARRATION.summary?.badge || 'Fraction Master'}</h2>
          <p className="summary-subtitle">
            You have successfully mastered equivalent fractions, common denominators, and balanced fraction equations!
          </p>
        </div>

        {/* Real Stats Dashboard */}
        <div className="summary-stats-grid">
          <div className="stat-card">
            <span className="stat-num text-gold">{xp}</span>
            <span className="stat-label">Total XP Earned</span>
          </div>

          <div className="stat-card">
            <span className="stat-num text-teal">{accuracy}%</span>
            <span className="stat-label">Accuracy ({correct}/{attempted})</span>
          </div>

          <div className="stat-card">
            <span className="stat-num text-coral">{bestStreak} 🔥</span>
            <span className="stat-label">Highest Streak</span>
          </div>

          <div className="stat-card">
            <span className="stat-num text-purple">{stationsDoneCount} / 3</span>
            <span className="stat-label">Labs Mastered</span>
          </div>
        </div>

        {/* Key Takeaways Review */}
        <div className="summary-takeaways-box">
          <h4 className="takeaways-title">Your Mastered Principles:</h4>
          <ul className="takeaways-list">
            <li>🍕 <strong>Equivalent Fractions:</strong> Multiply or divide numerator & denominator by the same factor without altering the true value.</li>
            <li>⚙️ <strong>Common Ground (LCM):</strong> Cut unlike fractions into identical-sized pieces before combining.</li>
            <li>⚖️ <strong>Scale Balance:</strong> Whatever fraction you add, subtract, multiply, or divide on one side, do the same to the other!</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="summary-actions-row">
          <button
            className="action-btn-secondary"
            onClick={() => {
              unlockAudio();
              sounds.click();
              onRestart();
            }}
          >
            🏠 Return to Start
          </button>
          <button
            className="action-btn-primary glow-pulse"
            onClick={() => {
              unlockAudio();
              sounds.ding();
              onPracticeAgain();
            }}
          >
            🎗️ Practice Again
          </button>
        </div>
      </div>
    </div>
  );
}
