import React, { useState, useEffect } from 'react';
import { NARRATION } from '../../utils/twoStepNarration.js';
import { narrate, sounds, unlockAudio } from '../../utils/audio.js';
import TwoStepMachineCanvas from './TwoStepMachineCanvas.jsx';

export default function StationsPhase({ stationsProgress, onCompleteStation, onNext, onAddXP }) {
  const [activeStation, setActiveStation] = useState('station1'); // 'station1' | 'station2' | 'station3'
  const [st1Index, setSt1Index] = useState(0);
  const [st2SlipAnswered, setSt2SlipAnswered] = useState(false);
  const [st3CardIndex, setSt3CardIndex] = useState(0);
  const [st3SelectedOption, setSt3SelectedOption] = useState(null);
  const [st3Feedback, setSt3Feedback] = useState(null);

  // Play narration on station switch
  useEffect(() => {
    const info = NARRATION.stations[activeStation];
    if (info) {
      narrate(info.narration, info.style);
    }
  }, [activeStation]);

  // Station 1: 3 Machines
  const st1Machines = [
    { a: 2, op1: 'mul', b: 5, op2: 'add', c: 17, x: 6 },
    { a: 3, op1: 'mul', b: 4, op2: 'sub', c: 14, x: 6 },
    { a: 4, op1: 'div', b: 3, op2: 'add', c: 7, x: 16 }
  ];

  const handleSt1MachineSolved = () => {
    sounds.correct();
    onAddXP?.(20);
    if (st1Index < st1Machines.length - 1) {
      setSt1Index(prev => prev + 1);
    } else {
      sounds.levelup();
      onCompleteStation('station1');
    }
  };

  // Station 2: Balance Scale + Slip
  const handleSt2ScaleSolved = () => {
    sounds.correct();
    onAddXP?.(25);
  };

  const handleSt2SlipPick = (opt) => {
    unlockAudio();
    if (opt === 'added') {
      sounds.correct();
      setSt2SlipAnswered(true);
      onAddXP?.(25);
      onCompleteStation('station2');
    } else {
      sounds.wrong();
    }
  };

  // Station 3: Singapore Scenes
  const st3Scenes = [
    {
      title: "MRT & Sentosa Express Tickets",
      desc: "Maya buys 3 express passes online. There is a $4 transaction surcharge. The total charge is $25. Which equation represents this situation?",
      options: [
        { label: "3x + 4 = 25", correct: true, explain: "3 tickets of price x plus $4 booking fee equals $25! Solve: 3x = 21 → x = $7." },
        { label: "3(x + 4) = 25", correct: false, explain: "The $4 booking fee is charged once for the whole order, not per ticket!" },
        { label: "4x + 3 = 25", correct: false, explain: "There were 3 tickets, so the coefficient of x is 3." }
      ]
    },
    {
      title: "Bubble Tea Delivery in Toa Payoh",
      desc: "Ravi orders 4 cups of brown sugar milk tea with a $3 grab delivery fee. Total paid was $23. What was the cost of each cup (b)?",
      options: [
        { label: "4b + 3 = 23  →  b = $5", correct: true, explain: "4b + 3 = 23 → 4b = 20 → b = $5 per cup. (Check: 4($5) + $3 = $23 ✓)" },
        { label: "4b − 3 = 23  →  b = $6.50", correct: false, explain: "The delivery fee is ADDED to the cost, not subtracted!" },
        { label: "3b + 4 = 23  →  b = $6.33", correct: false, explain: "Ravi bought 4 cups, so the coefficient is 4." }
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
        }, 1800);
      } else {
        onCompleteStation('station3');
      }
    } else {
      sounds.wrong();
      setFeedbackSt3({ isCorrect: false, msg: opt.explain });
    }
  };

  const allCompleted = stationsProgress.station1 && stationsProgress.station2 && stationsProgress.station3;

  return (
    <div className="phase-container stations-screen">
      <div className="phase-header-center">
        <span className="phase-badge">Phase 03 • Interactive Simulations</span>
        <h2 className="phase-title">Interactive Equation Labs</h2>
      </div>

      {/* Station Selector Tabs */}
      <div className="stations-nav-tabs">
        <button
          className={`station-tab ${activeStation === 'station1' ? 'active' : ''} ${stationsProgress.station1 ? 'done' : ''}`}
          onClick={() => { sounds.click(); setActiveStation('station1'); }}
        >
          <span>🔁 Station 1: Reverse Machine</span>
          {stationsProgress.station1 && <span className="tab-check">✓</span>}
        </button>

        <button
          className={`station-tab ${activeStation === 'station2' ? 'active' : ''} ${stationsProgress.station2 ? 'done' : ''}`}
          onClick={() => { sounds.click(); setActiveStation('station2'); }}
        >
          <span>⚖️ Station 2: Balance & Solve</span>
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
        {/* STATION 1: REVERSE MACHINE */}
        {activeStation === 'station1' && (
          <div className="station-box">
            <div className="station-intro-row">
              <div className="station-desc-text">
                <h3>Machine {st1Index + 1} of 3: Undo the Operations in Reverse</h3>
                <p>Click "Next Step" to peel each inverse layer or try dragging tiles in reverse order!</p>
              </div>
              <div className="station-status-pill">
                {stationsProgress.station1 ? '⭐ Station 1 Mastered!' : `Machine ${st1Index + 1} / 3`}
              </div>
            </div>

            <TwoStepMachineCanvas
              equation={st1Machines[st1Index]}
              view="chain"
              mode="step"
              direction="reverse"
              showLog={true}
              showCheck={true}
              onComplete={handleSt1MachineSolved}
            />
          </div>
        )}

        {/* STATION 2: BALANCE SCALE & SLIP SPOTTER */}
        {activeStation === 'station2' && (
          <div className="station-box">
            <div className="station-intro-row">
              <div className="station-desc-text">
                <h3>Balance Scale & Slip Detective</h3>
                <p>Observe the balance scale and identify the mathematical error in the equation working.</p>
              </div>
              <div className="station-status-pill">
                {stationsProgress.station2 ? '⭐ Station 2 Mastered!' : 'In Progress'}
              </div>
            </div>

            <div className="st2-split-layout">
              {/* Balance Scale Canvas */}
              <div className="st2-canvas-half">
                <TwoStepMachineCanvas
                  equation={{ a: 2, op1: 'mul', b: 6, op2: 'add', c: 18, x: 6 }}
                  view="balance"
                  mode="step"
                  showLog={true}
                  onComplete={handleSt2ScaleSolved}
                />
              </div>

              {/* Spot the Slip Detective Card */}
              <div className="st2-detective-card glass-panel">
                <div className="detective-badge">🕵️ Detective Challenge</div>
                <h4 className="detective-prompt">Ravi tried to solve: <code>2x + 6 = 18</code></h4>
                <div className="ravi-working-box">
                  <div className="ravi-line">Line 1: <code>2x = 24</code></div>
                  <div className="ravi-line">Line 2: <code>x = 12</code></div>
                </div>
                <p className="detective-question">What slip did Ravi make in Line 1?</p>

                <div className="detective-options">
                  <button
                    className={`detective-btn ${st2SlipAnswered ? 'disabled' : ''}`}
                    onClick={() => handleSt2SlipPick('added')}
                  >
                    ❌ Ravi added 6 to 18 instead of subtracting 6!
                  </button>
                  <button
                    className="detective-btn"
                    onClick={() => handleSt2SlipPick('div')}
                  >
                    ❌ Ravi divided 18 by 2 before subtracting 6.
                  </button>
                  <button
                    className="detective-btn"
                    onClick={() => handleSt2SlipPick('none')}
                  >
                    ❌ Line 1 is correct, but Line 2 is wrong.
                  </button>
                </div>

                {st2SlipAnswered && (
                  <div className="detective-success-msg">
                    🎯 Excellent deduction! Ravi should have subtracted 6 from both sides to get <code>2x = 12</code>, giving <code>x = 6</code>!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STATION 3: SINGAPORE WORD PROBLEMS */}
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
