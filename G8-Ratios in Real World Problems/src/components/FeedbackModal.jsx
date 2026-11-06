import React from 'react';
import { sounds } from '../utils/audio';

export default function FeedbackModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div
        className="modal-glass-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header-bar">
          <h3 className="modal-title">
            <span>📐</span> Ratio Master Cheat Sheet
          </h3>
          <button
            className="modal-close-btn"
            onClick={() => { sounds.click(); onClose(); }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="modal-body-content">
          <div className="cheat-section">
            <h4 className="cheat-heading">🌟 The 3-Step Ratio Habit</h4>
            <div className="cheat-steps-box">
              <div className="step-item">
                <span className="step-circle">1</span>
                <span><strong>Add the parts</strong> to find total units (e.g. 3 + 5 = 8 parts).</span>
              </div>
              <div className="step-item">
                <span className="step-circle">2</span>
                <span><strong>Find 1 part:</strong> Divide the given amount by its matching parts ($72 ÷ 8 = $9).</span>
              </div>
              <div className="step-item">
                <span className="step-circle">3</span>
                <span><strong>Multiply to scale:</strong> Maya gets 3 × $9 = $27; Ravi gets 5 × $9 = $45!</span>
              </div>
            </div>
          </div>

          <div className="cheat-section">
            <h4 className="cheat-heading">⚠️ The Additive Misconception Trap</h4>
            <p className="cheat-text">
              Ratios grow by <strong>multiplying or dividing</strong> both sides by the <em>same</em> factor.
              Adding numbers changes the mix! (e.g. 2 : 3 ≠ 4 : 5).
            </p>
          </div>

          <div className="cheat-section">
            <h4 className="cheat-heading">🥤 Comparing Mixtures</h4>
            <p className="cheat-text">
              To see which drink or paint mix is stronger, always compare the <strong>part-to-whole fraction</strong> (active ingredient ÷ total mixture), not just the first number!
            </p>
          </div>
        </div>

        <div className="modal-footer-bar">
          <button
            className="btn-gold-sm"
            onClick={() => { sounds.click(); onClose(); }}
          >
            Got It! Back to Quest
          </button>
        </div>
      </div>
    </div>
  );
}
