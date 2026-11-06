import React from 'react';

export default function FeedbackModal({ isOpen, title, message, type = 'info', onClose }) {
  if (!isOpen) return null;

  return (
    <div className="feedback-modal-backdrop" onClick={onClose}>
      <div className={`feedback-modal-card ${type}`} onClick={e => e.stopPropagation()}>
        <h3 className="feedback-modal-title">{title}</h3>
        <p className="feedback-modal-message">{message}</p>
        <button className="feedback-modal-close-btn" onClick={onClose}>
          Got it!
        </button>
      </div>
    </div>
  );
}
