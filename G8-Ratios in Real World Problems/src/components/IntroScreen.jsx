import React from 'react';
import FloatingShapes from './FloatingShapes';
import { sounds } from '../utils/audio';

export default function IntroScreen({ onStartJourney }) {
  const handleStart = () => {
    sounds.pop();
    onStartJourney();
  };

  return (
    <div className="intro-screen-container">
      <FloatingShapes />

      {/* Top right close button (as in screenshot) */}
      <button
        className="close-intro-btn"
        onClick={() => sounds.click()}
        aria-label="Close"
        title="Close"
      >
        ✕
      </button>

      {/* Curriculum Badge */}
      <div className="curriculum-badge">
        <span className="badge-sparkle">✦</span>
        <span>MOE Curriculum • Grade 8</span>
      </div>

      {/* Main Titles */}
      <h1 className="hero-main-title">Ratio Quest</h1>
      <h2 className="hero-sub-title">Ratios in Real World Problems</h2>

      {/* Mascot Speech Pill */}
      <div className="mascot-speech-pill">
        <div className="mascot-avatar-circle">
          🦊
        </div>
        <div className="mascot-pill-text">
          <span>Ready to discover the power of ratios?</span>
          <span>🍯</span>
        </div>
      </div>

      {/* Mission Description */}
      <p className="hero-mission-desc">
        Join Maya & Ravi on a mission to explore ratios, share quantities, scale recipes, and solve real-life mysteries!
      </p>

      {/* Learning Journey Glass Card */}
      <div className="intro-journey-card">
        <div className="journey-card-header">
          YOUR LEARNING JOURNEY
        </div>

        <div className="intro-journey-grid">
          {/* Top Row: Wonder -> Story -> Simulate */}
          <div className="journey-row-top">
            <div className="intro-step-node">
              <div className="intro-step-circle purple">🔮</div>
              <div className="intro-step-info">
                <span className="intro-step-title">Wonder</span>
                <span className="intro-step-subtitle">Spark curiosity</span>
              </div>
            </div>

            <span className="intro-arrow">➔</span>

            <div className="intro-step-node">
              <div className="intro-step-circle gold">📖</div>
              <div className="intro-step-info">
                <span className="intro-step-title">Story</span>
                <span className="intro-step-subtitle">Hear the tale</span>
              </div>
            </div>

            <span className="intro-arrow">➔</span>

            <div className="intro-step-node">
              <div className="intro-step-circle teal">🧪</div>
              <div className="intro-step-info">
                <span className="intro-step-title">Simulate</span>
                <span className="intro-step-subtitle">Explore & discover</span>
              </div>
            </div>
          </div>

          {/* Bottom Row: Practice -> Reflect */}
          <div className="journey-row-bottom">
            <div className="intro-step-node">
              <div className="intro-step-circle indigo">🎮</div>
              <div className="intro-step-info">
                <span className="intro-step-title">Practice</span>
                <span className="intro-step-subtitle">Test your skills</span>
              </div>
            </div>

            <span className="intro-arrow">➔</span>

            <div className="intro-step-node">
              <div className="intro-step-circle blue">📓</div>
              <div className="intro-step-info">
                <span className="intro-step-title">Reflect</span>
                <span className="intro-step-subtitle">What did you learn?</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Big Orange/Gold Glowing CTA Button */}
      <button
        className="btn-begin-journey"
        onClick={handleStart}
      >
        <span>🚀</span>
        <span>Begin Your Journey!</span>
      </button>

      {/* Bottom 3 Feature Cards */}
      <div className="intro-feature-cards">
        <div className="feature-pill-card">
          <div className="feature-card-icon blue">3:5</div>
          <div className="feature-card-title">Parts & Wholes</div>
          <div className="feature-card-desc">Meaning of ratios</div>
        </div>

        <div className="feature-pill-card">
          <div className="feature-card-icon red">🧪</div>
          <div className="feature-card-title">Ratio Bar Lab</div>
          <div className="feature-card-desc">Interactive visualizer</div>
        </div>

        <div className="feature-pill-card">
          <div className="feature-card-icon gold">🏆</div>
          <div className="feature-card-title">Ratio Master</div>
          <div className="feature-card-desc">XP & awards</div>
        </div>
      </div>
    </div>
  );
}
