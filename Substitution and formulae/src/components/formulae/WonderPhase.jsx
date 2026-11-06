import React, { useState, useEffect } from 'react';
import { NARRATION } from '../../utils/formulaeNarration.js';
import { narrate, sounds, stopNarration, unlockAudio } from '../../utils/audio.js';

export default function WonderPhase({ onNext, onAddXP }) {
  const [revealedCards, setRevealedCards] = useState({});
  const [activeCardId, setActiveCardId] = useState(null);

  useEffect(() => {
    unlockAudio();
    // Initial wonder narration on mount
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
      id: 'meter',
      icon: '🚕',
      question: NARRATION.wonder.meter.question,
      answer: NARRATION.wonder.meter.answer,
      badge: 'Real-World Rule',
      style: NARRATION.wonder.meter.style
    },
    {
      id: 'letters',
      icon: '✖️',
      question: NARRATION.wonder.letters.question,
      answer: NARRATION.wonder.letters.answer,
      badge: 'Algebra Secret',
      style: NARRATION.wonder.letters.style
    },
    {
      id: 'same',
      icon: '✨',
      question: NARRATION.wonder.same.question,
      answer: NARRATION.wonder.same.answer,
      badge: 'Universal Power',
      style: NARRATION.wonder.same.style
    }
  ];

  return (
    <div className="glass-card wonder-phase-card">
      {/* Header */}
      <div className="phase-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="badge badge-purple" style={{ marginBottom: '6px' }}>
            <span>🔮 Phase 01</span> <span>• Wonder & Curiosity</span>
          </div>
          <h2 style={{ fontSize: '2.2rem', color: 'var(--text-main)', fontFamily: 'var(--font-fun)' }}>
            Curious Questions About Rules & Numbers
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
            <span>Ravi's Wonder Prompt</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--teal-bright)' }}>🔊 Tap to hear</span>
          </div>
          <div className="speech-text">
            "Look around Singapore! A taxi meter, an EZ-Link fare gate, and the weather forecast all run on hidden algebraic rules. Tap each mystery below to reveal its secret!"
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
                  <span>Tap to reveal & listen</span> <span>➔</span>
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
