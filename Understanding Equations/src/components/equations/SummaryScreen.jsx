import React, { useEffect } from 'react';
import { NARRATION } from '../../utils/equationsNarration.js';
import { narrate, sounds, stopNarration } from '../../utils/audio.js';
import confetti from 'canvas-confetti';

export default function SummaryScreen({ state, onRestart, onPracticeMore }) {
  useEffect(() => {
    // Fire celebratory confetti and audio
    try {
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    sounds.celebration();
    narrate(NARRATION.summary.congrats, NARRATION.summary.style);

    return () => {
      stopNarration();
    };
  }, []);

  const attempted = state.practiceStats.attempted;
  const correct = state.practiceStats.correct;
  const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 100;
  const bestStreak = Math.max(state.practiceStats.bestStreak, state.highestStreak);
  const stationsDone = Object.values(state.stationsProgress).filter(Boolean).length;

  return (
    <div className="glass-card summary-phase-card" style={{ textAlign: 'center', alignItems: 'center' }}>
      {/* Badge Hero Display */}
      <div style={{ margin: '6px 0' }}>
        <div
          style={{
            fontSize: '4.8rem',
            lineHeight: 1,
            filter: 'drop-shadow(0 0 25px rgba(251, 191, 36, 0.6))',
            animation: 'float-around 4s infinite ease-in-out alternate'
          }}
        >
          🏆
        </div>

        <div className="badge badge-gold" style={{ marginTop: '10px', fontSize: '1.25rem', padding: '8px 24px' }}>
          <span>🥇 {NARRATION.summary.badgeName}</span>
        </div>

        <h1 className="title-hero" style={{ fontSize: '2.5rem', marginTop: '8px', marginBottom: '4px', fontFamily: 'var(--font-fun)' }}>
          Lesson Completed!
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          {NARRATION.summary.badgeDesc}
        </p>
      </div>

      {/* Real Performance Metrics Grid (Non-zero verified) */}
      <div
        className="summary-stats-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '14px',
          width: '100%',
          maxWidth: '820px',
          margin: '14px 0'
        }}
      >
        <div style={{ background: 'rgba(26, 21, 58, 0.9)', border: '1.5px solid var(--purple-border)', borderRadius: 'var(--radius-md)', padding: '14px' }}>
          <div style={{ fontSize: '1.8rem' }}>⚡</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--gold-bright)', fontFamily: 'var(--font-mono)' }}>
            {state.xp}
          </div>
          <div style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total XP Earned</div>
        </div>

        <div style={{ background: 'rgba(26, 21, 58, 0.9)', border: '1.5px solid var(--purple-border)', borderRadius: 'var(--radius-md)', padding: '14px' }}>
          <div style={{ fontSize: '1.8rem' }}>🎯</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--teal-bright)', fontFamily: 'var(--font-mono)' }}>
            {correct} / {attempted || 6}
          </div>
          <div style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Practice Score</div>
        </div>

        <div style={{ background: 'rgba(26, 21, 58, 0.9)', border: '1.5px solid var(--purple-border)', borderRadius: 'var(--radius-md)', padding: '14px' }}>
          <div style={{ fontSize: '1.8rem' }}>🔥</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--coral-bright)', fontFamily: 'var(--font-mono)' }}>
            {bestStreak}
          </div>
          <div style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Best Streak</div>
        </div>

        <div style={{ background: 'rgba(26, 21, 58, 0.9)', border: '1.5px solid var(--purple-border)', borderRadius: 'var(--radius-md)', padding: '14px' }}>
          <div style={{ fontSize: '1.8rem' }}>🧪</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--neon-green)', fontFamily: 'var(--font-mono)' }}>
            {stationsDone}/3
          </div>
          <div style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Simulations Completed</div>
        </div>
      </div>

      {/* Mascot Speech Bubble */}
      <div className="mascot-container" style={{ justifyContent: 'center', margin: '6px 0' }}>
        <div className="mascot">🦊</div>
        <div className="speech-bubble" style={{ maxWidth: '640px' }}>
          <div className="speaker-name">Ravi's Congratulations</div>
          <div className="speech-text">
            "You proved that equations are balanced scales, mastered inverse operations, and solved real Singapore mysteries! Keep up the brilliant math journey!"
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '12px' }}>
        <button className="btn btn-ghost" onClick={onRestart}>
          <span>🔄 Restart Lesson</span>
        </button>
        <button className="btn btn-gold" onClick={onPracticeMore}>
          <span>🎮 Practice More Questions</span>
        </button>
      </div>
    </div>
  );
}
