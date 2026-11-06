import React from 'react';

export default function FloatingShapes() {
  const shapes = [
    // Left side watermark numbers & variables matching screenshot
    { text: '54', sub: '100', top: '15%', left: '4%', size: '3.6rem', opacity: 0.12 },
    { text: 'x', top: '40%', left: '2.5%', size: '3.2rem', opacity: 0.11 },
    { text: 'n', top: '65%', left: '3.5%', size: '2.8rem', opacity: 0.10 },
    { text: '200', top: '78%', left: '2.8%', size: '3.5rem', opacity: 0.13 },

    // Upper center watermark numbers matching screenshot
    { text: '91', sub: '11', top: '13%', left: '24%', size: '2.8rem', opacity: 0.10 },
    { text: '66', top: '14%', left: '31%', size: '2.6rem', opacity: 0.10 },
    { text: '90', top: '14%', left: '49%', size: '3.0rem', opacity: 0.11 },
    { text: '30', sub: '500', top: '15%', left: '68%', size: '3.2rem', opacity: 0.12 },
    { text: '69', top: '13%', left: '73%', size: '2.4rem', opacity: 0.10 },

    // Right side watermark numbers & variables matching screenshot
    { text: '90', top: '15%', left: '92%', size: '3.2rem', opacity: 0.11 },
    { text: '347', top: '23%', left: '88%', size: '3.0rem', opacity: 0.12 },
    { text: 'a', top: '56%', left: '94%', size: '2.8rem', opacity: 0.10 },
    { text: '123', sub: '999', top: '75%', left: '86%', size: '4.2rem', opacity: 0.14 },

    // Fraction equations floating symbols
    { text: '1/2', top: '30%', left: '9%', size: '2.6rem', opacity: 0.09 },
    { text: '3/4', top: '88%', left: '18%', size: '2.4rem', opacity: 0.09 },
    { text: '=', top: '86%', left: '48%', size: '2.8rem', opacity: 0.08 },
    { text: '2/3', top: '88%', left: '76%', size: '2.5rem', opacity: 0.09 },
    { text: '+', top: '48%', left: '91%', size: '2.6rem', opacity: 0.09 }
  ];

  return (
    <div className="floating-shapes-container" aria-hidden="true">
      {shapes.map((s, idx) => (
        <div
          key={idx}
          className="watermark-glyph"
          style={{
            position: 'absolute',
            top: s.top,
            left: s.left,
            fontSize: s.size,
            opacity: s.opacity,
            fontFamily: 'var(--font-mono, monospace)',
            fontWeight: 700,
            color: '#a78bfa',
            userSelect: 'none',
            pointerEvents: 'none',
            lineHeight: 0.9,
            textAlign: 'center'
          }}
        >
          {s.text}
          {s.sub && (
            <div style={{ fontSize: '0.65em', marginTop: '-0.15em' }}>
              {s.sub}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
