import React, { useState, useEffect } from 'react';
import BalanceScaleCanvas from './BalanceScaleCanvas.jsx';
import { NARRATION } from '../../utils/equationsNarration.js';
import { narrate, sounds, stopNarration, unlockAudio } from '../../utils/audio.js';

export default function StationsPhase({ state, onNext, onCompleteStation, onAddXP }) {
  const [activeStation, setActiveStation] = useState('station1');

  // Station 1: Balance Scale States
  const [s1Round, setS1Round] = useState(0);
  const [s1Completed, setS1Completed] = useState(false);

  const s1Challenges = [
    { type: 'tutorial', left: { x: 1, units: 3 }, right: { units: 8 }, targetX: 5, prompt: "Tutorial: See how changing one side breaks balance, while changing both keeps it level!" },
    { type: 'interactive', left: { x: 1, units: 4 }, right: { units: 9 }, targetX: 5, prompt: "Challenge 1: Subtract 4 from both sides to find the mystery weight x in x + 4 = 9!" },
    { type: 'interactive', left: { x: 3, units: 0 }, right: { units: 12 }, targetX: 4, prompt: "Challenge 2: Divide both sides by 3 to isolate x in 3x = 12!" },
    { type: 'interactive', left: { x: 2, units: 3 }, right: { units: 11 }, targetX: 4, prompt: "Challenge 3: Undo addition (− 3), then undo multiplication (÷ 2) in 2x + 3 = 11!" }
  ];

  // Station 2: Undo & Fix (Spot the Slip)
  const [s2Round, setS2Round] = useState(0);
  const [s2SelectedLine, setS2SelectedLine] = useState(null);
  const [s2SelectedFix, setS2SelectedFix] = useState(null);
  const [s2Completed, setS2Completed] = useState(false);

  const s2Challenges = [
    {
      eq: "x + 5 = 12",
      prompt: "Find and fix Ravi's error in solving x + 5 = 12",
      lines: [
        { id: 'l1', text: "Line 1: x + 5 = 12", isError: false },
        { id: 'l2', text: "Line 2: x = 12 + 5", isError: true, reason: "Used addition instead of subtraction inverse" },
        { id: 'l3', text: "Line 3: x = 17", isError: false }
      ],
      fixes: [
        { text: "Line 2: x = 12 − 5 = 7 (Subtract 5 from both sides)", isCorrect: true },
        { text: "Line 2: x = 12 × 5 = 60 (Multiply by 5)", isCorrect: false },
        { text: "Line 2: x = 12 ÷ 5 = 2.4 (Divide by 5)", isCorrect: false }
      ]
    },
    {
      eq: "3x = 18",
      prompt: "Find and fix Ravi's error in solving 3x = 18",
      lines: [
        { id: 'l1', text: "Line 1: 3x = 18", isError: false },
        { id: 'l2', text: "Line 2: x = 18 − 3", isError: true, reason: "Subtracted instead of dividing by 3" },
        { id: 'l3', text: "Line 3: x = 15", isError: false }
      ],
      fixes: [
        { text: "Line 2: x = 18 ÷ 3 = 6 (Divide both sides by 3)", isCorrect: true },
        { text: "Line 2: x = 18 + 3 = 21 (Add 3 to both sides)", isCorrect: false },
        { text: "Line 2: x = 18 × 3 = 54 (Multiply both sides by 3)", isCorrect: false }
      ]
    },
    {
      eq: "2x + 4 = 14",
      prompt: "Find and fix Ravi's error in solving 2x + 4 = 14",
      lines: [
        { id: 'l1', text: "Line 1: 2x + 4 = 14", isError: false },
        { id: 'l2', text: "Line 2: 2x = 14 (Forgot to subtract 4 from right side)", isError: true, reason: "Applied operation to left side only" },
        { id: 'l3', text: "Line 3: x = 7", isError: false }
      ],
      fixes: [
        { text: "Line 2: 2x = 14 − 4 = 10, then x = 10 ÷ 2 = 5", isCorrect: true },
        { text: "Line 2: 2x = 14 + 4 = 18, then x = 9", isCorrect: false },
        { text: "Line 2: x + 4 = 7 (Divided by 2 first without brackets)", isCorrect: false }
      ]
    }
  ];

  // Station 3: Equations in Singapore
  const [s3Round, setS3Round] = useState(0);
  const [s3SelectedOpt, setS3SelectedOpt] = useState(null);
  const [s3Completed, setS3Completed] = useState(false);

  const s3Scenarios = [
    {
      landmark: "🚆 MRT Card Top-Up (Dhoby Ghaut)",
      desc: "Maya started with an unknown balance $x. She took 3 MRT rides of $1.50 each ($4.50 total) and now has $15.50 on her card.",
      equation: "x − 4.50 = 15.50",
      params: "Find the original card balance x:",
      options: ["$20.00", "$11.00", "$19.50", "$22.00"],
      correct: "$20.00",
      explanation: "Add $4.50 to both sides: x = 15.50 + 4.50 = $20.00."
    },
    {
      landmark: "🍲 Hawker Centre Feast (Lau Pa Sat)",
      desc: "4 classmates ordered identical Satay platters at $x each, plus $6 total for drinks. The bill came to $26.",
      equation: "4x + 6 = 26",
      params: "Find the cost x of each satay platter:",
      options: ["$5.00", "$6.50", "$8.00", "$4.50"],
      correct: "$5.00",
      explanation: "Subtract 6: 4x = 20. Divide by 4: x = $5.00."
    },
    {
      landmark: "🌺 Gardens by the Bay Concert",
      desc: "Event organizers arranged 5 equal rows of x chairs, plus 10 VIP front seats. There are 60 seats in total.",
      equation: "5x + 10 = 60",
      params: "Find the number of chairs x in each row:",
      options: ["10 chairs", "12 chairs", "8 chairs", "14 chairs"],
      correct: "10 chairs",
      explanation: "Subtract 10: 5x = 50. Divide by 5: x = 10 chairs."
    }
  ];

  useEffect(() => {
    unlockAudio();
    if (activeStation === 'station1') narrate(NARRATION.stations.station1.intro, 'instruction');
    if (activeStation === 'station2') narrate(NARRATION.stations.station2.intro, 'instruction');
    if (activeStation === 'station3') narrate(NARRATION.stations.station3.intro, 'instruction');
    return () => {
      stopNarration();
    };
  }, [activeStation]);

  const handleStationTab = (stKey) => {
    unlockAudio();
    sounds.click();
    setActiveStation(stKey);
  };

  // Station 1 Handlers
  const handleS1Advance = () => {
    sounds.click();
    if (s1Round < s1Challenges.length - 1) {
      setS1Round(r => r + 1);
    } else {
      sounds.celebration();
      setS1Completed(true);
      onCompleteStation('station1');
      onAddXP(50);
    }
  };

  // Station 2 Handlers
  const handleS2LineClick = (line) => {
    unlockAudio();
    sounds.click();
    setS2SelectedLine(line);
    setS2SelectedFix(null);
    if (line.isError) {
      sounds.correct();
    } else {
      sounds.pop();
    }
  };

  const handleS2FixSelect = (fix) => {
    unlockAudio();
    setS2SelectedFix(fix);
    if (fix.isCorrect) {
      sounds.correct();
      if (s2Round < s2Challenges.length - 1) {
        setTimeout(() => {
          setS2Round(r => r + 1);
          setS2SelectedLine(null);
          setS2SelectedFix(null);
        }, 1200);
      } else {
        sounds.celebration();
        setS2Completed(true);
        onCompleteStation('station2');
        onAddXP(50);
      }
    } else {
      sounds.wrong();
    }
  };

  // Station 3 Handlers
  const handleS3OptionSelect = (opt) => {
    unlockAudio();
    setS3SelectedOpt(opt);
    const isCorr = opt === s3Scenarios[s3Round].correct;
    if (isCorr) {
      sounds.correct();
      if (s3Round < s3Scenarios.length - 1) {
        setTimeout(() => {
          setS3Round(r => r + 1);
          setS3SelectedOpt(null);
        }, 1200);
      } else {
        sounds.celebration();
        setS3Completed(true);
        onCompleteStation('station3');
        onAddXP(50);
      }
    } else {
      sounds.wrong();
    }
  };

  const allStationsDone = (s1Completed || state.stationsProgress.station1) &&
                          (s2Completed || state.stationsProgress.station2) &&
                          (s3Completed || state.stationsProgress.station3);

  return (
    <div className="glass-card stations-phase-card">
      {/* Top Header with Station Tabs */}
      <div className="phase-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="badge badge-teal" style={{ marginBottom: '6px' }}>
            <span>🧪 Phase 03</span> <span>· Interactive Simulations</span>
          </div>
          <h2 style={{ fontSize: '2.1rem', color: 'var(--text-main)', fontFamily: 'var(--font-fun)' }}>
            Mathematical Exploration Labs
          </h2>
        </div>

        {/* 3 Station Selection Tabs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn ${(s1Completed || state.stationsProgress.station1) ? 'btn-primary' : activeStation === 'station1' ? 'btn-gold' : 'btn-ghost'}`}
            style={{ padding: '6px 14px', fontSize: '0.95rem' }}
            onClick={() => handleStationTab('station1')}
          >
            <span>⚖️ Lab 1 {(s1Completed || state.stationsProgress.station1) ? '✓' : ''}</span>
          </button>
          <button
            className={`btn ${(s2Completed || state.stationsProgress.station2) ? 'btn-primary' : activeStation === 'station2' ? 'btn-gold' : 'btn-ghost'}`}
            style={{ padding: '6px 14px', fontSize: '0.95rem' }}
            onClick={() => handleStationTab('station2')}
          >
            <span>🔧 Lab 2 {(s2Completed || state.stationsProgress.station2) ? '✓' : ''}</span>
          </button>
          <button
            className={`btn ${(s3Completed || state.stationsProgress.station3) ? 'btn-primary' : activeStation === 'station3' ? 'btn-gold' : 'btn-ghost'}`}
            style={{ padding: '6px 14px', fontSize: '0.95rem' }}
            onClick={() => handleStationTab('station3')}
          >
            <span>🏙️ Lab 3 {(s3Completed || state.stationsProgress.station3) ? '✓' : ''}</span>
          </button>
        </div>
      </div>

      {/* Station Body */}
      <div style={{ margin: '8px 0', minHeight: '340px' }}>
        {/* ================= STATION 1 ================= */}
        {activeStation === 'station1' && (
          <div className="station1-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ color: 'var(--gold-bright)', fontSize: '1.15rem', fontWeight: 700 }}>
                {s1Challenges[s1Round].prompt}
              </div>
              <div className="badge badge-gold">
                Round {s1Round + 1} of {s1Challenges.length}
              </div>
            </div>

            <BalanceScaleCanvas
              key={`s1-scale-${s1Round}`}
              left={s1Challenges[s1Round].left}
              right={s1Challenges[s1Round].right}
              targetX={s1Challenges[s1Round].targetX}
              mode={s1Challenges[s1Round].type}
              showEquation={true}
              showLog={true}
              onSolve={() => {
                // Handled in canvas
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button className="btn btn-gold" onClick={handleS1Advance}>
                <span>{s1Round === s1Challenges.length - 1 ? 'Complete Lab 1 (+50 XP) ⚖️' : 'Next Scale Round ▶'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= STATION 2 ================= */}
        {activeStation === 'station2' && (
          <div className="station2-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ color: 'var(--coral-bright)', fontSize: '1.15rem', fontWeight: 700 }}>
                Slip Hunter Round {s2Round + 1} of {s2Challenges.length}: {s2Challenges[s2Round].prompt}
              </div>
              <div className="badge badge-coral">Spot the Slip</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {/* Ravi's faulty working */}
              <div style={{ background: 'rgba(20, 16, 48, 0.85)', border: '1.5px solid var(--purple-border)', borderRadius: 'var(--radius-md)', padding: '14px' }}>
                <div style={{ color: 'var(--gold-bright)', fontWeight: 800, fontSize: '1.1rem', marginBottom: '10px' }}>
                  1. Tap the incorrect line in Ravi's working:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {s2Challenges[s2Round].lines.map((line) => {
                    const isSelected = s2SelectedLine?.id === line.id;
                    const isErr = line.isError;
                    return (
                      <button
                        key={line.id}
                        onClick={() => handleS2LineClick(line)}
                        style={{
                          background: isSelected
                            ? isErr ? 'rgba(244, 63, 94, 0.3)' : 'rgba(255, 255, 255, 0.1)'
                            : 'rgba(255, 255, 255, 0.05)',
                          border: isSelected
                            ? isErr ? '2px solid var(--coral-bright)' : '2px solid rgba(255,255,255,0.4)'
                            : '1.5px solid var(--purple-border)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '12px 16px',
                          color: 'var(--text-main)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '1.15rem',
                          textAlign: 'left',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <span>{line.text}</span>
                        {isSelected && <span>{isErr ? '❌ Error Found!' : '⚠️ Correct Line'}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Fix Options */}
              <div style={{ background: 'rgba(20, 16, 48, 0.85)', border: '1.5px solid var(--purple-border)', borderRadius: 'var(--radius-md)', padding: '14px' }}>
                <div style={{ color: 'var(--teal-bright)', fontWeight: 800, fontSize: '1.1rem', marginBottom: '10px' }}>
                  2. Choose the correct working:
                </div>
                {!s2SelectedLine?.isError ? (
                  <div style={{ color: 'var(--text-dim)', fontSize: '1.1rem', textAlign: 'center', marginTop: '30px' }}>
                    👆 Tap the faulty line on the left first to unlock the fix options!
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {s2Challenges[s2Round].fixes.map((fix, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleS2FixSelect(fix)}
                        style={{
                          background: s2SelectedFix === fix
                            ? fix.isCorrect ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'
                            : 'rgba(255, 255, 255, 0.05)',
                          border: '1.5px solid var(--purple-border)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '12px 14px',
                          color: 'var(--text-main)',
                          fontFamily: 'var(--font-main)',
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          textAlign: 'left',
                          cursor: 'pointer'
                        }}
                      >
                        {fix.text}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= STATION 3 ================= */}
        {activeStation === 'station3' && (
          <div className="station3-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ color: 'var(--gold-bright)', fontSize: '1.15rem', fontWeight: 700 }}>
                Singapore Scenario {s3Round + 1} of {s3Scenarios.length}: {s3Scenarios[s3Round].landmark}
              </div>
              <div className="badge badge-gold">Everyday Math</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {/* Scenario description card */}
              <div style={{ background: 'rgba(20, 16, 48, 0.85)', border: '1.5px solid var(--purple-border)', borderRadius: 'var(--radius-md)', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.4rem', color: 'var(--teal-bright)', marginBottom: '6px' }}>
                    {s3Scenarios[s3Round].landmark}
                  </h3>
                  <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    {s3Scenarios[s3Round].desc}
                  </p>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-mono)', fontSize: '1.3rem', color: 'var(--gold-bright)', border: '1px solid var(--purple-border)' }}>
                    Equation: {s3Scenarios[s3Round].equation}
                  </div>
                </div>

                <div style={{ marginTop: '14px', fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 700 }}>
                  👉 {s3Scenarios[s3Round].params}
                </div>
              </div>

              {/* Options selection */}
              <div style={{ background: 'rgba(20, 16, 48, 0.85)', border: '1.5px solid var(--purple-border)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 800, marginBottom: '12px' }}>
                  Select the calculated result:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {s3Scenarios[s3Round].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleS3OptionSelect(opt)}
                      style={{
                        background: s3SelectedOpt === opt
                          ? opt === s3Scenarios[s3Round].correct ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'
                          : 'rgba(255, 255, 255, 0.06)',
                        border: '2px solid var(--purple-border)',
                        borderRadius: 'var(--radius-md)',
                        padding: '16px',
                        color: 'var(--text-main)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '1.35rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
        <div style={{ color: 'var(--text-dim)', fontSize: '1.05rem', fontWeight: 600 }}>
          Simulation Labs: {Object.values({ s1: s1Completed || state.stationsProgress.station1, s2: s2Completed || state.stationsProgress.station2, s3: s3Completed || state.stationsProgress.station3 }).filter(Boolean).length}/3 Completed
        </div>

        <button
          className={`btn ${allStationsDone ? 'btn-gold' : 'btn-primary'}`}
          onClick={() => {
            sounds.click();
            onNext();
          }}
        >
          <span>Continue to Practice 🎮</span>
        </button>
      </div>
    </div>
  );
}
