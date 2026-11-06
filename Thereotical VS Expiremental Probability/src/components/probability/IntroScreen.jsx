/* =========================================================
   INTRO SCREEN (HOMEPAGE)
   Matches Image 1 UI faithfully:
   - Close button on top-right
   - MOE Curriculum · Grade 7 badge
   - Hero Titles (Probability Quest / Theoretical vs Experimental Probability)
   - Mascot Speech Pill (Fox avatar + ready prompt)
   - Mission Description with Archie & Maya
   - Learning Journey Glass Card (Wonder -> Story -> Simulate -> Practice -> Reflect)
   - Glowing Begin Your Journey CTA Button
   - 3 Feature Cards at the bottom
   ========================================================= */

import React from 'react';
import FloatingShapes from './FloatingShapes';
import { sounds, playNarration } from '../../utils/audio';

export default function IntroScreen({ onStartJourney }) {
  const handleStart = () => {
    sounds.pop();
    onStartJourney();
  };

  return (
    <div className="intro-screen-container">
      <FloatingShapes />

      {/* Top right close button */}
      <button 
        className="close-intro-btn"
        onClick={() => sounds.click()}
        aria-label="Close"
      >
        ✕
      </button>

      {/* Curriculum Badge */}
      <div className="curriculum-badge">
        <span>✨</span>
        <span>MOE Curriculum · Grade 7</span>
      </div>

      {/* Main Titles */}
      <h1 className="hero-main-title">Probability Quest</h1>
      <h2 className="hero-sub-title">Theoretical vs Experimental Probability</h2>

      {/* Mascot Speech Pill */}
      <div 
        className="mascot-speech-pill"
        onClick={() => {
          sounds.pop();
          playNarration("Welcome to Probability Quest! Ready to master chance and experiments with Archie and Maya?", "encouragement");
        }}
        style={{ cursor: 'pointer' }}
        title="Click to hear Archie & Maya"
      >
        <div className="mascot-avatar-circle">
          🦊
        </div>
        <div className="mascot-pill-text">
          <span>Ready to master chance and experiments?</span>
          <span>🎲 🔊</span>
        </div>
      </div>

      {/* Mission Description */}
      <p className="hero-mission-desc">
        Join Archie & Maya on an exciting mission to explore probability, predict outcomes, roll dice, flip coins, and discover the Law of Large Numbers!
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

            <span className="intro-arrow">→</span>

            <div className="intro-step-node">
              <div className="intro-step-circle gold">📖</div>
              <div className="intro-step-info">
                <span className="intro-step-title">Story</span>
                <span className="intro-step-subtitle">Hear the tale</span>
              </div>
            </div>

            <span className="intro-arrow">→</span>

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

            <span className="intro-arrow">→</span>

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
          <div className="feature-card-icon blue">🎲</div>
          <div className="feature-card-title">Theoretical Laws</div>
          <div className="feature-card-desc">Rules of chance & formulas</div>
        </div>

        <div className="feature-pill-card">
          <div className="feature-card-icon red">🧪</div>
          <div className="feature-card-title">Live Lab Simulator</div>
          <div className="feature-card-desc">Coins, dice & spinners</div>
        </div>

        <div className="feature-pill-card">
          <div className="feature-card-icon gold">🏆</div>
          <div className="feature-card-title">Probability Pro</div>
          <div className="feature-card-desc">XP, streaks & awards</div>
        </div>
      </div>
    </div>
  );
}
