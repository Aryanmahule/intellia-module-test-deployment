import React, { useState, useEffect } from 'react';
import { WONDER_NARRATION } from '../../utils/bracketsNarration.js';
import { narrate, sounds, unlockAudio } from '../../utils/audio.js';

export default function WonderPhase({ onNext, onAddXP }) {
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [hasBrackets, setHasBrackets] = useState(false);
  const [revealedQuestions, setRevealedQuestions] = useState([]);

  useEffect(() => {
    // Play intro narration
    narrate(WONDER_NARRATION.intro.text, WONDER_NARRATION.intro.style);
  }, []);

  const handleReveal = (qKey) => {
    unlockAudio();
    sounds.pop();

    if (!revealedQuestions.includes(qKey)) {
      setRevealedQuestions(prev => [...prev, qKey]);
      onAddXP?.(15);
    }

    setActiveQuestion(qKey);
    const item = WONDER_NARRATION[qKey];
    if (item && item.answer) {
      narrate(item.answer, item.style);
    }
  };

  const handleToggleBrackets = () => {
    unlockAudio();
    sounds.pop();
    setHasBrackets(prev => !prev);
    onAddXP?.(10);
  };

  const canContinue = revealedQuestions.length >= 2;

  return (
    <div className="phase-container wonder-screen">
      <div className="phase-header-center">
        <span className="phase-badge">Phase 01 • Wonder & Curiosity</span>
        <h2 className="phase-title">The Magic Power of Brackets</h2>
        <p className="phase-subtitle">
          Brackets change the order of operations! Flip the toggle below to witness the transformation.
        </p>
      </div>

      <div className="wonder-layout-grid">
        {/* Left: Interactive Equation Transformer */}
        <div className="wonder-interactive-card glass-panel">
          <div className="card-badge-row">
            <span className="layer-status-tag">
              {hasBrackets ? '🧩 With Brackets: (2 + 3) × 4 = 20' : '⚡ No Brackets: 2 + 3 × 4 = 14'}
            </span>
            <span className="tap-hint">Tap toggle to switch!</span>
          </div>

          <div
            className="mystery-parcel-container"
            onClick={handleToggleBrackets}
            role="button"
            tabIndex={0}
            style={{ cursor: 'pointer', padding: '16px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
          >
            <div style={{
              background: 'rgba(20, 8, 40, 0.9)',
              border: `2px solid ${hasBrackets ? '#ffb800' : '#a855f7'}`,
              borderRadius: '20px',
              padding: '24px 32px',
              textAlign: 'center',
              boxShadow: hasBrackets ? '0 0 30px rgba(255, 184, 0, 0.4)' : '0 0 25px rgba(168, 85, 247, 0.3)',
              transition: 'all 0.3s ease',
              width: '100%',
              maxWidth: '340px'
            }}>
              <div style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '8px', fontWeight: 600 }}>
                {hasBrackets ? 'Brackets force addition FIRST:' : 'Standard Order (Multiplication first):'}
              </div>

              <div style={{
                fontFamily: "'Space Grotesk', monospace",
                fontSize: '2.2rem',
                fontWeight: 800,
                color: hasBrackets ? '#fde047' : '#ffffff',
                marginBottom: '12px'
              }}>
                {hasBrackets ? '(2 + 3) × 4' : '2 + 3 × 4'}
              </div>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: hasBrackets ? 'rgba(255, 184, 0, 0.15)' : 'rgba(168, 85, 247, 0.15)',
                border: `1px solid ${hasBrackets ? '#ffb800' : '#a855f7'}`,
                padding: '6px 16px',
                borderRadius: '999px',
                fontSize: '1.2rem',
                fontWeight: 800,
                color: hasBrackets ? '#ffb800' : '#c084fc'
              }}>
                <span>Answer = </span>
                <span style={{ fontSize: '1.5rem', fontWeight: 900 }}>{hasBrackets ? '20' : '14'}</span>
              </div>

              <div style={{ marginTop: '14px', fontSize: '0.85rem', color: '#94a3b8' }}>
                {hasBrackets 
                  ? 'First: (2 + 3) = 5. Then: 5 × 4 = 20 ✨' 
                  : 'First: 3 × 4 = 12. Then: 2 + 12 = 14 ⚡'}
              </div>
            </div>
          </div>

          <div className="parcel-actions-row">
            <button
              className="parcel-step-btn"
              onClick={handleToggleBrackets}
            >
              {hasBrackets ? '⚡ Remove Brackets' : '🧩 Insert Brackets (2 + 3)'}
            </button>
          </div>
        </div>

        {/* Right: 3 Big Wonder Questions */}
        <div className="wonder-questions-column">
          {/* Question 1: Order */}
          <div
            className={`wonder-card glass-panel ${activeQuestion === 'order' ? 'selected' : ''} ${revealedQuestions.includes('order') ? 'revealed' : ''}`}
            onClick={() => handleReveal('order')}
          >
            <div className="wonder-card-top">
              <span className="wonder-q-num">Q1</span>
              <h3 className="wonder-q-title">{WONDER_NARRATION.order.question}</h3>
              <span className="reveal-badge">
                {revealedQuestions.includes('order') ? '✓ Answered' : 'Tap to reveal'}
              </span>
            </div>
            {revealedQuestions.includes('order') && (
              <div className="wonder-card-body">
                <p className="wonder-answer-text">
                  🎯 <strong>Brackets overrule standard priority!</strong> Without brackets, multiplication must happen first ($2 + 12 = 14$). With brackets, they force the addition inside to happen first: $(5) \times 4 = 20$. Brackets group quantities into single packages!
                </p>
              </div>
            )}
          </div>

          {/* Question 2: Distributive Law */}
          <div
            className={`wonder-card glass-panel ${activeQuestion === 'distributive' ? 'selected' : ''} ${revealedQuestions.includes('distributive') ? 'revealed' : ''}`}
            onClick={() => handleReveal('distributive')}
          >
            <div className="wonder-card-top">
              <span className="wonder-q-num">Q2</span>
              <h3 className="wonder-q-title">{WONDER_NARRATION.distributive.question}</h3>
              <span className="reveal-badge">
                {revealedQuestions.includes('distributive') ? '✓ Answered' : 'Tap to reveal'}
              </span>
            </div>
            {revealedQuestions.includes('distributive') && (
              <div className="wonder-card-body">
                <p className="wonder-answer-text">
                  🚪 <strong>Yes, every single term!</strong> The outside multiplier knocks on every door inside the brackets. $3(x + 4)$ means $3 \times x + 3 \times 4 = 3x + 12$. Forgetting to multiply the second term ($3x + 4$) is the most common mistake in algebra!
                </p>
              </div>
            )}
          </div>

          {/* Question 3: Two Paths */}
          <div
            className={`wonder-card glass-panel ${activeQuestion === 'twopaths' ? 'selected' : ''} ${revealedQuestions.includes('twopaths') ? 'revealed' : ''}`}
            onClick={() => handleReveal('twopaths')}
          >
            <div className="wonder-card-top">
              <span className="wonder-q-num">Q3</span>
              <h3 className="wonder-q-title">{WONDER_NARRATION.twopaths.question}</h3>
              <span className="reveal-badge">
                {revealedQuestions.includes('twopaths') ? '✓ Answered' : 'Tap to reveal'}
              </span>
            </div>
            {revealedQuestions.includes('twopaths') && (
              <div className="wonder-card-body">
                <p className="wonder-answer-text">
                  🛤️ <strong>Both methods work!</strong> Path 1 (Expand): $4x + 8 = 24 \implies 4x = 16 \implies x = 4$. Path 2 (Divide first): $x + 2 = 6 \implies x = 4$. If the outside factor divides cleanly without fractions, dividing first is a lightning-fast shortcut!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Nav Bar */}
      <div className="phase-bottom-nav">
        <span className="revealed-count-text">
          {revealedQuestions.length} of 3 mysteries explored
        </span>
        <button
          className={`action-btn-primary ${canContinue ? 'pulse-ready' : 'disabled'}`}
          onClick={() => {
            unlockAudio();
            sounds.ding();
            onNext();
          }}
          disabled={!canContinue}
        >
          <span>Continue to Story 📖</span>
        </button>
      </div>
    </div>
  );
}
