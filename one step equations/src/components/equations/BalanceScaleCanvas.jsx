import React, { useState, useEffect } from 'react';
import { sounds } from '../../utils/audio.js';

export default function BalanceScaleCanvas({
  left = { x: 1, units: 3 },
  right = { units: 8 },
  mode = 'display', // 'display' | 'step' | 'interactive' | 'tutorial'
  targetX = 5,
  showEquation = true,
  showLog = true,
  showCheck = false,
  onSolve = null
}) {
  const [currentLeft, setCurrentLeft] = useState(left);
  const [currentRight, setCurrentRight] = useState(right);
  const [history, setHistory] = useState([]);
  const [solved, setSolved] = useState(false);
  const [tutorialOneSide, setTutorialOneSide] = useState(false);
  const [testedX, setTestedX] = useState(null);

  useEffect(() => {
    setCurrentLeft(left);
    setCurrentRight(right);
    setHistory([formatEquation(left, right)]);
    setSolved(false);
    setTestedX(null);
  }, [left, right]);

  function formatEquation(l, r) {
    const lX = l.x ? (l.x === 1 ? 'x' : `${l.x}x`) : '';
    const lU = l.units ? `${l.units}` : '';
    const lStr = lX && lU ? `${lX} + ${lU}` : (lX || lU || '0');

    const rX = r.x ? (r.x === 1 ? 'x' : `${r.x}x`) : '';
    const rU = r.units ? `${r.units}` : '';
    const rStr = rX && rU ? `${rX} + ${rU}` : (rX || rU || '0');

    return `${lStr} = ${rStr}`;
  }

  // Calculate simulated weight on each side for tilt angle
  const xWeight = testedX !== null ? testedX : (targetX || 5);
  const leftTotalWeight = (currentLeft.x || 0) * xWeight + (currentLeft.units || 0);
  const rightTotalWeight = (currentRight.x || 0) * xWeight + (currentRight.units || 0);

  // Compute tilt angle (-15 deg to +15 deg)
  let tiltDeg = 0;
  if (tutorialOneSide) {
    tiltDeg = -14; // heavy on left
  } else {
    const diff = leftTotalWeight - rightTotalWeight;
    tiltDeg = Math.max(-14, Math.min(14, diff * -2));
  }

  const handleApplyOp = (op, val) => {
    sounds.click();
    let nextLeft = { ...currentLeft };
    let nextRight = { ...currentRight };

    if (op === 'sub') {
      if (tutorialOneSide) {
        nextLeft.units = Math.max(0, (nextLeft.units || 0) - val);
      } else {
        nextLeft.units = Math.max(0, (nextLeft.units || 0) - val);
        nextRight.units = Math.max(0, (nextRight.units || 0) - val);
      }
    } else if (op === 'add') {
      if (tutorialOneSide) {
        nextLeft.units = (nextLeft.units || 0) + val;
      } else {
        nextLeft.units = (nextLeft.units || 0) + val;
        nextRight.units = (nextRight.units || 0) + val;
      }
    } else if (op === 'div') {
      if ((nextLeft.x || 0) % val === 0 && (nextRight.units || 0) % val === 0) {
        nextLeft.x = (nextLeft.x || 0) / val;
        nextRight.units = (nextRight.units || 0) / val;
      }
    }

    setCurrentLeft(nextLeft);
    setCurrentRight(nextRight);

    const newEq = formatEquation(nextLeft, nextRight);
    setHistory(prev => [...prev, newEq]);

    // Check if isolated: x = targetX
    if (nextLeft.x === 1 && (!nextLeft.units || nextLeft.units === 0) && nextRight.units === targetX) {
      sounds.celebration();
      setSolved(true);
      if (onSolve) onSolve(targetX);
    }
  };

  const handleReset = () => {
    sounds.click();
    setCurrentLeft(left);
    setCurrentRight(right);
    setHistory([formatEquation(left, right)]);
    setSolved(false);
    setTestedX(null);
  };

  const handleTestCheck = (val) => {
    sounds.pop();
    setTestedX(val);
    if (val === targetX) {
      sounds.correct();
    } else {
      sounds.wrong();
    }
  };

  const currentEquationStr = formatEquation(currentLeft, currentRight);

  // SVG Pan heights given beam rotation
  const beamLength = 220;
  const rad = (tiltDeg * Math.PI) / 180;
  const leftPanX = 250 - Math.cos(rad) * (beamLength / 2);
  const leftPanY = 65 - Math.sin(rad) * (beamLength / 2);
  const rightPanX = 250 + Math.cos(rad) * (beamLength / 2);
  const rightPanY = 65 + Math.sin(rad) * (beamLength / 2);

  return (
    <div className="balance-scale-wrapper">
      {/* SVG Balance Scale Visualization */}
      <svg
        className="scale-svg-container"
        viewBox="0 0 500 210"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="fulcrumGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#4c1d95" />
          </linearGradient>
          <linearGradient id="panGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Central Fulcrum Stand */}
        <polygon
          points="250,65 225,185 275,185"
          fill="url(#fulcrumGrad)"
          stroke="#a78bfa"
          strokeWidth="2"
        />
        {/* Base Plate */}
        <rect
          x="180"
          y="180"
          width="140"
          height="14"
          rx="7"
          fill="#1e1b4b"
          stroke="#8b5cf6"
          strokeWidth="2"
        />
        {/* Fulcrum Pivot Pin */}
        <circle cx="250" cy="65" r="7" fill="#fbbf24" stroke="#ffffff" strokeWidth="2" />

        {/* Rotating Crossbar Beam */}
        <g
          className="scale-beam-group"
          style={{
            transform: `rotate(${tiltDeg}deg)`,
            transformOrigin: '250px 65px'
          }}
        >
          <rect
            x="140"
            y="60"
            width="220"
            height="10"
            rx="5"
            fill="url(#beamGrad)"
            filter="url(#glowFilter)"
          />
          {/* Left / Right Pivot Pins */}
          <circle cx="140" cy="65" r="4" fill="#ffffff" />
          <circle cx="360" cy="65" r="4" fill="#ffffff" />
        </g>

        {/* Left Hanging Pan and Chains */}
        <g
          className="scale-pan-group"
          style={{
            transform: `translate(${leftPanX - 140}px, ${leftPanY - 65}px)`
          }}
        >
          <line x1="140" y1="65" x2="105" y2="125" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 2" />
          <line x1="140" y1="65" x2="175" y2="125" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 2" />
          <path d="M 95 125 Q 140 145 185 125 Z" fill="url(#panGrad)" stroke="#38bdf8" strokeWidth="2" />

          {/* Left Pan Contents: Mystery Bags (x) and Units */}
          <g transform="translate(100, 95)">
            {/* Render mystery bags */}
            {Array.from({ length: currentLeft.x || 0 }).map((_, i) => (
              <g key={`bag-${i}`} transform={`translate(${i * 22}, 0)`}>
                <rect x="0" y="0" width="20" height="24" rx="4" fill="#10b981" stroke="#34d399" strokeWidth="1.5" />
                <text x="10" y="16" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="Space Grotesk">
                  x
                </text>
              </g>
            ))}

            {/* Render units */}
            {(currentLeft.units || 0) > 0 && (
              <g transform={`translate(${(currentLeft.x || 0) * 22 + 4}, 4)`}>
                <rect x="0" y="0" width="28" height="20" rx="4" fill="#f59e0b" stroke="#fbbf24" strokeWidth="1.5" />
                <text x="14" y="14" textAnchor="middle" fill="#0c0a24" fontSize="11" fontWeight="bold" fontFamily="Space Grotesk">
                  +{currentLeft.units}
                </text>
              </g>
            )}
          </g>
        </g>

        {/* Right Hanging Pan and Chains */}
        <g
          className="scale-pan-group"
          style={{
            transform: `translate(${rightPanX - 360}px, ${rightPanY - 65}px)`
          }}
        >
          <line x1="360" y1="65" x2="325" y2="125" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 2" />
          <line x1="360" y1="65" x2="395" y2="125" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 2" />
          <path d="M 315 125 Q 360 145 405 125 Z" fill="url(#panGrad)" stroke="#38bdf8" strokeWidth="2" />

          {/* Right Pan Contents: Units */}
          <g transform="translate(325, 98)">
            {(currentRight.units || 0) > 0 && (
              <g>
                <rect x="0" y="0" width="46" height="22" rx="5" fill="#f59e0b" stroke="#fbbf24" strokeWidth="1.5" />
                <text x="23" y="16" textAnchor="middle" fill="#0c0a24" fontSize="13" fontWeight="bold" fontFamily="Space Grotesk">
                  {currentRight.units}
                </text>
              </g>
            )}
          </g>
        </g>
      </svg>

      {/* Live Equation Display */}
      {showEquation && (
        <div className="scale-live-equation">
          <span>{currentEquationStr}</span>
        </div>
      )}

      {/* Interactive Controls Bar */}
      {mode === 'interactive' && (
        <div className="scale-controls-bar">
          {(currentLeft.units || 0) > 0 && (
            <button
              className="scale-op-btn"
              onClick={() => handleApplyOp('sub', currentLeft.units)}
              title={`Subtract ${currentLeft.units} from both sides`}
            >
              <span>− {currentLeft.units} (Both Sides)</span>
            </button>
          )}

          {(currentLeft.x || 0) > 1 && (
            <button
              className="scale-op-btn"
              onClick={() => handleApplyOp('div', currentLeft.x)}
              title={`Divide both sides by ${currentLeft.x}`}
              disabled={(currentRight.units || 0) % (currentLeft.x || 1) !== 0}
            >
              <span>÷ {currentLeft.x} (Both Sides)</span>
            </button>
          )}

          <button className="scale-op-btn" onClick={handleReset} style={{ background: 'rgba(255,255,255,0.08)' }}>
            <span>🔄 Reset</span>
          </button>
        </div>
      )}

      {/* Tutorial Mode (Demonstrating One-Side vs Both-Sides) */}
      {mode === 'tutorial' && (
        <div style={{ marginTop: '10px', textAlign: 'center' }}>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              className={`btn ${tutorialOneSide ? 'btn-gold' : 'btn-ghost'}`}
              onClick={() => {
                sounds.pop();
                setTutorialOneSide(true);
              }}
            >
              <span>⚠️ Change One Side Only (Breaks Balance)</span>
            </button>
            <button
              className={`btn ${!tutorialOneSide ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => {
                sounds.pop();
                setTutorialOneSide(false);
              }}
            >
              <span>⚖️ Change Both Sides (Keeps Balance)</span>
            </button>
          </div>

          <div style={{ marginTop: '8px', color: tutorialOneSide ? 'var(--coral-bright)' : 'var(--neon-green-bright)', fontSize: '0.98rem', fontWeight: 700 }}>
            {tutorialOneSide
              ? '❌ The scale tilts! Equality is lost when you only change one side.'
              : '✅ The scale stays level! Doing the same to both sides keeps the equation true.'}
          </div>
        </div>
      )}

      {/* Step History Log */}
      {showLog && history.length > 1 && (
        <div className="scale-history-steps">
          <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 800 }}>STEPS:</span>
          {history.map((step, idx) => (
            <React.Fragment key={idx}>
              <span className={`history-chip ${idx === history.length - 1 ? 'current' : ''}`}>
                {step}
              </span>
              {idx < history.length - 1 && <span style={{ color: 'var(--gold-bright)' }}>→</span>}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Check Mode: Substitute candidate values */}
      {showCheck && (
        <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: 700 }}>Test value for x:</span>
          {[targetX - 1, targetX, targetX + 1].filter(v => v > 0).map(val => (
            <button
              key={val}
              className={`btn ${testedX === val ? (val === targetX ? 'btn-gold' : 'btn-ghost') : 'btn-ghost'}`}
              style={{ padding: '4px 12px', fontSize: '0.95rem' }}
              onClick={() => handleTestCheck(val)}
            >
              x = {val} {testedX === val ? (val === targetX ? '✓' : '✗') : ''}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
