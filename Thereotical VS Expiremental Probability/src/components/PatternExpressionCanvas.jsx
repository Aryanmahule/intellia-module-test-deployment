import React from 'react';

export default function PatternExpressionCanvas({
  mode = 'shape',
  family = 'matchSquares',
  figure = 3,
  terms = [3, 5, 7, 9],
  difference = 2,
  rule = '3n + 1',
  phrase = '5 less than x',
  showDifference = true,
  interactive = false,
  onFigureChange = null
}) {
  // Render sequence mode
  if (mode === 'sequence') {
    return (
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {terms.map((val, idx) => (
            <React.Fragment key={idx}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                  Pos {idx + 1}
                </span>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.4), rgba(79, 70, 229, 0.4))',
                  border: '1.5px solid var(--purple-400)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-fun)',
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  boxShadow: '0 4px 14px rgba(124, 58, 237, 0.35)'
                }}>
                  {val}
                </div>
              </div>

              {idx < terms.length - 1 && showDifference && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 2px' }}>
                  <span style={{
                    fontSize: '0.85rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--gold-300)',
                    fontWeight: 700,
                    background: 'rgba(255, 184, 0, 0.15)',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 184, 0, 0.3)'
                  }}>
                    +{difference}
                  </span>
                  <span style={{ color: 'var(--gold-400)', fontSize: '1rem', marginTop: '2px' }}>➔</span>
                </div>
              )}
            </React.Fragment>
          ))}

          {/* Next Unknown Term Block */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 2px' }}>
            <span style={{
              fontSize: '0.85rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--teal-300)',
              fontWeight: 700,
              background: 'rgba(0, 229, 255, 0.15)',
              padding: '2px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(0, 229, 255, 0.3)'
            }}>
              +{difference}
            </span>
            <span style={{ color: 'var(--teal-400)', fontSize: '1rem', marginTop: '2px' }}>➔</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--teal-300)' }}>
              Pos {terms.length + 1}
            </span>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              background: 'rgba(0, 229, 255, 0.15)',
              border: '2px dashed var(--teal-400)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-fun)',
              fontSize: '1.5rem',
              fontWeight: 800,
              color: 'var(--teal-300)',
              boxShadow: '0 0 16px rgba(0, 229, 255, 0.3)'
            }}>
              ?
            </div>
          </div>
        </div>

        {rule && (
          <div style={{
            background: 'rgba(12, 4, 25, 0.65)',
            border: '1px solid var(--border-gold)',
            borderRadius: '10px',
            padding: '6px 16px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.95rem',
            color: 'var(--gold-300)',
            fontWeight: 700
          }}>
            Rule: {rule}
          </div>
        )}
      </div>
    );
  }

  // Render SVG Shape Pattern
  if (mode === 'shape') {
    const n = Math.max(1, Math.min(figure, 8)); // clamp for display
    const totalMatchsticks = family === 'matchSquares' ? 3 * n + 1
      : family === 'matchTriangles' ? 2 * n + 1
      : family === 'tables' ? 2 * n + 2
      : 2 * n - 1;

    return (
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '100%',
          maxWidth: '520px',
          height: '170px',
          background: 'rgba(10, 3, 22, 0.8)',
          borderRadius: '16px',
          border: '1.5px solid rgba(168, 85, 247, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10px',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.6)'
        }}>
          <svg viewBox="0 0 460 140" style={{ width: '100%', height: '100%' }}>
            <defs>
              <linearGradient id="matchstickGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Render Matchstick Squares */}
            {family === 'matchSquares' && (
              <g transform="translate(30, 20)">
                {Array.from({ length: n }).map((_, i) => {
                  const x = i * 48;
                  return (
                    <g key={i}>
                      {/* Top horizontal */}
                      <line x1={x + 4} y1="15" x2={x + 44} y2="15" stroke="url(#matchstickGrad)" strokeWidth="4.5" strokeLinecap="round" />
                      <circle cx={x + 4} cy="15" r="4" fill="#ef4444" filter="url(#glow)" />
                      {/* Bottom horizontal */}
                      <line x1={x + 4} y1="75" x2={x + 44} y2="75" stroke="url(#matchstickGrad)" strokeWidth="4.5" strokeLinecap="round" />
                      <circle cx={x + 4} cy="75" r="4" fill="#ef4444" filter="url(#glow)" />
                      {/* Left vertical (only for first square) */}
                      {i === 0 && (
                        <>
                          <line x1="4" y1="15" x2="4" y2="75" stroke="url(#matchstickGrad)" strokeWidth="4.5" strokeLinecap="round" />
                          <circle cx="4" cy="15" r="4" fill="#ef4444" filter="url(#glow)" />
                        </>
                      )}
                      {/* Right vertical */}
                      <line x1={x + 44} y1="15" x2={x + 44} y2="75" stroke="url(#matchstickGrad)" strokeWidth="4.5" strokeLinecap="round" />
                      <circle cx={x + 44} cy="15" r="4" fill="#ef4444" filter="url(#glow)" />

                      {/* Square label */}
                      <text x={x + 24} y="50" fill="#c084fc" fontSize="13" fontWeight="700" textAnchor="middle" fontFamily="var(--font-mono)">
                        #{i + 1}
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {/* Render Matchstick Triangles */}
            {family === 'matchTriangles' && (
              <g transform="translate(35, 20)">
                {Array.from({ length: n }).map((_, i) => {
                  const x = i * 44;
                  return (
                    <g key={i}>
                      {/* Bottom line */}
                      <line x1={x} y1="80" x2={x + 44} y2="80" stroke="url(#matchstickGrad)" strokeWidth="4.5" strokeLinecap="round" />
                      <circle cx={x} cy="80" r="4" fill="#ef4444" />
                      {/* Slanted left (only for first) */}
                      {i === 0 && (
                        <line x1={x} y1="80" x2={x + 22} y2="20" stroke="url(#matchstickGrad)" strokeWidth="4.5" strokeLinecap="round" />
                      )}
                      {/* Slanted right */}
                      <line x1={x + 22} y1="20" x2={x + 44} y2="80" stroke="url(#matchstickGrad)" strokeWidth="4.5" strokeLinecap="round" />
                      <circle cx={x + 22} cy="20" r="4" fill="#ef4444" />
                      <circle cx={x + 44} cy="80" r="4" fill="#ef4444" />

                      <text x={x + 22} y="62" fill="#38bdf8" fontSize="12" fontWeight="700" textAnchor="middle" fontFamily="var(--font-mono)">
                        ▲{i + 1}
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {/* Render Hawker Joined Tables */}
            {family === 'tables' && (
              <g transform="translate(30, 25)">
                {Array.from({ length: n }).map((_, i) => {
                  const x = i * 48;
                  return (
                    <g key={i}>
                      {/* Table surface */}
                      <rect x={x} y="30" width="46" height="36" rx="4" fill="#7c3aed" stroke="#c084fc" strokeWidth="2" opacity="0.85" />
                      <text x={x + 23} y="53" fill="#ffffff" fontSize="12" fontWeight="700" textAnchor="middle" fontFamily="var(--font-mono)">
                        T{i + 1}
                      </text>

                      {/* Top chair/seat */}
                      <circle cx={x + 23} cy="15" r="7" fill="#ffb800" stroke="#fff" strokeWidth="1.5" />
                      {/* Bottom chair/seat */}
                      <circle cx={x + 23} cy="81" r="7" fill="#ffb800" stroke="#fff" strokeWidth="1.5" />

                      {/* Left end chair (only on first table) */}
                      {i === 0 && (
                        <circle cx={x - 12} cy="48" r="7" fill="#10b981" stroke="#fff" strokeWidth="1.5" />
                      )}

                      {/* Right end chair (only on last table) */}
                      {i === n - 1 && (
                        <circle cx={x + 58} cy="48" r="7" fill="#10b981" stroke="#fff" strokeWidth="1.5" />
                      )}
                    </g>
                  );
                })}
              </g>
            )}

            {/* Render Tiles */}
            {family === 'tiles' && (
              <g transform="translate(60, 20)">
                {Array.from({ length: n }).map((_, i) => (
                  <rect key={`v-${i}`} x="20" y={20 + i * 18} width="16" height="16" rx="3" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
                ))}
                {Array.from({ length: n - 1 }).map((_, i) => (
                  <rect key={`h-${i}`} x={38 + i * 18} y="20" width="16" height="16" rx="3" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
                ))}
              </g>
            )}
          </svg>
        </div>

        {/* Stats & Interactive Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '520px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 600 }}>Figure:</span>
            <span style={{
              background: 'rgba(168, 85, 247, 0.25)',
              border: '1px solid var(--purple-400)',
              color: '#ffffff',
              padding: '2px 10px',
              borderRadius: '8px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700
            }}>
              n = {n}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 600 }}>Count:</span>
            <span style={{
              background: 'rgba(255, 184, 0, 0.2)',
              border: '1px solid var(--border-gold)',
              color: 'var(--gold-300)',
              padding: '2px 12px',
              borderRadius: '8px',
              fontFamily: 'var(--font-fun)',
              fontWeight: 800,
              fontSize: '1.05rem'
            }}>
              {totalMatchsticks}
            </span>
          </div>

          {interactive && onFigureChange && (
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => onFigureChange(Math.max(1, n - 1))}
                disabled={n <= 1}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid var(--border-glass)',
                  color: '#fff',
                  borderRadius: '6px',
                  width: '28px',
                  height: '28px',
                  cursor: n <= 1 ? 'not-allowed' : 'pointer',
                  fontWeight: 700
                }}
              >
                -
              </button>
              <button
                onClick={() => onFigureChange(Math.min(8, n + 1))}
                disabled={n >= 8}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid var(--border-glass)',
                  color: '#fff',
                  borderRadius: '6px',
                  width: '28px',
                  height: '28px',
                  cursor: n >= 8 ? 'not-allowed' : 'pointer',
                  fontWeight: 700
                }}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render Words to Expression mode
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
      <div style={{
        background: 'rgba(12, 4, 25, 0.7)',
        border: '1px solid rgba(168, 85, 247, 0.3)',
        borderRadius: '14px',
        padding: '12px 20px',
        color: '#f8fafc',
        fontFamily: 'var(--font-heading)',
        fontSize: '1.15rem',
        fontWeight: 600,
        textAlign: 'center'
      }}>
        "{phrase}"
      </div>
    </div>
  );
}
