import React, { useState, useEffect } from 'react';
import { NARRATION } from '../../utils/formulaeNarration.js';
import { narrate, sounds, stopNarration, unlockAudio } from '../../utils/audio.js';

export default function StoryPhase({ onNext, onAddXP }) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [visitedSlides, setVisitedSlides] = useState({ 0: true });

  const slides = NARRATION.story;
  const currentSlide = slides[slideIndex];

  useEffect(() => {
    unlockAudio();
    // Play narration for current slide
    if (currentSlide?.narration) {
      narrate(currentSlide.narration, currentSlide.style);
    }
    return () => {
      stopNarration();
    };
  }, [slideIndex]);

  const handleSlideChange = (newIdx) => {
    unlockAudio();
    sounds.click();
    if (!visitedSlides[newIdx]) {
      sounds.ding();
      setVisitedSlides(prev => ({ ...prev, [newIdx]: true }));
      onAddXP(20);
    }
    setSlideIndex(newIdx);
  };

  const handleReplay = () => {
    unlockAudio();
    sounds.pop();
    if (currentSlide?.narration) {
      narrate(currentSlide.narration, currentSlide.style);
    }
  };

  const handleNext = () => {
    if (slideIndex < slides.length - 1) {
      handleSlideChange(slideIndex + 1);
    } else {
      sounds.click();
      onNext();
    }
  };

  const handlePrev = () => {
    if (slideIndex > 0) {
      handleSlideChange(slideIndex - 1);
    }
  };

  return (
    <div className="glass-card story-phase-card">
      {/* Top Header */}
      <div className="phase-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="badge badge-teal" style={{ marginBottom: '6px' }}>
            <span>📐 Phase 02</span> <span>• Concept Story ({slideIndex + 1} of {slides.length})</span>
          </div>
          <h2 style={{ fontSize: '2.1rem', color: 'var(--text-main)', fontFamily: 'var(--font-fun)' }}>
            {currentSlide.title}
          </h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={handleReplay}
            className="btn btn-ghost"
            style={{ padding: '6px 14px', fontSize: '0.95rem' }}
            title="Replay Voice Narration"
          >
            <span>🔊 Replay Voice</span>
          </button>
          <div className="badge badge-gold">
            <span>{currentSlide.badge}</span>
          </div>
        </div>
      </div>

      {/* Main Story Split Container */}
      <div className="story-container">
        {/* Left: Visual Scene Card */}
        <div className="story-visual-box" style={{ position: 'relative', overflow: 'hidden', padding: 0 }}>
          <img
            src={currentSlide.image}
            alt={currentSlide.title}
            style={{
              width: '100%',
              height: '100%',
              maxHeight: '290px',
              objectFit: 'cover',
              borderRadius: 'var(--radius-md)'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div
            className="capsule-overlay"
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              right: '10px',
              background: 'rgba(18, 14, 43, 0.92)',
              backdropFilter: 'blur(8px)',
              border: '1.5px solid var(--purple-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 14px',
              fontSize: '1.05rem',
              fontWeight: 700,
              color: 'var(--gold-bright)',
              textAlign: 'center'
            }}
          >
            💡 {currentSlide.capsule}
          </div>
        </div>

        {/* Right: Story Dialogue & Explanations */}
        <div className="story-narrative-column" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div
            className="mascot-container"
            style={{ marginBottom: 0, cursor: 'pointer' }}
            onClick={handleReplay}
            title="Click to replay voice narration"
          >
            <div className="mascot">
              {slideIndex % 2 === 0 ? '🦊' : '👧'}
            </div>
            <div className="speech-bubble" style={{ maxWidth: '100%' }}>
              <div className="speaker-name" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{slideIndex % 2 === 0 ? 'Ravi the Robot Fox' : 'Maya'}</span>
                <span style={{ color: 'var(--teal-bright)', fontSize: '0.88rem' }}>🔊 Tap to hear</span>
              </div>
              <div className="speech-text" style={{ fontSize: '1.2rem' }}>
                {currentSlide.story}
              </div>
            </div>
          </div>

          <div
            className="story-question-box"
            style={{
              background: 'rgba(30, 24, 70, 0.8)',
              border: '1.5px solid var(--purple-border)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <span style={{ fontSize: '1.8rem' }}>❓</span>
            <div>
              <div style={{ color: 'var(--teal-bright)', fontSize: '0.95rem', fontWeight: 800 }}>THINK ABOUT IT</div>
              <div style={{ color: 'var(--text-main)', fontSize: '1.15rem', fontWeight: 600 }}>{currentSlide.question}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation & Slide Dots */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
        <button
          className="btn btn-ghost"
          onClick={handlePrev}
          disabled={slideIndex === 0}
        >
          <span>◀ Previous</span>
        </button>

        {/* 5 Slide Dots */}
        <div className="story-dots">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              className={`story-dot ${idx === slideIndex ? 'active' : ''}`}
              onClick={() => handleSlideChange(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <button
          className={`btn ${slideIndex === slides.length - 1 ? 'btn-gold' : 'btn-primary'}`}
          onClick={handleNext}
        >
          <span>{slideIndex === slides.length - 1 ? 'Go to Simulate 🧪' : 'Next Concept ▶'}</span>
        </button>
      </div>
    </div>
  );
}
