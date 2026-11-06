import React, { useState, useEffect } from 'react';
import { NARRATION } from '../../utils/fractionsNarration.js';
import { narrate, sounds, unlockAudio } from '../../utils/audio.js';

export default function WonderPhase({ onNext, onAddXP }) {
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [sliceStage, setSliceStage] = useState(0); // 0 = 1/2, 1 = 2/4, 2 = 4/8
  const [revealedQuestions, setRevealedQuestions] = useState([]);

  useEffect(() => {
    const introText = NARRATION.wonder.intro.spoken || NARRATION.wonder.intro.text;
    narrate(introText, NARRATION.wonder.intro.style || 'statement');
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
      narrate(item.spoken || item.answer, item.style || 'statement');
    }
  };

  const handleToggleSlice = () => {
    unlockAudio();
    sounds.pop();
    setSliceStage(prev => (prev + 1) % 3);
    onAddXP?.(10);
  };

  // Slice configuration based on stage
  const stageInfo = [
    { den: 2, num: 1, label: '1/2 Slices', tag: '🍕 1 of 2 Slices Shaded (1/2)', sub: 'Fundamental Half' },
    { den: 4, num: 2, label: '2/4 Slices', tag: '✨ Sliced into 4ths: 2/4 = 1/2', sub: 'Multiply by 2/2' },
    { den: 8, num: 4, label: '4/8 Slices', tag: '🎉 Sliced into 8ths: 4/8 = 1/2', sub: 'Multiply by 4/4' }
  ][sliceStage];

  return (
    <div className="phase-container wonder-screen">
      {/* Centered Phase Header */}
      <div className="phase-header-center">
        <span className="phase-badge">Phase 01 • Wonder & Curiosity</span>
        <h2 className="phase-title">The Secret Power of Fraction Slices</h2>
        <p className="phase-subtitle">
          Why does 1/2 take up the exact same space as 2/4 and 4/8? Tap the model to reslice!
        </p>
      </div>

      {/* Main 2-Column Grid */}
      <div className="wonder-layout-grid">
        {/* Left: Interactive Equivalent Fraction Slicer */}
        <div className="wonder-interactive-card glass-panel">
          <div className="card-badge-row">
            <span className="layer-status-tag">
              {stageInfo.tag}
            </span>
            <span className="tap-hint">Tap model to reslice!</span>
          </div>

          <div
            className="mystery-parcel-container"
            onClick={handleToggleSlice}
            role="button"
            tabIndex={0}
            aria-label="Tap to slice fractions"
            style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 'auto' }}
          >
            <svg viewBox="0 0 340 180" className="parcel-svg">
              <defs>
                <linearGradient id="wonderSliceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
                <linearGradient id="wonderEmptyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255, 255, 255, 0.08)" />
                  <stop offset="100%" stopColor="rgba(255, 255, 255, 0.02)" />
                </linearGradient>
                <filter id="wonderGlow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Background Outer Bar */}
              <rect
                x="20"
                y="35"
                width="300"
                height="70"
                rx="14"
                fill="none"
                stroke="#c084fc"
                strokeWidth="2.5"
              />

              {/* Individual Slices */}
              {Array.from({ length: stageInfo.den }).map((_, idx) => {
                const sliceW = 300 / stageInfo.den;
                const isShaded = idx < stageInfo.num;
                return (
                  <g key={idx}>
                    <rect
                      x={20 + idx * sliceW}
                      y="35"
                      width={sliceW}
                      height="70"
                      fill={isShaded ? 'url(#wonderSliceGrad)' : 'url(#wonderEmptyGrad)'}
                      stroke="rgba(255, 255, 255, 0.4)"
                      strokeWidth="1.5"
                      filter={isShaded ? 'url(#wonderGlow)' : undefined}
                    />
                    <text
                      x={20 + idx * sliceW + sliceW / 2}
                      y="78"
                      textAnchor="middle"
                      fill={isShaded ? '#ffffff' : 'rgba(255, 255, 255, 0.4)'}
                      fontSize="14"
                      fontWeight="700"
                      fontFamily="Space Grotesk, monospace"
                    >
                      1/{stageInfo.den}
                    </text>
                  </g>
                );
              })}

              {/* Center Ratio Text */}
              <text x="170" y="145" textAnchor="middle" fill="#facc15" fontSize="22" fontWeight="800" fontFamily="Outfit, sans-serif">
                {stageInfo.num} / {stageInfo.den} = 0.5 (Half)
              </text>
              <text x="170" y="168" textAnchor="middle" fill="#93c5fd" fontSize="13" fontWeight="600" fontFamily="Outfit, sans-serif">
                {stageInfo.sub}
              </text>
            </svg>
          </div>

          <div className="parcel-actions-row">
            <button
              className="parcel-step-btn"
              onClick={handleToggleSlice}
            >
              ✂️ Reslice Bar ({stageInfo.label})
            </button>
          </div>
        </div>

        {/* Right: 3 Big Wonder Questions */}
        <div className="wonder-questions-column">
          {/* Question 1: Pizza / Half */}
          <div
            className={`wonder-card glass-panel ${activeQuestion === 'pizza' ? 'selected' : ''} ${revealedQuestions.includes('pizza') ? 'revealed' : ''}`}
            onClick={() => handleReveal('pizza')}
          >
            <div className="wonder-card-top">
              <span className="wonder-q-num">Q1</span>
              <h3 className="wonder-q-title">{NARRATION.wonder.pizza.question}</h3>
              <span className="reveal-badge">
                {revealedQuestions.includes('pizza') ? '✓ Answered' : 'Tap to reveal'}
              </span>
            </div>
            {revealedQuestions.includes('pizza') && (
              <div className="wonder-card-body">
                <p>{NARRATION.wonder.pizza.answer}</p>
              </div>
            )}
          </div>

          {/* Question 2: Different Sizes */}
          <div
            className={`wonder-card glass-panel ${activeQuestion === 'differentsizes' ? 'selected' : ''} ${revealedQuestions.includes('differentsizes') ? 'revealed' : ''}`}
            onClick={() => handleReveal('differentsizes')}
          >
            <div className="wonder-card-top">
              <span className="wonder-q-num">Q2</span>
              <h3 className="wonder-q-title">{NARRATION.wonder.differentsizes.question}</h3>
              <span className="reveal-badge">
                {revealedQuestions.includes('differentsizes') ? '✓ Answered' : 'Tap to reveal'}
              </span>
            </div>
            {revealedQuestions.includes('differentsizes') && (
              <div className="wonder-card-body">
                <p>{NARRATION.wonder.differentsizes.answer}</p>
              </div>
            )}
          </div>

          {/* Question 3: Denominator */}
          <div
            className={`wonder-card glass-panel ${activeQuestion === 'denominator' ? 'selected' : ''} ${revealedQuestions.includes('denominator') ? 'revealed' : ''}`}
            onClick={() => handleReveal('denominator')}
          >
            <div className="wonder-card-top">
              <span className="wonder-q-num">Q3</span>
              <h3 className="wonder-q-title">{NARRATION.wonder.denominator.question}</h3>
              <span className="reveal-badge">
                {revealedQuestions.includes('denominator') ? '✓ Answered' : 'Tap to reveal'}
              </span>
            </div>
            {revealedQuestions.includes('denominator') && (
              <div className="wonder-card-body">
                <p>{NARRATION.wonder.denominator.answer}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="phase-bottom-nav">
        <span className="revealed-count-text">
          {revealedQuestions.length} of 3 questions explored
        </span>
        <button
          className="action-btn-primary pulse-ready"
          onClick={() => {
            unlockAudio();
            sounds.ding();
            onNext();
          }}
        >
          <span>Continue to Story 📖</span>
        </button>
      </div>
    </div>
  );
}
