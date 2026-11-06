/* =========================================================
   REFLECT CHECK COMPONENT
   Consolidates mastery with 3 deep-thinking probability prompts
   ========================================================= */

import React, { useState, useEffect } from 'react';
import { REFLECT_NARRATION } from '../../utils/probabilityNarration';
import { sounds, playNarration } from '../../utils/audio';

export default function ReflectCheck({ onNextPhase, onSaveReflection, initialNotes = {} }) {
  const [selectedPrompt, setSelectedPrompt] = useState('lawLargeNumbers');
  const [reflectionText, setReflectionText] = useState(initialNotes.lawLargeNumbers || '');
  const [confidence, setConfidence] = useState(initialNotes.confidence || 5);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    playNarration(REFLECT_NARRATION.intro.text, REFLECT_NARRATION.intro.style);
  }, []);

  const prompts = [
    {
      id: 'lawLargeNumbers',
      title: 'The Coin Marathon Mystery',
      question: 'If you flip a coin 10 times and get 8 heads, is the coin definitely rigged? Why or why not?',
      hint: 'Think about sample size! With only 10 flips, random variation is natural. To test fairness, you need hundreds of trials!'
    },
    {
      id: 'fairVsBiased',
      title: 'Detecting Rigged Games',
      question: 'How can a probability detective determine whether a carnival dice or spinner is biased?',
      hint: 'Conduct a large experiment (e.g. 500+ trials), calculate the experimental probability, and measure if it strongly deviates from theory!'
    },
    {
      id: 'realWorld',
      title: 'Real-World Applications',
      question: 'Where do doctors, scientists, or weather forecasters rely on experimental probability in everyday life?',
      hint: 'Examples: vaccine clinical trials, rainfall probability percentages, microchip quality control, and sports statistics!'
    }
  ];

  const handleSave = () => {
    sounds.correct();
    setSaved(true);
    if (onSaveReflection) {
      onSaveReflection({
        promptId: selectedPrompt,
        text: reflectionText,
        confidence: confidence
      });
    }
  };

  const activeP = prompts.find(p => p.id === selectedPrompt);

  return (
    <div className="phase-container">
      {/* Header */}
      <div className="phase-header-bar">
        <div className="phase-title-group">
          <h2><span>📓</span> Phase 05: Reflection & Mastery Check</h2>
          <p>Consolidate your discoveries and journal your key probability insights.</p>
        </div>
        <div className="mascot-speaker-badge">
          <span className="avatar">🦊</span>
          <span className="speaker-name">Detective Journal</span>
        </div>
      </div>

      <div className="reflection-main-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1.4fr', gap: '24px' }}>
        {/* Left: Prompt Selection */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ color: 'var(--teal-400)', fontFamily: 'var(--font-heading)', fontSize: '1.15rem', marginBottom: '14px' }}>
            Choose a Prompt to Journal:
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {prompts.map(p => (
              <button
                key={p.id}
                onClick={() => { sounds.click(); setSelectedPrompt(p.id); setSaved(false); }}
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: selectedPrompt === p.id ? '1.5px solid var(--gold-400)' : '1px solid rgba(255,255,255,0.1)',
                  background: selectedPrompt === p.id ? 'rgba(255, 184, 0, 0.15)' : 'rgba(255,255,255,0.03)',
                  color: '#fff',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontWeight: 700, color: selectedPrompt === p.id ? 'var(--gold-300)' : '#fff' }}>
                  {p.title}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                  {p.question.slice(0, 55)}...
                </div>
              </button>
            ))}
          </div>

          {/* Confidence Slider */}
          <div style={{ marginTop: '24px', background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '10px' }}>
            <label style={{ display: 'block', color: 'var(--gold-300)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px' }}>
              My Probability Confidence Level: {confidence} / 5 ⭐
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={confidence}
              onChange={(e) => setConfidence(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--gold-400)' }}
            />
          </div>
        </div>

        {/* Right: Thought Input Area */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ color: 'var(--gold-400)', fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '8px' }}>
              {activeP.question}
            </h3>
            <div style={{ fontSize: '0.88rem', color: 'var(--teal-300)', background: 'rgba(0, 229, 255, 0.08)', padding: '10px 14px', borderRadius: '8px', marginBottom: '14px' }}>
              💡 <strong>Clue:</strong> {activeP.hint}
            </div>

            <textarea
              className="reflection-textarea"
              placeholder="Write your explanation and findings here..."
              value={reflectionText}
              onChange={(e) => { setReflectionText(e.target.value); setSaved(false); }}
              rows={6}
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '10px',
                padding: '12px',
                color: '#fff',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ marginTop: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              className="btn-primary"
              onClick={handleSave}
              style={{ flex: 1, justifyContent: 'center' }}
            >
              {saved ? '✓ Saved to Journal!' : '💾 Save Reflection (+30 XP)'}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Phase Navigation */}
      <div className="phase-bottom-bar" style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          className="btn-gold"
          onClick={() => { sounds.fanfare(); onNextPhase(); }}
          style={{ padding: '12px 32px' }}
        >
          <span>Claim Probability Pro Badge →</span>
        </button>
      </div>
    </div>
  );
}
