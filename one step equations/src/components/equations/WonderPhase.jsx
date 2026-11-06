import React, { useState, useEffect } from 'react';
import { NARRATION } from '../../utils/equationsNarration.js';
import { narrate, sounds, stopNarration, unlockAudio } from '../../utils/audio.js';

export default function WonderPhase({ onNext, onAddXP }) {
  const [revealedCards, setRevealedCards] = useState({});
  const [activeCardId, setActiveCardId] = useState(null);

  // Interactive See-Saw / Balance State for Wonder
  const [leftWeight, setLeftWeight] = useState(2);
  const [rightWeight, setRightWeight] = useState(2);

  useEffect(() => {
    unlockAudio();
    narrate('wonder_intro', 'statement');
    return () => {
      stopNarration();
    };
  }, []);

  const handleCardClick = (id, cardData) => {
    unlockAudio();
    sounds.click();
    const isNew = !revealedCards[id];

    setRevealedCards(prev => ({ ...prev, [id]: true }));
    setActiveCardId(id);

    if (isNew) {
      sounds.ding();
      onAddXP(15);
    }

    narrate(cardData.id, cardData.style);
  };

  const handleReplayIntro = (e) => {
    e.stopPropagation();
    unlockAudio();
    sounds.pop();
    narrate('wonder_intro', 'statement');
  };

  // See-saw physics
  const tiltAngle = Math.max(-14, Math.min(14, (rightWeight - leftWeight) * 4));
  const isLevel = leftWeight === rightWeight;

  const handleAddLeft = () => {
    unlockAudio();
    sounds.pop();
    setLeftWeight(prev => Math.min(prev + 1, 8));
  };

  const handleAddRight = () => {
    unlockAudio();
    sounds.pop();
    setRightWeight(prev => Math.min(prev + 1, 8));
  };

  const handleResetScale = () => {
    sounds.click();
    setLeftWeight(2);
    setRightWeight(2);
  };

  const allRevealed = Object.keys(revealedCards).length >= 3;

  const items = [
    {
      id: 'wonder_equals',
      icon: '⚖️',
      question: "Why does a balance scale tip?",
      answer: "When one side is heavier, the scale tips. In mathematics, an equals sign says both sides are perfectly balanced. If they don't match, it isn't equal!",
      badge: 'The Balance Concept',
      style: 'statement'
    },
    {
      id: 'wonder_bothsides',
      icon: '⚡',
      question: "What if I add or remove weight from only one side?",
      answer: "The balance is broken! To keep the scale level, whatever operation you do to one side, you must do the exact same thing to the other side.",
      badge: 'The Golden Rule',
      style: 'emphasis'
    },
    {
      id: 'wonder_check',
      icon: '🔍',
      question: "How could Archie & Maya find the mystery weight x?",
      answer: "By removing known weights equally from both sides until the mystery box x sits all by itself on one pan!",
      badge: 'Isolating the Unknown',
      style: 'thinking'
    }
  ];

  return (
    <div className="glass-card wonder-phase-card">
      {/* Header */}
      <div className="phase-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div>
          <div className="badge badge-purple" style={{ marginBottom: '4px' }}>
            <span>🔮 Phase 01</span> <span>· Wonder & Curiosity</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-fun)', fontSize: '1.45rem', fontWeight: 800 }}>
            The Secret of the Balance Scale
          </h2>
        </div>

        <button
          className="audio-replay-pill"
          onClick={handleReplayIntro}
          title="Replay Archie's introduction"
        >
          <span>🔊 Archie says: "Can you keep it balanced?"</span>
        </button>
      </div>

      {/* Main Grid: Interactive See-Saw on Left, 3 Cards on Right */}
      <div className="wonder-split-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '16px', alignItems: 'center' }}>
        {/* Left: Interactive Mini Balance / See-saw */}
        <div className="wonder-scale-box" style={{ background: 'rgba(15, 8, 36, 0.75)', border: '1.5px solid var(--purple-border)', borderRadius: '16px', padding: '12px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--gold)' }}>
              {isLevel ? '⚖️ IN EQUILIBRIUM (EQUAL)' : '⚠️ UNBALANCED (TILTED)'}
            </span>
            <button onClick={handleResetScale} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '0.8rem' }}>
              ↺ Reset
            </button>
          </div>

          {/* SVG Mini See-Saw */}
          <svg viewBox="0 0 320 150" style={{ width: '100%', height: '130px', overflow: 'visible' }}>
            {/* Center Fulcrum */}
            <polygon points="160,85 145,135 175,135" fill="url(#fulcrumGrad)" stroke="#f59e0b" strokeWidth="2" />
            <circle cx="160" cy="85" r="5" fill="#f59e0b" />
            
            {/* Base platform */}
            <rect x="110" y="135" width="100" height="6" rx="3" fill="#6d28d9" />

            <defs>
              <linearGradient id="fulcrumGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
            </defs>

            {/* Rotating Beam */}
            <g transform={`rotate(${tiltAngle}, 160, 85)`} style={{ transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
              {/* Main crossbar */}
              <rect x="40" y="82" width="240" height="6" rx="3" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
              
              {/* Left Pan Attachment */}
              <line x1="60" y1="88" x2="60" y2="110" stroke="#94a3b8" strokeWidth="1.5" />
              <ellipse cx="60" cy="110" rx="35" ry="6" fill="#334155" stroke="#06b6d4" strokeWidth="2" />
              {/* Left Blocks */}
              <text x="60" y="104" textAnchor="middle" fill="#06b6d4" fontSize="13" fontWeight="bold">
                {leftWeight} weights
              </text>

              {/* Right Pan Attachment */}
              <line x1="260" y1="88" x2="260" y2="110" stroke="#94a3b8" strokeWidth="1.5" />
              <ellipse cx="260" cy="110" rx="35" ry="6" fill="#334155" stroke="#fbbf24" strokeWidth="2" />
              {/* Right Blocks */}
              <text x="260" y="104" textAnchor="middle" fill="#fbbf24" fontSize="13" fontWeight="bold">
                {rightWeight} weights
              </text>
            </g>
          </svg>

          {/* Interactive controls */}
          <div style={{ display: 'flex', justifyContent: 'space-around', gap: '8px', marginTop: '6px' }}>
            <button
              className="option-btn"
              onClick={handleAddLeft}
              style={{ flex: 1, padding: '6px 10px', fontSize: '0.85rem' }}
            >
              +1 Left Pan ({leftWeight})
            </button>
            <button
              className="option-btn"
              onClick={handleAddRight}
              style={{ flex: 1, padding: '6px 10px', fontSize: '0.85rem', borderColor: 'var(--gold)' }}
            >
              +1 Right Pan ({rightWeight})
            </button>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '6px' }}>
            {isLevel
              ? "✨ Both sides have equal weight. The scale is balanced!"
              : "⚠️ One side has more weight. The scale tilts!"}
          </p>
        </div>

        {/* Right: 3 Discovery Cards */}
        <div className="wonder-cards-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {items.map((item) => {
            const isRevealed = revealedCards[item.id];
            const isActive = activeCardId === item.id;

            return (
              <div
                key={item.id}
                className={`wonder-card ${isRevealed ? 'revealed' : ''} ${isActive ? 'active' : ''}`}
                onClick={() => handleCardClick(item.id, item)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: isActive ? '1.5px solid var(--gold)' : '1px solid var(--purple-border)',
                  background: isRevealed ? 'rgba(30, 20, 68, 0.95)' : 'rgba(20, 12, 48, 0.8)',
                  cursor: 'pointer',
                  transition: 'all 0.22s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.4rem' }}>{item.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--teal-bright)', fontWeight: 800 }}>
                      {item.badge}
                    </div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff' }}>
                      {item.question}
                    </div>
                  </div>
                  <span style={{ color: 'var(--gold)', fontSize: '0.85rem' }}>
                    {isRevealed ? '▲' : '▼ Tap'}
                  </span>
                </div>

                {isRevealed && (
                  <p style={{ marginTop: '6px', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.35, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '6px' }}>
                    {item.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer / Progression */}
      <div className="phase-footer-row" style={{ marginTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
          {allRevealed
            ? "🌟 Great exploration! You unlocked all 3 wonder clues."
            : "Tap cards and experiment with the scale to continue."}
        </span>

        <button
          className="btn-next-phase"
          onClick={() => {
            sounds.ding();
            onNext('story');
          }}
        >
          <span>Next: Story ➔</span>
        </button>
      </div>
    </div>
  );
}
