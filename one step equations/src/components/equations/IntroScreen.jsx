import React from 'react';
import { sounds, narrate, unlockAudio } from '../../utils/audio.js';

export default function IntroScreen({ state, onStart }) {
  const handleStart = () => {
    unlockAudio();
    sounds.ding();
    onStart('wonder');
  };

  const handleMascotClick = () => {
    unlockAudio();
    sounds.pop();
    narrate("Ready to crack the code of numbers? Join Archie and Maya on a mission to balance scales, solve linear equations, and master algebra!", "encouragement");
  };

  return (
    <div className="home-screen-wrapper">
      {/* Top Bar: Curriculum Badge & Close Button */}
      <div className="home-top-bar">
        <div className="curriculum-badge">
          <span className="badge-sparkle">✦</span>
          <span>MOE Curriculum · Grade 7</span>
        </div>

        <button className="top-close-btn" aria-label="Close" onClick={() => window.history.back?.()}>
          <span>✕</span>
        </button>
      </div>

      {/* Hero Title Block */}
      <div className="home-hero-section">
        <h1 className="quest-title-white">Algebra Quest</h1>
        <h2 className="quest-title-yellow">One step Equations</h2>
      </div>

      {/* Mascot Speech Bubble Pill (Clickable to hear voice) */}
      <div
        className="mascot-pill-row"
        onClick={handleMascotClick}
        style={{ cursor: 'pointer' }}
        title="Tap to listen to Archie & Maya!"
      >
        <div className="mascot-circle-avatar" role="img" aria-label="Archie Fox">
          🦊
        </div>
        <div className="mascot-white-pill">
          <span>Ready to crack the code of numbers? 🔓</span>
          <span style={{ marginLeft: '8px', fontSize: '0.9rem' }}>🔊</span>
        </div>
      </div>

      {/* Mission Subtitle Description */}
      <p className="home-mission-desc">
        Join Archie & Maya on a mission to write, simplify, and evaluate algebraic
        equations using balance scales, inverse operations, and real-life mysteries!
      </p>

      {/* Learning Journey Overview Box (Matches Reference Image) */}
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
                <div className="node-name">Wonder</div>
                <div className="node-sub">Spark curiosity</div>
              </div>
            </div>

            <div className="roadmap-arrow">→</div>

            <div className="roadmap-node">
              <div className="node-icon-circle gold-ring">
                <span>📖</span>
              </div>
              <div className="node-text-group">
                <div className="node-name">Story</div>
                <div className="node-sub">Hear the tale</div>
              </div>
            </div>

            <div className="roadmap-arrow">→</div>

            <div className="roadmap-node">
              <div className="node-icon-circle teal-ring">
                <span>🧪</span>
              </div>
              <div className="node-text-group">
                <div className="node-name">Simulate</div>
                <div className="node-sub">Explore & discover</div>
              </div>
            </div>
          </div>

          {/* Row 2: Practice -> Reflect */}
          <div className="roadmap-row roadmap-row-bottom">
            <div className="roadmap-node">
              <div className="node-icon-circle purple-ring">
                <span>🎮</span>
              </div>
              <div className="node-text-group">
                <div className="node-name">Practice</div>
                <div className="node-sub">Test your skills</div>
              </div>
            </div>

            <div className="roadmap-arrow">→</div>

            <div className="roadmap-node">
              <div className="node-icon-circle blue-ring">
                <span>📓</span>
              </div>
              <div className="node-text-group">
                <div className="node-name">Reflect</div>
                <div className="node-sub">What did you learn?</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Glowing Call to Action Button */}
      <div className="home-cta-wrapper">
        <button className="begin-journey-btn" onClick={handleStart}>
          <span>🚀 Begin Your Journey!</span>
        </button>
      </div>

      {/* Bottom 3 Feature Cards (Matches Reference Image) */}
      <div className="home-bottom-cards">
        <div className="bottom-mini-card">
          <div className="mini-card-icon blue-bg">
            <span>🔤</span>
          </div>
          <div className="mini-card-title">Letters & Terms</div>
          <div className="mini-card-sub">Variables & expressions</div>
        </div>

        <div className="bottom-mini-card">
          <div className="mini-card-icon red-bg">
            <span>🧮</span>
          </div>
          <div className="mini-card-title">Simulations</div>
          <div className="mini-card-sub">Interactive labs</div>
        </div>

        <div className="bottom-mini-card">
          <div className="mini-card-icon gold-bg">
            <span>🏆</span>
          </div>
          <div className="mini-card-title">10 Game Worlds</div>
          <div className="mini-card-sub">XP & awards</div>
        </div>
      </div>
    </div>
  );
}
