/* =========================================================
   GAMIFIED PROBABILITY EXPERIMENT SIMULATOR
   Modes: 
   1. 🪙 3D Coin Toss with Prediction Betting & Flip Physics
   2. 🎲 3D Pip Dice Roll with Target Face & Even/Odd Betting
   3. 🎯 4-Color Spinner with Rotating Needle & Sector Betting
   Features:
   - Interactive prediction system with streak bonuses & XP
   - Batch trials: 1, 10, 50, 100, 1,000 trials
   - Law of Large Numbers Convergence Engine with confetti & badge
   - Live Frequency Bars & Real-Time Convergence SVG Line Chart
   ========================================================= */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/audio';

const MODES = [
  { id: 'coin', label: '🪙 Coin Flip', theoreticalTarget: 0.5, targetName: 'Heads P(H) = 50%' },
  { id: 'dice', label: '🎲 6-Sided Dice', theoreticalTarget: 1 / 6, targetName: 'Face 6 P(6) = 16.7%' },
  { id: 'spinner', label: '🎯 4-Color Spinner', theoreticalTarget: 0.25, targetName: 'Red P(Red) = 25%' }
];

export default function ExperimentSimulator({ onTrialBatchComplete }) {
  const [mode, setMode] = useState('coin');
  const [totalTrials, setTotalTrials] = useState(0);
  const [counts, setCounts] = useState({ Heads: 0, Tails: 0 });
  const [convergenceHistory, setConvergenceHistory] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [lastOutcome, setLastOutcome] = useState(null);

  // Gamified Prediction States
  const [predictedChoice, setPredictedChoice] = useState('Heads');
  const [predictionStreak, setPredictionStreak] = useState(0);
  const [lastBetWon, setLastBetWon] = useState(null);
  const [hasConvergedCelebration, setHasConvergedCelebration] = useState(false);

  // Spinner rotation angle
  const [spinnerAngle, setSpinnerAngle] = useState(0);

  // Initialize or reset when mode changes
  useEffect(() => {
    handleReset();
    if (mode === 'coin') setPredictedChoice('Heads');
    else if (mode === 'dice') setPredictedChoice('6');
    else if (mode === 'spinner') setPredictedChoice('Red');
  }, [mode]);

  const handleReset = () => {
    sounds.click();
    setTotalTrials(0);
    setConvergenceHistory([]);
    setLastOutcome(null);
    setLastBetWon(null);
    setPredictionStreak(0);
    setHasConvergedCelebration(false);

    if (mode === 'coin') {
      setCounts({ Heads: 0, Tails: 0 });
    } else if (mode === 'dice') {
      setCounts({ '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0 });
    } else if (mode === 'spinner') {
      setCounts({ Red: 0, Blue: 0, Green: 0, Yellow: 0 });
    }
  };

  // Run single trial with full visual animation & bet check
  const runSingleTrial = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    sounds.pop();

    if (mode === 'coin') {
      const outcome = Math.random() < 0.5 ? 'Heads' : 'Tails';
      setTimeout(() => {
        applyTrials([{ outcome }]);
        setLastOutcome(outcome);
        checkBetWin(outcome);
        setIsAnimating(false);
      }, 550);
    } else if (mode === 'dice') {
      const roll = 1 + Math.floor(Math.random() * 6);
      const outcome = String(roll);
      setTimeout(() => {
        applyTrials([{ outcome }]);
        setLastOutcome(outcome);
        checkBetWin(outcome);
        setIsAnimating(false);
      }, 550);
    } else if (mode === 'spinner') {
      const colors = ['Red', 'Blue', 'Green', 'Yellow'];
      const pickIdx = Math.floor(Math.random() * 4);
      const outcome = colors[pickIdx];
      const newAngle = spinnerAngle + 1440 + pickIdx * 90 + Math.floor(Math.random() * 50) - 25;
      setSpinnerAngle(newAngle);

      setTimeout(() => {
        applyTrials([{ outcome }]);
        setLastOutcome(outcome);
        checkBetWin(outcome);
        setIsAnimating(false);
      }, 750);
    }
  };

  const checkBetWin = (outcome) => {
    const won = outcome === predictedChoice;
    setLastBetWon(won);
    if (won) {
      sounds.correct();
      setPredictionStreak(prev => prev + 1);
      if (onTrialBatchComplete) onTrialBatchComplete(5); // bonus XP
    } else {
      setPredictionStreak(0);
    }
  };

  // Run batch of trials (10, 50, 100, 1000)
  const runBatchTrials = (batchSize) => {
    if (isAnimating) return;
    setIsAnimating(true);
    sounds.pop();

    const outcomes = [];
    for (let i = 0; i < batchSize; i++) {
      if (mode === 'coin') {
        outcomes.push({ outcome: Math.random() < 0.5 ? 'Heads' : 'Tails' });
      } else if (mode === 'dice') {
        outcomes.push({ outcome: String(1 + Math.floor(Math.random() * 6)) });
      } else if (mode === 'spinner') {
        const colors = ['Red', 'Blue', 'Green', 'Yellow'];
        outcomes.push({ outcome: colors[Math.floor(Math.random() * 4)] });
      }
    }

    setTimeout(() => {
      applyTrials(outcomes);
      const finalOutcome = outcomes[outcomes.length - 1].outcome;
      setLastOutcome(finalOutcome);
      setIsAnimating(false);
      sounds.correct();

      if (onTrialBatchComplete) {
        onTrialBatchComplete(batchSize);
      }
    }, batchSize >= 500 ? 250 : 150);
  };

  const applyTrials = (trialsArr) => {
    setCounts(prevCounts => {
      const newCounts = { ...prevCounts };
      let newTotal = totalTrials;

      const targetOutcome = mode === 'coin' ? 'Heads' : mode === 'dice' ? '6' : 'Red';
      const newHistory = [...convergenceHistory];

      trialsArr.forEach(t => {
        newCounts[t.outcome] = (newCounts[t.outcome] || 0) + 1;
        newTotal++;

        const sampleInterval = newTotal < 100 ? 1 : newTotal < 500 ? 5 : 25;
        if (newTotal % sampleInterval === 0 || newTotal === 1) {
          const currentExpProb = newCounts[targetOutcome] / newTotal;
          newHistory.push({ trial: newTotal, expProb: currentExpProb });
        }
      });

      const trimmedHistory = newHistory.length > 200 ? newHistory.slice(newHistory.length - 200) : newHistory;
      setConvergenceHistory(trimmedHistory);
      setTotalTrials(newTotal);

      // Check Law of Large Numbers Convergence Achievement
      const currentModeInfo = MODES.find(m => m.id === mode);
      const targetCount = newCounts[targetOutcome] || 0;
      const expProb = targetCount / newTotal;
      const absError = Math.abs(expProb - currentModeInfo.theoreticalTarget);

      if (newTotal >= 100 && absError <= 0.035 && !hasConvergedCelebration) {
        setHasConvergedCelebration(true);
        sounds.fanfare();
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {}
      }

      return newCounts;
    });
  };

  // Target info for current mode
  const currentModeInfo = MODES.find(m => m.id === mode);
  const targetKey = mode === 'coin' ? 'Heads' : mode === 'dice' ? '6' : 'Red';
  const targetCount = counts[targetKey] || 0;
  const currentExpProb = totalTrials > 0 ? (targetCount / totalTrials) : 0;
  const theoreticalVal = currentModeInfo.theoreticalTarget;
  const absErrorPct = totalTrials > 0 ? (Math.abs(currentExpProb - theoreticalVal) * 100).toFixed(1) : '0.0';

  // Convergence status text & color
  let convergenceStatus = { label: 'Small Sample: Expect Fluctuations ⚡', color: '#ff758c', bg: 'rgba(255, 94, 98, 0.15)' };
  if (totalTrials >= 100 && parseFloat(absErrorPct) <= 3.5) {
    convergenceStatus = { label: 'Law of Large Numbers: Converged! 🎯', color: '#34d399', bg: 'rgba(16, 185, 129, 0.2)' };
  } else if (totalTrials >= 30) {
    convergenceStatus = { label: 'Stabilizing Toward Theory 📈', color: '#ffc933', bg: 'rgba(255, 184, 0, 0.15)' };
  }

  // SVG Chart Dimensions
  const chartW = 460;
  const chartH = 160;
  const padX = 40;
  const padY = 24;
  const innerW = chartW - padX * 2;
  const innerH = chartH - padY * 2;

  const maxTrialInHistory = convergenceHistory.length > 0 ? convergenceHistory[convergenceHistory.length - 1].trial : 1;
  const points = convergenceHistory.map(pt => {
    const x = padX + (pt.trial / Math.max(maxTrialInHistory, 10)) * innerW;
    const y = padY + (1 - Math.min(Math.max(pt.expProb, 0), 1)) * innerH;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const pathD = points.length > 0 ? `M ${points.join(' L ')}` : '';
  const theoreticalY = padY + (1 - theoreticalVal) * innerH;

  return (
    <div className="experiment-simulator-card">
      {/* Top Mode Tabs & Reset */}
      <div className="simulator-tabs">
        <div style={{ display: 'flex', gap: '8px' }}>
          {MODES.map(m => (
            <button
              key={m.id}
              className={`sim-tab-btn ${mode === m.id ? 'active' : ''}`}
              onClick={() => { sounds.click(); setMode(m.id); }}
            >
              {m.label}
            </button>
          ))}
        </div>

        <button
          className="sim-tab-btn reset"
          onClick={handleReset}
          title="Reset trials to 0"
        >
          🔄 Reset Lab
        </button>
      </div>

      {/* Gamified Prediction & Call Bar */}
      <div className="sim-prediction-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--gold-300)' }}>
            🎯 Your Prediction:
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            {mode === 'coin' && ['Heads', 'Tails'].map(c => (
              <button
                key={c}
                className={`btn-choice-chip ${predictedChoice === c ? 'active' : ''}`}
                onClick={() => { sounds.click(); setPredictedChoice(c); }}
              >
                {c === 'Heads' ? '🪙 Heads' : '🪙 Tails'}
              </button>
            ))}

            {mode === 'dice' && ['1', '2', '3', '4', '5', '6'].map(f => (
              <button
                key={f}
                className={`btn-choice-chip ${predictedChoice === f ? 'active' : ''}`}
                onClick={() => { sounds.click(); setPredictedChoice(f); }}
              >
                ⚅ Face {f}
              </button>
            ))}

            {mode === 'spinner' && ['Red', 'Blue', 'Green', 'Yellow'].map(col => (
              <button
                key={col}
                className={`btn-choice-chip ${predictedChoice === col ? 'active' : ''}`}
                onClick={() => { sounds.click(); setPredictedChoice(col); }}
              >
                {col}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {lastBetWon !== null && (
            <span className={`bet-status-pill ${lastBetWon ? 'won' : 'lost'}`}>
              {lastBetWon ? '🎉 Hit!' : '❌ Miss'}
            </span>
          )}
          <div className="streak-counter-pill">
            🔥 Streak: {predictionStreak}
          </div>
        </div>
      </div>

      {/* Main Lab Grid: Left Visualizer + Right Live Analytics */}
      <div className="simulator-main-grid">
        {/* Left Column: 3D Visual Apparatus & Trial Buttons */}
        <div className="sim-visual-column">
          <div className="apparatus-stage">
            {mode === 'coin' && (
              <div className={`coin-visual-token ${isAnimating ? 'flipping' : ''}`}>
                <div className="coin-face-inner">
                  {lastOutcome ? (lastOutcome === 'Heads' ? 'HEADS' : 'TAILS') : 'FLIP'}
                </div>
              </div>
            )}

            {mode === 'dice' && (
              <div className={`dice-visual-token ${isAnimating ? 'rolling' : ''}`}>
                <div className="dice-pips-container">
                  {lastOutcome === '1' && <div className="pip-center" />}
                  {lastOutcome === '2' && <><div className="pip-top-left" /><div className="pip-bottom-right" /></>}
                  {lastOutcome === '3' && <><div className="pip-top-left" /><div className="pip-center" /><div className="pip-bottom-right" /></>}
                  {lastOutcome === '4' && <><div className="pip-top-left" /><div className="pip-top-right" /><div className="pip-bottom-left" /><div className="pip-bottom-right" /></>}
                  {lastOutcome === '5' && <><div className="pip-top-left" /><div className="pip-top-right" /><div className="pip-center" /><div className="pip-bottom-left" /><div className="pip-bottom-right" /></>}
                  {(!lastOutcome || lastOutcome === '6') && <><div className="pip-top-left" /><div className="pip-top-right" /><div className="pip-mid-left" /><div className="pip-mid-right" /><div className="pip-bottom-left" /><div className="pip-bottom-right" /></>}
                </div>
              </div>
            )}

            {mode === 'spinner' && (
              <div className="spinner-visual-container">
                <div className="spinner-pointer-arrow">▼</div>
                <div
                  className="spinner-wheel-circle"
                  style={{
                    transform: `rotate(${spinnerAngle}deg)`,
                    transition: isAnimating ? 'transform 0.75s cubic-bezier(0.15, 0.9, 0.25, 1)' : 'none'
                  }}
                >
                  <div className="spinner-sector red"><span>Red</span></div>
                  <div className="spinner-sector blue"><span>Blue</span></div>
                  <div className="spinner-sector green"><span>Green</span></div>
                  <div className="spinner-sector yellow"><span>Yellow</span></div>
                </div>
              </div>
            )}

            {lastOutcome && (
              <div className="last-outcome-banner">
                Landed: <strong>{lastOutcome}</strong>
              </div>
            )}
          </div>

          {/* Trial Trigger Buttons */}
          <div className="sim-action-buttons">
            <button
              className="btn-sim-run single"
              onClick={runSingleTrial}
              disabled={isAnimating}
            >
              ▶ 1 Trial
            </button>
            <button
              className="btn-sim-run batch"
              onClick={() => runBatchTrials(10)}
              disabled={isAnimating}
            >
              +10
            </button>
            <button
              className="btn-sim-run batch"
              onClick={() => runBatchTrials(50)}
              disabled={isAnimating}
            >
              +50
            </button>
            <button
              className="btn-sim-run batch"
              onClick={() => runBatchTrials(100)}
              disabled={isAnimating}
            >
              +100
            </button>
            <button
              className="btn-sim-run marathon"
              onClick={() => runBatchTrials(1000)}
              disabled={isAnimating}
              title="Run 1,000 Rapid Trials"
            >
              🚀 1,000 Trials
            </button>
          </div>
        </div>

        {/* Right Column: Live Analytics, Frequencies & Convergence Chart */}
        <div className="sim-analytics-column">
          {/* Convergence Status Pill */}
          <div
            className="convergence-status-banner"
            style={{ color: convergenceStatus.color, background: convergenceStatus.bg }}
          >
            <span>{convergenceStatus.label}</span>
            <span>Trials: <strong>{totalTrials}</strong></span>
          </div>

          {/* 4 Stats Cards */}
          <div className="sim-stats-cards">
            <div className="sim-stat-box">
              <span className="stat-label">Total Trials (n)</span>
              <span className="stat-value">{totalTrials}</span>
            </div>
            <div className="sim-stat-box">
              <span className="stat-label">Target Occurrences</span>
              <span className="stat-value" style={{ color: 'var(--teal-300)' }}>
                {targetCount}
              </span>
            </div>
            <div className="sim-stat-box">
              <span className="stat-label">Experimental Prob.</span>
              <span className="stat-value" style={{ color: 'var(--gold-400)' }}>
                {totalTrials > 0 ? `${(currentExpProb * 100).toFixed(1)}%` : '—'}
              </span>
            </div>
            <div className="sim-stat-box">
              <span className="stat-label">Theoretical Target</span>
              <span className="stat-value" style={{ color: 'var(--emerald-400)' }}>
                {(theoreticalVal * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Frequency Bars of all outcomes */}
          <div className="sim-frequency-bars">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              <span>Outcome Distribution</span>
              <span>Relative Frequency</span>
            </div>
            {Object.keys(counts).map(key => {
              const cnt = counts[key];
              const pct = totalTrials > 0 ? (cnt / totalTrials) * 100 : 0;
              const isTarget = key === targetKey;

              return (
                <div key={key} className="sim-freq-row">
                  <span className={`freq-key ${isTarget ? 'target' : ''}`}>
                    {key} {isTarget && '⭐'}
                  </span>
                  <div className="sim-bar-track">
                    <div
                      className={`sim-bar-fill ${isTarget ? 'target' : ''}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="freq-val">
                    {cnt} ({pct.toFixed(1)}%)
                  </span>
                </div>
              );
            })}
          </div>

          {/* Real-time SVG Convergence Line Chart */}
          <div className="sim-chart-container">
            <div className="chart-header-row">
              <span className="chart-title">
                📈 Convergence to Theoretical Line ({currentModeInfo.targetName})
              </span>
              <span className="chart-error-tag">
                |Exp - Theo| = ±{absErrorPct}%
              </span>
            </div>

            <svg viewBox={`0 0 ${chartW} ${chartH}`} className="convergence-svg">
              {/* Grid lines */}
              <line x1={padX} y1={padY} x2={chartW - padX} y2={padY} stroke="rgba(255,255,255,0.08)" />
              <line x1={padX} y1={padY + innerH / 2} x2={chartW - padX} y2={padY + innerH / 2} stroke="rgba(255,255,255,0.08)" />
              <line x1={padX} y1={chartH - padY} x2={chartW - padX} y2={chartH - padY} stroke="rgba(255,255,255,0.15)" />

              {/* Y Axis labels */}
              <text x={padX - 8} y={padY + 4} fill="var(--text-dim)" fontSize="10" textAnchor="end">100%</text>
              <text x={padX - 8} y={padY + innerH / 2 + 3} fill="var(--text-dim)" fontSize="10" textAnchor="end">50%</text>
              <text x={padX - 8} y={chartH - padY + 3} fill="var(--text-dim)" fontSize="10" textAnchor="end">0%</text>

              {/* Theoretical Expected Dashed Line */}
              <line
                x1={padX}
                y1={theoreticalY}
                x2={chartW - padX}
                y2={theoreticalY}
                stroke="var(--gold-400)"
                strokeWidth="2"
                strokeDasharray="5,4"
              />
              <text
                x={chartW - padX - 4}
                y={theoreticalY - 6}
                fill="var(--gold-400)"
                fontSize="10"
                textAnchor="end"
                fontWeight="700"
              >
                Theoretical: {(theoreticalVal * 100).toFixed(1)}%
              </text>

              {/* Live Experimental Path */}
              {pathD && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="var(--teal-400)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
