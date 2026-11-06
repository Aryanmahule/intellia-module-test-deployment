import React from 'react';

/**
 * Floating background watermark shapes & numbers
 * Matches the reference UI screenshots with ratio notations and ambient numbers
 */
export default function FloatingShapes() {
  const watermarks = [
    { text: '54', className: 'wm-1' },
    { text: '100', className: 'wm-2' },
    { text: '91', className: 'wm-3' },
    { text: '11', className: 'wm-4' },
    { text: '66', className: 'wm-5' },
    { text: '90', className: 'wm-6' },
    { text: '30', className: 'wm-7' },
    { text: '500', className: 'wm-8' },
    { text: '69', className: 'wm-9' },
    { text: '90', className: 'wm-10' },
    { text: '347', className: 'wm-347' },
    { text: '3 : 5', className: 'wm-x' },
    { text: '2 : 3', className: 'wm-n' },
    { text: '$72', className: 'wm-200' },
    { text: '× 4', className: 'wm-a' },
    { text: '999', className: 'wm-999' },
    { text: '123', className: 'wm-123' },
    { text: '= 8', className: 'wm-parts' }
  ];

  return (
    <div className="floating-watermarks-container" aria-hidden="true">
      {watermarks.map((wm, i) => (
        <span key={i} className={`watermark-item ${wm.className}`}>
          {wm.text}
        </span>
      ))}
    </div>
  );
}
