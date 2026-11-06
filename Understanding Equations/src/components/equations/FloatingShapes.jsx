import React from 'react';

const WATERMARKS = [
  { text: '54\n100', className: 'wm-1', top: '5%', left: '3%', size: '4rem', opacity: 0.8 },
  { text: '91\n11', className: 'wm-3', top: '3%', left: '23%', size: '3.6rem', opacity: 0.7 },
  { text: '66', className: 'wm-5', top: '4%', left: '31%', size: '3.2rem', opacity: 0.65 },
  { text: '30\n500', className: 'wm-8', top: '5%', right: '27%', size: '4.8rem', opacity: 0.85 },
  { text: '69', className: 'wm-7', top: '3%', right: '22%', size: '2.8rem', opacity: 0.6 },
  { text: '90', className: 'wm-9', top: '5%', right: '5%', size: '4.5rem', opacity: 0.75 },
  { text: '347', className: 'wm-10', top: '14%', right: '7%', size: '3.4rem', opacity: 0.7 },
  { text: 'x', className: 'wm-x', top: '34%', left: '2%', size: '4.5rem', opacity: 0.75 },
  { text: 'n', className: 'wm-n', top: '62%', left: '3%', size: '4rem', opacity: 0.7 },
  { text: '200', className: 'wm-200', bottom: '6%', left: '2%', size: '5.8rem', opacity: 0.8 },
  { text: 'a', className: 'wm-a', top: '48%', right: '3%', size: '4.2rem', opacity: 0.7 },
  { text: '123\n999', className: 'wm-999', bottom: '8%', right: '3%', size: '6.2rem', opacity: 0.85 },
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
            opacity: item.opacity,
            whiteSpace: 'pre-line'
          }}
        >
          {item.text}
        </span>
      ))}
    </div>
  );
}
