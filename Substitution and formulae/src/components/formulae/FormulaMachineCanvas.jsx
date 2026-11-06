import React, { useState, useEffect } from 'react';
import { sounds } from '../../utils/audio.js';

export default function FormulaMachineCanvas({
  formula = '3x + 5',
  variables = { x: 4 },
  mode = 'display', // 'display' | 'step' | 'interactive'
  showBrackets = true,
  showSteps = false,
  targetOutput = null,
  onTargetReached = null
}) {
  const [interactiveVars, setInteractiveVars] = useState(variables);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    setInteractiveVars(variables);
  }, [JSON.stringify(variables)]);

  // Evaluator for common formula templates
  const evaluate = (vars) => {
    try {
      if (formula === '3x + 5') {
        const x = Number(vars.x ?? 0);
        return {
          val: 3 * x + 5,
          steps: [
            { label: 'Original Formula', expr: '3x + 5' },
            { label: 'Substitute with Brackets', expr: `3(${x}) + 5` },
            { label: 'Multiply First (BODMAS)', expr: `${3 * x} + 5` },
            { label: 'Final Result', expr: `${3 * x + 5}` }
          ]
        };
      }

      if (formula === '2a + 3b') {
        const a = Number(vars.a ?? 0);
        const b = Number(vars.b ?? 0);
        return {
          val: 2 * a + 3 * b,
          steps: [
            { label: 'Original Formula', expr: '2a + 3b' },
            { label: 'Substitute with Brackets', expr: `2(${a}) + 3(${b})` },
            { label: 'Multiply Terms', expr: `${2 * a} + (${3 * b})` },
            { label: 'Final Result', expr: `${2 * a + 3 * b}` }
          ]
        };
      }

      if (formula === 'a² + b²') {
        const a = Number(vars.a ?? 0);
        const b = Number(vars.b ?? 0);
        return {
          val: a * a + b * b,
          steps: [
            { label: 'Original Formula', expr: 'a² + b²' },
            { label: 'Substitute with Brackets', expr: `(${a})² + (${b})²` },
            { label: 'Square Each Term', expr: `${a * a} + ${b * b}` },
            { label: 'Final Result', expr: `${a * a + b * b}` }
          ]
        };
      }

      if (formula.includes('(2x)²')) {
        const x = Number(vars.x ?? 0);
        return {
          val: Math.pow(2 * x, 2),
          steps: [
            { label: 'Original Formula', expr: '(2x)²' },
            { label: 'Substitute Inside Brackets', expr: `(2 × ${x})²` },
            { label: 'Multiply Inside First', expr: `(${2 * x})²` },
            { label: 'Square Entire Term', expr: `${Math.pow(2 * x, 2)}` }
          ]
        };
      }

      if (formula.includes('2x²')) {
        const x = Number(vars.x ?? 0);
        return {
          val: 2 * x * x,
          steps: [
            { label: 'Original Formula', expr: '2x²' },
            { label: 'Substitute with Brackets', expr: `2 × (${x})²` },
            { label: 'Square Power First', expr: `2 × (${x * x})` },
            { label: 'Multiply Coefficient', expr: `${2 * x * x}` }
          ]
        };
      }

      if (formula === '−x²') {
        const x = Number(vars.x ?? 0);
        return {
          val: -(x * x),
          steps: [
            { label: 'Original Formula', expr: '−x²' },
            { label: 'Substitute Inside Power', expr: `−(${x})²` },
            { label: 'Square Value First', expr: `−(${x * x})` },
            { label: 'Apply Outer Negative', expr: `${-(x * x)}` }
          ]
        };
      }

      if (formula === '(x)²' || formula === '(−x)²') {
        const x = Number(vars.x ?? 0);
        return {
          val: x * x,
          steps: [
            { label: 'Original Formula', expr: '(x)²' },
            { label: 'Substitute with Shield', expr: `(${x})²` },
            { label: 'Square Entire Bracket', expr: `(${x}) × (${x})` },
            { label: 'Final Result', expr: `${x * x}` }
          ]
        };
      }

      if (formula.includes('2(l + w)')) {
        const l = Number(vars.l ?? 0);
        const w = Number(vars.w ?? 0);
        return {
          val: 2 * (l + w),
          steps: [
            { label: 'Perimeter Formula', expr: 'P = 2(l + w)' },
            { label: 'Substitute Dimensions', expr: `2(${l} + ${w})` },
            { label: 'Add Inside Brackets First', expr: `2(${l + w})` },
            { label: 'Multiply by 2', expr: `${2 * (l + w)}` }
          ]
        };
      }

      if (formula.includes('½bh') || formula.includes('1/2bh')) {
        const b = Number(vars.b ?? 0);
        const h = Number(vars.h ?? 0);
        return {
          val: 0.5 * b * h,
          steps: [
            { label: 'Triangle Area Formula', expr: 'A = ½bh' },
            { label: 'Substitute Base & Height', expr: `½ × (${b}) × (${h})` },
            { label: 'Multiply Base by Height', expr: `½ × (${b * h})` },
            { label: 'Halve Product', expr: `${0.5 * b * h}` }
          ]
        };
      }

      if (formula.includes('F = 4 + 2d') || formula.includes('4 + 2d')) {
        const d = Number(vars.d ?? 0);
        return {
          val: 4 + 2 * d,
          steps: [
            { label: 'Taxi Fare Formula', expr: 'F = 4 + 2d' },
            { label: 'Substitute Distance', expr: `4 + 2(${d})` },
            { label: 'Multiply Distance Rate', expr: `4 + ${2 * d}` },
            { label: 'Add Base Flagdown', expr: `$${4 + 2 * d}` }
          ]
        };
      }

      // Default generic evaluation
      const keys = Object.keys(vars);
      if (keys.length === 1) {
        const val = Number(vars[keys[0]]);
        return {
          val: val,
          steps: [
            { label: 'Formula', expr: formula },
            { label: `Substitute ${keys[0]} = ${val}`, expr: formula.replace(new RegExp(keys[0], 'g'), `(${val})`) },
            { label: 'Result', expr: `${val}` }
          ]
        };
      }

      return { val: 0, steps: [{ label: 'Formula', expr: formula }] };
    } catch {
      return { val: 0, steps: [] };
    }
  };

  const currentVars = mode === 'interactive' ? interactiveVars : variables;
  const evaluation = evaluate(currentVars);

  const handleSliderChange = (varKey, newVal) => {
    sounds.pop();
    const updated = { ...interactiveVars, [varKey]: Number(newVal) };
    setInteractiveVars(updated);

    const res = evaluate(updated);
    if (targetOutput !== null && res.val === targetOutput) {
      sounds.correct();
      if (onTargetReached) onTargetReached();
    }
  };

  const varEntries = Object.entries(currentVars);

  return (
    <div className="formula-machine-box">
      {/* Top Header / Machine Status */}
      <div className="machine-header">
        <div className="machine-title">
          <span className="machine-badge">⚡ RAVI-BOT 7000</span>
          <span className="machine-mode-pill">
            {mode === 'interactive' ? '🎮 Interactive Mode' : mode === 'step' ? '📋 Step Breakdown' : '✨ Formula Machine'}
          </span>
        </div>
        {targetOutput !== null && (
          <div className={`target-chip ${evaluation.val === targetOutput ? 'reached' : ''}`}>
            🎯 Target Output: <strong>{targetOutput}</strong>
            {evaluation.val === targetOutput && ' ✓ SOLVED!'}
          </div>
        )}
      </div>

      {/* Main Machine Grid */}
      <div className="machine-grid">
        {/* Left: Input Hopper / Variable Chips */}
        <div className="machine-column inputs-column">
          <div className="column-header">
            <span>📥 INPUT HOPPER</span>
          </div>

          <div className="variable-chips-container">
            {varEntries.length === 0 ? (
              <div className="empty-hopper">No variables needed</div>
            ) : (
              varEntries.map(([key, value]) => {
                const isNegative = Number(value) < 0;
                return (
                  <div key={key} className={`variable-slot-card ${isNegative ? 'negative-shield' : ''}`}>
                    <div className="var-badge-row">
                      <span className="var-name-chip">{key}</span>
                      <span className="var-equals">=</span>
                      <span className="var-value-display">
                        {isNegative && showBrackets ? `(${value})` : value}
                      </span>
                    </div>

                    {mode === 'interactive' && (
                      <div className="var-slider-control">
                        <input
                          type="range"
                          min="-10"
                          max="10"
                          step="1"
                          value={value}
                          onChange={(e) => handleSliderChange(key, e.target.value)}
                          className="var-range-slider"
                          aria-label={`Adjust ${key}`}
                        />
                        <div className="slider-ticks">
                          <span>-10</span>
                          <span>0</span>
                          <span>+10</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Center: Glowing Processor Engine SVG */}
        <div className="machine-column core-column">
          <div className="processor-unit">
            <div className="formula-display-banner">
              <span className="formula-main-text">{formula}</span>
            </div>

            {/* SVG Machine Core Animation */}
            <svg className="machine-core-svg" viewBox="0 0 200 90" width="100%" height="90">
              <defs>
                <linearGradient id="coreGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.8" />
                </linearGradient>
                <filter id="glowFilter">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Connecting Conduits */}
              <path d="M 10 45 L 60 45" stroke="var(--teal-bright)" strokeWidth="3" strokeDasharray="4 3" />
              <path d="M 140 45 L 190 45" stroke="var(--gold-bright)" strokeWidth="3" strokeDasharray="4 3" />

              {/* Central Processing Gear / Core */}
              <circle cx="100" cy="45" r="28" fill="url(#coreGlow)" filter="url(#glowFilter)" className="pulsing-core" />
              <circle cx="100" cy="45" r="20" fill="#140f35" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
              <text x="100" y="49" fill="#fbbf24" fontSize="13" fontWeight="800" textAnchor="middle" fontFamily="var(--font-fun)">
                BODMAS
              </text>
            </svg>

            <div className="substitution-preview">
              <span className="sub-label">Substitution:</span>
              <span className="sub-math-code">
                {evaluation.steps[1]?.expr || formula}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Output Screen */}
        <div className="machine-column outputs-column">
          <div className="column-header">
            <span>📤 OUTPUT DISPLAY</span>
          </div>

          <div className={`output-screen-box ${targetOutput !== null && evaluation.val === targetOutput ? 'match-glow' : ''}`}>
            <div className="screen-led-label">RESULT</div>
            <div className="screen-number-value">{evaluation.val}</div>
            <div className="screen-status-text">
              {targetOutput !== null
                ? evaluation.val === targetOutput
                  ? '🌟 TARGET MATCHED!'
                  : `Need ${targetOutput}`
                : '✓ COMPUTED'}
            </div>
          </div>
        </div>
      </div>

      {/* Optional Step-by-Step Breakdown Accordion */}
      {(showSteps || mode === 'step') && evaluation.steps.length > 0 && (
        <div className="steps-breakdown-panel">
          <div className="steps-title">
            <span>🔍 Step-by-Step BODMAS Calculation:</span>
          </div>
          <div className="steps-sequence">
            {evaluation.steps.map((step, idx) => (
              <div key={idx} className="step-card-item">
                <div className="step-number-tag">{idx + 1}</div>
                <div className="step-info">
                  <div className="step-tag-label">{step.label}</div>
                  <div className="step-math-expr">{step.expr}</div>
                </div>
                {idx < evaluation.steps.length - 1 && <div className="step-arrow-icon">➔</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
