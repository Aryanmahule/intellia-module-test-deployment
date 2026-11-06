import React, { useEffect } from 'react';
import { NARRATION } from '../../utils/equationsNarration.js';
import { narrate, sounds, stopNarration } from '../../utils/audio.js';
import confetti from 'canvas-confetti';

export default function SummaryScreen({ state, onRestart, onPracticeMore }) {
  useEffect(() => {
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {}

    sounds.celebration();
    narrate('summary_congrats', 'celebration');

    return () => {
      stopNarration();
    };
  }, []);

  const attempted = state.practiceStats?.attempted || 0;
  const correct = state.practiceStats?.correct || 0;
  const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 100;
  const bestStreak = Math.max(state.practiceStats?.bestStreak || 0, state.highestStreak || 0);

  const stationStats = state.stationStats || {};
  const stationsDone = Object.values(stationStats).filter(s => s?.completed).length;

  const earnedBadges = [
    { id: 'first-balance', icon: '⚖️', name: 'Balance Master', desc: 'Kept the scale in perfect equilibrium' },
    { id: 'vault-cracker', icon: '🔐', name: 'Vault Cracker', desc: 'Neutralized variables using inverse cards' },
    { id: 'hawker-hero', icon: '🍜', name: 'Hawker Stall Hero', desc: 'Solved real Singapore algebra orders' },
    { id: 'combo-5', icon: '🔥', name: 'Streak Prodigy', desc: 'Maintained consecutive correct answers' }
  ];

  return (
    <div className="glass-card summary-phase-card" style={{ textAlign: 'center', alignItems: 'center' }}>
      {/* Badge Hero Display */}
      <div style={{ margin: '4px 0' }}>
        <div
          style={{
            fontSize: '3.8rem',
            lineHeight: 1,
            filter: 'drop-shadow(0 0 25px rgba(251, 191, 36, 0.6))'
          }}
        >
          🏆
        </div>

        <div className="badge badge-gold" style={{ marginTop: '8px', fontSize: '1.1rem', padding: '6px 20px' }}>
          <span>🌟 {NARRATION.summary.badgeName}</span>
        </div>

        <h1 style={{ fontSize: '1.8rem', marginTop: '6px', marginBottom: '2px', fontFamily: 'var(--font-fun)', color: '#ffffff' }}>
          Lesson Completed!
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '580px', margin: '0 auto' }}>
          {NARRATION.summary.badgeDesc}
        </p>
      </div>

      {/* Performance Metrics Grid */}
      <div
        className="summary-stats-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          width: '100%',
          maxWidth: '740px',
          margin: '10px 0'
        }}
      >
        <div className="stats-pill" style={{ padding: '10px', textAlign: 'center', background: 'rgba(255,255,255,0.06)', borderRadius: '12px', border: '1px solid var(--purple-border)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Total XP</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--gold)', fontFamily: 'var(--font-mono)' }}>
            {state.xp}
          </div>
        </div>

        <div className="stats-pill" style={{ padding: '10px', textAlign: 'center', background: 'rgba(255,255,255,0.06)', borderRadius: '12px', border: '1px solid var(--purple-border)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Accuracy</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--neon-green-bright)', fontFamily: 'var(--font-mono)' }}>
            {accuracy}%
          </div>
        </div>

        <div className="stats-pill" style={{ padding: '10px', textAlign: 'center', background: 'rgba(255,255,255,0.06)', borderRadius: '12px', border: '1px solid var(--purple-border)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Best Streak</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--teal-bright)', fontFamily: 'var(--font-mono)' }}>
            {bestStreak}
          </div>
        </div>

        <div className="stats-pill" style={{ padding: '10px', textAlign: 'center', background: 'rgba(255,255,255,0.06)', borderRadius: '12px', border: '1px solid var(--purple-border)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Labs Done</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--coral-bright)', fontFamily: 'var(--font-mono)' }}>
            {stationsDone} / 3
          </div>
        </div>
      </div>

      {/* Badges Showcase Wall */}
      <div style={{ width: '100%', maxWidth: '740px', margin: '4px 0 10px' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>
          BADGES UNLOCKED
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
          {earnedBadges.map(b => {
            const hasBadge = (state.badges || []).includes(b.id) || stationsDone > 0;
            return (
              <div
                key={b.id}
                style={{
                  background: hasBadge ? 'rgba(30, 20, 68, 0.9)' : 'rgba(255,255,255,0.03)',
                  border: hasBadge ? '1px solid var(--gold)' : '1px dashed rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  padding: '8px 6px',
                  filter: hasBadge ? 'none' : 'grayscale(1) opacity(0.35)'
                }}
              >
                <div style={{ fontSize: '1.4rem' }}>{b.icon}</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: hasBadge ? '#fff' : 'var(--text-dim)' }}>
                  {b.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '14px', marginTop: '6px' }}>
        <button
          className="home-btn"
          onClick={onRestart}
          style={{ padding: '8px 20px', fontSize: '0.95rem' }}
        >
          <span>↺ Restart Lesson</span>
        </button>

        <button
          className="btn-next-phase"
          onClick={onPracticeMore}
          style={{ padding: '8px 24px', fontSize: '0.95rem' }}
        >
          <span>Practice More Questions ➔</span>
        </button>
      </div>
    </div>
  );
}
