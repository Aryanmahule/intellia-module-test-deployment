import React, { useState, useEffect } from 'react';
import RatioBarCanvas from './RatioBarCanvas';
import { sounds, playNarration } from '../utils/audio';

const STATIONS = [
  {
    id: 'station1',
    num: '01',
    title: 'Build the Ratio',
    icon: '🧩',
    desc: 'Explore part-to-part vs part-to-whole, scale up batches, and fill missing table values.',
    spokenLine:
      'Welcome to Station 1! Build each ratio with tiles, then scale it up or down to find the missing amount.'
  },
  {
    id: 'station2',
    num: '02',
    title: 'Share It',
    icon: '🍰',
    desc: 'Use the Singapore bar model to split prize money and solve total-given and difference-given problems.',
    spokenLine:
      'Welcome to Station 2! Share each amount using the bar model. Find the value of one part first.'
  },
  {
    id: 'station3',
    num: '03',
    title: 'Ratios in Singapore',
    icon: '🏙️',
    desc: 'Compare sweet Bandung drink concentrations and solve real Singapore bakery & construction puzzles.',
    spokenLine:
      'Welcome to Station 3! Compare mixes and solve real Singapore problems using ratios.'
  }
];

export default function StationsPhase({
  completedStations = [],
  onCompleteStation,
  onNextPhase,
  onAddXp
}) {
  const [activeStationIndex, setActiveStationIndex] = useState(0);
  const [subStep, setSubStep] = useState(0); // 0, 1, 2 subproblems per station
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);

  const currentStation = STATIONS[activeStationIndex];
  const isStationComplete = completedStations.includes(currentStation.id);

  useEffect(() => {
    playNarration(currentStation.spokenLine, 'instruction');
    setSubStep(0);
    setFeedback(null);
    setUserAnswer('');
  }, [activeStationIndex]);

  // Problems per station
  const station1Problems = [
    {
      q: 'Look at the tiles: 3 Blue and 5 Yellow. What is the fraction of Blue tiles out of the whole group?',
      options: ['3/5', '3/8', '5/8', '5/3'],
      correct: '3/8',
      expl: 'The whole has 3 + 5 = 8 parts. Blue is 3 out of 8, so the fraction is 3/8!',
      ratio: [3, 5],
      labels: ['Blue Tiles', 'Yellow Tiles'],
      mode: 'parts'
    },
    {
      q: 'A paint recipe uses 2 tins blue to 5 tins white (2 : 5). If Maya has 6 tins of blue, how many tins of white are needed?',
      options: ['9', '10', '15', '25'],
      correct: '15',
      expl: 'Scale factor: 6 ÷ 2 = 3. Multiply white tins: 5 × 3 = 15 tins!',
      ratio: [2, 5],
      labels: ['Blue Paint', 'White Paint'],
      mode: 'table'
    },
    {
      q: 'Simplify the ratio 24 : 36 into its simplest form:',
      options: ['12 : 18', '6 : 9', '2 : 3', '3 : 2'],
      correct: '2 : 3',
      expl: 'Divide both terms by their greatest common factor (12): 24÷12 = 2, 36÷12 = 3 → 2 : 3!',
      ratio: [2, 3],
      labels: ['Flour', 'Sugar'],
      mode: 'table'
    }
  ];

  const station2Problems = [
    {
      q: 'Share $72 between Maya and Ravi in the ratio 3 : 5. What is the value of 1 part?',
      options: ['$8', '$9', '$12', '$24'],
      correct: '$9',
      expl: 'Total parts = 3 + 5 = 8. One part = $72 ÷ 8 = $9 per part!',
      ratio: [3, 5],
      total: 72,
      difference: null,
      labels: ["Maya's Share", "Ravi's Share"],
      mode: 'bar'
    },
    {
      q: 'What is Ravi\'s total share from the $72 prize (5 parts)?',
      options: ['$27', '$36', '$45', '$50'],
      correct: '$45',
      expl: '5 parts × $9 = $45! (Maya gets 3 × $9 = $27. Sum: 27 + 45 = 72 ✓)',
      ratio: [3, 5],
      total: 72,
      difference: null,
      labels: ["Maya's Share", "Ravi's Share"],
      mode: 'bar'
    },
    {
      q: 'Ali and Ben share stamps in the ratio 3 : 5. Ben has 24 more stamps than Ali. How many stamps in total do they have?',
      options: ['$48', '72', '96', '120'],
      correct: '96',
      expl: 'Ben has 5 - 3 = 2 parts more. 2 parts = 24 → 1 part = 12. Total = 8 parts × 12 = 96 stamps!',
      ratio: [3, 5],
      total: 96,
      difference: 24,
      labels: ["Ali's Stamps", "Ben's Stamps"],
      mode: 'bar'
    }
  ];

  const station3Problems = [
    {
      q: 'Mix A has syrup : water = 4 : 9. Mix B has syrup : water = 3 : 5. Which mix is sweeter and stronger?',
      options: ['Mix A (more syrup cups)', 'Mix B (higher syrup fraction)', 'Both are equal', 'Cannot tell'],
      correct: 'Mix B (higher syrup fraction)',
      expl: 'Mix A syrup fraction is 4/13 ≈ 30.8%. Mix B is 3/8 = 37.5%. Mix B has a higher concentration!',
      mixes: [
        { name: 'Mix A', a: 4, b: 9, labelA: 'Syrup', labelB: 'Water' },
        { name: 'Mix B', a: 3, b: 5, labelA: 'Syrup', labelB: 'Water' }
      ],
      mode: 'mix'
    },
    {
      q: 'For school renovation cement : sand is mixed in ratio 1 : 3. A contractor has 12 bags of sand. How many bags of cement are needed?',
      options: ['3', '4', '9', '36'],
      correct: '4',
      expl: 'Sand is 3 parts = 12 bags → 1 part = 12 ÷ 3 = 4 bags of cement!',
      ratio: [1, 3],
      labels: ['Cement', 'Sand'],
      mode: 'table'
    }
  ];

  const getProblemList = () => {
    if (activeStationIndex === 0) return station1Problems;
    if (activeStationIndex === 1) return station2Problems;
    return station3Problems;
  };

  const problems = getProblemList();
  const currentProblem = problems[subStep] || problems[0];

  const handleSelectOption = (opt) => {
    sounds.click();
    setUserAnswer(opt);
    const isCorrect = opt === currentProblem.correct;

    if (isCorrect) {
      sounds.correct();
      setFeedback({ type: 'correct', msg: `Correct! ${currentProblem.expl}` });
      onAddXp(15);
    } else {
      sounds.wrong();
      setFeedback({ type: 'wrong', msg: `Not quite. ${currentProblem.expl}` });
    }
  };

  const handleNextProblem = () => {
    sounds.click();
    if (subStep < problems.length - 1) {
      setSubStep(subStep + 1);
      setUserAnswer('');
      setFeedback(null);
    } else {
      // Completed this entire station!
      sounds.fanfare();
      onCompleteStation(currentStation.id);
      setFeedback({
        type: 'station_done',
        msg: `🎉 Amazing! You completed Station ${activeStationIndex + 1}: ${currentStation.title}!`
      });
    }
  };

  const allStationsDone = STATIONS.every(s => completedStations.includes(s.id));

  return (
    <div className="stations-phase-container">
      {/* Station Selector Tabs */}
      <div className="stations-tab-header">
        {STATIONS.map((station, idx) => {
          const isActive = idx === activeStationIndex;
          const isDone = completedStations.includes(station.id);

          return (
            <button
              key={station.id}
              className={`station-tab-btn ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
              onClick={() => {
                sounds.click();
                setActiveStationIndex(idx);
              }}
            >
              <span className="station-tab-num">Station {station.num}</span>
              <span className="station-tab-icon">{station.icon}</span>
              <span className="station-tab-title">{station.title}</span>
              {isDone && <span className="done-badge">✓</span>}
            </button>
          );
        })}
      </div>

      {/* Main 2-Column Lab Workspace */}
      <div className="station-lab-workspace">
        {/* Left Column: Interactive Canvas */}
        <div className="station-canvas-panel">
          <RatioBarCanvas
            mode={currentProblem.mode}
            ratio={currentProblem.ratio || [3, 5]}
            labels={currentProblem.labels || ['Part A', 'Part B']}
            total={currentProblem.total || 72}
            difference={currentProblem.difference}
            mixes={currentProblem.mixes}
          />
        </div>

        {/* Right Column: Problem Prompt & Interactive Options */}
        <div className="station-task-panel">
          <div className="task-substep-tracker">
            <span>Challenge {subStep + 1} of {problems.length}</span>
            <div className="substep-dots">
              {problems.map((_, i) => (
                <span
                  key={i}
                  className={`dot ${i === subStep ? 'current' : i < subStep ? 'done' : ''}`}
                />
              ))}
            </div>
          </div>

          <h3 className="task-problem-prompt">
            {currentProblem.q}
          </h3>

          <div className="options-selection-grid">
            {currentProblem.options.map((opt, i) => {
              const isSelected = userAnswer === opt;
              const isCorrectOpt = opt === currentProblem.correct;
              let btnClass = 'option-btn';
              if (feedback) {
                if (isCorrectOpt) btnClass += ' opt-correct';
                else if (isSelected) btnClass += ' opt-wrong';
              } else if (isSelected) {
                btnClass += ' opt-selected';
              }

              return (
                <button
                  key={i}
                  className={btnClass}
                  onClick={() => !feedback && handleSelectOption(opt)}
                  disabled={!!feedback}
                >
                  <span className="opt-letter">{String.fromCharCode(65 + i)}</span>
                  <span className="opt-text">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Feedback & Advance Button */}
          {feedback && (
            <div className={`station-feedback-card ${feedback.type}`}>
              <p>{feedback.msg}</p>
              {feedback.type === 'station_done' ? (
                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  {activeStationIndex < STATIONS.length - 1 ? (
                    <button
                      className="btn-gold"
                      onClick={() => setActiveStationIndex(activeStationIndex + 1)}
                    >
                      Next Station ➔
                    </button>
                  ) : (
                    <button
                      className="btn-gold"
                      onClick={() => { sounds.fanfare(); onNextPhase(); }}
                    >
                      Go to Practice Mode 🎮
                    </button>
                  )}
                </div>
              ) : (
                <button
                  className="btn-secondary"
                  onClick={handleNextProblem}
                  style={{ marginTop: '12px', alignSelf: 'flex-start' }}
                >
                  {subStep < problems.length - 1 ? 'Next Challenge ➔' : 'Complete Station ✓'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom bar if all stations done */}
      {allStationsDone && (
        <div className="stations-bottom-complete-bar">
          <span>🏆 All 3 Stations Completed!</span>
          <button
            className="btn-gold"
            onClick={() => { sounds.fanfare(); onNextPhase(); }}
          >
            Advance to Practice Mode ➔
          </button>
        </div>
      )}
    </div>
  );
}
