import React, { useState, useEffect } from 'react';
import { NARRATION } from '../../utils/equationsNarration.js';
import { narrate, sounds, stopNarration, unlockAudio } from '../../utils/audio.js';

export default function StoryPhase({ onNext, onAddXP }) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [visitedSlides, setVisitedSlides] = useState({ 0: true });

  const slides = NARRATION.story;
  const currentSlide = slides[slideIndex];
  const totalSlides = slides.length;
  const progressPercent = ((slideIndex + 1) / totalSlides) * 100;

  useEffect(() => {
    unlockAudio();
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
    if (slideIndex < totalSlides - 1) {
      handleSlideChange(slideIndex + 1);
    } else {
      sounds.fanfare();
      onNext();
    }
  };

  const handlePrev = () => {
    if (slideIndex > 0) {
      handleSlideChange(slideIndex - 1);
    }
  };

  return (
    <div className="story-wrapper">
      {/* Top Slide Progress Bar & Counter */}
      <div className="story-progress-container">
        <div className="story-progress-bar-track">
          <div
            className="story-progress-bar-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="story-progress-counter">
          {slideIndex + 1}/{totalSlides}
        </div>
      </div>

      {/* Main Glassmorphic 2-Column Story Card */}
      <div className="story-main-card">
        {/* Left: AI Generated Art Image */}
        <div className="story-image-panel">
          <img
            src={currentSlide.image}
            alt={currentSlide.title}
            loading="eager"
            onError={(e) => {
              // fallback if image not found
              e.target.style.display = 'none';
            }}
          />
        </div>

        {/* Right: Story Details, Concept Pill, and Mascot Tip */}
        <div className="story-details-panel">
          <h2 className="story-slide-heading">
            {currentSlide.title}
          </h2>

          <p className="story-narrative-paragraph">
            {currentSlide.story}
          </p>

          {/* Key Concept / Question Capsule with Audio Icon */}
          <div
            className="story-concept-capsule"
            onClick={handleReplay}
            style={{ cursor: 'pointer' }}
            title="Click to hear question"
          >
            <div className="story-concept-capsule-text">
              <span>✨</span>
              <span>"{currentSlide.question}"</span>
              <span>✨</span>
            </div>
            <span style={{ fontSize: '0.95rem', opacity: 0.85 }} title="Click to listen">
              🔊
            </span>
          </div>

          {/* White Mascot Speech Pill */}
          <div
            className="story-mascot-tip-pill"
            onClick={handleReplay}
            style={{ cursor: 'pointer' }}
            title="Click to replay voice"
          >
            <div className="story-mascot-tip-avatar">
              🦊
            </div>
            <div className="story-mascot-tip-text">
              {currentSlide.capsule}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="story-bottom-nav">
        <button
          className="btn-ghost story-nav-btn"
          onClick={handlePrev}
          disabled={slideIndex === 0}
          style={{
            opacity: slideIndex === 0 ? 0.35 : 1,
            cursor: slideIndex === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          <span>← Back</span>
        </button>

        {/* Centered Dots Indicator */}
        <div className="story-nav-dots-container">
          {slides.map((_, idx) => (
            <div
              key={idx}
              className={`story-dot-node ${idx === slideIndex ? 'active' : ''}`}
              onClick={() => handleSlideChange(idx)}
              title={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          className="btn-gold story-nav-btn"
          onClick={handleNext}
        >
          <span>{slideIndex === totalSlides - 1 ? 'Go to Stations 🚀' : 'Next →'}</span>
        </button>
      </div>
    </div>
  );
}
