import React from 'react';

// Floating algebraic watermarks & background numbers matching reference UI and two-step equation tokens
const WATERMARKS = [
  // Numbers from image
  { text: '54', top: '5%', left: '4%', size: '3.6rem', opacity: 0.12 },
  { text: '100', top: '10%', left: '6%', size: '4.8rem', opacity: 0.14 },
  { text: '91', top: '4%', left: '24%', size: '3.8rem', opacity: 0.13 },
  { text: '11', top: '8%', left: '28%', size: '2.4rem', opacity: 0.11 },
  { text: '66', top: '5%', left: '32%', size: '3.5rem', opacity: 0.12 },
  { text: '500', top: '8%', right: '27%', size: '5.2rem', opacity: 0.13 },
  { text: '30', top: '5%', right: '31%', size: '2.5rem', opacity: 0.10 },
  { text: '69', top: '4%', right: '26%', size: '2.8rem', opacity: 0.10 },
  { text: '90', top: '6%', right: '7%', size: '3.6rem', opacity: 0.12 },
  { text: '347', top: '13%', right: '6%', size: '4.2rem', opacity: 0.12 },
  
  // Mid variables
  { text: 'x', top: '34%', left: '3%', size: '3.8rem', opacity: 0.12 },
  { text: 'n', top: '62%', left: '4%', size: '3.4rem', opacity: 0.12 },
  { text: '200', top: '76%', left: '3%', size: '4.6rem', opacity: 0.14 },
  { text: 'a', top: '51%', right: '4%', size: '3.6rem', opacity: 0.11 },
  { text: '123', top: '74%', right: '11%', size: '2.6rem', opacity: 0.10 },
  { text: '999', top: '78%', right: '6%', size: '5.4rem', opacity: 0.15 },

  // Equation symbols & two-step tokens
  { text: '2x + 3 = 11', top: '22%', left: '14%', size: '2.2rem', opacity: 0.08 },
  { text: '− 3', top: '42%', left: '10%', size: '2.8rem', opacity: 0.09 },
  { text: '÷ 2', top: '50%', right: '15%', size: '2.8rem', opacity: 0.09 },
  { text: 'x = 4', top: '68%', right: '22%', size: '2.4rem', opacity: 0.08 },
  { text: '3x − 4 = 14', top: '85%', left: '25%', size: '2.2rem', opacity: 0.07 },
  { text: 'x ÷ 4 + 2 = 5', top: '88%', right: '35%', size: '2.0rem', opacity: 0.07 },
  { text: '⚖️', top: '28%', right: '8%', size: '2.5rem', opacity: 0.08 },
  { text: '🔁', top: '38%', left: '20%', size: '2.2rem', opacity: 0.07 }
];

export default function FloatingShapes() {
  return (
    <div className="floating-watermarks-container" aria-hidden="true">
      {WATERMARKS.map((item, idx) => (
        <span
          key={idx}
          className="watermark-item"
          style={{
            top: item.top,
            left: item.left,
            right: item.right,
            bottom: item.bottom,
            fontSize: item.size,
            opacity: item.opacity
          }}
        >
          {item.text}
        </span>
      ))}
    </div>
  );
}
