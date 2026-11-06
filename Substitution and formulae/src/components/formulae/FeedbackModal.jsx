import React, { useEffect } from 'react';

export default function FeedbackModal({ isOpen, isCorrect, title, message, hint, onClose }) {
  if (!isOpen) return null;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const defaultTitle = isCorrect ? 'Correct! 🎉' : 'Not quite! 💡';
  const displayTitle = title || defaultTitle;
  const displayText = message || (isCorrect ? 'Great job! You substituted values and followed BODMAS correctly.' : 'Remember to wrap substituted numbers in brackets and check order of operations.');

  return (
    <div
      className="feedback-modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(8, 4, 20, 0.78)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        cursor: 'pointer',
        animation: 'modalFadeIn 0.2s ease-out'
      }}
    >
      <div
        className={`feedback-modal-card ${isCorrect ? 'modal-correct' : 'modal-wrong'}`}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        style={{
          background: isCorrect ? '#3bb75e' : '#e11d48',
          color: '#ffffff',
          borderRadius: '28px',
          padding: '36px 42px',
          maxWidth: '480px',
          width: '90%',
          textAlign: 'center',
          boxShadow: isCorrect
            ? '0 24px 60px rgba(0, 0, 0, 0.6), 0 0 35px rgba(59, 183, 94, 0.45)'
            : '0 24px 60px rgba(0, 0, 0, 0.6), 0 0 35px rgba(225, 29, 72, 0.45)',
          border: '2px solid rgba(255, 255, 255, 0.25)',
          cursor: 'pointer',
          transform: 'scale(1)',
          animation: 'modalPop 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        {/* Top Icon */}
        <div style={{ fontSize: '4.2rem', marginBottom: '8px', lineHeight: 1, filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.2))' }}>
          {isCorrect ? '🎉' : '💡'}
        </div>

        {/* Title */}
        <h2
          style={{
            fontFamily: "'Fredoka', var(--font-main)",
            fontSize: '2.4rem',
            fontWeight: 800,
            color: '#ffffff',
            marginBottom: '10px',
            lineHeight: 1.15
          }}
        >
          {displayTitle}
        </h2>

        {/* Explanation Subtext */}
        <p
          style={{
            fontSize: '1.25rem',
            lineHeight: 1.55,
            color: '#ffffff',
            fontWeight: 600,
            margin: '0 auto 14px',
            textShadow: '0 1px 3px rgba(0,0,0,0.2)'
          }}
        >
          {displayText}
        </p>

        {/* Hint / Advance Prompt */}
        <div
          style={{
            fontSize: '0.98rem',
            color: 'rgba(255, 255, 255, 0.85)',
            fontWeight: 700,
            marginTop: '8px'
          }}
        >
          (Tap anywhere or press Space to continue ➔)
        </div>
      </div>
    </div>
  );
}
