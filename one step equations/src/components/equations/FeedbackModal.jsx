import React, { useEffect } from 'react';

export default function FeedbackModal({ isOpen, isCorrect, title, message, hint, onClose }) {
  // Call Hook unconditionally at top of component (Complies with Rules of Hooks)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const defaultTitle = isCorrect ? 'Correct! 🌟' : 'Not quite! 💡';
  const displayTitle = title || defaultTitle;
  const displayText = message || (isCorrect ? 'Great job! You balanced both sides and found the exact solution.' : 'Remember to apply inverse operations to both sides to maintain equality.');

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
          background: isCorrect ? '#10b981' : '#f43f5e',
          color: '#ffffff',
          borderRadius: '24px',
          padding: '28px 36px',
          maxWidth: '460px',
          width: '90%',
          textAlign: 'center',
          boxShadow: isCorrect
            ? '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(16, 185, 129, 0.45)'
            : '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(244, 63, 94, 0.45)',
          border: '2px solid rgba(255, 255, 255, 0.25)',
          cursor: 'pointer',
          animation: 'modalPop 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        {/* Top Icon */}
        <div style={{ fontSize: '3.6rem', marginBottom: '8px', lineHeight: 1, filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.2))' }}>
          {isCorrect ? '🌟' : '💡'}
        </div>

        {/* Title */}
        <h2
          style={{
            fontFamily: "'Fredoka', var(--font-main)",
            fontSize: '2rem',
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
            fontSize: '1.05rem',
            lineHeight: 1.5,
            color: '#ffffff',
            fontWeight: 600,
            margin: '0 auto 12px',
            textShadow: '0 1px 3px rgba(0,0,0,0.2)'
          }}
        >
          {displayText}
        </p>

        {/* Advance Prompt */}
        <div
          style={{
            fontSize: '0.88rem',
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
