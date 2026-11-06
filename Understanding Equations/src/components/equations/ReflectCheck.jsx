import React, { useState, useEffect } from 'react';
import { NARRATION } from '../../utils/equationsNarration.js';
import { narrate, sounds, stopNarration, unlockAudio } from '../../utils/audio.js';

export default function ReflectCheck({ onNext, onSaveReflection, onAddXP }) {
  const [activePromptIdx, setActivePromptIdx] = useState(0);
  const [answers, setAnswers] = useState({
    bothsides: '',
    check: '',
    diff: ''
  });
  const [isSaved, setIsSaved] = useState(false);

  const prompts = NARRATION.reflect.prompts;
  const currentPrompt = prompts[activePromptIdx];

  useEffect(() => {
    unlockAudio();
    narrate(NARRATION.reflect.intro, NARRATION.reflect.style);
    return () => {
      stopNarration();
    };
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setAnswers(prev => ({ ...prev, [currentPrompt.id]: val }));
  };

  const handleNextPrompt = () => {
    sounds.click();
    if (activePromptIdx < prompts.length - 1) {
      setActivePromptIdx(i => i + 1);
    } else {
      // Save reflections and dispatch
      sounds.ding();
      setIsSaved(true);
      onSaveReflection(answers);
      onAddXP(40);
    }
  };

  const handleFinish = () => {
    sounds.celebration();
    onNext();
  };

  const currentAnswer = answers[currentPrompt.id] || '';

  return (
    <div className="glass-card reflect-phase-card">
      {/* Top Header */}
      <div className="phase-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="badge badge-purple" style={{ marginBottom: '6px' }}>
            <span>📓 Phase 05</span> <span>· Reflect & Connect</span>
          </div>
          <h2 style={{ fontSize: '2.1rem', color: 'var(--text-main)', fontFamily: 'var(--font-fun)' }}>
            Consolidate Your Mathematical Thinking
          </h2>
        </div>
        <div className="badge badge-gold">
          <span>+40 XP on completion</span>
        </div>
      </div>

      {/* Mascot Guidance */}
      <div className="mascot-container" style={{ margin: '10px 0' }}>
        <div className="mascot">👧</div>
        <div className="speech-bubble">
          <div className="speaker-name">Maya's Reflection Prompt</div>
          <div className="speech-text">
            "Reflecting on balance scales and inverse operations makes you a true algebraic master! Share your insights below to lock in your discoveries."
          </div>
        </div>
      </div>

      {/* Main Reflection Box */}
      <div style={{ background: 'rgba(20, 16, 48, 0.85)', border: '1.5px solid var(--purple-border)', borderRadius: 'var(--radius-md)', padding: '18px', margin: '10px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ color: 'var(--teal-bright)', fontWeight: 800, fontSize: '1.1rem' }}>
            Reflection Question {activePromptIdx + 1} of {prompts.length}
          </span>
          <span style={{ color: 'var(--text-dim)', fontSize: '0.95rem' }}>
            {Object.values(answers).filter(v => v.trim().length > 0).length} of {prompts.length} answered
          </span>
        </div>

        <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '8px' }}>
          {currentPrompt.question}
        </h3>

        <div style={{ color: 'var(--gold-bright)', fontSize: '1.05rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>💡 Hint:</span> <span>{currentPrompt.hint}</span>
        </div>

        <textarea
          value={currentAnswer}
          onChange={handleInputChange}
          placeholder="Type your explanation here in your own words..."
          rows={4}
          style={{
            width: '100%',
            background: 'rgba(10, 8, 25, 0.8)',
            border: '1.5px solid var(--purple-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 16px',
            color: 'var(--text-main)',
            fontFamily: 'var(--font-main)',
            fontSize: '1.15rem',
            lineHeight: 1.5,
            resize: 'none',
            outline: 'none'
          }}
        />
      </div>

      {/* Action Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
        <button
          className="btn btn-ghost"
          onClick={() => setActivePromptIdx(i => Math.max(0, i - 1))}
          disabled={activePromptIdx === 0}
        >
          <span>◀ Previous Question</span>
        </button>

        {activePromptIdx < prompts.length - 1 ? (
          <button className="btn btn-primary" onClick={handleNextPrompt}>
            <span>Next Reflection ▶</span>
          </button>
        ) : !isSaved ? (
          <button className="btn btn-gold" onClick={handleNextPrompt}>
            <span>Save Reflection (+40 XP) 💾</span>
          </button>
        ) : (
          <button className="btn btn-gold" onClick={handleFinish}>
            <span>Claim Balance Master Badge 🏆</span>
          </button>
        )}
      </div>
    </div>
  );
}
