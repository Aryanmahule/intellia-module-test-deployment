import React, { useState, useEffect } from 'react';
import { REFLECT_NARRATION } from '../../utils/ratesNarration.js';
import { narrate, sounds, stopNarration, unlockAudio } from '../../utils/audio.js';

export default function ReflectCheck({ onNext, onSaveReflection, onAddXP }) {
  const [activePromptIdx, setActivePromptIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSaved, setIsSaved] = useState(false);

  const prompts = REFLECT_NARRATION.prompts;
  const currentPrompt = prompts[activePromptIdx];

  useEffect(() => {
    unlockAudio();
    narrate(REFLECT_NARRATION.intro.spoken, REFLECT_NARRATION.intro.style);
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
      sounds.pop();
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
            <span>📓 Phase 05</span> <span>• Reflect & Connect</span>
          </div>
          <h2 style={{ fontSize: '2.1rem', color: 'var(--text-main)', fontFamily: 'var(--font-fun)' }}>
            Consolidate Your Rates Discoveries
          </h2>
        </div>
        <div className="badge badge-gold">
          <span>+40 XP on completion</span>
        </div>
      </div>

      {/* Mascot Guidance */}
      <div className="mascot-container" style={{ margin: '8px 0' }}>
        <div className="mascot" style={{ fontSize: '2.4rem' }}>🦊🏎️</div>
        <div className="speech-bubble">
          <div className="speaker-name">Ravi's Reflection Pit Stop</div>
          <p>{REFLECT_NARRATION.intro.spoken}</p>
        </div>
      </div>

      {/* Interactive Reflection Card */}
      <div
        className="reflection-box"
        style={{
          background: 'rgba(26, 20, 62, 0.85)',
          border: '1.5px solid var(--purple-border)',
          borderRadius: '18px',
          padding: '20px',
          margin: '10px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="badge badge-teal" style={{ fontSize: '0.85rem' }}>
            Prompt {activePromptIdx + 1} of {prompts.length}
          </span>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>
            Personal Synthesis
          </span>
        </div>

        <h3 style={{ fontSize: '1.35rem', color: 'var(--text-main)', margin: '4px 0' }}>
          {currentPrompt.prompt}
        </h3>

        <textarea
          value={currentAnswer}
          onChange={handleInputChange}
          placeholder={currentPrompt.placeholder}
          rows={3}
          style={{
            width: '100%',
            background: 'rgba(15, 10, 35, 0.85)',
            border: '1.5px solid var(--purple-border)',
            borderRadius: '12px',
            color: 'var(--text-main)',
            padding: '14px',
            fontSize: '1.05rem',
            fontFamily: 'var(--font-main)',
            resize: 'none',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Quick Idea Chips */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {activePromptIdx === 0 && (
              <>
                <button
                  type="button"
                  onClick={() => setAnswers(prev => ({ ...prev, unit_price_fair: (prev.unit_price_fair ? prev.unit_price_fair + ' ' : '') + 'Different pack sizes make total prices misleading; per 1 unit equalizes them.' }))}
                  style={{ background: 'rgba(45, 36, 100, 0.8)', border: '1px solid var(--purple-border)', color: 'var(--teal-bright)', padding: '5px 12px', borderRadius: '9999px', fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  + Equalizes pack sizes
                </button>
                <button
                  type="button"
                  onClick={() => setAnswers(prev => ({ ...prev, unit_price_fair: (prev.unit_price_fair ? prev.unit_price_fair + ' ' : '') + 'Lower cost per 1 kg or litre is the true bargain.' }))}
                  style={{ background: 'rgba(45, 36, 100, 0.8)', border: '1px solid var(--purple-border)', color: 'var(--gold-bright)', padding: '5px 12px', borderRadius: '9999px', fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  + Cost per 1 kg is true bargain
                </button>
              </>
            )}

            {activePromptIdx === 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setAnswers(prev => ({ ...prev, graph_slope: (prev.graph_slope ? prev.graph_slope + ' ' : '') + 'Slope is rise over run (change in y per 1 unit of x), which is the unit rate.' }))}
                  style={{ background: 'rgba(45, 36, 100, 0.8)', border: '1px solid var(--purple-border)', color: 'var(--teal-bright)', padding: '5px 12px', borderRadius: '9999px', fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  + Rise over run = Unit Rate
                </button>
                <button
                  type="button"
                  onClick={() => setAnswers(prev => ({ ...prev, graph_slope: (prev.graph_slope ? prev.graph_slope + ' ' : '') + 'Steeper line means a higher speed or faster rate.' }))}
                  style={{ background: 'rgba(45, 36, 100, 0.8)', border: '1px solid var(--purple-border)', color: 'var(--gold-bright)', padding: '5px 12px', borderRadius: '9999px', fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  + Steeper line = Higher speed
                </button>
              </>
            )}

            {activePromptIdx === 2 && (
              <>
                <button
                  type="button"
                  onClick={() => setAnswers(prev => ({ ...prev, real_world_rate: (prev.real_world_rate ? prev.real_world_rate + ' ' : '') + 'EZ-Link MRT fare per km travelled.' }))}
                  style={{ background: 'rgba(45, 36, 100, 0.8)', border: '1px solid var(--purple-border)', color: 'var(--neon-green)', padding: '5px 12px', borderRadius: '9999px', fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  + MRT fare per km
                </button>
                <button
                  type="button"
                  onClick={() => setAnswers(prev => ({ ...prev, real_world_rate: (prev.real_world_rate ? prev.real_world_rate + ' ' : '') + 'Hawker roast chicken rice at $4.50 per plate.' }))}
                  style={{ background: 'rgba(45, 36, 100, 0.8)', border: '1px solid var(--purple-border)', color: 'var(--gold-bright)', padding: '5px 12px', borderRadius: '9999px', fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  + Hawker meal per plate
                </button>
              </>
            )}
          </div>

          <button
            className="btn-secondary"
            onClick={handleNextPrompt}
            style={{ padding: '8px 20px', fontSize: '0.95rem' }}
          >
            {activePromptIdx < prompts.length - 1 ? 'Save & Next Prompt ➔' : 'Lock In All Reflections ✓'}
          </button>
        </div>
      </div>

      {/* Bottom Footer Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '8px' }}>
        <div style={{ color: 'var(--text-dim)', fontSize: '0.95rem' }}>
          {isSaved ? '✓ Reflections successfully recorded! XP awarded.' : 'Record your thoughts on all 3 prompts to complete reflection.'}
        </div>

        <button
          className="btn-primary"
          onClick={handleFinish}
          disabled={!isSaved}
          style={{
            opacity: isSaved ? 1 : 0.4,
            cursor: isSaved ? 'pointer' : 'not-allowed',
            padding: '12px 32px'
          }}
        >
          <span>View Rate Racer Badge</span>
          <span>➔</span>
        </button>
      </div>
    </div>
  );
}
