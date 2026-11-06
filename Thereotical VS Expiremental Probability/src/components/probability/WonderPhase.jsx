/* =========================================================
   WONDER PHASE COMPONENT
   Spark curiosity with 3 key questions:
   1. 10 Coin flips: exactly 5 heads?
   2. What does "fair" really mean?
   3. Theoretical vs Experimental: Which is more trustworthy?
   ========================================================= */

import React, { useState, useEffect } from 'react';
import { WONDER_NARRATION } from '../../utils/probabilityNarration';
import { sounds, playNarration } from '../../utils/audio';

export default function WonderPhase({ onNextPhase, onAddXp }) {
  const [revealed, setRevealed] = useState({});

  useEffect(() => {
    playNarration(WONDER_NARRATION.intro.text, WONDER_NARRATION.intro.style);
  }, []);

  const cards = [
    {
      id: 'coinFlip',
      icon: '🪙',
      badge: 'MYSTERY 01',
      question: 'If you flip a fair coin 10 times, will you always get exactly 5 heads?',
      answer: 'Not always! Even with a perfectly balanced coin, getting 4 heads or 7 heads in 10 flips is completely normal. 10 flips is a small sample size where chance fluctuates naturally!',
      narration: WONDER_NARRATION.coinFlip
    },
    {
      id: 'fairMeaning',
      icon: '🎲',
      badge: 'DEEP DIVE 02',
      question: 'What does "fair" really mean for a dice or a spinner?',
      answer: 'A fair device guarantees every outcome has an identical theoretical probability of occurring. No face is weighted, shaved, or favored over another!',
      narration: WONDER_NARRATION.fairMeaning
    },
    {
      id: 'trustworthy',
      icon: '⚖️',
      badge: 'PROBABILITY PARADOX 03',
      question: 'Which is more trustworthy: what SHOULD happen, or what ACTUALLY happened?',
      answer: 'Both are essential! Theoretical probability defines the mathematical rule of the universe, while experimental probability shows real-world data. When trials grow large, they meet!',
      narration: WONDER_NARRATION.trustworthy
    }
  ];

  const handleCardClick = (card) => {
    sounds.pop();
    if (!revealed[card.id]) {
      setRevealed(prev => ({ ...prev, [card.id]: true }));
      onAddXp(20);
    }
    playNarration(card.narration.text, card.narration.style);
  };

  const allRevealed = cards.every(c => revealed[c.id]);

  return (
    <div className="phase-container">
      {/* Header bar */}
      <div className="phase-header-bar">
        <div className="phase-title-group">
          <h2><span>🔮</span> Phase 01: Wonder & Curiosity</h2>
          <p>Tap each mystery question to unlock the surprising laws of chance and reality.</p>
        </div>
        <div className="mascot-speaker-badge">
          <span className="avatar">🦊</span>
          <span className="speaker-name">Archie & Maya</span>
        </div>
      </div>

      {/* 3 Question Cards Grid */}
      <div className="wonder-cards-grid">
        {cards.map((card) => {
          const isRevealed = !!revealed[card.id];

          return (
            <div
              key={card.id}
              className={`wonder-card ${isRevealed ? 'revealed' : ''}`}
              onClick={() => handleCardClick(card)}
              role="button"
              tabIndex={0}
            >
              <div className="wonder-card-top">
                <span className="wonder-card-badge">{card.badge}</span>
                <span className="wonder-card-icon">{card.icon}</span>
              </div>

              <h3 className="wonder-card-question">
                {card.question}
              </h3>

              <div className="wonder-card-action-hint">
                {isRevealed ? 'Revealed' : 'Tap to reveal secret →'}
              </div>

              {isRevealed && (
                <div className="wonder-card-answer-box">
                  <div className="answer-heading">
                    <span>💡 The Truth:</span>
                  </div>
                  <p>{card.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Action Bar */}
      <div className="phase-bottom-bar">
        <div style={{ color: 'var(--text-dim)', fontSize: '0.95rem' }}>
          {allRevealed ? '✨ All 3 wonder mysteries solved! Ready for the story.' : '👉 Tap all 3 mystery cards to continue.'}
        </div>

        <button
          className="btn-gold"
          onClick={() => {
            sounds.fanfare();
            onNextPhase();
          }}
          disabled={!allRevealed}
          style={{ opacity: allRevealed ? 1 : 0.45 }}
        >
          <span>Continue to Story Chapter →</span>
        </button>
      </div>
    </div>
  );
}
