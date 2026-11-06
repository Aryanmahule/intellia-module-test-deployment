import React, { useState, useEffect } from 'react';
import { sounds } from '../../utils/audio.js';

export default function RateRaceCanvas({
  mode = 'doubleLine', // 'doubleLine' | 'compare' | 'trip' | 'convert' | 'graph'
  quantities = { a: { value: 6, unit: 'bottles' }, b: { value: 9, unit: '$' } },
  offers = [
    { name: 'Bag A (5 kg)', qty: 5, unit: 'kg', price: 12.50 },
    { name: 'Bag B (2 kg)', qty: 2, unit: 'kg', price: 6.00 }
  ],
  trip = { speed: 60, speedUnit: 'km/h', time: 2.5 },
  convert = { value: 72, from: 'km/h', to: 'm/s' },
  points = [[1, 60], [2, 120], [3, 180]],
  showUnits = true,
  showPerOne = true,
  onSolved = null
}) {
  // State for Double Number Line mode
  const [scaleFactor, setScaleFactor] = useState(1); // 1 = original, 1/6 = unit rate

  // State for Compare mode
  const [showUnitComparison, setShowUnitComparison] = useState(false);

  // State for Trip mode
  const [currentSpeed, setCurrentSpeed] = useState(trip.speed || 60);
  const [currentTime, setCurrentTime] = useState(trip.time || 2.5);
  const [timeUnit, setTimeUnit] = useState('hours'); // 'hours' | 'minutes'

  // State for Convert mode
  const [convertSpeed, setConvertSpeed] = useState(convert.value || 72);
  const [direction, setDirection] = useState('kmh_to_ms'); // 'kmh_to_ms' | 'ms_to_kmh'

  // State for Graph mode
  const [selectedPointIndex, setSelectedPointIndex] = useState(1);
  const [customRate, setCustomRate] = useState(60);

  // Sound effects
  const handleScaleDown = () => {
    sounds.pop();
    setScaleFactor(1 / (quantities.a.value || 6));
    if (onSolved) onSolved();
  };

  const handleResetScale = () => {
    sounds.pop();
    setScaleFactor(1);
  };

  return (
    <div className="rate-race-canvas-wrapper" style={{
      width: '100%',
      height: '100%',
      minHeight: '290px',
      background: 'rgba(18, 13, 44, 0.88)',
      backdropFilter: 'blur(12px)',
      border: '1.5px solid var(--purple-border)',
      borderRadius: '20px',
      padding: '16px 20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* -------------------- MODE 1: DOUBLE NUMBER LINE -------------------- */}
      {mode === 'doubleLine' && (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="badge badge-teal" style={{ fontSize: '0.85rem' }}>
              Double Number Line • Scaling to Unit Rate
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="btn-secondary"
                onClick={handleScaleDown}
                style={{ padding: '6px 14px', fontSize: '0.9rem', borderColor: 'var(--gold-bright)' }}
              >
                <span>÷ {quantities.a.value} (Find Per 1)</span>
              </button>
              <button
                className="btn-secondary"
                onClick={handleResetScale}
                style={{ padding: '6px 12px', fontSize: '0.9rem' }}
              >
                Reset
              </button>
            </div>
          </div>

          {/* SVG Double Number Line */}
          <div style={{ width: '100%', margin: '10px 0' }}>
            <svg viewBox="0 0 540 160" style={{ width: '100%', height: 'auto', maxHeight: '160px' }}>
              <defs>
                <linearGradient id="lineGradA" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
                <linearGradient id="lineGradB" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
              </defs>

              {/* Top Axis: Quantity A (e.g., Bottles) */}
              <line x1="60" y1="45" x2="480" y2="45" stroke="url(#lineGradA)" strokeWidth="4" strokeLinecap="round" />
              <text x="500" y="49" fill="#22d3ee" fontSize="13" fontWeight="bold" fontFamily="var(--font-mono)">
                {quantities.a.unit}
              </text>

              {/* Bottom Axis: Quantity B (e.g., Dollars) */}
              <line x1="60" y1="115" x2="480" y2="115" stroke="url(#lineGradB)" strokeWidth="4" strokeLinecap="round" />
              <text x="500" y="119" fill="#fbbf24" fontSize="13" fontWeight="bold" fontFamily="var(--font-mono)">
                {quantities.b.unit}
              </text>

              {/* Zero Mark */}
              <line x1="80" y1="35" x2="80" y2="55" stroke="#22d3ee" strokeWidth="2.5" />
              <text x="80" y="28" fill="#cbd5e1" fontSize="12" textAnchor="middle" fontWeight="bold">0</text>
              <line x1="80" y1="105" x2="80" y2="125" stroke="#fbbf24" strokeWidth="2.5" />
              <text x="80" y="140" fill="#cbd5e1" fontSize="12" textAnchor="middle" fontWeight="bold">$0</text>

              {/* Unit Rate Mark (1 unit) */}
              <line
                x1="180"
                y1="32"
                x2="180"
                y2="58"
                stroke={scaleFactor < 1 ? '#10b981' : '#64748b'}
                strokeWidth={scaleFactor < 1 ? '3.5' : '2'}
              />
              <circle cx="180" cy="45" r={scaleFactor < 1 ? '6' : '3'} fill={scaleFactor < 1 ? '#10b981' : '#64748b'} />
              <text x="180" y="24" fill={scaleFactor < 1 ? '#10b981' : '#94a3b8'} fontSize="13" textAnchor="middle" fontWeight="bold">
                1
              </text>

              <line
                x1="180"
                y1="102"
                x2="180"
                y2="128"
                stroke={scaleFactor < 1 ? '#10b981' : '#64748b'}
                strokeWidth={scaleFactor < 1 ? '3.5' : '2'}
              />
              <circle cx="180" cy="115" r={scaleFactor < 1 ? '6' : '3'} fill={scaleFactor < 1 ? '#10b981' : '#64748b'} />
              <text x="180" y="144" fill={scaleFactor < 1 ? '#10b981' : '#94a3b8'} fontSize="13" textAnchor="middle" fontWeight="bold">
                ${(quantities.b.value / quantities.a.value).toFixed(2)}
              </text>

              {/* Connecting dashed line at Unit Rate if highlighted */}
              {scaleFactor < 1 && (
                <line x1="180" y1="52" x2="180" y2="108" stroke="#10b981" strokeWidth="2" strokeDasharray="4 3" />
              )}

              {/* Original Given Mark (e.g. 6 bottles ↔ $9.00) */}
              <line x1="420" y1="35" x2="420" y2="55" stroke="#22d3ee" strokeWidth="3" />
              <circle cx="420" cy="45" r="5" fill="#22d3ee" />
              <text x="420" y="25" fill="#22d3ee" fontSize="13" textAnchor="middle" fontWeight="bold">
                {quantities.a.value}
              </text>

              <line x1="420" y1="105" x2="420" y2="125" stroke="#fbbf24" strokeWidth="3" />
              <circle cx="420" cy="115" r="5" fill="#fbbf24" />
              <text x="420" y="144" fill="#fbbf24" fontSize="13" textAnchor="middle" fontWeight="bold">
                ${quantities.b.value.toFixed(2)}
              </text>

              {/* Scaling arrow arcs */}
              <path d="M 410,40 Q 300,10 190,40" fill="none" stroke="#a855f7" strokeWidth="2" strokeDasharray="3 3" />
              <text x="300" y="20" fill="#c084fc" fontSize="11" textAnchor="middle" fontWeight="bold">
                ÷ {quantities.a.value}
              </text>

              <path d="M 410,120 Q 300,150 190,120" fill="none" stroke="#a855f7" strokeWidth="2" strokeDasharray="3 3" />
              <text x="300" y="152" fill="#c084fc" fontSize="11" textAnchor="middle" fontWeight="bold">
                ÷ {quantities.a.value}
              </text>
            </svg>
          </div>

          {/* Result Banner */}
          <div style={{
            background: scaleFactor < 1 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.05)',
            border: `1.5px solid ${scaleFactor < 1 ? 'var(--neon-green)' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: '12px',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
              Unit Rate (Per 1 {quantities.a.unit}):
            </span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: scaleFactor < 1 ? 'var(--neon-green)' : 'var(--gold-bright)', fontFamily: 'var(--font-mono)' }}>
              ${(quantities.b.value / quantities.a.value).toFixed(2)} per {quantities.a.unit.slice(0, -1) || 'unit'}
            </span>
          </div>
        </div>
      )}

      {/* -------------------- MODE 2: BEST BUY COMPARISON -------------------- */}
      {mode === 'compare' && (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="badge badge-purple" style={{ fontSize: '0.85rem' }}>
              Best Buy • Comparing Unit Rates
            </span>
            <button
              className="btn-secondary"
              onClick={() => {
                sounds.pop();
                setShowUnitComparison(!showUnitComparison);
                if (onSolved) onSolved();
              }}
              style={{ padding: '6px 14px', fontSize: '0.9rem', borderColor: 'var(--neon-green)' }}
            >
              {showUnitComparison ? 'Show Total Prices' : 'Calculate Unit Rates ⚖️'}
            </button>
          </div>

          {/* Cards Comparison Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', margin: '10px 0' }}>
            {offers.map((offer, idx) => {
              const unitPrice = offer.price / offer.qty;
              const isBestBuy = offers.every(o => unitPrice <= (o.price / o.qty));

              return (
                <div
                  key={idx}
                  style={{
                    background: isBestBuy && showUnitComparison ? 'rgba(16, 185, 129, 0.18)' : 'rgba(28, 22, 64, 0.7)',
                    border: `2px solid ${isBestBuy && showUnitComparison ? 'var(--neon-green)' : 'var(--purple-border)'}`,
                    borderRadius: '16px',
                    padding: '14px',
                    position: 'relative',
                    transition: 'all 0.3s'
                  }}
                >
                  {isBestBuy && showUnitComparison && (
                    <div style={{
                      position: 'absolute',
                      top: '-12px',
                      right: '12px',
                      background: 'var(--neon-green)',
                      color: '#022c22',
                      padding: '2px 10px',
                      borderRadius: '9999px',
                      fontSize: '0.8rem',
                      fontWeight: 800
                    }}>
                      BEST BUY 🏆
                    </div>
                  )}

                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {offer.name}
                  </div>

                  <div style={{ fontSize: '0.9rem', color: 'var(--text-dim)', margin: '4px 0' }}>
                    Pack Total: <strong style={{ color: 'var(--gold-bright)' }}>${offer.price.toFixed(2)}</strong> for {offer.qty} {offer.unit}
                  </div>

                  {/* Relative bar visualization */}
                  <div style={{ width: '100%', height: '14px', background: 'rgba(255,255,255,0.1)', borderRadius: '9999px', overflow: 'hidden', margin: '8px 0' }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min(100, (unitPrice / 4) * 100)}%`,
                      background: isBestBuy && showUnitComparison ? 'var(--neon-green)' : 'var(--teal-bright)',
                      borderRadius: '9999px',
                      transition: 'width 0.5s ease-out'
                    }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Cost per 1 {offer.unit}:</span>
                    <span style={{
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      fontFamily: 'var(--font-mono)',
                      color: isBestBuy && showUnitComparison ? 'var(--neon-green)' : 'var(--text-main)'
                    }}>
                      {showUnitComparison ? `$${unitPrice.toFixed(2)} / ${offer.unit}` : '???'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{
            fontSize: '0.9rem',
            color: 'var(--text-dim)',
            textAlign: 'center',
            background: 'rgba(255,255,255,0.03)',
            padding: '6px',
            borderRadius: '8px'
          }}>
            {showUnitComparison
              ? `✓ Lower unit price wins! Comparing $${(offers[0].price/offers[0].qty).toFixed(2)}/kg vs $${(offers[1].price/offers[1].qty).toFixed(2)}/kg.`
              : 'Tap "Calculate Unit Rates" to find the fairer comparison per 1 unit.'}
          </div>
        </div>
      )}

      {/* -------------------- MODE 3: SPEED DISTANCE TIME (TRIP) -------------------- */}
      {mode === 'trip' && (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="badge badge-teal" style={{ fontSize: '0.85rem' }}>
              Speed Trio • d = r × t
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Units:</span>
              <button
                className={`btn-secondary ${timeUnit === 'hours' ? 'active' : ''}`}
                onClick={() => { sounds.click(); setTimeUnit('hours'); }}
                style={{ padding: '4px 10px', fontSize: '0.8rem' }}
              >
                Hours
              </button>
              <button
                className={`btn-secondary ${timeUnit === 'minutes' ? 'active' : ''}`}
                onClick={() => { sounds.click(); setTimeUnit('minutes'); }}
                style={{ padding: '4px 10px', fontSize: '0.8rem' }}
              >
                Minutes
              </button>
            </div>
          </div>

          {/* Interactive Formula Dashboard */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            margin: '8px 0',
            textAlign: 'center'
          }}>
            {/* Speed (r) */}
            <div style={{ background: 'rgba(6, 182, 212, 0.15)', border: '1.5px solid var(--teal)', borderRadius: '14px', padding: '10px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--teal-bright)', fontWeight: 700 }}>SPEED (r)</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-main)', margin: '4px 0' }}>
                {currentSpeed} km/h
              </div>
              <input
                type="range"
                min="20"
                max="120"
                step="10"
                value={currentSpeed}
                onChange={(e) => {
                  setCurrentSpeed(Number(e.target.value));
                  sounds.pop();
                }}
                style={{ width: '90%', cursor: 'pointer' }}
              />
            </div>

            {/* Time (t) */}
            <div style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1.5px solid var(--gold)', borderRadius: '14px', padding: '10px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--gold-bright)', fontWeight: 700 }}>TIME (t)</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-main)', margin: '4px 0' }}>
                {timeUnit === 'hours' ? `${currentTime} h` : `${Math.round(currentTime * 60)} min`}
              </div>
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.5"
                value={currentTime}
                onChange={(e) => {
                  setCurrentTime(Number(e.target.value));
                  sounds.pop();
                }}
                style={{ width: '90%', cursor: 'pointer' }}
              />
            </div>

            {/* Distance (d) */}
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1.5px solid var(--neon-green)', borderRadius: '14px', padding: '10px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--neon-green)', fontWeight: 700 }}>DISTANCE (d = r × t)</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--neon-green)', margin: '4px 0' }}>
                {(currentSpeed * currentTime).toFixed(0)} km
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {currentSpeed} × {currentTime} h
              </div>
            </div>
          </div>

          {/* Racetrack Visual Animation Bar */}
          <div style={{
            position: 'relative',
            height: '42px',
            background: 'rgba(30, 24, 70, 0.7)',
            borderRadius: '9999px',
            border: '1.5px dashed rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              left: `${Math.min(92, Math.max(4, ((currentSpeed * currentTime) / 400) * 88))}%`,
              transition: 'left 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              fontSize: '1.8rem',
              transform: 'translateY(-2px)'
            }}>
              🏎️💨
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginLeft: '4px' }}>START (0 km)</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginLeft: 'auto' }}>FINISH (400 km)</span>
          </div>
        </div>
      )}

      {/* -------------------- MODE 4: CONVERT RATE (km/h ↔ m/s) -------------------- */}
      {mode === 'convert' && (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="badge badge-coral" style={{ fontSize: '0.85rem' }}>
              Switch Units • Unit Conversion Chain
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className={`btn-secondary ${direction === 'kmh_to_ms' ? 'active' : ''}`}
                onClick={() => { sounds.click(); setDirection('kmh_to_ms'); }}
                style={{ padding: '4px 10px', fontSize: '0.8rem' }}
              >
                km/h ➔ m/s (÷ 3.6)
              </button>
              <button
                className={`btn-secondary ${direction === 'ms_to_kmh' ? 'active' : ''}`}
                onClick={() => { sounds.click(); setDirection('ms_to_kmh'); }}
                style={{ padding: '4px 10px', fontSize: '0.8rem' }}
              >
                m/s ➔ km/h (× 3.6)
              </button>
            </div>
          </div>

          {/* Quick speed selector presets */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', margin: '6px 0' }}>
            {[18, 36, 54, 72, 90].map((val) => (
              <button
                key={val}
                className="btn-secondary"
                onClick={() => {
                  sounds.pop();
                  setConvertSpeed(val);
                }}
                style={{
                  padding: '4px 12px',
                  fontSize: '0.85rem',
                  borderColor: convertSpeed === val ? 'var(--gold-bright)' : undefined
                }}
              >
                {val} km/h
              </button>
            ))}
          </div>

          {/* Unit Cancellation Chain Visualization */}
          <div style={{
            background: 'rgba(25, 20, 60, 0.85)',
            border: '1.5px solid var(--purple-border)',
            borderRadius: '16px',
            padding: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            fontFamily: 'var(--font-mono)'
          }}>
            {/* Step 1: Input Speed */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--teal-bright)' }}>
                {convertSpeed} <span style={{ textDecoration: 'line-through', opacity: 0.6 }}>km</span>/h
              </div>
            </div>

            <span style={{ fontSize: '1.3rem', color: 'var(--text-dim)' }}>×</span>

            {/* Step 2: Multiply by 1,000 m / 1 km */}
            <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.06)', padding: '6px 10px', borderRadius: '8px' }}>
              <div style={{ borderBottom: '1px solid #cbd5e1', paddingBottom: '2px', color: 'var(--neon-green)', fontWeight: 700 }}>
                1,000 m
              </div>
              <div style={{ paddingTop: '2px', textDecoration: 'line-through', color: 'var(--coral-bright)', fontSize: '0.85rem' }}>
                1 km
              </div>
            </div>

            <span style={{ fontSize: '1.3rem', color: 'var(--text-dim)' }}>÷</span>

            {/* Step 3: Divide by 3,600 s / 1 h */}
            <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.06)', padding: '6px 10px', borderRadius: '8px' }}>
              <div style={{ borderBottom: '1px solid #cbd5e1', paddingBottom: '2px', color: 'var(--gold-bright)', fontWeight: 700 }}>
                3,600 s
              </div>
              <div style={{ paddingTop: '2px', textDecoration: 'line-through', color: 'var(--coral-bright)', fontSize: '0.85rem' }}>
                1 h
              </div>
            </div>

            <span style={{ fontSize: '1.5rem', color: 'var(--gold-bright)', fontWeight: 800 }}>=</span>

            {/* Step 4: Result in m/s */}
            <div style={{ textAlign: 'center', background: 'rgba(16, 185, 129, 0.2)', border: '1.5px solid var(--neon-green)', padding: '8px 16px', borderRadius: '12px' }}>
              <div style={{ fontSize: '1.7rem', fontWeight: 900, color: 'var(--neon-green)' }}>
                {(convertSpeed / 3.6).toFixed(0)} m/s
              </div>
            </div>
          </div>

          <div style={{
            fontSize: '0.88rem',
            color: 'var(--gold-bright)',
            textAlign: 'center',
            fontFamily: 'var(--font-mono)'
          }}>
            💡 Golden Rule: <strong>Speed in km/h ÷ 3.6 = Speed in m/s</strong> (and m/s × 3.6 = km/h)
          </div>
        </div>
      )}

      {/* -------------------- MODE 5: PROPORTIONAL GRAPH RATE -------------------- */}
      {mode === 'graph' && (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="badge badge-teal" style={{ fontSize: '0.85rem' }}>
              Rate on Graph • Slope = Unit Rate
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[40, 60, 80].map(r => (
                <button
                  key={r}
                  className="btn-secondary"
                  onClick={() => { sounds.pop(); setCustomRate(r); }}
                  style={{
                    padding: '3px 10px',
                    fontSize: '0.8rem',
                    borderColor: customRate === r ? 'var(--teal-bright)' : undefined
                  }}
                >
                  {r} km/h
                </button>
              ))}
            </div>
          </div>

          {/* SVG Coordinate Graph */}
          <div style={{ width: '100%', margin: '4px 0' }}>
            <svg viewBox="0 0 500 170" style={{ width: '100%', height: 'auto', maxHeight: '170px' }}>
              {/* Grid Lines */}
              {[1, 2, 3, 4].map(x => (
                <line key={`gx-${x}`} x1={80 + x * 90} y1="20" x2={80 + x * 90} y2="135" stroke="rgba(255,255,255,0.08)" strokeDasharray="2 2" />
              ))}
              {[40, 80, 120, 160].map((y, idx) => (
                <line key={`gy-${y}`} x1="80" y1={135 - (idx + 1) * 26} x2="440" y2={135 - (idx + 1) * 26} stroke="rgba(255,255,255,0.08)" strokeDasharray="2 2" />
              ))}

              {/* Axes */}
              <line x1="80" y1="135" x2="440" y2="135" stroke="#cbd5e1" strokeWidth="2" />
              <line x1="80" y1="15" x2="80" y2="135" stroke="#cbd5e1" strokeWidth="2" />

              {/* Axis Labels */}
              <text x="450" y="139" fill="#cbd5e1" fontSize="11" fontWeight="bold">Time (h)</text>
              <text x="75" y="14" fill="#cbd5e1" fontSize="11" textAnchor="end" fontWeight="bold">Distance (km)</text>

              {/* Tick marks on X */}
              {[1, 2, 3, 4].map(x => (
                <g key={`tx-${x}`}>
                  <line x1={80 + x * 80} y1="132" x2={80 + x * 80} y2="138" stroke="#cbd5e1" strokeWidth="2" />
                  <text x={80 + x * 80} y="150" fill="#94a3b8" fontSize="10" textAnchor="middle">{x}</text>
                </g>
              ))}

              {/* Origin */}
              <text x="70" y="146" fill="#94a3b8" fontSize="10">0</text>

              {/* Proportional Line through Origin */}
              <line
                x1="80"
                y1="135"
                x2="400"
                y2={135 - (320 / 80) * (customRate * 0.35)}
                stroke="#22d3ee"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Points (1, r), (2, 2r), (3, 3r) */}
              {[1, 2, 3].map(t => {
                const px = 80 + t * 80;
                const py = 135 - t * (customRate * 0.35);
                const isSelected = selectedPointIndex === t;

                return (
                  <g key={`pt-${t}`} onClick={() => { sounds.pop(); setSelectedPointIndex(t); }} style={{ cursor: 'pointer' }}>
                    <circle
                      cx={px}
                      cy={py}
                      r={isSelected ? 7 : 5}
                      fill={isSelected ? '#fbbf24' : '#06b6d4'}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    <text
                      x={px + 8}
                      y={py - 6}
                      fill={isSelected ? '#fbbf24' : '#22d3ee'}
                      fontSize="11"
                      fontWeight="bold"
                    >
                      ({t}, {t * customRate})
                    </text>
                  </g>
                );
              })}

              {/* Slope Triangle at point (1, r) */}
              <line x1="80" y1="135" x2="160" y2="135" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 2" />
              <line x1="160" y1="135" x2="160" y2={135 - customRate * 0.35} stroke="#10b981" strokeWidth="2" strokeDasharray="3 2" />
              <text x="120" y="147" fill="#f59e0b" fontSize="10" textAnchor="middle">Run = 1 h</text>
              <text x="168" y={135 - (customRate * 0.35) / 2} fill="#10b981" fontSize="10">Rise = {customRate} km</text>
            </svg>
          </div>

          {/* Graph Equation & Slope Badge */}
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1.5px solid var(--purple-border)',
            borderRadius: '12px',
            padding: '6px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Slope = Rise ÷ Run = <strong>{customRate} km ÷ 1 h = {customRate} km/h</strong>
            </span>
            <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--gold-bright)', fontFamily: 'var(--font-mono)' }}>
              Equation: d = {customRate}t
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
