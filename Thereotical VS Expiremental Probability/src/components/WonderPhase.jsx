import React, { useState, useEffect } from 'react';
import { WONDER_NARRATION } from '../utils/patternsNarration';
import { sounds, playNarration } from '../utils/audio';

export default function WonderPhase({ onNextPhase, onAddXp }) {
  const [revealed, setRevealed] = useState({});

  useEffect(() => {
    // Play intro narration
    playNarration(WONDER_NARRATION.intro.text, WONDER_NARRATION.intro.style);
  }, []);

  const cards = [
    {
      id: 'hundredth',
      icon: '🔮',
      badge: 'MYSTERY 01',
      question: 'How could you find the 100th shape without drawing all 100?',
      answer: 'Find the rule! Once you know how the pattern grows (like adding 3 every time), you can jump straight to position 100 using algebra: 3(100) + 1 = 301!',
      narration: WONDER_NARRATION.hundredth
    },
    {
      id: 'lessthan',
      icon: '⚠️',
      badge: 'TRAP ALERT 02',
      question: 'Is "5 less than x" the same as "5 − x"?',
      answer: 'No! "5 less than x" means you start with x and subtract 5, so it is (x − 5). The order in words is reversed in symbols!',
      narration: WONDER_NARRATION.lessthan
    },
    {
      id: 'letters',
      icon: '🔤',
      badge: 'CODEBREAKER 03',
      question: 'Can everyday sentences be turned into maths expressions?',
      answer: 'Yes! A letter stands for any unknown number. Words like "twice", "sum", "divided equally" become (× 2), (+), (÷).',
      narration: WONDER_NARRATION.letters
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
          <p>Tap each mystery question to crack open the secrets of patterns and expressions.</p>
        </div>
        <div className="mascot-speaker-badge">
          <span className="avatar">🦊</span>
          <span className="speaker-name">Detective Archie</span>
        </div>
      </div>

      {/* Wonder Grid */}
      <div className="wonder-grid">
        {cards.map(card => {
          const isRev = !!revealed[card.id];
          return (
            <div
              key={card.id}
              className={`wonder-card ${isRev ? 'revealed' : ''}`}
              onClick={() => handleCardClick(card)}
            >
              <div className="wonder-card-top">
                <span className="wonder-badge">{card.badge}</span>
                <span className="wonder-icon">{card.icon}</span>
              </div>

              <div className="wonder-question-text">{card.question}</div>

              {isRev ? (
                <div className="wonder-reveal-box">
                  <div className="wonder-reveal-text">{card.answer}</div>
                </div>
              ) : (
                <div className="wonder-hint-cta">
                  <span>💡 Click to uncover the secret</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom action row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem', fontWeight: 600 }}>
          {allRevealed ? '🎉 All 3 mysteries explored (+60 XP)!' : '👆 Click cards to reveal and listen'}
        </div>
        <button
          className="btn-gold"
          onClick={() => {
            sounds.correct();
            onNextPhase();
          }}
        >
          <span>Continue to Story</span>
          <span>➔</span>
        </button>
      </div>
    </div>
  );
}
