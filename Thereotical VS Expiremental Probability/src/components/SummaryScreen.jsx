import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { SUMMARY_NARRATION } from '../utils/patternsNarration';
import { sounds, playNarration } from '../utils/audio';

export default function SummaryScreen({ state, onNavigatePhase, onReset }) {
  const { xp, questionsAnswered, correctAnswers, bestStreak, stationsCompleted } = state;

  const accuracy = questionsAnswered > 0
    ? Math.round((correctAnswers / questionsAnswered) * 100)
    : 100;

  useEffect(() => {
    sounds.fanfare();
    playNarration(SUMMARY_NARRATION.celebration.text, SUMMARY_NARRATION.celebration.style);

    // Fire Confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
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
      }, 400);
    } catch (e) {}
  }, []);

  return (
    <div className="phase-container" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div className="summary-card">
        {/* Animated Badge Icon */}
        <div className="mastery-badge-icon">
          🏆
        </div>

        <div style={{ color: 'var(--gold-400)', fontFamily: 'var(--font-fun)', fontSize: '1rem', fontWeight: 800, letterSpacing: '1px' }}>
          BADGE UNLOCKED
        </div>
        <h2 style={{ color: '#ffffff', fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 900, margin: '4px 0 12px' }}>
          Pattern & Expression Master
        </h2>
        <p style={{ color: '#cbd5e1', fontSize: '1.05rem', maxWidth: '580px', lineHeight: 1.5 }}>
          Outstanding work! You've decoded the secrets of linear number sequences, cracked the nth-term formula machine, and translated complex word sentences into crisp algebraic expressions.
        </p>

        {/* 4 Stats Boxes */}
        <div className="summary-stats-grid">
          <div className="stat-box">
            <div className="stat-val">{xp}</div>
            <div className="stat-lbl">XP Earned ⚡</div>
          </div>

          <div className="stat-box">
            <div className="stat-val">{accuracy}%</div>
            <div className="stat-lbl">Accuracy 🎯</div>
          </div>

          <div className="stat-box">
            <div className="stat-val">{bestStreak} 🔥</div>
            <div className="stat-lbl">Best Streak</div>
          </div>

          <div className="stat-box">
            <div className="stat-val">{stationsCompleted.length} / 3</div>
            <div className="stat-lbl">Labs Done 🧪</div>
          </div>
        </div>

        {/* Actions Row */}
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '10px' }}>
          <button className="btn-secondary" onClick={() => { sounds.click(); onNavigatePhase('wonder'); }}>
            🔄 Review Journey
          </button>

          <button className="btn-primary" onClick={() => { sounds.click(); onNavigatePhase('practice'); }}>
            🎮 Practice More Questions
          </button>

          <button
            className="btn-gold"
            onClick={() => {
              if (window.confirm('Restart lesson from the beginning?')) {
                sounds.click();
                onReset();
              }
            }}
          >
            🚀 Restart Quest
          </button>
        </div>
      </div>
    </div>
  );
}
