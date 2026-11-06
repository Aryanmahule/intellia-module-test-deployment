import React, { useEffect } from 'react';
import { sounds, playNarration } from '../utils/audio';
import confetti from 'canvas-confetti';

export default function SummaryScreen({ state, onNavigatePhase, onReset }) {
  useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    playNarration(
      'Congratulations! You have mastered ratios in real world problems and earned your Ratio Master badge!',
      'celebration'
    );
  }, []);

  const accuracyPct = state.questionsAnswered > 0
    ? Math.round((state.correctAnswers / state.questionsAnswered) * 100)
    : 100;

  return (
    <div className="summary-screen-container">
      {/* Trophy & Badge Section */}
      <div className="summary-badge-showcase">
        <div className="trophy-glow-circle">
          🏆
        </div>
        <div className="badge-ribbon-tag">
          RATIO MASTER
        </div>
        <h1 className="summary-title">
          Mission Accomplished!
        </h1>
        <p className="summary-subtitle">
          You conquered ratios, scaled recipes, shared prizes with the bar model, and compared real-world mixtures!
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="summary-stats-grid">
        <div className="summary-stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-value">{state.xp}</div>
          <div className="stat-label">Total XP Earned</div>
        </div>

        <div className="summary-stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-value">{state.correctAnswers}/{state.questionsAnswered}</div>
          <div className="stat-label">Practice Score ({accuracyPct}%)</div>
        </div>

        <div className="summary-stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-value">{state.bestStreak}</div>
          <div className="stat-label">Best Streak</div>
        </div>

        <div className="summary-stat-card">
          <div className="stat-icon">🧪</div>
          <div className="stat-value">{state.stationsCompleted.length}/3</div>
          <div className="stat-label">Stations Conquered</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="summary-actions-row">
        <button
          className="btn-gold"
          onClick={() => { sounds.click(); onNavigatePhase('intro'); }}
          style={{ padding: '14px 32px' }}
        >
          <span>🏠 Return to Home</span>
        </button>

        <button
          className="btn-secondary"
          onClick={() => { sounds.click(); onNavigatePhase('practice'); }}
          style={{ padding: '14px 32px' }}
        >
          <span>🎮 More Practice</span>
        </button>

        <button
          className="btn-outline-danger"
          onClick={() => {
            if (window.confirm('Are you sure you want to restart your ratio journey from scratch?')) {
              sounds.pop();
              onReset();
            }
          }}
          style={{ padding: '12px 20px', fontSize: '0.9rem', opacity: 0.8 }}
        >
          <span>↺ Reset Progress</span>
        </button>
      </div>
    </div>
  );
}
