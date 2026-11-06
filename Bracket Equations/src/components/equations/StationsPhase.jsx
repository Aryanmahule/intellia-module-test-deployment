import React, { useState, useEffect } from 'react';
import { STATIONS_NARRATION } from '../../utils/bracketsNarration.js';
import { narrate, sounds, unlockAudio } from '../../utils/audio.js';
import BracketSimulationCanvas from './BracketSimulationCanvas.jsx';

export default function StationsPhase({ stationsProgress, onCompleteStation, onNext, onAddXP }) {
  const [activeStation, setActiveStation] = useState('station1'); // 'station1' | 'station2' | 'station3'
  const [st1SubMode, setSt1SubMode] = useState('area'); // 'area' | 'placeBrackets'
  
  // Station 2 state (Order the Steps / Two-Way Solver)
  const [st2Method, setSt2Method] = useState('expand'); // 'expand' | 'divide'
  const [st2StepIndex, setSt2StepIndex] = useState(0);

  // Station 3 state (Real Singapore Word Scenes)
  const [st3CardIndex, setSt3CardIndex] = useState(0);
  const [st3SelectedOption, setSt3SelectedOption] = useState(null);
  const [st3Feedback, setSt3Feedback] = useState(null);

  useEffect(() => {
    const info = STATIONS_NARRATION[activeStation];
    if (info) {
      narrate(info.narration, info.style);
    }
  }, [activeStation]);

  // Station 1 completion
  const handleSt1Complete = () => {
    sounds.levelup();
    onAddXP?.(30);
    onCompleteStation('station1');
  };

  // Station 2: Method Steps
  const expandSteps = [
    { line: "4(x + 3) = 28", desc: "Given equation with brackets" },
    { line: "4x + 12 = 28", desc: "Step 1: Distribute 4 into both terms: 4 × x and 4 × 3" },
    { line: "4x = 16", desc: "Step 2: Subtract 12 from both sides" },
    { line: "x = 4", desc: "Step 3: Divide both sides by 4! (Check: 4(4+3) = 28 ✓)" }
  ];

  const divideSteps = [
    { line: "4(x + 3) = 28", desc: "Given equation with brackets" },
    { line: "x + 3 = 7", desc: "Step 1: Divide both sides by 4 first! (28 ÷ 4 = 7)" },
    { line: "x = 4", desc: "Step 2: Subtract 3 from both sides! (Check: 4(4+3) = 28 ✓)" }
  ];

  const currentSteps = st2Method === 'expand' ? expandSteps : divideSteps;

  const handleSt2NextStep = () => {
    unlockAudio();
    sounds.pop();
    if (st2StepIndex < currentSteps.length - 1) {
      setSt2StepIndex(prev => prev + 1);
    } else {
      sounds.correct();
      onAddXP?.(25);
      onCompleteStation('station2');
    }
  };

  const handleSt2Reset = (method) => {
    unlockAudio();
    sounds.click();
    setSt2Method(method);
    setSt2StepIndex(0);
  };

  // Station 3: Singapore Scenes
  const st3Scenes = [
    {
      title: "Sentosa Express & Cable Car Passes",
      desc: "Maya buys 4 cable car packages for her family. Each package has 1 unlimited ride ticket ($p) plus a $3 museum add-on. The total bill is $48. Which equation matches this situation?",
      options: [
        { label: "4(p + 3) = 48", correct: true, explain: "4 packages of (ticket + $3 add-on) equals $48! Solve: p + 3 = 12 → p = $9." },
        { label: "4p + 3 = 48", correct: false, explain: "The $3 add-on applies to EACH of the 4 packages, so it must be multiplied by 4 inside brackets!" },
        { label: "p + 12 = 48", correct: false, explain: "There are 4 tickets of price p, so the variable must be multiplied by 4." }
      ]
    },
    {
      title: "Old Seng Choong Cookie Gift Packs",
      desc: "Archie orders 5 identical festive cookie boxes. Each box holds c pandan cookies and 4 pineapple tarts. Across all 5 boxes, there are 45 cookies. Find the number of pandan cookies (c) in each box.",
      options: [
        { label: "5(c + 4) = 45  →  c = 5", correct: true, explain: "5(c + 4) = 45 → c + 4 = 9 → c = 5 pandan cookies per box! (Check: 5(5+4) = 45 ✓)" },
        { label: "5c + 4 = 45  →  c = 8.2", correct: false, explain: "Each of the 5 boxes has 4 pineapple tarts, so 4 must also be multiplied by 5!" },
        { label: "4(c + 5) = 45  →  c = 6.25", correct: false, explain: "There are 5 boxes, not 4!" }
      ]
    }
  ];

  const handleSt3OptionSelect = (opt) => {
    unlockAudio();
    setSt3SelectedOption(opt);
    if (opt.correct) {
      sounds.correct();
      setSt3Feedback({ isCorrect: true, msg: opt.explain });
      onAddXP?.(25);
      if (st3CardIndex < st3Scenes.length - 1) {
        setTimeout(() => {
          setSt3CardIndex(prev => prev + 1);
          setSt3SelectedOption(null);
          setSt3Feedback(null);
        }, 2000);
      } else {
        onCompleteStation('station3');
      }
    } else {
      sounds.wrong();
      setSt3Feedback({ isCorrect: false, msg: opt.explain });
    }
  };

  const allCompleted = stationsProgress.station1 && stationsProgress.station2 && stationsProgress.station3;

  return (
    <div className="phase-container stations-screen">
      <div className="phase-header-center">
        <span className="phase-badge">Phase 03 • Interactive Simulations</span>
        <h2 className="phase-title">Interactive Bracket Equation Labs</h2>
      </div>

      {/* Station Selector Tabs */}
      <div className="stations-nav-tabs">
        <button
          className={`station-tab ${activeStation === 'station1' ? 'active' : ''} ${stationsProgress.station1 ? 'done' : ''}`}
          onClick={() => { sounds.click(); setActiveStation('station1'); }}
        >
          <span>📦 Station 1: Distributive Area Model</span>
          {stationsProgress.station1 && <span className="tab-check">✓</span>}
        </button>

        <button
          className={`station-tab ${activeStation === 'station2' ? 'active' : ''} ${stationsProgress.station2 ? 'done' : ''}`}
          onClick={() => { sounds.click(); setActiveStation('station2'); }}
        >
          <span>⚖️ Station 2: The Two-Way Solver</span>
          {stationsProgress.station2 && <span className="tab-check">✓</span>}
        </button>

        <button
          className={`station-tab ${activeStation === 'station3' ? 'active' : ''} ${stationsProgress.station3 ? 'done' : ''}`}
          onClick={() => { sounds.click(); setActiveStation('station3'); }}
        >
          <span>🏙️ Station 3: Real Singapore</span>
          {stationsProgress.station3 && <span className="tab-check">✓</span>}
        </button>
      </div>

      {/* Station Body Content */}
      <div className="station-workspace">
        {/* STATION 1: DISTRIBUTIVE AREA MODEL & BRACKET PLACEMENT */}
        {activeStation === 'station1' && (
          <div className="station-box">
            <div className="station-intro-row">
              <div className="station-desc-text">
                <h3>{st1SubMode === 'area' ? 'Distributive Area Model' : 'Place the Brackets Challenge'}</h3>
                <p>
                  {st1SubMode === 'area'
                    ? 'Change the outside factor and inside constant to see how rectangular areas expand!'
                    : 'Tap where to insert brackets so that 2 + 3 × 4 equals 20!'}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn-secondary"
                  onClick={() => { sounds.click(); setSt1SubMode('area'); }}
                  style={{ padding: '6px 14px', fontSize: '0.85rem', background: st1SubMode === 'area' ? '#7c3aed' : 'transparent' }}
                >
                  Area Model
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => { sounds.click(); setSt1SubMode('placeBrackets'); }}
                  style={{ padding: '6px 14px', fontSize: '0.85rem', background: st1SubMode === 'placeBrackets' ? '#7c3aed' : 'transparent' }}
                >
                  Place Brackets
                </button>
              </div>
            </div>

            <BracketSimulationCanvas
              mode={st1SubMode}
              onComplete={handleSt1Complete}
            />
          </div>
        )}

        {/* STATION 2: THE TWO-WAY SOLVER */}
        {activeStation === 'station2' && (
          <div className="station-box">
            <div className="station-intro-row">
              <div className="station-desc-text">
                <h3>Solving <code>4(x + 3) = 28</code>: Compare Strategies</h3>
                <p>Should you expand first or divide both sides by 4 first? Step through both methods!</p>
              </div>
              <div className="station-status-pill">
                {stationsProgress.station2 ? '⭐ Station 2 Mastered!' : 'Step-by-Step Lab'}
              </div>
            </div>

            {/* Strategy Switch Buttons */}
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', marginBottom: '16px' }}>
              <button
                className="btn-secondary"
                onClick={() => handleSt2Reset('expand')}
                style={{
                  background: st2Method === 'expand' ? 'rgba(168, 85, 247, 0.4)' : 'rgba(255,255,255,0.06)',
                  borderColor: st2Method === 'expand' ? '#a855f7' : 'rgba(255,255,255,0.15)',
                  padding: '8px 20px',
                  fontWeight: 700
                }}
              >
                Method 1: Expand First (Distribute)
              </button>

              <button
                className="btn-secondary"
                onClick={() => handleSt2Reset('divide')}
                style={{
                  background: st2Method === 'divide' ? 'rgba(255, 184, 0, 0.35)' : 'rgba(255,255,255,0.06)',
                  borderColor: st2Method === 'divide' ? '#ffb800' : 'rgba(255,255,255,0.15)',
                  padding: '8px 20px',
                  fontWeight: 700
                }}
              >
                Method 2: Divide by 4 First (Shortcut)
              </button>
            </div>

            {/* Stepper Display */}
            <div style={{
              background: 'rgba(15, 6, 32, 0.85)',
              border: '1.5px solid rgba(168, 85, 247, 0.35)',
              borderRadius: '18px',
              padding: '24px 32px',
              maxWidth: '540px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}>
              {currentSteps.slice(0, st2StepIndex + 1).map((s, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 18px',
                    borderRadius: '12px',
                    background: idx === st2StepIndex ? 'rgba(168, 85, 247, 0.25)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${idx === st2StepIndex ? '#c084fc' : 'rgba(255,255,255,0.08)'}`
                  }}
                >
                  <div style={{ fontFamily: "'Space Grotesk', monospace", fontSize: '1.35rem', fontWeight: 800, color: '#fde047' }}>
                    {s.line}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#cbd5e1', textAlign: 'right', maxWidth: '260px' }}>
                    {s.desc}
                  </div>
                </div>
              ))}

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                <button
                  className="btn-gold"
                  onClick={handleSt2NextStep}
                >
                  {st2StepIndex < currentSteps.length - 1 ? 'Reveal Next Step ▶' : '🎉 Method Completed!'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STATION 3: REAL SINGAPORE SCENES */}
        {activeStation === 'station3' && (
          <div className="station-box">
            <div className="station-intro-row">
              <div className="station-desc-text">
                <h3>Challenge {st3CardIndex + 1} of 2: {st3Scenes[st3CardIndex].title}</h3>
                <p>{st3Scenes[st3CardIndex].desc}</p>
              </div>
              <div className="station-status-pill">
                {stationsProgress.station3 ? '⭐ Station 3 Mastered!' : `Scene ${st3CardIndex + 1} / 2`}
              </div>
            </div>

            <div className="st3-options-grid">
              {st3Scenes[st3CardIndex].options.map((opt, idx) => (
                <button
                  key={idx}
                  className={`st3-option-card glass-panel ${st3SelectedOption === opt ? (opt.correct ? 'opt-correct' : 'opt-wrong') : ''}`}
                  onClick={() => handleSt3OptionSelect(opt)}
                >
                  <div className="opt-letter">{['A', 'B', 'C'][idx]}</div>
                  <div className="opt-text-wrap">
                    <div className="opt-equation">{opt.label}</div>
                  </div>
                </button>
              ))}
            </div>

            {st3Feedback && (
              <div className={`st3-feedback-banner ${st3Feedback.isCorrect ? 'banner-success' : 'banner-error'}`}>
                {st3Feedback.isCorrect ? '🎉 ' : '⚠️ '} {st3Feedback.msg}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="phase-bottom-nav">
        <span className="stations-progress-count">
          Stations Completed: {[stationsProgress.station1, stationsProgress.station2, stationsProgress.station3].filter(Boolean).length} / 3
        </span>

        <button
          className={`action-btn-primary ${allCompleted ? 'pulse-ready' : 'disabled'}`}
          onClick={() => {
            unlockAudio();
            sounds.ding();
            onNext();
          }}
          disabled={!allCompleted}
        >
          <span>Continue to Practice 🎮</span>
        </button>
      </div>
    </div>
  );
}
