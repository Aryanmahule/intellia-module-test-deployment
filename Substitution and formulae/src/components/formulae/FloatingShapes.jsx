import React from 'react';

const WATERMARKS = [
  { text: '54\n100', top: '5%', left: '3%', size: '3.2rem', color: 'rgba(65, 45, 115, 0.45)', multiline: true },
  { text: '91\n11', top: '3%', left: '24%', size: '2.8rem', color: 'rgba(65, 45, 115, 0.4)', multiline: true },
  { text: '66', top: '4%', left: '32%', size: '2.6rem', color: 'rgba(65, 45, 115, 0.35)' },
  { text: '30\n500', top: '4%', left: '68%', size: '3.0rem', color: 'rgba(65, 45, 115, 0.45)', multiline: true },
  { text: '69', top: '3%', left: '74%', size: '2.4rem', color: 'rgba(65, 45, 115, 0.35)' },
  { text: '90', top: '5%', left: '92%', size: '3.2rem', color: 'rgba(65, 45, 115, 0.4)' },
  { text: '347', top: '12%', left: '87%', size: '3.0rem', color: 'rgba(65, 45, 115, 0.45)' },
  { text: 'x', top: '34%', left: '2%', size: '3.4rem', color: 'rgba(65, 45, 115, 0.4)' },
  { text: 'a', top: '50%', left: '95%', size: '3.4rem', color: 'rgba(65, 45, 115, 0.4)' },
  { text: 'n', top: '60%', left: '3%', size: '3.2rem', color: 'rgba(65, 45, 115, 0.4)' },
  { text: '200', top: '75%', left: '2%', size: '4.0rem', color: 'rgba(65, 45, 115, 0.45)' },
  { text: '123\n999', top: '74%', left: '86%', size: '3.6rem', color: 'rgba(65, 45, 115, 0.5)', multiline: true },
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
            lineHeight: 0.9,
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
