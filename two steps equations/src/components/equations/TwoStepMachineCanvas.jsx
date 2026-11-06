import React, { useState, useEffect } from 'react';
import { sounds, unlockAudio } from '../../utils/audio.js';

/**
 * TwoStepMachineCanvas
 * Section 7: Pure SVG/CSS interactive canvas supporting Chain View and Balance Scale View
 */
export default function TwoStepMachineCanvas({
  equation = { a: 2, op1: 'mul', b: 3, op2: 'add', c: 11, x: 4 },
  view = 'chain', // 'chain' | 'balance'
  mode = 'step',  // 'display' | 'step' | 'interactive'
  direction = 'reverse', // 'forward' | 'reverse'
  showLog = true,
  showCheck = true,
  onComplete = null
}) {
  const [activeStep, setActiveStep] = useState(0); // 0: start, 1: undo b, 2: undo a, 3: checked
  const [feedback, setFeedback] = useState('');
  const [currentView, setCurrentView] = useState(view);

  // Reset when equation changes
  useEffect(() => {
    setActiveStep(0);
    setFeedback('');
  }, [equation.a, equation.b, equation.c, equation.x]);

  const { a, op1, b, op2, c, x } = equation;

  // Intermediate values
  const intermediateVal = op2 === 'add' ? c - b : c + b;
  const isMult = op1 === 'mul';
  const isAdd = op2 === 'add';

  const op1Text = isMult ? `× ${a}` : `÷ ${a}`;
  const op2Text = isAdd ? `+ ${b}` : `− ${b}`;

  const invOp2Text = isAdd ? `− ${b}` : `+ ${b}`;
  const invOp1Text = isMult ? `÷ ${a}` : `× ${a}`;

  const handleNextStep = () => {
    unlockAudio();
    sounds.pop();
    if (activeStep < 3) {
      const next = activeStep + 1;
      setActiveStep(next);
      if (next === 2) sounds.correct();
      if (next === 3) sounds.ding();
      if (next === 2 && onComplete) onComplete(x);
    }
  };

  const handleReset = () => {
    sounds.click();
    setActiveStep(0);
    setFeedback('');
  };

  const handleInteractiveTile = (tileType) => {
    unlockAudio();
    if (activeStep === 0) {
      if (tileType === 'inv2') {
        sounds.correct();
        setActiveStep(1);
        setFeedback(`✓ Spot on! Undo the ${isAdd ? 'addition' : 'subtraction'} first.`);
      } else {
        sounds.wrong();
        setFeedback('⚠️ Remember socks and shoes! Undo the outer addition/subtraction first.');
      }
    } else if (activeStep === 1) {
      if (tileType === 'inv1') {
        sounds.correct();
        setActiveStep(2);
        setFeedback(`🎉 Perfect! Unwrapped mystery x = ${x}.`);
        if (onComplete) onComplete(x);
      } else {
        sounds.wrong();
        setFeedback(`⚠️ Now undo the ${isMult ? 'multiplication' : 'division'} to leave x alone!`);
      }
    }
  };

  return (
    <div className="twostep-machine-canvas glass-panel">
      {/* View Switcher Tabs */}
      <div className="canvas-header-tabs">
        <div className="view-toggle-pills">
          <button
            className={`view-pill ${currentView === 'chain' ? 'active' : ''}`}
            onClick={() => { sounds.click(); setCurrentView('chain'); }}
          >
            🔁 Flow-Chain View
          </button>
          <button
            className={`view-pill ${currentView === 'balance' ? 'active' : ''}`}
            onClick={() => { sounds.click(); setCurrentView('balance'); }}
          >
            ⚖️ Balance Scale View
          </button>
        </div>

        <div className="canvas-step-badge">
          Step {activeStep} of 2 {activeStep >= 2 ? '• Solved! 🎯' : ''}
        </div>
      </div>

      {/* Main Visual Display */}
      <div className="canvas-visual-stage">
        {currentView === 'chain' ? (
          /* CHAIN FLOW VIEW */
          <div className="chain-flow-wrapper">
            <div className="chain-nodes-row">
              {/* Node 1: Unknown x */}
              <div className={`chain-node node-variable ${activeStep >= 2 ? 'revealed-val' : 'mystery-val'}`}>
                <div className="node-label">Variable</div>
                <div className="node-main-glyph">
                  {activeStep >= 2 ? `x = ${x}` : 'x = ?'}
                </div>
                <div className="node-caption">Core Value</div>
              </div>

              {/* Arrow 1 with Inverse Op 1 */}
              <div className="chain-connector">
                <div className={`op-bubble ${activeStep >= 2 ? 'active-op' : ''}`}>
                  <span className="op-symbol">{invOp1Text}</span>
                  <span className="op-hint">Step 2: Undo</span>
                </div>
                <div className={`chain-arrow-line ${activeStep >= 2 ? 'line-active' : ''}`}>
                  <span className="arrow-head">◀</span>
                </div>
              </div>

              {/* Node 2: Intermediate state */}
              <div className={`chain-node node-intermediate ${activeStep >= 1 ? 'revealed-val' : 'locked-val'}`}>
                <div className="node-label">Intermediate</div>
                <div className="node-main-glyph">
                  {activeStep >= 1 ? intermediateVal : `${isMult ? a + 'x' : 'x÷' + a}`}
                </div>
                <div className="node-caption">After Step 1</div>
              </div>

              {/* Arrow 2 with Inverse Op 2 */}
              <div className="chain-connector">
                <div className={`op-bubble ${activeStep >= 1 ? 'active-op' : ''}`}>
                  <span className="op-symbol">{invOp2Text}</span>
                  <span className="op-hint">Step 1: Undo</span>
                </div>
                <div className={`chain-arrow-line ${activeStep >= 1 ? 'line-active' : ''}`}>
                  <span className="arrow-head">◀</span>
                </div>
              </div>

              {/* Node 3: Result c */}
              <div className="chain-node node-target">
                <div className="node-label">Total Result</div>
                <div className="node-main-glyph">{c}</div>
                <div className="node-caption">Given Value</div>
              </div>
            </div>
          </div>
        ) : (
          /* BALANCE SCALE VIEW */
          <div className="balance-scale-wrapper">
            <svg viewBox="0 0 540 230" className="balance-svg">
              <defs>
                <linearGradient id="beamGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="50%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
                <linearGradient id="panGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
              </defs>

              {/* Fulcrum Stand */}
              <polygon points="270,185 240,215 300,215" fill="#334155" stroke="#64748b" strokeWidth="2" />
              <line x1="270" y1="120" x2="270" y2="185" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
              <circle cx="270" cy="120" r="10" fill="#facc15" stroke="#ffffff" strokeWidth="3" />

              {/* Balanced Beam */}
              <g className="beam-group">
                <line x1="90" y1="120" x2="450" y2="120" stroke="url(#beamGrad)" strokeWidth="8" strokeLinecap="round" />

                {/* Left Pan Strings & Pan */}
                <line x1="120" y1="120" x2="90" y2="170" stroke="#cbd5e1" strokeWidth="2" />
                <line x1="120" y1="120" x2="150" y2="170" stroke="#cbd5e1" strokeWidth="2" />
                <path d="M 75 170 Q 120 185 165 170 Z" fill="url(#panGrad)" stroke="#38bdf8" strokeWidth="2" />

                {/* Left Pan Contents */}
                <text x="120" y="160" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="800">
                  {activeStep === 0 && `${a}x ${op2Text}`}
                  {activeStep === 1 && `${a}x`}
                  {activeStep >= 2 && `x`}
                </text>

                {/* Right Pan Strings & Pan */}
                <line x1="420" y1="120" x2="390" y2="170" stroke="#cbd5e1" strokeWidth="2" />
                <line x1="420" y1="120" x2="450" y2="170" stroke="#cbd5e1" strokeWidth="2" />
                <path d="M 375 170 Q 420 185 465 170 Z" fill="url(#panGrad)" stroke="#38bdf8" strokeWidth="2" />

                {/* Right Pan Contents */}
                <text x="420" y="160" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="800">
                  {activeStep === 0 && `${c}`}
                  {activeStep === 1 && `${intermediateVal}`}
                  {activeStep >= 2 && `${x}`}
                </text>
              </g>

              {/* Equals Glow at Fulcrum */}
              <text x="270" y="105" textAnchor="middle" fill="#facc15" fontSize="22" fontWeight="900">
                =
              </text>
            </svg>
          </div>
        )}
      </div>

      {/* Interactive Undo Tiles Mode */}
      {mode === 'interactive' && activeStep < 2 && (
        <div className="interactive-tiles-shelf">
          <div className="shelf-label">Choose the next inverse operation tile to apply:</div>
          <div className="tiles-row">
            <button
              className="inv-tile"
              onClick={() => handleInteractiveTile('inv2')}
            >
              {invOp2Text} <span className="tile-action">({isAdd ? 'Subtract ' + b : 'Add ' + b})</span>
            </button>
            <button
              className="inv-tile"
              onClick={() => handleInteractiveTile('inv1')}
            >
              {invOp1Text} <span className="tile-action">({isMult ? 'Divide by ' + a : 'Multiply by ' + a})</span>
            </button>
            <button
              className="inv-tile distractor"
              onClick={() => { sounds.wrong(); setFeedback('⚠️ Wrong inverse! That repeats the original operation.'); }}
            >
              {op2Text} <span className="tile-action">(Wrong sign)</span>
            </button>
          </div>
          {feedback && <div className="interactive-feedback-msg">{feedback}</div>}
        </div>
      )}

      {/* Synchronous Line-by-Line Algebraic Log */}
      {showLog && (
        <div className="algebraic-log-box">
          <div className="log-row line-0">
            <span className="line-num">Original:</span>
            <span className="line-math">{isMult ? `${a}x` : `x ÷ ${a}`} {op2Text} = {c}</span>
          </div>

          {activeStep >= 1 && (
            <div className="log-row line-1 highlight-pulse">
              <span className="line-num">Step 1:</span>
              <span className="line-math">
                {isMult ? `${a}x` : `x ÷ ${a}`} = {intermediateVal}
              </span>
              <span className="line-annot">({invOp2Text} on both sides)</span>
            </div>
          )}

          {activeStep >= 2 && (
            <div className="log-row line-2 highlight-pulse">
              <span className="line-num">Step 2:</span>
              <span className="line-math">x = {x}</span>
              <span className="line-annot">({invOp1Text} on both sides)</span>
            </div>
          )}

          {showCheck && activeStep >= 3 && (
            <div className="log-row line-check highlight-gold">
              <span className="line-num">Check:</span>
              <span className="line-math">
                {isMult ? `${a}(${x})` : `(${x} ÷ ${a})`} {op2Text} = {c} ✓ (Left = Right)
              </span>
            </div>
          )}
        </div>
      )}

      {/* Step Mode Controls */}
      {mode === 'step' && (
        <div className="canvas-step-controls">
          <button
            className="ctrl-btn reset-btn"
            onClick={handleReset}
            disabled={activeStep === 0}
          >
            🔄 Restart Working
          </button>

          {activeStep < 2 && (
            <button
              className="ctrl-btn next-step-btn"
              onClick={handleNextStep}
            >
              Next Step ({activeStep === 0 ? `Undo ${op2Text}` : `Undo ${op1Text}`}) ➡️
            </button>
          )}

          {activeStep === 2 && showCheck && (
            <button
              className="ctrl-btn check-step-btn"
              onClick={handleNextStep}
            >
              Substitute & Check Solution 🔍
            </button>
          )}

          {activeStep >= 3 && (
            <span className="solved-badge">🎉 Solved & Verified!</span>
          )}
        </div>
      )}
    </div>
  );
}
