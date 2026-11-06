import React, { useState, useEffect } from 'react';
import { STORY_SLIDES } from '../utils/ratiosNarration';
import { sounds, playNarration } from '../utils/audio';

export default function StoryPhase({ onNextPhase, onAddXp }) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [visitedSlides, setVisitedSlides] = useState({ 0: true });

  const slide = STORY_SLIDES[currentSlideIndex];
  const totalSlides = STORY_SLIDES.length;
  const progressPercent = ((currentSlideIndex + 1) / totalSlides) * 100;

  useEffect(() => {
    playNarration(slide.spokenNarration, 'statement');
  }, [currentSlideIndex]);

  const handleNext = () => {
    sounds.click();
    if (currentSlideIndex < totalSlides - 1) {
      const nextIdx = currentSlideIndex + 1;
      setCurrentSlideIndex(nextIdx);
      if (!visitedSlides[nextIdx]) {
        setVisitedSlides(prev => ({ ...prev, [nextIdx]: true }));
        onAddXp(15);
      }
    } else {
      sounds.fanfare();
      onNextPhase();
    }
  };

  const handlePrev = () => {
    sounds.click();
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const handleReplayAudio = () => {
    sounds.pop();
    playNarration(slide.spokenNarration, 'statement');
  };

  // SVG graphical badges or overlays for the story illustration
  const renderSlideGraphicOverlay = () => {
    switch (slide.id) {
      case 'slide_1':
        return (
          <div className="story-graphic-overlay">
            <div className="overlay-pill-badge">
              <span>Ratio 3 : 5</span>
              <span className="dot">•</span>
              <span>Total 8 Parts</span>
            </div>
          </div>
        );
      case 'slide_2':
        return (
          <div className="story-graphic-overlay">
            <div className="overlay-pill-badge gold">
              <span>2 : 3</span>
              <span className="scale-arrow">× 4 ➔</span>
              <span>8 : 12</span>
            </div>
          </div>
        );
      case 'slide_3':
        return (
          <div className="story-graphic-overlay">
            <div className="overlay-pill-badge teal">
              <span>Blue : White = 2 : 5</span>
              <span className="dot">•</span>
              <span>6 : 15 (× 3)</span>
            </div>
          </div>
        );
      case 'slide_4':
        return (
          <div className="story-graphic-overlay">
            <div className="overlay-pill-badge gold">
              <span>$72 ÷ 8 = $9 per part</span>
              <span className="dot">•</span>
              <span>$27 & $45</span>
            </div>
          </div>
        );
      case 'slide_5':
        return (
          <div className="story-graphic-overlay">
            <div className="overlay-pill-badge coral">
              <span>4/13 (30.8%) vs 3/8 (37.5%)</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="story-wrapper">
      {/* Top Slide Progress Bar */}
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

      {/* Main Glassmorphic 2-Column Story Card */}
      <div className="story-main-card">
        {/* Left: AI Generated Anime Art Image with visual badge */}
        <div className="story-image-panel">
          <img
            src={slide.image}
            alt={slide.title}
            loading="eager"
            onError={(e) => {
              // Fallback if image fails to load
              e.target.src = '/images/story/slide1.jpg';
            }}
          />
          {renderSlideGraphicOverlay()}
        </div>

        {/* Right: Story Details, Concept Pill, and Mascot Tip */}
        <div className="story-details-panel">
          <h2 className="story-slide-heading">
            {slide.title}
          </h2>

          <p className="story-narrative-paragraph">
            {slide.story}
          </p>

          {/* Key Concept / Question Capsule with Audio Icon */}
          <div
            className="story-concept-capsule"
            onClick={handleReplayAudio}
            style={{ cursor: 'pointer' }}
            title="Click to replay audio narration"
          >
            <div className="story-concept-capsule-text">
              <span className="sparkle">✨</span>
              <span>"{slide.keyQuestion}"</span>
              <span className="sparkle">✨</span>
            </div>
            <span className="speaker-icon" title="Listen">
              🔊
            </span>
          </div>

          {/* White Mascot Speech Pill with Fox Avatar */}
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

      {/* Bottom Navigation Bar */}
      <div className="story-bottom-nav">
        <button
          className="btn-secondary"
          onClick={handlePrev}
          disabled={currentSlideIndex === 0}
          style={{
            opacity: currentSlideIndex === 0 ? 0.35 : 1,
            cursor: currentSlideIndex === 0 ? 'not-allowed' : 'pointer',
            padding: '10px 24px'
          }}
        >
          ← Back
        </button>

        {/* Centered Dots Indicator (with pill active dot) */}
        <div className="story-nav-dots-container">
          {STORY_SLIDES.map((_, idx) => (
            <div
              key={idx}
              className={`story-dot-node ${idx === currentSlideIndex ? 'active' : ''}`}
              onClick={() => {
                sounds.click();
                setCurrentSlideIndex(idx);
              }}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          className="btn-gold"
          onClick={handleNext}
          style={{ padding: '12px 32px' }}
        >
          <span>{currentSlideIndex === totalSlides - 1 ? 'Finish Story ➔' : 'Next ➔'}</span>
        </button>
      </div>
    </div>
  );
}
