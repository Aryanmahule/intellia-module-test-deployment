import React, { useState, useEffect } from 'react';
import { NARRATION } from '../../utils/equationsNarration.js';
import { narrate, sounds, stopNarration, unlockAudio } from '../../utils/audio.js';

export default function WonderPhase({ onNext, onAddXP }) {
  const [revealedCards, setRevealedCards] = useState({});
  const [activeCardId, setActiveCardId] = useState(null);

  useEffect(() => {
    unlockAudio();
    narrate(NARRATION.wonder.intro.text, NARRATION.wonder.intro.style);
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

    narrate(cardData.answer, cardData.style);
  };

  const handleReplayIntro = (e) => {
    e.stopPropagation();
    unlockAudio();
    sounds.pop();
    narrate(NARRATION.wonder.intro.text, NARRATION.wonder.intro.style);
  };

  const allRevealed = Object.keys(revealedCards).length >= 3;

  const items = [
    {
      id: 'equals',
      icon: '⚖️',
      question: NARRATION.wonder.equals.question,
      answer: NARRATION.wonder.equals.answer,
      badge: 'The Balance Scale',
      style: NARRATION.wonder.equals.style
    },
    {
      id: 'bothsides',
      icon: '🔄',
      question: NARRATION.wonder.bothsides.question,
      answer: NARRATION.wonder.bothsides.answer,
      badge: 'The Golden Rule',
      style: NARRATION.wonder.bothsides.style
    },
    {
      id: 'check',
      icon: '✅',
      question: NARRATION.wonder.check.question,
      answer: NARRATION.wonder.check.answer,
      badge: 'Proof & Verification',
      style: NARRATION.wonder.check.style
    }
  ];

  return (
    <div className="glass-card wonder-phase-card">
      {/* Header */}
      <div className="phase-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="badge badge-purple" style={{ marginBottom: '6px' }}>
            <span>🔮 Phase 01</span> <span>· Wonder & Curiosity</span>
          </div>
          <h2 style={{ fontSize: '2.1rem', color: 'var(--text-main)', fontFamily: 'var(--font-fun)' }}>
            Curious Questions About Balance & Equations
          </h2>
        </div>
        <div className="badge badge-gold">
          <span>XP Bonus: +15 each</span>
        </div>
      </div>

      {/* Mascot Speech */}
      <div className="mascot-container" style={{ margin: '10px 0' }}>
        <div className="mascot" onClick={handleReplayIntro} style={{ cursor: 'pointer' }} title="Click to listen">
          🦊
        </div>
        <div className="speech-bubble" style={{ cursor: 'pointer' }} onClick={handleReplayIntro}>
          <div className="speaker-name" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Ravi the Balance Keeper</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--teal-bright)' }}>🔊 Tap to hear</span>
          </div>
          <div className="speech-text">
            "Look at this balance scale. When both sides weigh the exact same, it sits perfectly level. That is what an equation is! Tap each mystery below to discover the golden rules."
          </div>
        </div>
      </div>

      {/* 3 Wonder Cards Grid */}
      <div className="wonder-grid">
        {items.map((item) => {
          const isRevealed = !!revealedCards[item.id];
          const isActive = activeCardId === item.id;

          return (
            <div
              key={item.id}
              className={`wonder-card ${isRevealed ? 'revealed' : ''} ${isActive ? 'active-card' : ''}`}
              onClick={() => handleCardClick(item.id, item)}
              role="button"
              tabIndex={0}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '2.2rem' }}>{item.icon}</span>
                <span className="badge badge-teal" style={{ fontSize: '0.9rem', padding: '4px 12px' }}>
                  {item.badge}
                </span>
              </div>

              <h3 style={{ fontSize: '1.35rem', color: 'var(--text-main)', marginTop: '8px' }}>
                {item.question}
              </h3>

              {isRevealed ? (
                <div className="wonder-revealed-text" style={{ marginTop: '8px', color: 'var(--text-muted)', fontSize: '1.15rem', lineHeight: 1.5 }}>
                  {item.answer}
                  <div style={{ marginTop: '8px', color: 'var(--teal-bright)', fontSize: '0.92rem', fontWeight: 700 }}>
                    🔊 Tap to replay voice
                  </div>
                </div>
              ) : (
                <div style={{ marginTop: 'auto', color: 'var(--gold-bright)', fontWeight: 700, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Tap to reveal & listen</span> <span>✨</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Phase Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
        <div style={{ color: 'var(--text-dim)', fontSize: '1.05rem', fontWeight: 600 }}>
          {Object.keys(revealedCards).length} of 3 mysteries explored
        </div>

        <button
          className={`btn ${allRevealed ? 'btn-gold' : 'btn-primary'}`}
          onClick={() => {
            sounds.click();
            onNext();
          }}
        >
          <span>Continue to Story 📐</span>
        </button>
      </div>
    </div>
  );
}
