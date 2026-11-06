import React, { useState, useEffect } from 'react';
import FormulaMachineCanvas from './FormulaMachineCanvas.jsx';
import FeedbackModal from './FeedbackModal.jsx';
import { NARRATION } from '../../utils/formulaeNarration.js';
import { narrate, sounds, stopNarration } from '../../utils/audio.js';

export default function StationsPhase({ state, onNext, onCompleteStation, onAddXP }) {
  const [activeStation, setActiveStation] = useState('station1');

  // Station 1 State: Interactive Plug It In Challenges
  const [s1Round, setS1Round] = useState(0);
  const [s1Completed, setS1Completed] = useState(state.stationsProgress.station1);

  // Station 2 State: Spot the Slip
  const [s2Round, setS2Round] = useState(0);
  const [s2SelectedLine, setS2SelectedLine] = useState(null);
  const [s2SelectedFix, setS2SelectedFix] = useState(null);
  const [s2Completed, setS2Completed] = useState(state.stationsProgress.station2);

  // Station 3 State: Singapore Formulae
  const [s3Round, setS3Round] = useState(0);
  const [s3SelectedOpt, setS3SelectedOpt] = useState(null);
  const [s3Completed, setS3Completed] = useState(state.stationsProgress.station3);

  // Modal feedback
  const [modalData, setModalData] = useState({ isOpen: false, isCorrect: true, title: '', message: '' });

  const s1Challenges = [
    {
      formula: '3x + 5',
      variables: { x: 0 },
      target: 20,
      hint: 'Adjust slider until 3x + 5 equals 20 (Hint: 3 × 5 + 5 = 20)'
    },
    {
      formula: '2a + 3b',
      variables: { a: 2, b: 0 },
      target: 16,
      hint: 'Adjust b until 2(2) + 3b = 16 (4 + 3b = 16 → b = 4)'
    },
    {
      formula: '2(l + w)',
      variables: { l: 7, w: 1 },
      target: 24,
      hint: 'Set width w so that 2(7 + w) = 24 (7 + w = 12 → w = 5)'
    }
  ];

  const s2Challenges = [
    {
      title: 'Evaluating 3x when x = 4',
      lines: [
        { id: 1, text: 'Step 1: Write expression 3x', isError: false },
        { id: 2, text: 'Step 2: Replace x with 4 → 34', isError: true },
        { id: 3, text: 'Step 3: Answer is 34', isError: false }
      ],
      fixes: [
        { text: '3x = 3(4) = 12 (Use brackets for multiplication)', isCorrect: true },
        { text: '3x = 3 + 4 = 7', isCorrect: false },
        { text: '3x = 3⁴ = 81', isCorrect: false }
      ],
      explanation: '3x means 3 multiplied by x. Putting 4 without brackets creates concatenation (34) instead of multiplication (12).'
    },
    {
      title: 'Evaluating 2 + 5x when x = 3',
      lines: [
        { id: 1, text: 'Step 1: Add (2 + 5) = 7', isError: true },
        { id: 2, text: 'Step 2: Multiply 7 × 3 = 21', isError: false },
        { id: 3, text: 'Step 3: Final Answer = 21', isError: false }
      ],
      fixes: [
        { text: '2 + 5(3) = 2 + 15 = 17 (BODMAS: Multiply before adding)', isCorrect: true },
        { text: '2 + 5 + 3 = 10', isCorrect: false },
        { text: '2 × 5 × 3 = 30', isCorrect: false }
      ],
      explanation: 'Order of operations requires multiplying 5(3) = 15 before adding 2.'
    },
    {
      title: 'Evaluating −x² when x = −3',
      lines: [
        { id: 1, text: 'Step 1: Replace x with −3', isError: false },
        { id: 2, text: 'Step 2: Calculate (−3)² = 9 and drop the outer minus → +9', isError: true },
        { id: 3, text: 'Step 3: Final Answer = +9', isError: false }
      ],
      fixes: [
        { text: '−x² = −(−3)² = −(9) = −9 (Outer negative remains)', isCorrect: true },
        { text: '−x² = −3 × 2 = −6', isCorrect: false },
        { text: '−x² = +18', isCorrect: false }
      ],
      explanation: 'In −x², the negative is outside the square. First calculate (−3)² = 9, then negate it: −9.'
    }
  ];

  const s3Scenarios = [
    {
      landmark: '🚕 ComfortDelGro Taxi',
      desc: 'Base flagdown is $4.10, plus $0.60 per kilometer travelled.',
      formula: 'Fare = $4.10 + $0.60d',
      params: 'Calculate the fare for a trip of d = 10 km to Orchard Road:',
      correct: '$10.10',
      options: ['$10.10', '$47.00', '$6.50', '$14.10'],
      explanation: 'Substitute d = 10: Fare = 4.10 + 0.60(10) = 4.10 + 6.00 = $10.10.'
    },
    {
      landmark: '🌡️ Marina Bay Weather Station',
      desc: 'Temperature conversion formula between Celsius and Fahrenheit.',
      formula: 'F = 9C/5 + 32',
      params: 'On a sunny Singapore afternoon, the temperature is C = 30 °C. Convert to Fahrenheit:',
      correct: '86 °F',
      options: ['86 °F', '59 °F', '95 °F', '72 °F'],
      explanation: 'Substitute C = 30: F = (9 × 30)/5 + 32 = 270/5 + 32 = 54 + 32 = 86 °F.'
    },
    {
      landmark: '🌿 Gardens by the Bay Solar Canopy',
      desc: 'Triangular solar roof canopy with base b = 12 m and height h = 6 m.',
      formula: 'Area = ½bh',
      params: 'Calculate the total surface area of the solar panel canopy:',
      correct: '36 m²',
      options: ['36 m²', '72 m²', '18 m²', '48 m²'],
      explanation: 'Substitute b = 12, h = 6: Area = ½ × 12 × 6 = ½ × 72 = 36 m².'
    }
  ];

  useEffect(() => {
    // Narrate station intro on switch
    const stationIntro = NARRATION.stations[activeStation];
    if (stationIntro?.intro) {
      narrate(stationIntro.intro, stationIntro.style);
    }
    return () => {
      stopNarration();
    };
  }, [activeStation]);

  const handleStationTab = (key) => {
    sounds.click();
    setActiveStation(key);
  };

  // Station 1 Handler
  const handleS1TargetSolved = () => {
    sounds.correct();
    if (s1Round < s1Challenges.length - 1) {
      setModalData({
        isOpen: true,
        isCorrect: true,
        title: 'Target Reached! 🎯',
        message: `Great job! You found the right value to make the output ${s1Challenges[s1Round].target}.`
      });
      setTimeout(() => {
        setS1Round(r => r + 1);
      }, 400);
    } else {
      setS1Completed(true);
      onCompleteStation('station1');
      sounds.celebration();
      setModalData({
        isOpen: true,
        isCorrect: true,
        title: 'Station 1 Mastered! 🌟',
        message: 'You have solved all interactive formula challenges (+50 XP awarded)!'
      });
    }
  };

  // Station 2 Handlers
  const handleS2LineClick = (line) => {
    sounds.click();
    setS2SelectedLine(line);
    if (!line.isError) {
      sounds.wrong();
    }
  };

  const handleS2FixSelect = (fix) => {
    setS2SelectedFix(fix);
    if (fix.isCorrect) {
      sounds.correct();
      if (s2Round < s2Challenges.length - 1) {
        setModalData({
          isOpen: true,
          isCorrect: true,
          title: 'Slip Corrected! 🔍',
          message: s2Challenges[s2Round].explanation
        });
        setTimeout(() => {
          setS2Round(r => r + 1);
          setS2SelectedLine(null);
          setS2SelectedFix(null);
        }, 500);
      } else {
        setS2Completed(true);
        onCompleteStation('station2');
        sounds.celebration();
        setModalData({
          isOpen: true,
          isCorrect: true,
          title: 'Station 2 Mastered! 🌟',
          message: 'You spotted all algebraic slips and fixed every working (+50 XP awarded)!'
        });
      }
    } else {
      sounds.wrong();
      setModalData({
        isOpen: true,
        isCorrect: false,
        title: 'Try Again 💡',
        message: 'Look closely at the order of operations and bracket rules.'
      });
    }
  };

  // Station 3 Handlers
  const handleS3OptionSelect = (opt) => {
    setS3SelectedOpt(opt);
    const curr = s3Scenarios[s3Round];
    if (opt === curr.correct) {
      sounds.correct();
      if (s3Round < s3Scenarios.length - 1) {
        setModalData({
          isOpen: true,
          isCorrect: true,
          title: 'Singapore Problem Solved! 🏙️',
          message: curr.explanation
        });
        setTimeout(() => {
          setS3Round(r => r + 1);
          setS3SelectedOpt(null);
        }, 500);
      } else {
        setS3Completed(true);
        onCompleteStation('station3');
        sounds.celebration();
        setModalData({
          isOpen: true,
          isCorrect: true,
          title: 'Station 3 Mastered! 🌟',
          message: 'You solved all Singapore real-world formula scenarios (+50 XP awarded)!'
        });
      }
    } else {
      sounds.wrong();
      setModalData({
        isOpen: true,
        isCorrect: false,
        title: 'Not quite! 💡',
        message: 'Check your substitution and BODMAS order.'
      });
    }
  };

  const allStationsDone = (s1Completed || state.stationsProgress.station1) &&
    (s2Completed || state.stationsProgress.station2) &&
    (s3Completed || state.stationsProgress.station3);

  return (
    <div className="glass-card stations-phase-card">
      <FeedbackModal
        isOpen={modalData.isOpen}
        isCorrect={modalData.isCorrect}
        title={modalData.title}
        message={modalData.message}
        onClose={() => setModalData(prev => ({ ...prev, isOpen: false }))}
      />

      {/* Top Header */}
      <div className="phase-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="badge badge-teal" style={{ marginBottom: '6px' }}>
            <span>🧪 Phase 03</span> <span>• Interactive Simulation Lab</span>
          </div>
          <h2 style={{ fontSize: '2.1rem', color: 'var(--text-main)', fontFamily: 'var(--font-fun)' }}>
            {activeStation === 'station1' && 'Station 1: Plug It In 🧮'}
            {activeStation === 'station2' && 'Station 2: Spot the Slip 🔍'}
            {activeStation === 'station3' && 'Station 3: Formulae in Singapore 🏙️'}
          </h2>
        </div>

        {/* Station Navigation Tabs */}
        <div className="stations-nav">
          <button
            className={`station-tab-btn ${activeStation === 'station1' ? 'active' : ''}`}
            onClick={() => handleStationTab('station1')}
          >
            {(s1Completed || state.stationsProgress.station1) ? '✓ 1. Plug It In' : '1. Plug It In'}
          </button>
          <button
            className={`station-tab-btn ${activeStation === 'station2' ? 'active' : ''}`}
            onClick={() => handleStationTab('station2')}
          >
            {(s2Completed || state.stationsProgress.station2) ? '✓ 2. Spot Slip' : '2. Spot Slip'}
          </button>
          <button
            className={`station-tab-btn ${activeStation === 'station3' ? 'active' : ''}`}
            onClick={() => handleStationTab('station3')}
          >
            {(s3Completed || state.stationsProgress.station3) ? '✓ 3. Singapore' : '3. Singapore'}
          </button>
        </div>
      </div>

      {/* Main Station Content Area */}
      <div className="station-workspace" style={{ margin: '8px 0', minHeight: '340px' }}>
        {/* ================= STATION 1 ================= */}
        {activeStation === 'station1' && (
          <div className="station1-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ color: 'var(--gold-bright)', fontSize: '1.15rem', fontWeight: 700 }}>
                Challenge {s1Round + 1} of {s1Challenges.length}: {s1Challenges[s1Round].hint}
              </div>
              <div className="badge badge-purple">Interactive Sliders</div>
            </div>

            <FormulaMachineCanvas
              formula={s1Challenges[s1Round].formula}
              variables={s1Challenges[s1Round].variables}
              mode="interactive"
              targetOutput={s1Challenges[s1Round].target}
              onTargetReached={handleS1TargetSolved}
              showSteps={true}
            />
          </div>
        )}

        {/* ================= STATION 2 ================= */}
        {activeStation === 'station2' && (
          <div className="station2-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ color: 'var(--gold-bright)', fontSize: '1.15rem', fontWeight: 700 }}>
                Case {s2Round + 1} of {s2Challenges.length}: {s2Challenges[s2Round].title}
              </div>
              <div className="badge badge-coral">Find the Error</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {/* Ravi's Working (Tap line with error) */}
              <div style={{ background: 'rgba(20, 16, 48, 0.85)', border: '1.5px solid var(--purple-border)', borderRadius: 'var(--radius-md)', padding: '14px' }}>
                <div style={{ color: 'var(--coral-bright)', fontWeight: 800, fontSize: '1.1rem', marginBottom: '10px' }}>
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

              {/* Fix Options (Enabled once error identified) */}
              <div style={{ background: 'rgba(20, 16, 48, 0.85)', border: '1.5px solid var(--purple-border)', borderRadius: 'var(--radius-md)', padding: '14px' }}>
                <div style={{ color: 'var(--teal-bright)', fontWeight: 800, fontSize: '1.1rem', marginBottom: '10px' }}>
                  2. Choose the correct working:
                </div>
                {!s2SelectedLine?.isError ? (
                  <div style={{ color: 'var(--text-dim)', fontSize: '1.1rem', textAlign: 'center', marginTop: '30px' }}>
                    👈 Tap the faulty line on the left first to unlock the fix options!
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
                    {s3Scenarios[s3Round].formula}
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
          Simulation Stations: {Object.values({ s1: s1Completed || state.stationsProgress.station1, s2: s2Completed || state.stationsProgress.station2, s3: s3Completed || state.stationsProgress.station3 }).filter(Boolean).length}/3 Completed
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
