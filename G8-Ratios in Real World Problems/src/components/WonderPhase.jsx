import React, { useState, useEffect } from 'react';
import { WONDER_QUESTIONS } from '../utils/ratiosNarration';
import { sounds, playNarration } from '../utils/audio';

export default function WonderPhase({ onNextPhase, onAddXp }) {
  const [revealedIds, setRevealedIds] = useState([]);
  const [activeQuestionId, setActiveQuestionId] = useState(null);

  useEffect(() => {
    playNarration(
      "Welcome to Ravi's kitchen! A good recipe needs the right ratio of ingredients. Get it wrong, and the whole batch tastes off!",
      'statement'
    );
  }, []);

  const handleReveal = (q) => {
    sounds.pop();
    if (!revealedIds.includes(q.id)) {
      setRevealedIds(prev => [...prev, q.id]);
      onAddXp(20);
    }
    setActiveQuestionId(q.id);
    playNarration(q.spokenAnswer, 'thinking');
  };

  const allRevealed = WONDER_QUESTIONS.every(q => revealedIds.includes(q.id));

  return (
    <div className="wonder-phase-container">
      {/* Phase Header */}
      <div className="wonder-header-box">
        <div className="curriculum-badge-sm">
          <span>🔮 Wonder Phase</span>
        </div>
        <h2 className="wonder-main-heading">
          Puzzles in Ravi's Kitchen
        </h2>
        <p className="wonder-sub-desc">
          Click each question card to uncover how ratios control recipes, mixtures, and scaling!
        </p>
      </div>

      {/* 3 Question Cards Grid */}
      <div className="wonder-cards-grid">
        {WONDER_QUESTIONS.map((q) => {
          const isRevealed = revealedIds.includes(q.id);
          const isActive = activeQuestionId === q.id;

          return (
            <div
              key={q.id}
              className={`wonder-card ${isRevealed ? 'revealed' : ''} ${isActive ? 'active-glow' : ''}`}
              onClick={() => handleReveal(q)}
            >
              <div className="wonder-card-top">
                <span className="wonder-icon">{q.icon}</span>
                <span className="wonder-status-chip">
                  {isRevealed ? 'Revealed ✓' : 'Click to Reveal'}
                </span>
              </div>

              <h3 className="wonder-card-question">
                {q.question}
              </h3>

              {isRevealed ? (
                <div className="wonder-revealed-content">
                  <div className="wonder-answer-bubble">
                    <p className="wonder-answer-text">{q.spokenAnswer}</p>
                  </div>
                  <div className="wonder-capsule-badge">
                    <span>💡 {q.capsule}</span>
                  </div>
                </div>
              ) : (
                <div className="wonder-hidden-hint">
                  <span>Tap to reveal Ravi's answer ➔</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom CTA to advance to Story */}
      <div className="wonder-bottom-bar">
        <button
          className="btn-gold"
          onClick={() => {
            sounds.fanfare();
            onNextPhase();
          }}
          disabled={!allRevealed}
          style={{
            opacity: allRevealed ? 1 : 0.45,
            cursor: allRevealed ? 'pointer' : 'not-allowed',
            padding: '14px 36px'
          }}
        >
          <span>{allRevealed ? 'Continue to Story ➔' : `Explore All Cards (${revealedIds.length}/3)`}</span>
        </button>
      </div>
    </div>
  );
}
