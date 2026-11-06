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
    narrate('reflect_intro', 'thinking');
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
      sounds.ding();
      setIsSaved(true);
      onSaveReflection(answers);
      onAddXP(40);
    }
  };

  const handleFinish = () => {
    sounds.celebration();
    onNext('summary');
  };

  const currentAnswer = answers[currentPrompt.id] || '';

  return (
    <div className="glass-card reflect-phase-card">
      {/* Top Header */}
      <div className="phase-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div>
          <div className="badge badge-purple" style={{ marginBottom: '4px' }}>
            <span>📓 Phase 05</span> <span>· Reflect & Connect</span>
          </div>
          <h2 style={{ fontSize: '1.45rem', color: 'var(--text-main)', fontFamily: 'var(--font-fun)', fontWeight: 800 }}>
            Consolidate Your Mathematical Thinking
          </h2>
        </div>
        <div className="badge badge-gold" style={{ fontSize: '0.85rem' }}>
          <span>+40 XP on completion</span>
        </div>
      </div>

      {/* Mascot Guidance */}
      <div className="mascot-container" style={{ margin: '8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div className="mascot" style={{ fontSize: '2.4rem' }}>🦊</div>
        <div className="speech-bubble" style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: '0.95rem' }}>
            {NARRATION.reflect.intro.text}
          </p>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="reflect-step-indicators" style={{ display: 'flex', gap: '8px', margin: '12px 0' }}>
        {prompts.map((p, idx) => (
          <button
            key={p.id}
            className={`btn ${idx === activePromptIdx ? 'btn-gold' : answers[p.id] ? 'btn-primary' : 'btn-ghost'}`}
            style={{ flex: 1, padding: '6px 10px', fontSize: '0.85rem' }}
            onClick={() => setActivePromptIdx(idx)}
          >
            Prompt {idx + 1} {answers[p.id] ? '✓' : ''}
          </button>
        ))}
      </div>

      {/* Prompt Card & Response Input */}
      <div className="reflect-question-box" style={{ background: 'rgba(15, 10, 36, 0.85)', border: '1.5px solid var(--purple-border)', borderRadius: '16px', padding: '16px', margin: '10px 0' }}>
        <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--gold-bright)', marginBottom: '6px' }}>
          {currentPrompt.question}
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '10px' }}>
          💡 Hint: {currentPrompt.hint}
        </div>

        <textarea
          className="reflect-textarea"
          value={currentAnswer}
          onChange={handleInputChange}
          placeholder="Write your thoughts in your own words..."
          rows={3}
          style={{
            width: '100%',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--purple-border)',
            borderRadius: '10px',
            color: '#ffffff',
            padding: '10px 14px',
            fontSize: '0.95rem',
            fontFamily: 'var(--font-main)',
            resize: 'none',
            outline: 'none'
          }}
        />
      </div>

      {/* Footer Navigation */}
      <div className="phase-footer-row" style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          className="home-btn"
          onClick={() => setActivePromptIdx(i => Math.max(0, i - 1))}
          disabled={activePromptIdx === 0}
          style={{ opacity: activePromptIdx === 0 ? 0.4 : 1 }}
        >
          <span>← Previous</span>
        </button>

        {activePromptIdx < prompts.length - 1 ? (
          <button className="btn-next-phase" onClick={handleNextPrompt}>
            <span>Next Prompt ➔</span>
          </button>
        ) : (
          <button className="btn-next-phase" onClick={isSaved ? handleFinish : handleNextPrompt}>
            <span>{isSaved ? 'Complete & View Summary 🏆' : 'Save Reflection (+40 XP) 💾'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
