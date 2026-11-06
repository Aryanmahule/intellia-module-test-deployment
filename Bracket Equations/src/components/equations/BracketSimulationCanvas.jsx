import React, { useState } from 'react';
import { sounds, unlockAudio } from '../../utils/audio.js';

/**
 * BracketSimulationCanvas
 * Interactive visual token animator and area model for bracket equations.
 * Modes:
 * - 'area': Distributive Area Model: height a, widths x and b.
 * - 'tokens': Step-through equation evaluation: (2 + 3) × 4 -> 5 × 4 -> 20.
 * - 'placeBrackets': Interactive tapping to place brackets to hit target.
 */
export default function BracketSimulationCanvas({
  mode = 'area', // 'area' | 'tokens' | 'placeBrackets'
  onComplete
}) {
  // Area Model state
  const [factorA, setFactorA] = useState(3);
  const [constB, setConstB] = useState(4);
  const [isExpanded, setIsExpanded] = useState(false);

  // Token Step-through state
  const [tokenStep, setTokenStep] = useState(0); // 0: (2 + 3) × 4, 1: 5 × 4, 2: 20

  // Place Brackets Challenge state
  const [selectedPair, setSelectedPair] = useState(null); // 'none' | 'first' | 'second'
  const [challengeSolved, setChallengeSolved] = useState(false);

  const handleStepTokens = () => {
    unlockAudio();
    sounds.pop();
    if (tokenStep < 2) {
      setTokenStep(prev => prev + 1);
      if (tokenStep === 1) {
        sounds.correct();
        onComplete?.();
      }
    } else {
      setTokenStep(0);
    }
  };

  const handleToggleExpand = () => {
    unlockAudio();
    sounds.pop();
    setIsExpanded(prev => !prev);
    if (!isExpanded) {
      sounds.ding();
      onComplete?.();
    }
  };

  const handleBracketChoice = (choice) => {
    unlockAudio();
    setSelectedPair(choice);
    if (choice === 'first') {
      // (2 + 3) * 4 = 20 -> Correct!
      sounds.correct();
      setChallengeSolved(true);
      onComplete?.();
    } else {
      sounds.wrong();
      setChallengeSolved(false);
    }
  };

  return (
    <div className="bracket-simulation-canvas glass-panel" style={{
      width: '100%',
      padding: '20px',
      borderRadius: '20px',
      background: 'rgba(22, 9, 44, 0.85)',
      border: '1.5px solid rgba(168, 85, 247, 0.35)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px'
    }}>
      {/* MODE 1: DISTRIBUTIVE AREA MODEL */}
      {mode === 'area' && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <label style={{ color: '#e2e8f0', fontSize: '0.95rem', fontWeight: 600 }}>
              Outside Factor (Height a):{' '}
              <select
                value={factorA}
                onChange={(e) => { sounds.click(); setFactorA(Number(e.target.value)); }}
                style={{ background: '#2e1065', color: '#fde047', border: '1px solid #a855f7', padding: '4px 10px', borderRadius: '8px', fontWeight: 700 }}
              >
                {[2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>

            <label style={{ color: '#e2e8f0', fontSize: '0.95rem', fontWeight: 600 }}>
              Inside Constant (Width b):{' '}
              <select
                value={constB}
                onChange={(e) => { sounds.click(); setConstB(Number(e.target.value)); }}
                style={{ background: '#2e1065', color: '#67e8f9', border: '1px solid #06b6d4', padding: '4px 10px', borderRadius: '8px', fontWeight: 700 }}
              >
                {[2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
          </div>

          {/* SVG Area Model */}
          <div style={{ width: '100%', maxWidth: '440px', background: 'rgba(12, 4, 25, 0.7)', borderRadius: '16px', padding: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <svg viewBox="0 0 380 180" style={{ width: '100%', height: 'auto', display: 'block' }}>
              <defs>
                <linearGradient id="rectVar" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#581c87" />
                </linearGradient>
                <linearGradient id="rectConst" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#0284c7" />
                  <stop offset="100%" stopColor="#0369a1" />
                </linearGradient>
              </defs>

              {/* Outside height label */}
              <text x="35" y="105" fill="#fde047" fontSize="22" fontWeight="900" textAnchor="middle">{factorA}</text>

              {/* Bracket width top label */}
              <text x="145" y="24" fill="#c084fc" fontSize="18" fontWeight="800" textAnchor="middle">x</text>
              <text x="285" y="24" fill="#38bdf8" fontSize="18" fontWeight="800" textAnchor="middle">{constB}</text>

              {/* Section 1: Variable Area */}
              <rect x="70" y="35" width="150" height="130" rx="10" fill="url(#rectVar)" stroke="#a855f7" strokeWidth="2.5" />
              <text x="145" y="105" fill="#ffffff" fontSize="22" fontWeight="900" textAnchor="middle">
                {isExpanded ? `${factorA}x` : `${factorA} × x`}
              </text>
              <text x="145" y="130" fill="#e9d5ff" fontSize="12" fontWeight="600" textAnchor="middle">Area 1</text>

              {/* Section 2: Constant Area */}
              <rect x="225" y="35" width="120" height="130" rx="10" fill="url(#rectConst)" stroke="#38bdf8" strokeWidth="2.5" />
              <text x="285" y="105" fill="#ffffff" fontSize="22" fontWeight="900" textAnchor="middle">
                {isExpanded ? `${factorA * constB}` : `${factorA} × ${constB}`}
              </text>
              <text x="285" y="130" fill="#bae6fd" fontSize="12" fontWeight="600" textAnchor="middle">Area 2</text>
            </svg>
          </div>

          {/* Equation Ribbon */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(255,255,255,0.06)',
            padding: '10px 24px',
            borderRadius: '999px',
            fontSize: '1.25rem',
            fontFamily: "'Space Grotesk', monospace",
            fontWeight: 800
          }}>
            <span style={{ color: '#fde047' }}>{factorA}(x + {constB})</span>
            <span style={{ color: '#cbd5e1' }}>=</span>
            <span style={{ color: '#38bdf8' }}>{factorA}x + {factorA * constB}</span>
          </div>

          <button
            className="btn-gold"
            onClick={handleToggleExpand}
            style={{ padding: '8px 24px', fontSize: '0.95rem' }}
          >
            {isExpanded ? '🔄 Reset to Bracket Form' : '✨ Expand with Rainbow Arrows'}
          </button>
        </div>
      )}

      {/* MODE 2: TOKEN STEP-THROUGH */}
      {mode === 'tokens' && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div style={{ color: '#e2e8f0', fontSize: '1rem', fontWeight: 600 }}>
            Watch the expression transform step-by-step:
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '24px 36px',
            background: 'rgba(12, 4, 25, 0.8)',
            borderRadius: '20px',
            border: '2px solid #a855f7',
            boxShadow: '0 0 25px rgba(168, 85, 247, 0.35)',
            fontFamily: "'Space Grotesk', monospace"
          }}>
            {tokenStep === 0 && (
              <>
                <div style={{ background: '#7c3aed', color: '#fff', padding: '10px 18px', borderRadius: '12px', fontSize: '1.8rem', fontWeight: 800, boxShadow: '0 0 15px rgba(124, 58, 237, 0.6)' }}>
                  (2 + 3)
                </div>
                <div style={{ color: '#94a3b8', fontSize: '1.8rem', fontWeight: 700 }}>×</div>
                <div style={{ background: '#0284c7', color: '#fff', padding: '10px 18px', borderRadius: '12px', fontSize: '1.8rem', fontWeight: 800 }}>
                  4
                </div>
              </>
            )}

            {tokenStep === 1 && (
              <>
                <div style={{ background: '#10b981', color: '#fff', padding: '10px 18px', borderRadius: '12px', fontSize: '1.8rem', fontWeight: 800, boxShadow: '0 0 15px rgba(16, 185, 129, 0.6)' }}>
                  5
                </div>
                <div style={{ color: '#94a3b8', fontSize: '1.8rem', fontWeight: 700 }}>×</div>
                <div style={{ background: '#0284c7', color: '#fff', padding: '10px 18px', borderRadius: '12px', fontSize: '1.8rem', fontWeight: 800 }}>
                  4
                </div>
              </>
            )}

            {tokenStep === 2 && (
              <div style={{ background: '#f59e0b', color: '#fff', padding: '12px 28px', borderRadius: '14px', fontSize: '2.4rem', fontWeight: 900, boxShadow: '0 0 25px rgba(245, 158, 11, 0.7)' }}>
                20 🎉
              </div>
            )}
          </div>

          <div style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>
            {tokenStep === 0 && 'Step 1: Brackets group (2 + 3) together first!'}
            {tokenStep === 1 && 'Step 2: Inside brackets evaluates to 5. Now multiply by 4!'}
            {tokenStep === 2 && 'Step 3: Final evaluated answer = 20!'}
          </div>

          <button
            className="btn-gold"
            onClick={handleStepTokens}
            style={{ padding: '10px 28px' }}
          >
            {tokenStep < 2 ? 'Next Step ▶' : '🔄 Restart Calculation'}
          </button>
        </div>
      )}

      {/* MODE 3: PLACE BRACKETS CHALLENGE */}
      {mode === 'placeBrackets' && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px' }}>
          <div style={{ color: '#e2e8f0', fontSize: '1.1rem', fontWeight: 700, textAlign: 'center' }}>
            Target: Make the expression equal <span style={{ color: '#ffb800', fontSize: '1.4rem' }}>20</span>!
          </div>

          <p style={{ color: '#94a3b8', fontSize: '0.9rem', textAlign: 'center', maxWidth: '400px' }}>
            Where should you insert brackets into <code style={{ color: '#fde047' }}>2 + 3 × 4</code> to make it equal 20?
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => handleBracketChoice('first')}
              style={{
                padding: '14px 22px',
                borderRadius: '14px',
                background: selectedPair === 'first' ? (challengeSolved ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 94, 98, 0.25)') : 'rgba(255, 255, 255, 0.08)',
                border: `2px solid ${selectedPair === 'first' ? (challengeSolved ? '#10b981' : '#ff5e62') : '#a855f7'}`,
                color: '#ffffff',
                fontFamily: "'Space Grotesk', monospace",
                fontSize: '1.25rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: selectedPair === 'first' && challengeSolved ? '0 0 20px rgba(16, 185, 129, 0.5)' : 'none'
              }}
            >
              (2 + 3) × 4
            </button>

            <button
              onClick={() => handleBracketChoice('second')}
              style={{
                padding: '14px 22px',
                borderRadius: '14px',
                background: selectedPair === 'second' ? 'rgba(255, 94, 98, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                border: `2px solid ${selectedPair === 'second' ? '#ff5e62' : 'rgba(255, 255, 255, 0.2)'}`,
                color: '#ffffff',
                fontFamily: "'Space Grotesk', monospace",
                fontSize: '1.25rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              2 + (3 × 4)
            </button>
          </div>

          {selectedPair && (
            <div style={{
              padding: '10px 20px',
              borderRadius: '999px',
              fontWeight: 700,
              fontSize: '0.95rem',
              background: challengeSolved ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: `1px solid ${challengeSolved ? '#10b981' : '#ef4444'}`,
              color: challengeSolved ? '#34d399' : '#f87171'
            }}>
              {challengeSolved
                ? '🎯 Correct! (2 + 3) × 4 = 5 × 4 = 20!'
                : '❌ 2 + (3 × 4) = 2 + 12 = 14, which does not equal 20!'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
