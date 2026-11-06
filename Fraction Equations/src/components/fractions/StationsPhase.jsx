import React, { useState } from 'react';
import FractionModelCanvas from './FractionModelCanvas.jsx';
import { sounds, unlockAudio } from '../../utils/audio.js';

export default function StationsPhase({ onNext, onAddXP }) {
  const [activeStation, setActiveStation] = useState(1);
  const [completed, setCompleted] = useState({ 1: false, 2: false, 3: false });

  // Station 1 state: Equivalent Fraction Bar
  const [st1Den, setSt1Den] = useState(4);
  const [st1Num, setSt1Num] = useState(2);
  const [st1Feedback, setSt1Feedback] = useState(null);

  // Station 2 state: Common Denominator Machine
  const [st2SelectedLCD, setSt2SelectedLCD] = useState(null);
  const [st2Feedback, setSt2Feedback] = useState(null);

  // Station 3 state: Real World Scenario
  const [st3SelectedOpt, setSt3SelectedOpt] = useState(null);
  const [st3Feedback, setSt3Feedback] = useState(null);

  const handleStationComplete = (stNum) => {
    if (!completed[stNum]) {
      sounds.celebration();
      setCompleted(prev => ({ ...prev, [stNum]: true }));
      onAddXP?.(25);
    }
  };

  // Station 1: check if st1Num / st1Den == 1/2
  const checkSt1 = () => {
    unlockAudio();
    if (st1Num / st1Den === 0.5) {
      sounds.correct();
      setSt1Feedback({
        correct: true,
        text: `🎯 Spot on! ${st1Num}/${st1Den} exactly equals 1/2. They cover the exact same distance!`
      });
      handleStationComplete(1);
    } else {
      sounds.wrong();
      setSt1Feedback({
        correct: false,
        text: `Not quite! ${st1Num}/${st1Den} is ${(st1Num / st1Den).toFixed(2)}, which does not equal 0.5 (1/2). Try shading half the pieces!`
      });
    }
  };

  // Station 2: 1/2 + 1/3 -> LCD = 6
  const checkSt2 = (lcd) => {
    unlockAudio();
    setSt2SelectedLCD(lcd);
    if (lcd === 6) {
      sounds.correct();
      setSt2Feedback({
        correct: true,
        text: `🎉 Correct! 6 is the Lowest Common Multiple (LCM) of 2 and 3! 1/2 becomes 3/6, and 1/3 becomes 2/6. 3/6 + 2/6 = 5/6!`
      });
      handleStationComplete(2);
    } else {
      sounds.wrong();
      setSt2Feedback({
        correct: false,
        text: `${lcd} is not the common denominator for 2 and 3. Find a multiple that both 2 and 3 divide evenly into!`
      });
    }
  };

  // Station 3: Mei ate 1/4, Ken ate 2/8. Total?
  const checkSt3 = (optIndex) => {
    unlockAudio();
    setSt3SelectedOpt(optIndex);
    if (optIndex === 1) { // 1/2
      sounds.correct();
      setSt3Feedback({
        correct: true,
        text: `🌟 Fantastic! 2/8 simplifies to 1/4. 1/4 + 1/4 = 2/4 = 1/2 of the cake!`
      });
      handleStationComplete(3);
    } else {
      sounds.wrong();
      setSt3Feedback({
        correct: false,
        text: `Remember to simplify 2/8 first (2/8 = 1/4), then add 1/4 + 1/4!`
      });
    }
  };

  const allCompleted = completed[1] && completed[2] && completed[3];

  return (
    <div className="stations-screen">
      {/* Stations Top Navigation Tabs */}
      <div className="stations-nav-tabs">
        <button
          className={`station-tab ${activeStation === 1 ? 'active' : ''}`}
          onClick={() => { unlockAudio(); sounds.pop(); setActiveStation(1); }}
        >
          <span>Lab 1: Equivalent Bars</span>
          {completed[1] && <span className="tab-check">✓</span>}
        </button>

        <button
          className={`station-tab ${activeStation === 2 ? 'active' : ''}`}
          onClick={() => { unlockAudio(); sounds.pop(); setActiveStation(2); }}
        >
          <span>Lab 2: Common Denominator</span>
          {completed[2] && <span className="tab-check">✓</span>}
        </button>

        <button
          className={`station-tab ${activeStation === 3 ? 'active' : ''}`}
          onClick={() => { unlockAudio(); sounds.pop(); setActiveStation(3); }}
        >
          <span>Lab 3: Singapore Story</span>
          {completed[3] && <span className="tab-check">✓</span>}
        </button>
      </div>

      {/* Workspace Area */}
      <div className="station-workspace">
        {activeStation === 1 && (
          <div className="station-box">
            <h3 className="station-title">Build & Align: Make Equivalent Fractions to 1/2</h3>
            <p className="station-desc">
              Adjust the number of slices in your bar and tap them to shade. Make your bar line up with 1/2!
            </p>

            {/* Comparison Canvas */}
            <div style={{ margin: '15px 0', display: 'flex', justifyContent: 'center' }}>
              <FractionModelCanvas
                type="comparison"
                num={1}
                den={2}
                compareNum={st1Num}
                compareDen={st1Den}
                width={440}
                height={130}
              />
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', alignItems: 'center', margin: '15px 0' }}>
              <label style={{ fontSize: '15px', color: '#cbd5e1' }}>Total Slices:</label>
              {[4, 6, 8, 10].map(d => (
                <button
                  key={d}
                  className={`btn-secondary ${st1Den === d ? 'active' : ''}`}
                  onClick={() => { sounds.click(); setSt1Den(d); setSt1Num(Math.min(st1Num, d)); setSt1Feedback(null); }}
                  style={{ padding: '6px 14px', borderRadius: '12px' }}
                >
                  {d} Slices
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', alignItems: 'center', margin: '10px 0' }}>
              <label style={{ fontSize: '15px', color: '#cbd5e1' }}>Shaded Slices: <strong>{st1Num}</strong></label>
              <button
                className="btn-secondary"
                onClick={() => { if (st1Num > 0) { sounds.pop(); setSt1Num(st1Num - 1); setSt1Feedback(null); } }}
                style={{ padding: '4px 14px', borderRadius: '8px' }}
              >
                - 1
              </button>
              <button
                className="btn-secondary"
                onClick={() => { if (st1Num < st1Den) { sounds.pop(); setSt1Num(st1Num + 1); setSt1Feedback(null); } }}
                style={{ padding: '4px 14px', borderRadius: '8px' }}
              >
                + 1
              </button>
              <button
                className="btn-gold"
                onClick={checkSt1}
                style={{ padding: '8px 22px', marginLeft: '10px' }}
              >
                Check Alignment ✨
              </button>
            </div>

            {st1Feedback && (
              <div className={`st3-feedback-banner ${st1Feedback.correct ? 'correct' : 'wrong'}`} style={{ marginTop: '12px' }}>
                {st1Feedback.text}
              </div>
            )}
          </div>
        )}

        {activeStation === 2 && (
          <div className="station-box">
            <h3 className="station-title">Common Denominator Machine: 1/2 + 1/3</h3>
            <p className="station-desc">
              You cannot add 1/2 and 1/3 directly because halves and thirds are different sized slices.
              Select the lowest common denominator to slice them equally!
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', margin: '20px 0' }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '20px', color: '#38bdf8', fontWeight: 'bold' }}>1 / 2</span>
                <FractionModelCanvas type="bar" num={1} den={2} width={200} height={100} />
              </div>
              <div style={{ fontSize: '32px', color: '#facc15', alignSelf: 'center', fontWeight: 'bold' }}>+</div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '20px', color: '#ec4899', fontWeight: 'bold' }}>1 / 3</span>
                <FractionModelCanvas type="bar" num={1} den={3} width={200} height={100} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', margin: '15px 0' }}>
              {[4, 5, 6, 8, 9].map(lcd => (
                <button
                  key={lcd}
                  className={`btn-secondary ${st2SelectedLCD === lcd ? 'active' : ''}`}
                  onClick={() => checkSt2(lcd)}
                  style={{ padding: '10px 20px', fontSize: '16px', borderRadius: '14px' }}
                >
                  Denominator: {lcd}
                </button>
              ))}
            </div>

            {st2Feedback && (
              <div className={`st3-feedback-banner ${st2Feedback.correct ? 'correct' : 'wrong'}`}>
                {st2Feedback.text}
              </div>
            )}
          </div>
        )}

        {activeStation === 3 && (
          <div className="station-box">
            <h3 className="station-title">Singapore Fair Challenge: Mei & Ken's Cake</h3>
            <p className="station-desc">
              Mei ate <strong>1/4</strong> of a pandan cake, and Ken ate <strong>2/8</strong> of the same cake.
              How much cake did they eat together?
            </p>

            <div style={{ margin: '20px auto', maxWidth: '480px' }}>
              {[
                { label: 'A', text: '3/12 of the cake (added top and bottom)' },
                { label: 'B', text: '1/2 of the cake (2/8 = 1/4, so 1/4 + 1/4 = 2/4 = 1/2)' },
                { label: 'C', text: '3/8 of the cake' },
                { label: 'D', text: '3/4 of the cake' }
              ].map((opt, idx) => (
                <div
                  key={idx}
                  className={`st3-option-card ${st3SelectedOpt === idx ? 'selected' : ''}`}
                  onClick={() => checkSt3(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 18px',
                    margin: '8px 0',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    border: '1px solid rgba(168, 85, 247, 0.3)'
                  }}
                >
                  <span style={{ fontWeight: 'bold', color: '#facc15' }}>{opt.label}.</span>
                  <span style={{ color: '#ffffff' }}>{opt.text}</span>
                </div>
              ))}
            </div>

            {st3Feedback && (
              <div className={`st3-feedback-banner ${st3Feedback.correct ? 'correct' : 'wrong'}`}>
                {st3Feedback.text}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Continue Bar */}
      <div className="phase-bottom-bar" style={{ marginTop: '15px' }}>
        <button
          className="action-btn-primary"
          onClick={() => {
            unlockAudio();
            sounds.ding();
            onNext();
          }}
        >
          <span>{allCompleted ? 'Continue to Practice 🎗️' : 'Next Phase 🎗️'}</span>
        </button>
      </div>
    </div>
  );
}
