import React from 'react';

const WATERMARKS = [
  { text: 'km/h', top: '5%', left: '4%', size: '3.4rem', color: 'rgba(6, 182, 212, 0.35)' },
  { text: '$ / kg', top: '4%', left: '20%', size: '2.6rem', color: 'rgba(251, 191, 36, 0.35)' },
  { text: 'per 1', top: '4%', left: '38%', size: '3.2rem', color: 'rgba(16, 185, 129, 0.35)' },
  { text: 'd = r × t\n= 150 km', top: '3%', left: '62%', size: '2.6rem', color: 'rgba(147, 112, 219, 0.35)', multiline: true },
  { text: '75 km/h', top: '4%', left: '80%', size: '3.0rem', color: 'rgba(244, 63, 94, 0.35)' },
  { text: '÷ 3.6', top: '5%', left: '92%', size: '2.6rem', color: 'rgba(147, 112, 219, 0.35)' },
  { text: '⏱', top: '16%', left: '88%', size: '2.4rem', color: 'rgba(251, 191, 36, 0.3)' },
  { text: 'm/s', top: '38%', left: '2%', size: '3.0rem', color: 'rgba(6, 182, 212, 0.35)' },
  { text: 'per 1', top: '52%', left: '94%', size: '3.2rem', color: 'rgba(16, 185, 129, 0.35)' },
  { text: 'km/h', top: '64%', left: '3%', size: '2.6rem', color: 'rgba(244, 63, 94, 0.35)' },
  { text: 'Slope = \nUnit Rate', top: '76%', left: '2%', size: '2.5rem', color: 'rgba(6, 182, 212, 0.35)', multiline: true },
  { text: 'Best Buy 🏆', top: '75%', left: '86%', size: '2.6rem', color: 'rgba(251, 191, 36, 0.35)' },
];

export default function FloatingShapes() {
  return (
    <div className="floating-bg" aria-hidden="true">
      {WATERMARKS.map((item, idx) => (
        <span
          key={idx}
          className="floating-item"
          style={{
            top: item.top,
            left: item.left,
            fontSize: item.size,
            color: item.color,
            fontFamily: 'var(--font-fun)',
            fontWeight: 800,
            whiteSpace: 'pre-line',
            lineHeight: 1.1,
            pointerEvents: 'none',
            userSelect: 'none'
          }}
        >
          {item.text}
        </span>
      ))}
    </div>
  );
}
