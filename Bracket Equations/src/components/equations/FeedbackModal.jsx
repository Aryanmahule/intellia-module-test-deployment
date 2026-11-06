import React from 'react';
import { sounds } from '../../utils/audio.js';

export default function FeedbackModal({ isOpen, isSuccess, title, message, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="feedback-modal-overlay" onClick={onClose}>
      <div
        className={`feedback-modal-card glass-panel ${isSuccess ? 'modal-success' : 'modal-notice'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-icon">{isSuccess ? '🎉' : '💡'}</div>
        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>
        <button
          className="modal-close-btn"
          onClick={() => {
            sounds.click();
            onClose();
          }}
        >
          Got It!
        </button>
      </div>
    </div>
  );
}
