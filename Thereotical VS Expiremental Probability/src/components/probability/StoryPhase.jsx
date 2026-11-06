/* =========================================================
   STORY PHASE COMPONENT
   Matches Image 2 UI faithfully:
   - Yellow progress bar track with counter (e.g. 1/5)
   - 2-Column Glassmorphic card
     - Left: High quality anime illustration
     - Right: Title in gold bold, Narrative text, Key Question capsule with 🔊 icon, White Fox Mascot Tip Pill
   - Bottom navigation: ← Back, Dot pagination (active dot expanded to pill), Next →
   ========================================================= */

import React, { useState, useEffect } from 'react';
import { STORY_SLIDES } from '../../utils/probabilityNarration';
import { sounds, playNarration } from '../../utils/audio';

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
        {/* Left: AI Generated Anime Art Image */}
        <div className="story-image-panel">
          <img
            src={slide.image}
            alt={slide.title}
            loading="eager"
          />
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
          <div className="story-concept-capsule" onClick={handleReplayAudio} style={{ cursor: 'pointer' }} title="Click to listen">
            <div className="story-concept-capsule-text">
              <span>✨</span>
              <span>"{slide.keyQuestion}"</span>
              <span>✨</span>
            </div>
            <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>
              🔊
            </span>
          </div>

          {/* White Mascot Speech Pill */}
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

        {/* Centered Dots Indicator */}
        <div className="story-nav-dots-container">
          {STORY_SLIDES.map((_, idx) => (
            <div
              key={idx}
              className={`story-dot-node ${idx === currentSlideIndex ? 'active' : ''}`}
              onClick={() => { sounds.click(); setCurrentSlideIndex(idx); }}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          className="btn-gold"
          onClick={handleNext}
          style={{ padding: '12px 32px' }}
        >
          <span>{currentSlideIndex === totalSlides - 1 ? 'Finish Story →' : 'Next →'}</span>
        </button>
      </div>
    </div>
  );
}
