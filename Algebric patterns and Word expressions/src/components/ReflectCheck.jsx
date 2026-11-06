import React, { useState, useEffect } from 'react';
import { REFLECT_NARRATION } from '../utils/patternsNarration';
import { sounds, playNarration } from '../utils/audio';

export default function ReflectCheck({ onNextPhase, onSaveReflection, initialNotes = {} }) {
  const [selectedPrompt, setSelectedPrompt] = useState('trap');
  const [reflectionText, setReflectionText] = useState(initialNotes.ruleCheck || '');
  const [confidence, setConfidence] = useState(initialNotes.confidence || 5);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    playNarration(REFLECT_NARRATION.intro.text, REFLECT_NARRATION.intro.style);
  }, []);

  const prompts = [
    {
      id: 'trap',
      title: 'The "Less Than" Trap',
      question: 'Why is "5 less than x" written as (x − 5) and NOT (5 − x)?',
      hint: 'Think about who is losing 5: you start with quantity x and decrease it by 5!'
    },
    {
      id: 'verify',
      title: 'Testing Your Rule',
      question: 'How can you verify that your nth-term formula (like 3n + 1) is 100% correct?',
      hint: 'Substitute n = 1, 2, 3 into your formula and check if they match the original terms!'
    },
    {
      id: 'realworld',
      title: 'Patterns in Daily Life',
      question: 'Where in Singapore or your daily routine have you spotted a linear pattern?',
      hint: 'Examples: joined hawker tables, bus fares, stairs, MRT stops, or phone data plans.'
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

  return (
    <div className="phase-container">
      {/* Header */}
      <div className="phase-header-bar">
        <div className="phase-title-group">
          <h2><span>📓</span> Phase 05: Reflection & Mastery Check</h2>
          <p>Consolidate your learning and capture your key algebra insights.</p>
        </div>
        <div className="mascot-speaker-badge">
          <span className="avatar">🦊</span>
          <span className="speaker-name">Detective Journal</span>
        </div>
      </div>

      {/* Main 2-column Grid */}
      <div className="reflect-grid">
        {/* Left Column: Prompts Selection */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 style={{ color: 'var(--gold-300)', fontFamily: 'var(--font-heading)', fontSize: '1.2rem' }}>
            Choose a Reflection Prompt:
          </h3>

          {prompts.map(p => (
            <div
              key={p.id}
              onClick={() => { sounds.click(); setSelectedPrompt(p.id); }}
              style={{
                background: selectedPrompt === p.id ? 'rgba(168, 85, 247, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                border: selectedPrompt === p.id ? '1.5px solid var(--gold-400)' : '1px solid var(--border-glass)',
                borderRadius: '14px',
                padding: '14px 18px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ color: selectedPrompt === p.id ? 'var(--gold-300)' : '#ffffff', fontWeight: 700, fontSize: '1.05rem' }}>
                {p.title}
              </div>
              <div style={{ color: '#cbd5e1', fontSize: '0.88rem', marginTop: '4px' }}>
                {p.question}
              </div>
            </div>
          ))}

          {/* Self-Rating Stars */}
          <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
            <div style={{ color: '#e2e8f0', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>
              How confident do you feel with algebraic patterns & expressions?
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => { sounds.pop(); setConfidence(star); }}
                  style={{
                    background: star <= confidence ? 'rgba(255, 184, 0, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                    border: star <= confidence ? '1.5px solid var(--gold-400)' : '1px solid var(--border-glass)',
                    color: star <= confidence ? 'var(--gold-300)' : 'var(--text-dim)',
                    fontSize: '1.4rem',
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    cursor: 'pointer'
                  }}
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Reflection Input */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ color: '#ffffff', fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '8px' }}>
              Your Detective Journal Entry
            </h3>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '14px' }}>
              {prompts.find(p => p.id === selectedPrompt)?.hint}
            </p>

            <textarea
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              placeholder="Type your reflection here... (e.g., 'I learned that 5 less than x is x - 5 because...')"
              rows={6}
              style={{
                width: '100%',
                background: 'rgba(10, 3, 22, 0.8)',
                border: '1.5px solid var(--border-purple)',
                borderRadius: '12px',
                color: '#ffffff',
                padding: '14px',
                fontFamily: 'var(--font-heading)',
                fontSize: '1rem',
                lineHeight: 1.5,
                resize: 'none',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px' }}>
            <button className="btn-secondary" onClick={handleSave}>
              <span>{saved ? '✓ Saved (+30 XP)' : '💾 Save Journal'}</span>
            </button>

            <button
              className="btn-gold"
              onClick={() => {
                sounds.fanfare();
                onNextPhase();
              }}
            >
              <span>View Mastery Summary</span>
              <span>➔</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
