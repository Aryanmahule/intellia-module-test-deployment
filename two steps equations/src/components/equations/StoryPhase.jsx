import React, { useState, useEffect } from 'react';
import { NARRATION } from '../../utils/twoStepNarration.js';
import { narrate, sounds, stopNarration, unlockAudio } from '../../utils/audio.js';

export default function StoryPhase({ onNext, onAddXP }) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [visitedSlides, setVisitedSlides] = useState({ 0: true });

  const slides = NARRATION.story;
  const currentSlide = slides[slideIndex];

  useEffect(() => {
    unlockAudio();
    if (currentSlide?.narration) {
      narrate(currentSlide.narration, currentSlide.style || 'statement');
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
      onAddXP?.(20);
    }
    setSlideIndex(newIdx);
  };

  const handleReplayVoice = (e) => {
    e?.stopPropagation();
    unlockAudio();
    sounds.pop();
    if (currentSlide?.narration) {
      narrate(currentSlide.narration, currentSlide.style || 'statement');
    }
  };

  const handleNext = () => {
    unlockAudio();
    if (slideIndex < slides.length - 1) {
      sounds.pop();
      handleSlideChange(slideIndex + 1);
    } else {
      sounds.ding();
      onNext();
    }
  };

  const handlePrev = () => {
    unlockAudio();
    if (slideIndex > 0) {
      sounds.pop();
      handleSlideChange(slideIndex - 1);
    }
  };

  return (
    <div className="story-phase-wrapper">
      {/* Slim Top Progress Bar (Matching Reference Image) */}
      <div className="story-top-progress-container">
        <div className="story-progress-track">
          <div
            className="story-progress-fill"
            style={{ width: `${((slideIndex + 1) / slides.length) * 100}%` }}
          />
        </div>
        <div className="story-progress-counter">
          {slideIndex + 1}/{slides.length}
        </div>
      </div>

      {/* Main Story Glass Card (Centered & Sized exactly as in reference image) */}
      <div className="story-main-card">
        {/* Left Column: Anime Illustration */}
        <div className="story-left-col">
          <img
            src={currentSlide.image}
            alt={currentSlide.title}
            className="story-character-img"
            onError={(e) => {
              // Clean fallback image
              e.target.src = '/images/story/slide1.jpg';
            }}
          />
        </div>

        {/* Right Column: Title, Narrative, Quote Pill & Fox Capsule */}
        <div className="story-right-col">
          <h2 className="story-hero-title">
            {currentSlide.title}
          </h2>

          <p className="story-narrative-text">
            {currentSlide.story}
          </p>

          {/* Golden Quote Box with Audio Trigger */}
          <div
            className="story-quote-pill"
            onClick={handleReplayVoice}
            title="Click to hear narration"
          >
            <div className="story-quote-content">
              <span className="sparkle-icon">✨</span>
              <span className="quote-text">✦ "{currentSlide.quote || currentSlide.question}" ✦</span>
            </div>
            <span className="speaker-mini-icon">🔊</span>
          </div>

          {/* White Fox Mascot Speech Capsule */}
          <div className="story-fox-capsule">
            <div className="fox-mini-avatar" role="img" aria-label="Archie Fox">
              🦊
            </div>
            <div className="fox-capsule-text">
              {currentSlide.capsule}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Controls (Back, Pill Dots, Glowing Next Button) */}
      <div className="story-bottom-nav">
        <button
          className="story-back-btn"
          onClick={handlePrev}
          disabled={slideIndex === 0}
        >
          <span>← Back</span>
        </button>

        {/* Slide Indicator Pill Container */}
        <div className="story-dots-capsule">
          {slides.map((_, idx) => (
            <div
              key={idx}
              className={`story-dot-indicator ${idx === slideIndex ? 'active' : ''}`}
              onClick={() => handleSlideChange(idx)}
              role="button"
              tabIndex={0}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <button className="story-next-btn" onClick={handleNext}>
          <span>{slideIndex === slides.length - 1 ? 'Go to Simulate ⚙️' : 'Next →'}</span>
        </button>
      </div>
    </div>
  );
}
