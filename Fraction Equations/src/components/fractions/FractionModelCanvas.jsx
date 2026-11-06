import React, { useState } from 'react';
import { sounds } from '../../utils/audio.js';

export default function FractionModelCanvas({
  type = 'bar', // 'bar' | 'circle' | 'comparison'
  num = 1,
  den = 2,
  interactive = false,
  onShadeChange,
  compareDen = 4,
  compareNum = 2,
  width = 380,
  height = 140
}) {
  const [shadedCount, setShadedCount] = useState(num);

  const handleSliceClick = (index) => {
    if (!interactive) return;
    sounds.pop();
    const newShaded = index < shadedCount ? index : index + 1;
    setShadedCount(newShaded);
    onShadeChange?.(newShaded);
  };

  if (type === 'bar') {
    const sliceWidth = (width - 40) / den;
    return (
      <div className="fraction-canvas-container">
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="fraction-svg">
          <defs>
            <linearGradient id="sliceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <linearGradient id="emptyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.08)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0.02)" />
            </linearGradient>
          </defs>

          {/* Background Bar Frame */}
          <rect
            x="20"
            y="25"
            width={width - 40}
            height="55"
            rx="8"
            fill="none"
            stroke="rgba(168, 85, 247, 0.4)"
            strokeWidth="2"
          />

          {/* Slices */}
          {Array.from({ length: den }).map((_, idx) => {
            const isShaded = idx < shadedCount;
            return (
              <g
                key={idx}
                onClick={() => handleSliceClick(idx)}
                style={{ cursor: interactive ? 'pointer' : 'default' }}
              >
                <rect
                  x={20 + idx * sliceWidth}
                  y="25"
                  width={sliceWidth}
                  height="55"
                  fill={isShaded ? 'url(#sliceGrad)' : 'url(#emptyGrad)'}
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth="1.5"
                />
                <text
                  x={20 + idx * sliceWidth + sliceWidth / 2}
                  y="60"
                  textAnchor="middle"
                  fill={isShaded ? '#ffffff' : 'rgba(255, 255, 255, 0.4)'}
                  fontSize="14"
                  fontWeight="600"
                  fontFamily="Space Grotesk, monospace"
                  pointerEvents="none"
                >
                  1/{den}
                </text>
              </g>
            );
          })}

          {/* Bottom Fraction Label */}
          <text
            x={width / 2}
            y="115"
            textAnchor="middle"
            fill="#facc15"
            fontSize="18"
            fontWeight="700"
            fontFamily="Outfit, sans-serif"
          >
            {shadedCount} / {den} Shaded
          </text>
        </svg>
      </div>
    );
  }

  if (type === 'comparison') {
    const barWidth = width - 40;
    const sliceW1 = barWidth / den;
    const sliceW2 = barWidth / compareDen;

    return (
      <div className="fraction-canvas-container">
        <svg width={width} height={height + 40} viewBox={`0 0 ${width} ${height + 40}`} className="fraction-svg">
          {/* Top Bar: e.g. 1/2 */}
          <text x="20" y="20" fill="#a78bfa" fontSize="13" fontWeight="600">
            Top Bar: {num}/{den}
          </text>
          <g>
            {Array.from({ length: den }).map((_, idx) => (
              <rect
                key={`top-${idx}`}
                x={20 + idx * sliceW1}
                y="30"
                width={sliceW1}
                height="40"
                fill={idx < num ? '#38bdf8' : 'rgba(255, 255, 255, 0.05)'}
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="1.5"
              />
            ))}
          </g>

          {/* Bottom Bar: e.g. 2/4 */}
          <text x="20" y="100" fill="#facc15" fontSize="13" fontWeight="600">
            Equivalent Bar: {compareNum}/{compareDen}
          </text>
          <g>
            {Array.from({ length: compareDen }).map((_, idx) => (
              <rect
                key={`bot-${idx}`}
                x={20 + idx * sliceW2}
                y="110"
                width={sliceW2}
                height="40"
                fill={idx < compareNum ? '#f59e0b' : 'rgba(255, 255, 255, 0.05)'}
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="1.5"
              />
            ))}
          </g>

          {/* Alignment guide line */}
          <line
            x1={20 + num * sliceW1}
            y1="25"
            x2={20 + num * sliceW1}
            y2="155"
            stroke="#10b981"
            strokeWidth="2"
            strokeDasharray="4 2"
          />
        </svg>
      </div>
    );
  }

  // Default circle / pie model
  const cx = width / 2;
  const cy = height / 2;
  const r = Math.min(width, height) / 2 - 15;

  return (
    <div className="fraction-canvas-container">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="fraction-svg">
        <circle cx={cx} cy={cy} r={r} fill="rgba(255, 255, 255, 0.05)" stroke="rgba(168, 85, 247, 0.5)" strokeWidth="2" />
        {Array.from({ length: den }).map((_, idx) => {
          const startAngle = (idx * 2 * Math.PI) / den - Math.PI / 2;
          const endAngle = ((idx + 1) * 2 * Math.PI) / den - Math.PI / 2;
          const x1 = cx + r * Math.cos(startAngle);
          const y1 = cy + r * Math.sin(startAngle);
          const x2 = cx + r * Math.cos(endAngle);
          const y2 = cy + r * Math.sin(endAngle);
          const largeArc = 2 * Math.PI / den > Math.PI ? 1 : 0;
          const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
          const isShaded = idx < shadedCount;

          return (
            <path
              key={idx}
              d={pathData}
              fill={isShaded ? '#f59e0b' : 'transparent'}
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="1.5"
              onClick={() => handleSliceClick(idx)}
              style={{ cursor: interactive ? 'pointer' : 'default' }}
            />
          );
        })}
      </svg>
    </div>
  );
}
