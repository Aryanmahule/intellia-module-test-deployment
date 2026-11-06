import React, { useState, useEffect } from 'react';
import PatternExpressionCanvas from './PatternExpressionCanvas';
import { STATIONS_NARRATION } from '../utils/patternsNarration';
import { sounds, playNarration } from '../utils/audio';

export default function StationsPhase({ onNextPhase, onCompleteStation, completedStations = [], onAddXp }) {
  const [activeStation, setActiveStation] = useState('station1');

  // Station 1 State (Pattern Builder)
  const [s1Family, setS1Family] = useState('matchSquares');
  const [s1Figure, setS1Figure] = useState(3);
  const [s1SelectedRule, setS1SelectedRule] = useState('');
  const [s1Figure10Input, setS1Figure10Input] = useState('');
  const [s1Feedback, setS1Feedback] = useState(null);

  // Station 2 State (Word Translator)
  const [s2PhraseIndex, setS2PhraseIndex] = useState(0);
  const [s2BuiltChips, setS2BuiltChips] = useState([]);
  const [s2Feedback, setS2Feedback] = useState(null);

  // Station 3 State (Singapore Real World)
  const [s3ScenarioIndex, setS3ScenarioIndex] = useState(0);
  const [s3Answer, setS3Answer] = useState('');
  const [s3Feedback, setS3Feedback] = useState(null);

  useEffect(() => {
    if (activeStation === 'station1') {
      playNarration(STATIONS_NARRATION.station1.text, STATIONS_NARRATION.station1.style);
    } else if (activeStation === 'station2') {
      playNarration(STATIONS_NARRATION.station2.text, STATIONS_NARRATION.station2.style);
    } else if (activeStation === 'station3') {
      playNarration(STATIONS_NARRATION.station3.text, STATIONS_NARRATION.station3.style);
    }
  }, [activeStation]);

  // Station 2 Data
  const s2Challenges = [
    {
      phrase: '7 less than k',
      availableChips: ['k', '−', '7', '7', '+', 'k'],
      correctAnswer: ['k', '−', '7'],
      ruleName: 'Order Reversal Rule'
    },
    {
      phrase: 'Twice the sum of x and 4',
      availableChips: ['2', '(', 'x', '+', '4', ')', 'x', '+', '8'],
      correctAnswer: ['2', '(', 'x', '+', '4', ')'],
      ruleName: 'Brackets First Rule'
    },
    {
      phrase: 'Divide y by 3, then add 5',
      availableChips: ['y/3', '+', '5', '3/y', '−', '5'],
      correctAnswer: ['y/3', '+', '5'],
      ruleName: 'Sequential Operations'
    }
  ];

  // Station 3 Data
  const s3Scenarios = [
    {
      title: 'Hawker Centre Joined Tables 🍲',
      context: 'At Newton Food Centre, square tables are placed in a row. 1 seat on each top/bottom side + 2 end seats.',
      formula: '2n + 2',
      prompt: 'For 12 joined tables (n = 12), how many people can sit?',
      correctVal: '26',
      options: ['24', '26', '28', '48']
    },
    {
      title: 'HDB Corridor L-Shape Tiles 🏢',
      context: 'Corner tiles laid out in an expanding L-shape pattern in a Toa Payoh HDB block.',
      formula: '2n − 1',
      prompt: 'How many tiles are needed for Pattern #8 (n = 8)?',
      correctVal: '15',
      options: ['14', '15', '16', '17']
    },
    {
      title: 'Downtown MRT Line Travel Time 🚇',
      context: 'Base wait time is 5 minutes, plus 3 minutes for every MRT station passed.',
      formula: '3n + 5',
      prompt: 'How many minutes will a journey of 10 stations take?',
      correctVal: '35',
      options: ['30', '32', '35', '38']
    }
  ];

  // Station 1 Handler
  const handleS1Check = () => {
    const isSquares = s1Family === 'matchSquares';
    const isTriangles = s1Family === 'matchTriangles';
    const expectedRule = isSquares ? '3n + 1' : isTriangles ? '2n + 1' : '2n + 2';
    const expectedFig10 = isSquares ? '31' : isTriangles ? '21' : '22';

    if (s1SelectedRule === expectedRule && s1Figure10Input.trim() === expectedFig10) {
      sounds.correct();
      setS1Feedback({ success: true, msg: `Awesome! You mastered the ${s1Family} rule: ${expectedRule}!` });
      onCompleteStation('station1');
      onAddXp(40);
    } else {
      sounds.wrong();
      setS1Feedback({
        success: false,
        msg: `Check your rule: remember Figure 1 needs the base sticks, and each extra adds the common jump!`
      });
    }
  };

  // Station 2 Handlers
  const handleS2ChipClick = (chip) => {
    sounds.click();
    setS2BuiltChips(prev => [...prev, chip]);
  };

  const handleS2RemoveChip = (idx) => {
    sounds.pop();
    setS2BuiltChips(prev => prev.filter((_, i) => i !== idx));
  };

  const handleS2Check = () => {
    const current = s2Challenges[s2PhraseIndex];
    const userBuiltStr = s2BuiltChips.join('');
    const correctStr = current.correctAnswer.join('');

    if (userBuiltStr === correctStr) {
      sounds.correct();
      setS2Feedback({ success: true, msg: `Correct! "${current.phrase}" ➔ ${correctStr}` });
      if (s2PhraseIndex < s2Challenges.length - 1) {
        setTimeout(() => {
          setS2PhraseIndex(prev => prev + 1);
          setS2BuiltChips([]);
          setS2Feedback(null);
        }, 1200);
      } else {
        onCompleteStation('station2');
        onAddXp(40);
      }
    } else {
      sounds.wrong();
      setS2Feedback({ success: false, msg: `Not quite! Check the word order and operations.` });
    }
  };

  // Station 3 Handler
  const handleS3Select = (opt) => {
    const current = s3Scenarios[s3ScenarioIndex];
    setS3Answer(opt);
    if (opt === current.correctVal) {
      sounds.correct();
      setS3Feedback({ success: true, msg: `Spot on! Rule ${current.formula} gives ${opt}.` });
      if (s3ScenarioIndex < s3Scenarios.length - 1) {
        setTimeout(() => {
          setS3ScenarioIndex(prev => prev + 1);
          setS3Answer('');
          setS3Feedback(null);
        }, 1300);
      } else {
        onCompleteStation('station3');
        onAddXp(40);
      }
    } else {
      sounds.wrong();
      setS3Feedback({ success: false, msg: `Try again! Substitute the value of n into the formula ${current.formula}.` });
    }
  };

  const allDone = ['station1', 'station2', 'station3'].every(s => completedStations.includes(s));

  return (
    <div className="phase-container">
      {/* Header */}
      <div className="phase-header-bar">
        <div className="phase-title-group">
          <h2><span>🧪</span> Phase 03: Interactive Simulation Labs</h2>
          <p>Complete all 3 stations to test your pattern detective formulas in real time.</p>
        </div>
        <div className="mascot-speaker-badge">
          <span className="avatar">🦊</span>
          <span className="speaker-name">Station Master</span>
        </div>
      </div>

      {/* 3 Station Tabs */}
      <div className="station-tab-bar">
        <button
          className={`station-tab-btn ${activeStation === 'station1' ? 'active' : ''} ${completedStations.includes('station1') ? 'completed' : ''}`}
          onClick={() => { sounds.click(); setActiveStation('station1'); }}
        >
          <span>🧩 Station 1: Pattern Builder</span>
          {completedStations.includes('station1') && <span>✓</span>}
        </button>

        <button
          className={`station-tab-btn ${activeStation === 'station2' ? 'active' : ''} ${completedStations.includes('station2') ? 'completed' : ''}`}
          onClick={() => { sounds.click(); setActiveStation('station2'); }}
        >
          <span>🔤 Station 2: Word Translator</span>
          {completedStations.includes('station2') && <span>✓</span>}
        </button>

        <button
          className={`station-tab-btn ${activeStation === 'station3' ? 'active' : ''} ${completedStations.includes('station3') ? 'completed' : ''}`}
          onClick={() => { sounds.click(); setActiveStation('station3'); }}
        >
          <span>🏙️ Station 3: Real Singapore Patterns</span>
          {completedStations.includes('station3') && <span>✓</span>}
        </button>
      </div>

      {/* Main Interactive Station Content */}
      <div className="station-main-area">
        {/* STATION 1: PATTERN BUILDER */}
        {activeStation === 'station1' && (
          <>
            <div className="interactive-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: '1.2rem' }}>
                  Live Shape Canvas
                </h3>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => { sounds.click(); setS1Family('matchSquares'); }}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      background: s1Family === 'matchSquares' ? 'var(--purple-500)' : 'rgba(255,255,255,0.08)',
                      color: '#fff',
                      border: 'none',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    Squares (3n+1)
                  </button>
                  <button
                    onClick={() => { sounds.click(); setS1Family('matchTriangles'); }}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      background: s1Family === 'matchTriangles' ? 'var(--purple-500)' : 'rgba(255,255,255,0.08)',
                      color: '#fff',
                      border: 'none',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    Triangles (2n+1)
                  </button>
                  <button
                    onClick={() => { sounds.click(); setS1Family('tables'); }}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      background: s1Family === 'tables' ? 'var(--purple-500)' : 'rgba(255,255,255,0.08)',
                      color: '#fff',
                      border: 'none',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    Tables (2n+2)
                  </button>
                </div>
              </div>

              <PatternExpressionCanvas
                mode="shape"
                family={s1Family}
                figure={s1Figure}
                interactive={true}
                onFigureChange={setS1Figure}
              />

              <table className="table-data-grid">
                <thead>
                  <tr>
                    <th>Figure (n)</th>
                    <th>1</th>
                    <th>2</th>
                    <th>3</th>
                    <th>4</th>
                    <th>... 10</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ color: 'var(--gold-300)' }}>Count</td>
                    <td>{s1Family === 'matchSquares' ? 4 : s1Family === 'matchTriangles' ? 3 : 4}</td>
                    <td>{s1Family === 'matchSquares' ? 7 : s1Family === 'matchTriangles' ? 5 : 6}</td>
                    <td>{s1Family === 'matchSquares' ? 10 : s1Family === 'matchTriangles' ? 7 : 8}</td>
                    <td>{s1Family === 'matchSquares' ? 13 : s1Family === 'matchTriangles' ? 9 : 10}</td>
                    <td style={{ color: 'var(--teal-300)', fontWeight: 800 }}>?</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="interactive-card">
              <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold-300)', fontSize: '1.15rem', marginBottom: '8px' }}>
                Determine the Rule
              </h3>
              <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '12px' }}>
                Select the correct nth-term formula and predict Figure 10:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                {['3n + 1', '2n + 1', '2n + 2', '4n'].map((r) => (
                  <button
                    key={r}
                    onClick={() => { sounds.click(); setS1SelectedRule(r); }}
                    style={{
                      background: s1SelectedRule === r ? 'rgba(168, 85, 247, 0.35)' : 'rgba(255,255,255,0.06)',
                      border: s1SelectedRule === r ? '1.5px solid var(--purple-400)' : '1px solid var(--border-glass)',
                      color: '#ffffff',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      textAlign: 'left',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Formula: {r}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Figure 10 count:</span>
                <input
                  type="number"
                  value={s1Figure10Input}
                  onChange={(e) => setS1Figure10Input(e.target.value)}
                  placeholder="e.g. 31"
                  style={{
                    background: 'rgba(12, 4, 25, 0.8)',
                    border: '1.5px solid var(--border-purple)',
                    borderRadius: '8px',
                    color: '#fff',
                    padding: '8px 12px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.1rem',
                    width: '90px'
                  }}
                />
              </div>

              {s1Feedback && (
                <div className={`feedback-alert-box ${s1Feedback.success ? 'correct' : 'wrong'}`} style={{ marginBottom: '12px' }}>
                  {s1Feedback.msg}
                </div>
              )}

              <button className="btn-gold" onClick={handleS1Check} style={{ marginTop: 'auto' }}>
                Check My Formula ➔
              </button>
            </div>
          </>
        )}

        {/* STATION 2: WORD TRANSLATOR */}
        {activeStation === 'station2' && (
          <>
            <div className="interactive-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--teal-300)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700 }}>
                  CHALLENGE {s2PhraseIndex + 1} OF {s2Challenges.length}
                </span>
                <span style={{ color: 'var(--gold-300)', fontSize: '0.85rem' }}>
                  {s2Challenges[s2PhraseIndex].ruleName}
                </span>
              </div>

              <div style={{
                background: 'rgba(10, 3, 22, 0.85)',
                border: '1.5px solid var(--border-gold)',
                borderRadius: '14px',
                padding: '16px',
                margin: '14px 0',
                textAlign: 'center'
              }}>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  English Sentence Clue
                </div>
                <div style={{ color: '#ffffff', fontFamily: 'var(--font-heading)', fontSize: '1.45rem', fontWeight: 800, marginTop: '6px' }}>
                  "{s2Challenges[s2PhraseIndex].phrase}"
                </div>
              </div>

              <div>
                <div style={{ color: '#cbd5e1', fontSize: '0.85rem', marginBottom: '6px' }}>
                  Your Built Algebraic Expression (Tap chips in order):
                </div>
                <div className="chips-container">
                  {s2BuiltChips.length === 0 ? (
                    <span style={{ color: 'var(--text-dim)', fontStyle: 'italic', fontSize: '0.9rem' }}>
                      (Tap chips from below to build your expression)
                    </span>
                  ) : (
                    s2BuiltChips.map((chip, idx) => (
                      <span
                        key={idx}
                        className="math-chip"
                        onClick={() => handleS2RemoveChip(idx)}
                        title="Click to remove"
                      >
                        {chip} ✕
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div style={{ marginTop: 'auto' }}>
                <div style={{ color: '#cbd5e1', fontSize: '0.85rem', marginBottom: '8px' }}>
                  Available Chips:
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {s2Challenges[s2PhraseIndex].availableChips.map((chip, idx) => (
                    <button
                      key={idx}
                      className="math-chip"
                      onClick={() => handleS2ChipClick(chip)}
                      style={{ cursor: 'pointer' }}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="interactive-card">
              <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--teal-300)', fontSize: '1.15rem', marginBottom: '8px' }}>
                Detective Rules & Slips
              </h3>
              <div style={{
                background: 'rgba(255, 94, 98, 0.15)',
                border: '1px solid var(--coral-400)',
                borderRadius: '12px',
                padding: '12px',
                marginBottom: '14px'
              }}>
                <div style={{ color: 'var(--coral-300)', fontWeight: 700, fontSize: '0.85rem' }}>⚠️ Beware of Ravi's Slip:</div>
                <p style={{ color: '#ffe4e6', fontSize: '0.85rem', marginTop: '4px' }}>
                  In English we say "7 less than k", but in Algebra you must start with the original quantity <strong>k</strong> and subtract <strong>7</strong>: <code>k − 7</code>!
                </p>
              </div>

              {s2Feedback && (
                <div className={`feedback-alert-box ${s2Feedback.success ? 'correct' : 'wrong'}`} style={{ marginBottom: '14px' }}>
                  {s2Feedback.msg}
                </div>
              )}

              <button className="btn-gold" onClick={handleS2Check} style={{ marginTop: 'auto' }}>
                Submit Translation ➔
              </button>
            </div>
          </>
        )}

        {/* STATION 3: SINGAPORE REAL WORLD */}
        {activeStation === 'station3' && (
          <>
            <div className="interactive-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ color: 'var(--emerald-300)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700 }}>
                  SCENARIO {s3ScenarioIndex + 1} OF {s3Scenarios.length}
                </span>
                <span style={{ color: 'var(--gold-300)', fontSize: '0.85rem', fontWeight: 700 }}>
                  Singapore Math in Action
                </span>
              </div>

              <div style={{
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1.5px solid var(--emerald-400)',
                borderRadius: '14px',
                padding: '16px',
                marginBottom: '14px'
              }}>
                <h4 style={{ color: '#ffffff', fontSize: '1.25rem', fontFamily: 'var(--font-heading)', marginBottom: '6px' }}>
                  {s3Scenarios[s3ScenarioIndex].title}
                </h4>
                <p style={{ color: '#cbd5e1', fontSize: '0.92rem', lineHeight: 1.5 }}>
                  {s3Scenarios[s3ScenarioIndex].context}
                </p>
                <div style={{ marginTop: '10px', fontFamily: 'var(--font-mono)', color: 'var(--gold-300)', fontWeight: 700 }}>
                  Algebraic Rule: {s3Scenarios[s3ScenarioIndex].formula}
                </div>
              </div>

              <div style={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: 700, margin: '8px 0' }}>
                {s3Scenarios[s3ScenarioIndex].prompt}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '12px' }}>
                {s3Scenarios[s3ScenarioIndex].options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleS3Select(opt)}
                    style={{
                      background: s3Answer === opt ? 'rgba(16, 185, 129, 0.35)' : 'rgba(255,255,255,0.06)',
                      border: s3Answer === opt ? '1.5px solid var(--emerald-400)' : '1px solid var(--border-glass)',
                      color: '#fff',
                      padding: '12px',
                      borderRadius: '12px',
                      fontSize: '1.1rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="interactive-card">
              <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--emerald-300)', fontSize: '1.15rem', marginBottom: '8px' }}>
                Real-World Explanation
              </h3>
              <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '14px' }}>
                Everyday city systems rely on algebraic linear functions. By substituting any value into <strong>n</strong>, you can calculate answers instantly without counting one by one!
              </p>

              {s3Feedback && (
                <div className={`feedback-alert-box ${s3Feedback.success ? 'correct' : 'wrong'}`} style={{ marginBottom: '14px' }}>
                  {s3Feedback.msg}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Bottom Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
        <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem', fontWeight: 600 }}>
          {allDone ? '🎉 All 3 Stations Completed (+120 XP)!' : `Stations Completed: ${completedStations.length} / 3`}
        </div>
        <button
          className="btn-gold"
          onClick={() => {
            sounds.correct();
            onNextPhase();
          }}
        >
          <span>Continue to Practice Arena</span>
          <span>➔</span>
        </button>
      </div>
    </div>
  );
}
