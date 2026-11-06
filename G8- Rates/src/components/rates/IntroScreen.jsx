import React from 'react';
import { sounds, narrate, unlockAudio } from '../../utils/audio.js';
import { INTRO_MASCOT } from '../../utils/ratesNarration.js';

export default function IntroScreen({ state, onStart }) {
  const handleStart = () => {
    unlockAudio();
    sounds.click();
    onStart('wonder');
  };

  const handleMascotClick = () => {
    unlockAudio();
    sounds.pop();
    narrate(INTRO_MASCOT.spoken, INTRO_MASCOT.style);
  };

  return (
    <div className="home-screen-wrapper">
      {/* Top Bar: Curriculum Badge & Close Button */}
      <div className="home-top-bar">
        <div className="curriculum-badge">
          <span className="badge-sparkle">✓</span>
          <span>Grade 8 · Ratios, Rates & Proportional Relationships</span>
        </div>

        <button className="top-close-btn" aria-label="Close" onClick={() => window.history.back?.()}>
          <span>✕</span>
        </button>
      </div>

      {/* Hero Title Block */}
      <div className="home-hero-section">
        <h1 className="quest-title-white">Ratios, Rates & Proportional Relationships</h1>
        <h2 className="quest-title-yellow">Rates & Unit Rates</h2>
      </div>

      {/* Mascot Speech Bubble Pill (Clickable to hear voice) */}
      <div
        className="mascot-pill-row"
        onClick={handleMascotClick}
        style={{ cursor: 'pointer' }}
        title="Tap to listen to Ravi the Rate Racer!"
      >
        <div className="mascot-circle-avatar" role="img" aria-label="Ravi the Rate Racer">
          🦊🏎️
        </div>
        <div className="mascot-white-pill">
          <span>Ravi the Rate Racer: "Fast, fair & per one!"</span>
          <span style={{ marginLeft: '8px', fontSize: '0.9rem' }}>🔊</span>
        </div>
      </div>

      {/* Mission Subtitle Description */}
      <p className="home-mission-desc">
        Join Maya and Ravi the Rate Racer to calculate unit rates, compare supermarket best buys,
        conquer speed–distance–time journeys, convert rate units, and master rates on coordinate graphs!
      </p>

      {/* Learning Journey Overview Box */}
      <div className="journey-roadmap-card">
        <div className="roadmap-title">YOUR LEARNING JOURNEY</div>

        <div className="roadmap-flow">
          {/* Row 1: Wonder -> Story -> Simulate */}
          <div className="roadmap-row">
            <div className="roadmap-node">
              <div className="node-icon-circle purple-ring">
                <span>🔮</span>
              </div>
              <div className="node-text-group">
                <span className="node-phase-tag">01 WONDER</span>
                <span className="node-title">Fast, Cheap or Fair?</span>
              </div>
            </div>

            <div className="roadmap-arrow">➔</div>

            <div className="roadmap-node">
              <div className="node-icon-circle purple-ring">
                <span>📐</span>
              </div>
              <div className="node-text-group">
                <span className="node-phase-tag">02 STORY</span>
                <span className="node-title">The Power of 'Per One'</span>
              </div>
            </div>

            <div className="roadmap-arrow">➔</div>

            <div className="roadmap-node">
              <div className="node-icon-circle purple-ring">
                <span>🧪</span>
              </div>
              <div className="node-text-group">
                <span className="node-phase-tag">03 SIMULATE</span>
                <span className="node-title">Rate Race Labs</span>
              </div>
            </div>
          </div>

          {/* Row 2: Practice -> Reflect */}
          <div className="roadmap-row" style={{ marginTop: '12px' }}>
            <div className="roadmap-node">
              <div className="node-icon-circle purple-ring">
                <span>🎮</span>
              </div>
              <div className="node-text-group">
                <span className="node-phase-tag">04 PRACTICE</span>
                <span className="node-title">Rate Racer Arena</span>
              </div>
            </div>

            <div className="roadmap-arrow">➔</div>

            <div className="roadmap-node">
              <div className="node-icon-circle purple-ring">
                <span>📓</span>
              </div>
              <div className="node-text-group">
                <span className="node-phase-tag">05 REFLECT</span>
                <span className="node-title">Deep Reflection</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <div className="home-action-row">
        <button className="start-quest-btn" onClick={handleStart}>
          <span>Enter Ravi's Racetrack</span>
          <span className="btn-arrow-icon">➔</span>
        </button>
      </div>
    </div>
  );
}
