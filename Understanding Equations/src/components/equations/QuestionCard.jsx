import React from 'react';
import { sounds } from '../../utils/audio.js';

export default function QuestionCard({
  question,
  index,
  total,
  selectedOption,
  onSelectOption,
  isAnswered,
  isCorrect
}) {
  const letters = ['A', 'B', 'C', 'D'];

  const handleOptionClick = (option) => {
    if (isAnswered) return;
    sounds.click();
    onSelectOption(option);
  };

  const badgeColorClass = {
    teal: 'badge-teal',
    purple: 'badge-purple',
    gold: 'badge-gold',
    coral: 'badge-coral',
    green: 'badge-teal'
  }[question.typeColor] || 'badge-teal';

  return (
    <div className="question-card-inner" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Top Question Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--gold-bright)' }}>
            Q{index + 1} of {total}
          </span>
          <span className={`badge ${badgeColorClass}`}>
            <span>{question.typeIcon}</span> <span>{question.typeLabel}</span>
          </span>
        </div>
      </div>

      {/* Question Prompt */}
      <h3 style={{ fontSize: '1.45rem', color: 'var(--text-main)', lineHeight: 1.4, margin: '4px 0' }}>
        {question.prompt}
      </h3>

      {/* Highlighted Equation Card if Available */}
      {question.equation && (
        <div style={{
          background: 'rgba(15, 10, 36, 0.9)',
          border: '1.5px solid var(--purple-border)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 20px',
          textAlign: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: '1.8rem',
          color: 'var(--teal-bright)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
        }}>
          {question.equation}
        </div>
      )}

      {/* Options Grid (4 options with A, B, C, D pills) */}
      <div className="options-grid" style={{ margin: '8px 0' }}>
        {question.options.map((option, idx) => {
          const isSelected = selectedOption === option;
          const isCorrectOption = option === question.correctAnswer;

          let btnClass = 'option-btn';
          if (isAnswered) {
            if (isCorrectOption) {
              btnClass += ' correct';
            } else if (isSelected && !isCorrect) {
              btnClass += ' wrong';
            }
          } else if (isSelected) {
            btnClass += ' selected';
          }

          return (
            <button
              key={idx}
              className={btnClass}
              onClick={() => handleOptionClick(option)}
              disabled={isAnswered}
              aria-label={`Option ${letters[idx]}: ${option}`}
            >
              <span className="option-letter">{letters[idx]}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700 }}>{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
