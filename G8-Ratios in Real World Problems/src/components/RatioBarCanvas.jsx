import React, { useState } from 'react';
import { sounds } from '../utils/audio';

/**
 * RatioBarCanvas
 * Interactive multi-mode visualizer for ratios:
 * 1. 'parts' - Part-to-Part vs Part-to-Whole tile explorer
 * 2. 'table' - Scalable ratio table with multiplier arrows & additive test
 * 3. 'bar' - Step-by-step Singapore bar model (total given / difference given)
 * 4. 'mix' - Two drink mix jugs with liquid levels & sweetness strength meters
 */
export default function RatioBarCanvas({
  mode = 'parts',
  ratio = [3, 5],
  labels = ['Group A', 'Group B'],
  total = 72,
  difference = null,
  initialScale = 1,
  mixes = [
    { name: 'Dispenser A', a: 4, b: 9, labelA: 'Syrup', labelB: 'Water' },
    { name: 'Dispenser B', a: 3, b: 5, labelA: 'Syrup', labelB: 'Water' }
  ],
  interactive = true
}) {
  // Mode-specific local state
  const [viewMode, setViewMode] = useState('partToPart'); // 'partToPart' | 'partToWhole'
  const [scaleFactor, setScaleFactor] = useState(initialScale || 1);
  const [additiveOffset, setAdditiveOffset] = useState(0);
  const [barStep, setBarStep] = useState(1); // 1: see parts, 2: bracket total, 3: find 1 part, 4: calculate shares
  const [mixRescaled, setMixRescaled] = useState(false);

  const [termA, termB] = ratio;
  const totalParts = termA + termB;

  // Colors for Part A (Cyan/Teal) and Part B (Golden Amber)
  const colorA = '#00e5ff';
  const colorB = '#ffb800';
  const colorWhole = '#a855f7';

  // 1. PARTS MODE RENDERER
  const renderPartsMode = () => {
    return (
      <div className="canvas-parts-view">
        <div className="canvas-mode-controls">
          <button
            className={`canvas-toggle-btn ${viewMode === 'partToPart' ? 'active' : ''}`}
            onClick={() => {
              sounds.pop();
              setViewMode('partToPart');
            }}
          >
            Part-to-Part (Ratio {termA} : {termB})
          </button>
          <button
            className={`canvas-toggle-btn ${viewMode === 'partToWhole' ? 'active' : ''}`}
            onClick={() => {
              sounds.pop();
              setViewMode('partToWhole');
            }}
          >
            Part-to-Whole ({termA} out of {totalParts})
          </button>
        </div>

        <div className="parts-visual-board">
          {/* Group A */}
          <div className="parts-tile-group">
            <div className="parts-group-header" style={{ color: colorA }}>
              <span>{labels[0]}</span>
              <span className="badge-pill" style={{ background: 'rgba(0, 229, 255, 0.2)' }}>
                {termA} {termA === 1 ? 'part' : 'parts'}
              </span>
            </div>
            <div className="tiles-grid">
              {Array.from({ length: termA }).map((_, i) => (
                <div
                  key={`a-${i}`}
                  className="ratio-tile tile-a"
                  style={{
                    borderColor: colorA,
                    boxShadow: '0 0 12px rgba(0, 229, 255, 0.4)'
                  }}
                >
                  <span className="tile-index">{i + 1}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="ratio-colon-separator">:</div>

          {/* Group B */}
          <div className="parts-tile-group">
            <div className="parts-group-header" style={{ color: colorB }}>
              <span>{labels[1]}</span>
              <span className="badge-pill" style={{ background: 'rgba(255, 184, 0, 0.2)' }}>
                {termB} {termB === 1 ? 'part' : 'parts'}
              </span>
            </div>
            <div className="tiles-grid">
              {Array.from({ length: termB }).map((_, i) => (
                <div
                  key={`b-${i}`}
                  className="ratio-tile tile-b"
                  style={{
                    borderColor: colorB,
                    boxShadow: '0 0 12px rgba(255, 184, 0, 0.4)'
                  }}
                >
                  <span className="tile-index">{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Caption / Inspection */}
        <div className="parts-info-panel">
          {viewMode === 'partToPart' ? (
            <div className="info-text">
              Comparing <strong>{labels[0]}</strong> to <strong>{labels[1]}</strong>:
              <span className="gold-highlight" style={{ marginLeft: '8px' }}>
                {termA} : {termB}
              </span>
              <p className="dim-subtext">Order matters! For every {termA} of {labels[0]}, there are {termB} of {labels[1]}.</p>
            </div>
          ) : (
            <div className="info-text">
              Total parts: {termA} + {termB} = <strong style={{ color: colorWhole }}>{totalParts} parts</strong>
              <div className="fraction-chips">
                <span className="chip" style={{ borderColor: colorA }}>
                  {labels[0]}: <strong>{termA}/{totalParts}</strong> of the whole
                </span>
                <span className="chip" style={{ borderColor: colorB }}>
                  {labels[1]}: <strong>{termB}/{totalParts}</strong> of the whole
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // 2. TABLE MODE RENDERER
  const renderTableMode = () => {
    const scaledA = termA * scaleFactor + additiveOffset;
    const scaledB = termB * scaleFactor + additiveOffset;
    const isAdditiveBroken = additiveOffset > 0;

    return (
      <div className="canvas-table-view">
        <div className="table-controls-bar">
          <div className="stepper-item">
            <span className="stepper-label">Scale Factor (× k):</span>
            <div className="stepper-btn-group">
              {[1, 2, 3, 4, 5].map((k) => (
                <button
                  key={k}
                  className={`scale-btn ${scaleFactor === k && additiveOffset === 0 ? 'active' : ''}`}
                  onClick={() => {
                    sounds.pop();
                    setScaleFactor(k);
                    setAdditiveOffset(0);
                  }}
                >
                  ×{k}
                </button>
              ))}
            </div>
          </div>

          <div className="additive-test-toggle">
            <button
              className={`test-btn ${isAdditiveBroken ? 'broken-warning' : ''}`}
              onClick={() => {
                sounds.wrong();
                setAdditiveOffset(additiveOffset === 0 ? 2 : 0);
              }}
              title="Test adding +2 to both sides"
            >
              {additiveOffset === 0 ? '⚠️ Test Adding (+2 to each)' : '↩️ Reset to Multiplicative'}
            </button>
          </div>
        </div>

        {/* Visual Table */}
        <div className="ratio-table-wrapper">
          <div className="table-row-container">
            <div className="row-label" style={{ color: colorA }}>{labels[0]}</div>
            <div className="table-cell base-cell">{termA}</div>
            <div className="table-arrow-cell">
              <span className={`arrow-indicator ${isAdditiveBroken ? 'broken' : ''}`}>
                {isAdditiveBroken ? '+ 2' : `× ${scaleFactor}`} ➔
              </span>
            </div>
            <div className={`table-cell scaled-cell ${isAdditiveBroken ? 'cell-error' : ''}`}>
              {scaledA}
            </div>
          </div>

          <div className="table-divider-line" />

          <div className="table-row-container">
            <div className="row-label" style={{ color: colorB }}>{labels[1]}</div>
            <div className="table-cell base-cell">{termB}</div>
            <div className="table-arrow-cell">
              <span className={`arrow-indicator ${isAdditiveBroken ? 'broken' : ''}`}>
                {isAdditiveBroken ? '+ 2' : `× ${scaleFactor}`} ➔
              </span>
            </div>
            <div className={`table-cell scaled-cell ${isAdditiveBroken ? 'cell-error' : ''}`}>
              {scaledB}
            </div>
          </div>
        </div>

        {/* Feedback message */}
        <div className="table-status-message">
          {isAdditiveBroken ? (
            <div className="alert-box error">
              ❌ <strong>Ratio Broken!</strong> {termA + additiveOffset} : {termB + additiveOffset} is NOT equivalent to {termA} : {termB}!
              Ratios grow by <em>multiplying</em>, not by adding!
            </div>
          ) : (
            <div className="alert-box success">
              ✨ <strong>Equivalent Ratio!</strong> {termA} : {termB} = {scaledA} : {scaledB} (scaled by {scaleFactor}).
              The proportion stays identical!
            </div>
          )}
        </div>
      </div>
    );
  };

  // 3. BAR MODEL MODE RENDERER
  const renderBarMode = () => {
    const isDiffGiven = difference !== null;
    const diffParts = Math.abs(termB - termA);
    const onePartVal = isDiffGiven ? difference / diffParts : total / totalParts;
    const shareA = termA * onePartVal;
    const shareB = termB * onePartVal;

    return (
      <div className="canvas-bar-view">
        {/* Step-by-Step interactive progression */}
        <div className="bar-step-pills">
          <button
            className={`bar-step-pill ${barStep >= 1 ? 'active' : ''}`}
            onClick={() => { sounds.click(); setBarStep(1); }}
          >
            1. Count Parts ({totalParts})
          </button>
          <button
            className={`bar-step-pill ${barStep >= 2 ? 'active' : ''}`}
            onClick={() => { sounds.click(); setBarStep(2); }}
          >
            2. {isDiffGiven ? `Difference ($${difference})` : `Total Bracket ($${total})`}
          </button>
          <button
            className={`bar-step-pill ${barStep >= 3 ? 'active' : ''}`}
            onClick={() => { sounds.pop(); setBarStep(3); }}
          >
            3. Find 1 Part ($ {onePartVal})
          </button>
          <button
            className={`bar-step-pill ${barStep >= 4 ? 'active' : ''}`}
            onClick={() => { sounds.correct(); setBarStep(4); }}
          >
            4. Calculate Shares
          </button>
        </div>

        {/* Segmented Bar Visuals */}
        <div className="bar-model-display">
          {/* Share A row */}
          <div className="bar-row">
            <span className="bar-row-label" style={{ color: colorA }}>{labels[0]} ({termA} units)</span>
            <div className="bar-segments-track">
              {Array.from({ length: termA }).map((_, idx) => (
                <div
                  key={`seg-a-${idx}`}
                  className="bar-block block-a"
                  style={{
                    backgroundColor: 'rgba(0, 229, 255, 0.25)',
                    borderColor: colorA
                  }}
                >
                  {barStep >= 3 && <span className="block-val">${onePartVal}</span>}
                </div>
              ))}
            </div>
            {barStep >= 4 && (
              <span className="share-calculated-badge" style={{ color: colorA }}>
                = ${shareA}
              </span>
            )}
          </div>

          {/* Share B row */}
          <div className="bar-row">
            <span className="bar-row-label" style={{ color: colorB }}>{labels[1]} ({termB} units)</span>
            <div className="bar-segments-track">
              {Array.from({ length: termB }).map((_, idx) => (
                <div
                  key={`seg-b-${idx}`}
                  className="bar-block block-b"
                  style={{
                    backgroundColor: 'rgba(255, 184, 0, 0.25)',
                    borderColor: colorB
                  }}
                >
                  {barStep >= 3 && <span className="block-val">${onePartVal}</span>}
                </div>
              ))}
            </div>
            {barStep >= 4 && (
              <span className="share-calculated-badge" style={{ color: colorB }}>
                = ${shareB}
              </span>
            )}
          </div>
        </div>

        {/* Step Guide Panel */}
        <div className="bar-step-guide">
          {barStep === 1 && (
            <p>Step 1: Add up the total units: {termA} + {termB} = <strong>{totalParts} equal blocks</strong>.</p>
          )}
          {barStep === 2 && (
            <p>
              Step 2:{' '}
              {isDiffGiven
                ? `The difference is ${diffParts} blocks = $${difference}.`
                : `All ${totalParts} blocks together equal the total sum of $${total}.`}
            </p>
          )}
          {barStep === 3 && (
            <p>
              Step 3: Find the value of <strong>1 single part</strong>:{' '}
              <span className="gold-highlight">
                {isDiffGiven
                  ? `$${difference} ÷ ${diffParts} = $${onePartVal} per block`
                  : `$${total} ÷ ${totalParts} = $${onePartVal} per block`}
              </span>
            </p>
          )}
          {barStep === 4 && (
            <div className="shares-summary-row">
              <span>{labels[0]}: {termA} × ${onePartVal} = <strong>${shareA}</strong></span>
              <span>•</span>
              <span>{labels[1]}: {termB} × ${onePartVal} = <strong>${shareB}</strong></span>
              <span>•</span>
              <span style={{ color: '#34d399' }}>Check: ${shareA} + ${shareB} = ${shareA + shareB} ✓</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // 4. MIX MODE RENDERER (Comparing Drink Strength)
  const renderMixMode = () => {
    const mixA = mixes[0] || { name: 'Batch A', a: 4, b: 9 };
    const mixB = mixes[1] || { name: 'Batch B', a: 3, b: 5 };

    const totalA = mixA.a + mixA.b;
    const totalB = mixB.a + mixB.b;

    // Fractions of Part A (Syrup)
    const pctA = ((mixA.a / totalA) * 100).toFixed(1);
    const pctB = ((mixB.a / totalB) * 100).toFixed(1);

    // Common denominator = totalA * totalB = 13 * 8 = 104
    const commonDenom = totalA * totalB;
    const rescaledA = mixA.a * totalB;
    const rescaledB = mixB.a * totalA;

    return (
      <div className="canvas-mix-view">
        <div className="mix-mode-toggle">
          <button
            className={`canvas-toggle-btn ${!mixRescaled ? 'active' : ''}`}
            onClick={() => { sounds.pop(); setMixRescaled(false); }}
          >
            Original Quantities
          </button>
          <button
            className={`canvas-toggle-btn ${mixRescaled ? 'active' : ''}`}
            onClick={() => { sounds.correct(); setMixRescaled(true); }}
          >
            Compare with Common Total ({commonDenom} parts)
          </button>
        </div>

        <div className="mix-jugs-container">
          {/* Jug A */}
          <div className="mix-jug-card">
            <h4 className="jug-title">{mixA.name}</h4>
            <div className="jug-beaker-visual">
              <div
                className="beaker-liquid liquid-water"
                style={{ height: '100%' }}
              >
                <div
                  className="beaker-liquid liquid-syrup"
                  style={{ height: `${pctA}%` }}
                >
                  <span className="liquid-label">{pctA}% Syrup</span>
                </div>
              </div>
            </div>
            <div className="jug-stats">
              <div className="stat-line">
                <span>Ratio:</span> <strong>{mixA.a} : {mixA.b}</strong>
              </div>
              <div className="stat-line">
                <span>Total:</span> {totalA} parts
              </div>
              <div className="stat-line">
                <span>Syrup Share:</span>
                <span className="share-frac">
                  {mixRescaled ? `${rescaledA}/${commonDenom}` : `${mixA.a}/${totalA}`} ({pctA}%)
                </span>
              </div>
            </div>
          </div>

          <div className="versus-badge">VS</div>

          {/* Jug B */}
          <div className="mix-jug-card highlighted-stronger">
            <div className="winner-tag">🏆 Sweeter & Stronger!</div>
            <h4 className="jug-title">{mixB.name}</h4>
            <div className="jug-beaker-visual">
              <div
                className="beaker-liquid liquid-water"
                style={{ height: '100%' }}
              >
                <div
                  className="beaker-liquid liquid-syrup stronger"
                  style={{ height: `${pctB}%` }}
                >
                  <span className="liquid-label">{pctB}% Syrup</span>
                </div>
              </div>
            </div>
            <div className="jug-stats">
              <div className="stat-line">
                <span>Ratio:</span> <strong>{mixB.a} : {mixB.b}</strong>
              </div>
              <div className="stat-line">
                <span>Total:</span> {totalB} parts
              </div>
              <div className="stat-line">
                <span>Syrup Share:</span>
                <span className="share-frac gold-glow">
                  {mixRescaled ? `${rescaledB}/${commonDenom}` : `${mixB.a}/${totalB}`} ({pctB}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mix-conclusion-box">
          💡 Even though Batch A has 4 cups of syrup (and Batch B only has 3 cups), Batch B is <strong>stronger</strong> because it has a <strong>higher proportion of syrup (37.5% vs 30.8%)</strong>!
        </div>
      </div>
    );
  };

  return (
    <div className="ratio-canvas-container">
      {mode === 'parts' && renderPartsMode()}
      {mode === 'table' && renderTableMode()}
      {mode === 'bar' && renderBarMode()}
      {mode === 'mix' && renderMixMode()}
    </div>
  );
}
