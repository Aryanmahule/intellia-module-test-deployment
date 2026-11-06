/* =========================================================
   STATIONS PHASE (SIMULATE)
   Station 1: Live Probability Lab (ExperimentSimulator)
   Station 2: Predict then Test Lab
   Station 3: Detective Fairness Test (Fair or Biased?)
   ========================================================= */

import React, { useState, useEffect } from 'react';
import ExperimentSimulator from './ExperimentSimulator';
import { STATIONS_NARRATION } from '../../utils/probabilityNarration';
import { sounds, playNarration } from '../../utils/audio';

export default function StationsPhase({ onNextPhase, onCompleteStation, completedStations = [], onAddXp }) {
  const [activeStation, setActiveStation] = useState('station1');

  // Station 2 State (Predict then Test)
  const [s2Event, setS2Event] = useState('coinHeads');
  const [s2SampleSize, setS2SampleSize] = useState(100);
  const [s2Result, setS2Result] = useState(null);
  const [s2Tested, setS2Tested] = useState(false);

  // Station 3 State (Detective Fairness Test)
  const [s3CaseIndex, setS3CaseIndex] = useState(0);
  const [s3UserChoice, setS3UserChoice] = useState(null);
  const [s3Feedback, setS3Feedback] = useState(null);
  const [s3Solved, setS3Solved] = useState({});

  useEffect(() => {
    if (activeStation === 'station1') {
      playNarration(STATIONS_NARRATION.station1.text, STATIONS_NARRATION.station1.style);
    } else if (activeStation === 'station2') {
      playNarration(STATIONS_NARRATION.station2.text, STATIONS_NARRATION.station2.style);
    } else if (activeStation === 'station3') {
      playNarration(STATIONS_NARRATION.station3.text, STATIONS_NARRATION.station3.style);
    }
  }, [activeStation]);

  // Station 2 Hypothesis presets
  const s2Events = [
    { id: 'coinHeads', name: 'Coin lands on Heads', theoretical: 0.50, formula: '1 / 2 = 50%' },
    { id: 'diceEven', name: 'Dice lands on an Even number {2, 4, 6}', theoretical: 0.50, formula: '3 / 6 = 50%' },
    { id: 'diceSix', name: 'Dice lands on number 6', theoretical: 1 / 6, formula: '1 / 6 ≈ 16.7%' },
    { id: 'spinnerRed', name: 'Spinner lands on Red (4 equal sectors)', theoretical: 0.25, formula: '1 / 4 = 25%' }
  ];

  const handleS2RunTest = () => {
    sounds.pop();
    const ev = s2Events.find(e => e.id === s2Event);
    let successCount = 0;
    for (let i = 0; i < s2SampleSize; i++) {
      if (s2Event === 'coinHeads') {
        if (Math.random() < 0.5) successCount++;
      } else if (s2Event === 'diceEven') {
        const roll = 1 + Math.floor(Math.random() * 6);
        if (roll % 2 === 0) successCount++;
      } else if (s2Event === 'diceSix') {
        const roll = 1 + Math.floor(Math.random() * 6);
        if (roll === 6) successCount++;
      } else if (s2Event === 'spinnerRed') {
        if (Math.random() < 0.25) successCount++;
      }
    }

    const expProb = successCount / s2SampleSize;
    const deviation = Math.abs(expProb - ev.theoretical);

    setS2Result({
      successCount,
      total: s2SampleSize,
      expProb,
      theoretical: ev.theoretical,
      deviation
    });
    setS2Tested(true);
    sounds.correct();
    onAddXp(20);
    onCompleteStation('station2');
  };

  // Station 3 Detective Cases
  const s3Cases = [
    {
      id: 'case1',
      title: 'Case 01: The Marina Carnival Wheel 🎡',
      apparatus: '4-Color Spinner (Equal sectors: Red, Blue, Green, Yellow)',
      trials: 400,
      expected: '100 on each color (25%)',
      data: [
        { label: 'Red', count: 218, pct: '54.5%' },
        { label: 'Blue', count: 62, pct: '15.5%' },
        { label: 'Green', count: 65, pct: '16.3%' },
        { label: 'Yellow', count: 55, pct: '13.8%' }
      ],
      correct: 'biased',
      reasoning: 'Red occurred 218 times out of 400 (54.5%), over double the theoretical expectation of 25%! In a large sample of 400 spins, this huge skew proves the wheel is rigged towards Red.'
    },
    {
      id: 'case2',
      title: "Case 02: Archie's Game Night Dice 🎲",
      apparatus: 'Standard 6-sided dice',
      trials: 300,
      expected: '50 on each face (16.7%)',
      data: [
        { label: 'Face 1', count: 48, pct: '16.0%' },
        { label: 'Face 2', count: 52, pct: '17.3%' },
        { label: 'Face 3', count: 51, pct: '17.0%' },
        { label: 'Face 4', count: 49, pct: '16.3%' },
        { label: 'Face 5', count: 53, pct: '17.7%' },
        { label: 'Face 6', count: 47, pct: '15.7%' }
      ],
      correct: 'fair',
      reasoning: 'All faces landed between 47 and 53 times, hovering right around the expected 50 rolls (16.7%). These tiny differences are completely normal random variation. The dice is fair!'
    },
    {
      id: 'case3',
      title: 'Case 03: Changi Airport Coin Toss 🪙',
      apparatus: 'Singapore $1 Commemorative Coin',
      trials: 200,
      expected: '100 Heads (50%), 100 Tails (50%)',
      data: [
        { label: 'Heads', count: 104, pct: '52.0%' },
        { label: 'Tails', count: 96, pct: '48.0%' }
      ],
      correct: 'fair',
      reasoning: '104 Heads vs 96 Tails is remarkably close to the theoretical 50/50 split (only a 2% deviation in 200 flips). The coin is perfectly balanced and fair!'
    }
  ];

  const currentCase = s3Cases[s3CaseIndex];

  const handleS3Answer = (choice) => {
    sounds.click();
    setS3UserChoice(choice);
    const isCorrect = choice === currentCase.correct;
    if (isCorrect) {
      sounds.correct();
      setS3Feedback({ isCorrect: true, text: `Correct Detective! ${currentCase.reasoning}` });
      setS3Solved(prev => ({ ...prev, [currentCase.id]: true }));
      onAddXp(25);
      onCompleteStation('station3');
    } else {
      sounds.wrong();
      setS3Feedback({ isCorrect: false, text: `Not quite! Look closer at the sample size and deviation. ${currentCase.reasoning}` });
    }
  };

  const handleNextCase = () => {
    sounds.click();
    setS3UserChoice(null);
    setS3Feedback(null);
    setS3CaseIndex((s3CaseIndex + 1) % s3Cases.length);
  };

  return (
    <div className="phase-container">
      {/* Top Header */}
      <div className="phase-header-bar">
        <div className="phase-title-group">
          <h2><span>🧪</span> Phase 03: Interactive Simulation Stations</h2>
          <p>Experiment with probability instruments, test mathematical predictions, and uncover rigged games.</p>
        </div>
        <div className="mascot-speaker-badge">
          <span className="avatar">🦊</span>
          <span className="speaker-name">Archie & Maya Lab</span>
        </div>
      </div>

      {/* 3 Station Navigation Pills */}
      <div className="station-nav-pills">
        <button
          className={`station-pill-btn ${activeStation === 'station1' ? 'active' : ''}`}
          onClick={() => { sounds.click(); setActiveStation('station1'); }}
        >
          <span>01</span>
          <span>⚡ Live Probability Lab</span>
          {completedStations.includes('station1') && <span className="pill-check">✓</span>}
        </button>

        <button
          className={`station-pill-btn ${activeStation === 'station2' ? 'active' : ''}`}
          onClick={() => { sounds.click(); setActiveStation('station2'); }}
        >
          <span>02</span>
          <span>🎯 Predict then Test</span>
          {completedStations.includes('station2') && <span className="pill-check">✓</span>}
        </button>

        <button
          className={`station-pill-btn ${activeStation === 'station3' ? 'active' : ''}`}
          onClick={() => { sounds.click(); setActiveStation('station3'); }}
        >
          <span>03</span>
          <span>🔍 Detective Fairness Test</span>
          {completedStations.includes('station3') && <span className="pill-check">✓</span>}
        </button>
      </div>

      {/* Active Station Viewport */}
      <div className="station-viewport">
        {/* STATION 1: EXPERIMENT SIMULATOR */}
        {activeStation === 'station1' && (
          <div>
            <div className="station-instruction-banner">
              <strong>🔬 Lab Directive:</strong> Run batches of 10, 100, or 1,000 trials on the Coin, Dice, or Spinner. Notice how the experimental line chart hugs the dashed theoretical target line as trials increase!
            </div>
            <ExperimentSimulator
              onTrialBatchComplete={(count) => {
                onAddXp(count >= 100 ? 25 : 10);
                onCompleteStation('station1');
              }}
            />
          </div>
        )}

        {/* STATION 2: PREDICT THEN TEST */}
        {activeStation === 'station2' && (
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ color: 'var(--gold-400)', fontFamily: 'var(--font-heading)', fontSize: '1.3rem', marginBottom: '12px' }}>
              🎯 Hypothesis & Experimental Testing
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.5 }}>
              Choose a probability event, state its mathematical theoretical probability, and test it against real trials to observe the error margin shrink!
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {/* Event Selection */}
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '16px', borderRadius: '12px' }}>
                <label style={{ display: 'block', color: 'var(--teal-300)', fontWeight: 700, marginBottom: '8px' }}>
                  1. Select Target Event:
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {s2Events.map(ev => (
                    <button
                      key={ev.id}
                      className={`btn-selector ${s2Event === ev.id ? 'active' : ''}`}
                      onClick={() => { sounds.click(); setS2Event(ev.id); setS2Tested(false); }}
                      style={{
                        padding: '10px 14px',
                        textAlign: 'left',
                        borderRadius: '8px',
                        border: s2Event === ev.id ? '1.5px solid var(--teal-400)' : '1px solid rgba(255,255,255,0.1)',
                        background: s2Event === ev.id ? 'rgba(0, 229, 255, 0.15)' : 'rgba(0,0,0,0.2)',
                        color: '#fff',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontWeight: 600 }}>{ev.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--gold-400)' }}>P(E) = {ev.formula}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sample Size & Launch */}
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <label style={{ display: 'block', color: 'var(--gold-300)', fontWeight: 700, marginBottom: '8px' }}>
                    2. Choose Sample Size (Trials):
                  </label>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                    {[20, 100, 500].map(sz => (
                      <button
                        key={sz}
                        onClick={() => { sounds.click(); setS2SampleSize(sz); setS2Tested(false); }}
                        style={{
                          flex: 1,
                          padding: '10px',
                          borderRadius: '8px',
                          border: s2SampleSize === sz ? '1.5px solid var(--gold-400)' : '1px solid rgba(255,255,255,0.1)',
                          background: s2SampleSize === sz ? 'rgba(255, 184, 0, 0.2)' : 'rgba(0,0,0,0.2)',
                          color: '#fff',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {sz} Trials
                      </button>
                    ))}
                  </div>

                  <button
                    className="btn-primary"
                    onClick={handleS2RunTest}
                    style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
                  >
                    🚀 Run {s2SampleSize} Empirical Trials!
                  </button>
                </div>

                {/* Live Results Panel */}
                {s2Tested && s2Result && (
                  <div style={{
                    marginTop: '16px',
                    padding: '14px',
                    background: 'rgba(0, 229, 255, 0.1)',
                    border: '1px solid var(--teal-400)',
                    borderRadius: '10px'
                  }}>
                    <div style={{ fontWeight: 700, color: 'var(--teal-300)', marginBottom: '4px' }}>
                      Empirical Findings ({s2Result.total} Trials):
                    </div>
                    <div style={{ fontSize: '0.92rem', color: '#fff', lineHeight: 1.5 }}>
                      • Occurrences: <strong>{s2Result.successCount} / {s2Result.total}</strong><br />
                      • Experimental Prob: <strong>{(s2Result.expProb * 100).toFixed(1)}%</strong><br />
                      • Theoretical Prob: <strong>{(s2Result.theoretical * 100).toFixed(1)}%</strong><br />
                      • Deviation: <strong style={{ color: s2Result.deviation < 0.05 ? 'var(--emerald-400)' : 'var(--gold-400)' }}>
                        {(s2Result.deviation * 100).toFixed(1)}% difference
                      </strong>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STATION 3: DETECTIVE FAIRNESS TEST */}
        {activeStation === 'station3' && (
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ color: 'var(--gold-400)', fontFamily: 'var(--font-heading)', fontSize: '1.3rem' }}>
                {currentCase.title}
              </h3>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                Case {s3CaseIndex + 1} of {s3Cases.length}
              </span>
            </div>

            <div style={{ color: 'var(--text-muted)', marginBottom: '14px', fontSize: '0.95rem' }}>
              <strong>Device:</strong> {currentCase.apparatus} | <strong>Total Trials:</strong> {currentCase.trials} | <strong>Expected:</strong> {currentCase.expected}
            </div>

            {/* Trial Data Table */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${currentCase.data.length}, 1fr)`,
              gap: '10px',
              marginBottom: '20px'
            }}>
              {currentCase.data.map((col, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    padding: '12px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    border: '1px solid rgba(255,255,255,0.08)'
                  }}
                >
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginBottom: '4px' }}>{col.label}</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--gold-300)' }}>{col.count}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--teal-300)' }}>{col.pct}</div>
                </div>
              ))}
            </div>

            {/* Fair or Biased Decision Buttons */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              <button
                onClick={() => handleS3Answer('fair')}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: '10px',
                  border: s3UserChoice === 'fair' ? '2px solid var(--emerald-400)' : '1px solid rgba(255,255,255,0.15)',
                  background: s3UserChoice === 'fair' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(0,0,0,0.3)',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  cursor: 'pointer'
                }}
              >
                ✅ Fair Device
              </button>

              <button
                onClick={() => handleS3Answer('biased')}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: '10px',
                  border: s3UserChoice === 'biased' ? '2px solid var(--coral-400)' : '1px solid rgba(255,255,255,0.15)',
                  background: s3UserChoice === 'biased' ? 'rgba(255, 94, 98, 0.25)' : 'rgba(0,0,0,0.3)',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  cursor: 'pointer'
                }}
              >
                ⚠️ Biased / Rigged
              </button>
            </div>

            {/* Feedback & Next Case */}
            {s3Feedback && (
              <div style={{
                padding: '16px',
                borderRadius: '10px',
                background: s3Feedback.isCorrect ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 94, 98, 0.15)',
                border: `1.5px solid ${s3Feedback.isCorrect ? 'var(--emerald-400)' : 'var(--coral-400)'}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ color: '#fff', fontSize: '0.95rem', lineHeight: 1.5, paddingRight: '12px' }}>
                  {s3Feedback.text}
                </div>
                <button
                  className="btn-primary"
                  onClick={handleNextCase}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  Next Case →
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Phase Navigation */}
      <div className="phase-bottom-bar" style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          className="btn-gold"
          onClick={() => { sounds.fanfare(); onNextPhase(); }}
          style={{ padding: '12px 28px' }}
        >
          <span>Complete Labs & Enter Practice Arena →</span>
        </button>
      </div>
    </div>
  );
}
