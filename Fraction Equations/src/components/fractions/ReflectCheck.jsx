import React, { useState, useEffect } from 'react';
import { NARRATION } from '../../utils/fractionsNarration.js';
import { narrate, sounds, unlockAudio } from '../../utils/audio.js';

export default function ReflectCheck({ onRecordReflection, onNext, onAddXP }) {
  const [answers, setAnswers] = useState({
    confidence: 'high',
    favoriteStrategy: 'bars'
  });
  const [activePromptIndex, setActivePromptIndex] = useState(0);

  const prompts = NARRATION.reflect.prompts;

  useEffect(() => {
    narrate(NARRATION.reflect.intro, 'thinking');
  }, []);

  const handleConfidenceSelect = (level) => {
    unlockAudio();
    sounds.click();
    setAnswers(prev => ({ ...prev, confidence: level }));
  };

  const handleStrategySelect = (strat) => {
    unlockAudio();
    sounds.click();
    setAnswers(prev => ({ ...prev, favoriteStrategy: strat }));
  };

  const handleFinishReflection = () => {
    try {
      unlockAudio();
      sounds.celebration();
    } catch (e) {
      console.warn('Audio effect failed:', e);
    }

    try {
      onRecordReflection?.(answers);
    } catch (e) {
      console.warn('Record reflection failed:', e);
    }

    try {
      onAddXP?.(40);
    } catch (e) {
      console.warn('Add XP failed:', e);
    }

    // Always transition to summary screen
    onNext();
  };

  return (
    <div className="phase-container reflect-screen">
      {/* Centered Phase Header */}
      <div className="phase-header-center">
        <span className="phase-badge">Phase 05 • Reflect & Consolidate</span>
        <h2 className="phase-title">Consolidating Your Fraction Mastery</h2>
        <p className="phase-subtitle">
          Pause, connect the concepts, and see how much you've discovered today!
        </p>
      </div>

      <div className="reflect-cards-grid">
        {/* Card 1: 3 Prompts Carousel */}
        <div className="reflect-card glass-panel">
          <div className="reflect-card-header">
            <span className="reflect-num-tag">Prompt {activePromptIndex + 1} of {prompts.length}</span>
            <div className="prompt-dots">
              {prompts.map((_, i) => (
                <span
                  key={i}
                  className={`prompt-dot ${i === activePromptIndex ? 'active' : ''}`}
                  onClick={() => { sounds.click(); setActivePromptIndex(i); }}
                />
              ))}
            </div>
          </div>

          <h3 className="reflect-question-text">{prompts[activePromptIndex].question}</h3>

          <div className="reflect-hint-box">
            <span className="hint-icon">💡</span>
            <p className="hint-text">{prompts[activePromptIndex].hint}</p>
          </div>

          <div className="reflect-prompt-actions">
            <button
              className="prompt-jump-btn"
              disabled={activePromptIndex === 0}
              onClick={() => { sounds.click(); setActivePromptIndex(prev => prev - 1); }}
            >
              ◀ Previous Prompt
            </button>
            <button
              className="prompt-jump-btn"
              disabled={activePromptIndex === prompts.length - 1}
              onClick={() => { sounds.click(); setActivePromptIndex(prev => prev + 1); }}
            >
              Next Prompt ▶
            </button>
          </div>
        </div>

        {/* Card 2: Self-Assessment & Reflection */}
        <div className="reflect-card glass-panel">
          <h3 className="reflect-card-title">How confident do you feel solving fraction equations?</h3>

          <div className="confidence-selector-row">
            {[
              { id: 'high', label: '🔥 Mastered!', desc: 'I can find common denominators and isolate x with ease.' },
              { id: 'medium', label: '⚡ Getting Stronger', desc: 'I can solve them with a quick reminder on common denominators.' },
              { id: 'low', label: '🌱 Still Practicing', desc: 'I need to practice simplifying and multiplying fractions once more.' }
            ].map((item) => (
              <button
                key={item.id}
                className={`conf-btn ${answers.confidence === item.id ? 'active' : ''}`}
                onClick={() => handleConfidenceSelect(item.id)}
              >
                <span className="conf-label">{item.label}</span>
                <span className="conf-desc">{item.desc}</span>
              </button>
            ))}
          </div>

          <div className="strategy-choice-box">
            <label className="input-label">Which mental model helped you the most?</label>
            <div className="strategy-chips-row">
              <button
                className={`strat-chip ${answers.favoriteStrategy === 'bars' ? 'active' : ''}`}
                onClick={() => handleStrategySelect('bars')}
              >
                🍕 Equivalent Fraction Bars
              </button>
              <button
                className={`strat-chip ${answers.favoriteStrategy === 'lcm' ? 'active' : ''}`}
                onClick={() => handleStrategySelect('lcm')}
              >
                ⚙️ Common Denominator Machine
              </button>
              <button
                className={`strat-chip ${answers.favoriteStrategy === 'balance' ? 'active' : ''}`}
                onClick={() => handleStrategySelect('balance')}
              >
                ⚖️ Balance Scale Method
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Final Summary Button ALWAYS Visible and Pulsing */}
      <div className="phase-bottom-nav">
        <span className="reflect-footer-note">All answers saved to your learning portfolio</span>
        <button
          className="action-btn-primary pulse-ready"
          onClick={handleFinishReflection}
        >
          <span>View Final Summary 🏆</span>
        </button>
      </div>
    </div>
  );
}
