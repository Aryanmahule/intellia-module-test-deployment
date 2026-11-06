import React, { useState, useEffect } from 'react';
import { NARRATION } from '../../utils/twoStepNarration.js';
import { narrate, sounds, unlockAudio } from '../../utils/audio.js';

export default function WonderPhase({ onNext, onAddXP }) {
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [unwrappedLayer, setUnwrappedLayer] = useState(0); // 0 = sealed, 1 = layer 1 off, 2 = fully unwrapped
  const [revealedQuestions, setRevealedQuestions] = useState([]);

  useEffect(() => {
    // Play intro narration
    const introText = NARRATION.wonder.intro.text;
    narrate(introText, NARRATION.wonder.intro.style);
  }, []);

  const handleReveal = (qKey) => {
    unlockAudio();
    sounds.pop();

    if (!revealedQuestions.includes(qKey)) {
      setRevealedQuestions(prev => [...prev, qKey]);
      onAddXP?.(15);
    }

    setActiveQuestion(qKey);
    const item = NARRATION.wonder[qKey];
    if (item && item.answer) {
      narrate(item.answer, item.style);
    }
  };

  const handleTapParcel = () => {
    unlockAudio();
    sounds.pop();
    if (unwrappedLayer === 0) {
      setUnwrappedLayer(1);
      onAddXP?.(10);
    } else if (unwrappedLayer === 1) {
      setUnwrappedLayer(2);
      sounds.ding();
      onAddXP?.(20);
    } else {
      setUnwrappedLayer(0);
    }
  };

  const canContinue = revealedQuestions.length >= 2;

  return (
    <div className="phase-container wonder-screen">
      <div className="phase-header-center">
        <span className="phase-badge">Phase 01 • Wonder & Curiosity</span>
        <h2 className="phase-title">Unwrapping Ravi's Mystery Parcel</h2>
        <p className="phase-subtitle">
          Two things happened to mystery number x. Tap the parcel to peel each layer!
        </p>
      </div>

      <div className="wonder-layout-grid">
        {/* Left: Interactive 2-Layer Parcel Visual */}
        <div className="wonder-interactive-card glass-panel">
          <div className="card-badge-row">
            <span className="layer-status-tag">
              {unwrappedLayer === 0 && '🎁 Fully Wrapped: 2x + 3 = 11'}
              {unwrappedLayer === 1 && '✂️ Layer 1 Removed (−3): 2x = 8'}
              {unwrappedLayer === 2 && '🎉 Unwrapped (÷2): x = 4!'}
            </span>
            <span className="tap-hint">Tap parcel to unwrap!</span>
          </div>

          <div
            className={`mystery-parcel-container layer-${unwrappedLayer}`}
            onClick={handleTapParcel}
            role="button"
            tabIndex={0}
            aria-label="Tap to unwrap parcel layers"
          >
            {/* SVG Visual Parcel */}
            <svg viewBox="0 0 320 220" className="parcel-svg">
              <defs>
                <linearGradient id="boxGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#4c1d95" />
                </linearGradient>
                <linearGradient id="innerBoxGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
                <filter id="goldGlow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Mystery Core Box */}
              <rect
                x="80"
                y="55"
                width="160"
                height="120"
                rx="18"
                fill="url(#innerBoxGrad)"
                stroke="#fde047"
                strokeWidth="3"
                filter="url(#goldGlow)"
              />
              <text x="160" y="115" textAnchor="middle" fill="#ffffff" fontSize="28" fontWeight="800">
                {unwrappedLayer === 2 ? 'x = 4' : 'Mystery x'}
              </text>
              <text x="160" y="145" textAnchor="middle" fill="#fef08a" fontSize="14" fontWeight="600">
                {unwrappedLayer === 2 ? 'Check: 2(4)+3=11 ✓' : 'Hidden Core'}
              </text>

              {/* Layer 2 (Outer-inner: Multiplied by 2) */}
              {unwrappedLayer < 2 && (
                <g className="parcel-layer layer-inner-glow">
                  <rect
                    x="60"
                    y="40"
                    width="200"
                    height="150"
                    rx="20"
                    fill="#3b82f6"
                    fillOpacity="0.82"
                    stroke="#93c5fd"
                    strokeWidth="3"
                    strokeDasharray="6 4"
                  />
                  <text x="160" y="70" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="700">
                    Layer 2: [ × 2 ]
                  </text>
                </g>
              )}

              {/* Layer 1 (Outermost: Added 3) */}
              {unwrappedLayer === 0 && (
                <g className="parcel-layer layer-outermost">
                  <rect
                    x="40"
                    y="25"
                    width="240"
                    height="180"
                    rx="22"
                    fill="#8b5cf6"
                    fillOpacity="0.88"
                    stroke="#c4b5fd"
                    strokeWidth="4"
                  />
                  {/* Decorative Ribbon */}
                  <rect x="145" y="25" width="30" height="180" fill="#facc15" fillOpacity="0.9" />
                  <rect x="40" y="100" width="240" height="30" fill="#facc15" fillOpacity="0.9" />
                  <circle cx="160" cy="115" r="28" fill="#ef4444" stroke="#ffffff" strokeWidth="3" />
                  <text x="160" y="122" textAnchor="middle" fill="#ffffff" fontSize="18" fontWeight="800">
                    + 3
                  </text>
                  <text x="160" y="55" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="700">
                    Layer 1: [ + 3 ]
                  </text>
                </g>
              )}
            </svg>
          </div>

          <div className="parcel-actions-row">
            <button
              className="parcel-step-btn"
              onClick={handleTapParcel}
            >
              {unwrappedLayer === 0 && '✂️ Undo +3 (Subtract 3)'}
              {unwrappedLayer === 1 && '✂️ Undo ×2 (Divide by 2)'}
              {unwrappedLayer === 2 && '🔄 Rewrap Parcel'}
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
              <h3 className="wonder-q-title">{NARRATION.wonder.order.question}</h3>
              <span className="reveal-badge">
                {revealedQuestions.includes('order') ? '✓ Answered' : 'Tap to reveal'}
              </span>
            </div>
            {revealedQuestions.includes('order') && (
              <div className="wonder-card-body">
                <p className="wonder-answer-text">
                  👞 <strong>Think of socks and shoes!</strong> Socks go on first, shoes go on last. To take them off, shoes come off first!
                  Always undo the <em>last</em> operation done (adding or subtracting) before undoing multiplying or dividing.
                </p>
              </div>
            )}
          </div>

          {/* Question 2: Dividing */}
          <div
            className={`wonder-card glass-panel ${activeQuestion === 'dividing' ? 'selected' : ''} ${revealedQuestions.includes('dividing') ? 'revealed' : ''}`}
            onClick={() => handleReveal('dividing')}
          >
            <div className="wonder-card-top">
              <span className="wonder-q-num">Q2</span>
              <h3 className="wonder-q-title">{NARRATION.wonder.dividing.question}</h3>
              <span className="reveal-badge">
                {revealedQuestions.includes('dividing') ? '✓ Answered' : 'Tap to reveal'}
              </span>
            </div>
            {revealedQuestions.includes('dividing') && (
              <div className="wonder-card-body">
                <p className="wonder-answer-text">
                  ⚖️ <strong>Never!</strong> An equation is like a balanced scale. Whatever operation you apply, you must apply to <em>both sides</em> and to every term to keep the balance level.
                </p>
              </div>
            )}
          </div>

          {/* Question 3: Check */}
          <div
            className={`wonder-card glass-panel ${activeQuestion === 'check' ? 'selected' : ''} ${revealedQuestions.includes('check') ? 'revealed' : ''}`}
            onClick={() => handleReveal('check')}
          >
            <div className="wonder-card-top">
              <span className="wonder-q-num">Q3</span>
              <h3 className="wonder-q-title">{NARRATION.wonder.check.question}</h3>
              <span className="reveal-badge">
                {revealedQuestions.includes('check') ? '✓ Answered' : 'Tap to reveal'}
              </span>
            </div>
            {revealedQuestions.includes('check') && (
              <div className="wonder-card-body">
                <p className="wonder-answer-text">
                  🔍 <strong>Substitute back!</strong> Replace the letter with your number. If 2(4) + 3 = 11, then left equals right and you are 100% certain!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Floating Bar */}
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
