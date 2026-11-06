import React, { useState, useEffect } from 'react';
import { STORY_SLIDES } from '../../utils/bracketsNarration.js';
import { sounds, narrate, unlockAudio } from '../../utils/audio.js';

export default function StoryPhase({ onNext, onAddXP }) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [visitedSlides, setVisitedSlides] = useState({ 0: true });

  const slide = STORY_SLIDES[currentSlideIndex];
  const totalSlides = STORY_SLIDES.length;
  const progressPercent = ((currentSlideIndex + 1) / totalSlides) * 100;

  useEffect(() => {
    // Play narration for the current slide
    if (slide && slide.spokenNarration) {
      narrate(slide.spokenNarration, slide.style || 'statement');
    }
  }, [currentSlideIndex]);

  const handleNext = () => {
    unlockAudio();
    sounds.click();
    if (currentSlideIndex < totalSlides - 1) {
      const nextIdx = currentSlideIndex + 1;
      setCurrentSlideIndex(nextIdx);
      if (!visitedSlides[nextIdx]) {
        setVisitedSlides(prev => ({ ...prev, [nextIdx]: true }));
        onAddXP?.(15);
      }
    } else {
      sounds.ding();
      onNext();
    }
  };

  const handlePrev = () => {
    unlockAudio();
    sounds.click();
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const handleSlideJump = (idx) => {
    unlockAudio();
    sounds.click();
    setCurrentSlideIndex(idx);
    if (!visitedSlides[idx]) {
      setVisitedSlides(prev => ({ ...prev, [idx]: true }));
      onAddXP?.(15);
    }
  };

  const handleReplayAudio = () => {
    unlockAudio();
    sounds.pop();
    if (slide && slide.spokenNarration) {
      narrate(slide.spokenNarration, slide.style || 'statement');
    }
  };

  return (
    <div className="story-wrapper">
      {/* Top Slide Progress Bar (Matches Image 2) */}
      <div className="story-progress-container">
        <div className="story-progress-bar-track">
          <div
            className="story-progress-bar-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="story-progress-counter">
          {currentSlideIndex + 1}/{totalSlides}
        </div>
      </div>

      {/* Main Glassmorphic 2-Column Story Card (Matches Image 2) */}
      <div className="story-main-card">
        {/* Left Column: Visual Scene Image */}
        <div className="story-image-panel">
          <img
            src={slide.image}
            alt={slide.title}
            loading="eager"
            onError={(e) => {
              // Fallback to slide1.jpg if specific image is not found
              e.target.src = '/images/story/slide1.jpg';
            }}
          />
        </div>

        {/* Right Column: Title, Story Text, Concept Capsule, Mascot Pill */}
        <div className="story-details-panel">
          <h2 className="story-slide-heading">
            {slide.title}
          </h2>

          <p className="story-narrative-paragraph">
            {slide.story}
          </p>

          {/* Key Concept / Question Capsule with Audio Icon (Matches Image 2) */}
          <div
            className="story-concept-capsule"
            onClick={handleReplayAudio}
            style={{ cursor: 'pointer' }}
            title="Click to replay audio narration"
          >
            <div className="story-concept-capsule-text">
              <span>✦</span>
              <span>"{slide.keyQuestion}"</span>
              <span>✦</span>
            </div>
            <span style={{ fontSize: '0.9rem', opacity: 0.85 }} aria-label="Audio button">
              🔊
            </span>
          </div>

          {/* White Mascot Tip Pill (Matches Image 2) */}
          <div className="story-mascot-tip-pill">
            <div className="story-mascot-tip-avatar">
              🦊
            </div>
            <div className="story-mascot-tip-text">
              {slide.mascotHint}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar (Matches Image 2) */}
      <div className="story-bottom-nav">
        <button
          className="btn-secondary"
          onClick={handlePrev}
          disabled={currentSlideIndex === 0}
          style={{
            opacity: currentSlideIndex === 0 ? 0.35 : 1,
            cursor: currentSlideIndex === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          ← Back
        </button>

        {/* Centered Dots Indicator with elongated active pill */}
        <div className="story-nav-dots-container">
          {STORY_SLIDES.map((_, idx) => (
            <div
              key={idx}
              className={`story-dot-node ${idx === currentSlideIndex ? 'active' : ''}`}
              onClick={() => handleSlideJump(idx)}
              title={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          className="btn-gold"
          onClick={handleNext}
        >
          <span>{currentSlideIndex === totalSlides - 1 ? 'Start Simulations 🧪' : 'Next →'}</span>
        </button>
      </div>
    </div>
  );
}
