import React from 'react';
import FloatingShapes from './FloatingShapes.jsx';
import { sounds, narrate, unlockAudio } from '../../utils/audio.js';

export default function IntroScreen({ onStart }) {
  const handleStart = () => {
    unlockAudio();
    sounds.ding();
    onStart('wonder');
  };

  const handleMascotClick = () => {
    unlockAudio();
    sounds.pop();
    narrate(
      "Ready to crack the code of brackets? Join Archie and Maya on a mission to expand, simplify, and solve equations with brackets using the distributive property, balance scales, and real-life mysteries!",
      "encouragement"
    );
  };

  return (
    <div className="intro-screen-container">
      <FloatingShapes />

      {/* Top right cyan close button (matches reference image) */}
      <button 
        className="close-intro-btn"
        onClick={() => {
          sounds.click();
          window.location.reload();
        }}
        aria-label="Exit Lesson"
        title="Exit Lesson"
      >
        ✕
      </button>

      {/* Curriculum Badge */}
      <div className="curriculum-badge">
        <span className="badge-sparkle">✦</span>
        <span>MOE Curriculum • Grade 7</span>
      </div>

      {/* Main Titles matching Image 1 */}
      <h1 className="hero-main-title">Algebra Quest</h1>
      <h2 className="hero-sub-title">Bracket Equations</h2>

      {/* Mascot Speech Bubble Pill (Clickable for narration) */}
      <div 
        className="mascot-speech-pill"
        onClick={handleMascotClick}
        style={{ cursor: 'pointer' }}
        title="Click to hear Archie & Maya!"
      >
        <div className="mascot-avatar-circle">
          🦊
        </div>
        <div className="mascot-pill-text">
          <span>Ready to crack the code of brackets?</span>
          <span>🔐</span>
        </div>
      </div>

      {/* Mission Description */}
      <p className="hero-mission-desc">
        Join Archie & Maya on a mission to expand, simplify, and solve equations with brackets using the distributive property, balance scales, and real-life mysteries!
      </p>

      {/* Learning Journey Glass Card (Matches Image 1) */}
      <div className="intro-journey-card">
        <div className="journey-card-header">
          YOUR LEARNING JOURNEY
        </div>

        <div className="intro-journey-grid">
          {/* Top Row: Wonder -> Story -> Simulate */}
          <div className="journey-row-top">
            <div 
              className="intro-step-node" 
              onClick={() => { unlockAudio(); sounds.click(); onStart('wonder'); }}
              style={{ cursor: 'pointer' }}
              title="Phase 1: Wonder"
            >
              <div className="intro-step-circle purple">🔍</div>
              <div className="intro-step-info">
                <span className="intro-step-title">Wonder</span>
                <span className="intro-step-subtitle">Spark curiosity</span>
              </div>
            </div>

            <span className="intro-arrow">→</span>

            <div 
              className="intro-step-node"
              onClick={() => { unlockAudio(); sounds.click(); onStart('story'); }}
              style={{ cursor: 'pointer' }}
              title="Phase 2: Story"
            >
              <div className="intro-step-circle gold">📖</div>
              <div className="intro-step-info">
                <span className="intro-step-title">Story</span>
                <span className="intro-step-subtitle">Hear the tale</span>
              </div>
            </div>

            <span className="intro-arrow">→</span>

            <div 
              className="intro-step-node"
              onClick={() => { unlockAudio(); sounds.click(); onStart('stations'); }}
              style={{ cursor: 'pointer' }}
              title="Phase 3: Simulate"
            >
              <div className="intro-step-circle teal">🧪</div>
              <div className="intro-step-info">
                <span className="intro-step-title">Simulate</span>
                <span className="intro-step-subtitle">Explore & discover</span>
              </div>
            </div>
          </div>

          {/* Bottom Row: Practice -> Reflect */}
          <div className="journey-row-bottom">
            <div 
              className="intro-step-node"
              onClick={() => { unlockAudio(); sounds.click(); onStart('practice'); }}
              style={{ cursor: 'pointer' }}
              title="Phase 4: Practice"
            >
              <div className="intro-step-circle indigo">🎮</div>
              <div className="intro-step-info">
                <span className="intro-step-title">Practice</span>
                <span className="intro-step-subtitle">Test your skills</span>
              </div>
            </div>

            <span className="intro-arrow">→</span>

            <div 
              className="intro-step-node"
              onClick={() => { unlockAudio(); sounds.click(); onStart('reflect'); }}
              style={{ cursor: 'pointer' }}
              title="Phase 5: Reflect"
            >
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

      {/* Bottom 3 Feature Cards (Matches Image 1) */}
      <div className="home-bottom-cards">
        <div className="bottom-mini-card">
          <div className="mini-card-icon blue-bg">
            <span>🔤</span>
          </div>
          <div className="mini-card-text">
            <div className="mini-card-title">Letters & Terms</div>
            <div className="mini-card-sub">Distributive expansion</div>
          </div>
        </div>

        <div className="bottom-mini-card">
          <div className="mini-card-icon red-bg">
            <span>🧪</span>
          </div>
          <div className="mini-card-text">
            <div className="mini-card-title">Simulations</div>
            <div className="mini-card-sub">Interactive labs</div>
          </div>
        </div>

        <div className="bottom-mini-card">
          <div className="mini-card-icon gold-bg">
            <span>🏆</span>
          </div>
          <div className="mini-card-text">
            <div className="mini-card-title">10 Game Worlds</div>
            <div className="mini-card-sub">XP & awards</div>
          </div>
        </div>
      </div>
    </div>
  );
}
