import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { SUMMARY_NARRATION } from '../../utils/bracketsNarration.js';
import { narrate, sounds, unlockAudio } from '../../utils/audio.js';

export default function SummaryScreen({ state, onRestart, onPracticeAgain }) {
  useEffect(() => {
    // Fire celebration confetti
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
    } catch {
      // ignore
    }

    // Play celebration audio
    narrate(SUMMARY_NARRATION.congrats, 'celebration');
  }, []);

  const { practiceStats, xp, stationsProgress } = state;
  const attempted = practiceStats.attempted || 0;
  const correct = practiceStats.correct || 0;
  const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 100;
  const bestStreak = practiceStats.bestStreak || 0;

  const stationsDoneCount = Object.values(stationsProgress).filter(Boolean).length;

  return (
    <div className="phase-container summary-screen">
      <div className="summary-card glass-panel">
        {/* Celebration Trophy & Badge */}
        <div className="summary-badge-header">
          <div className="trophy-avatar glow-pulse" role="img" aria-label="Trophy">
            🛡️
          </div>
          <span className="summary-tag">Mission Accomplished!</span>
          <h2 className="summary-title">{SUMMARY_NARRATION.badge}</h2>
          <p className="summary-subtitle">
            You have successfully mastered the Distributive Law and solved equations with brackets!
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
            <span className="stat-label">Simulations Mastered</span>
          </div>
        </div>

        {/* Key Takeaways Review */}
        <div className="summary-takeaways-box">
          <h4 className="takeaways-title">Your Mastered Principles:</h4>
          <ul className="takeaways-list">
            <li>🚪 <strong>The Distributive Law:</strong> The multiplier outside knocks on every term inside: <code>a(b + c) = ab + ac</code>.</li>
            <li>⚡ <strong>Two Strategies:</strong> Expand brackets first, OR divide both sides first when the outside number divides cleanly!</li>
            <li>➖ <strong>Watch Negative Signs:</strong> Multiplying a negative outside by a negative inside turns into a positive!</li>
            <li>⚖️ <strong>Brackets on Both Sides:</strong> Expand both sides first, collect like variable terms, and balance!</li>
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
            🔄 Restart Quest
          </button>

          <button
            className="action-btn-primary pulse-ready"
            onClick={() => {
              unlockAudio();
              sounds.ding();
              onPracticeAgain();
            }}
          >
            🎮 Practice More Problems
          </button>
        </div>
      </div>
    </div>
  );
}
