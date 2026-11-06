/* =========================================================
   FLOATING SHAPES / WATERMARKS COMPONENT
   Renders background floating probability fractions, coins, dice, and glyphs
   ========================================================= */

import React from 'react';

export default function FloatingShapes() {
  return (
    <div className="floating-watermarks-container" aria-hidden="true">
      {/* Numbers, fractions, and probability glyphs placed matching the UI screenshot */}
      <div className="watermark-item wm-1">54</div>
      <div className="watermark-item wm-2">100</div>
      <div className="watermark-item wm-3">P(E)</div>
      <div className="watermark-item wm-4">1/6</div>
      <div className="watermark-item wm-5">66</div>
      <div className="watermark-item wm-6">1/2</div>
      <div className="watermark-item wm-7">50%</div>
      <div className="watermark-item wm-8">500</div>
      <div className="watermark-item wm-9">90</div>
      <div className="watermark-item wm-10">347</div>

      <div className="watermark-item wm-x">🎲</div>
      <div className="watermark-item wm-n">🪙</div>
      <div className="watermark-item wm-200">200</div>
      <div className="watermark-item wm-a">3/4</div>
      <div className="watermark-item wm-123">123</div>
      <div className="watermark-item wm-999">999</div>
    </div>
  );
}
