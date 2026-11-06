/* =========================================================
   QUESTION CARD COMPONENT
   Displays prompt, context, 4 options, feedback and explanation
   ========================================================= */

import React from 'react';

export default function QuestionCard({
  question,
  selectedAnswer,
  isAnswered,
  isCorrect,
  onSelectOption
}) {
  const { prompt, options, correctAnswer, explanation, typeMeta, contextInfo } = question;

  return (
    <div className="question-card-main">
      <div>
        {/* Type Badge & Context Pill */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span
            className="question-type-pill"
            style={{ color: typeMeta.color, background: typeMeta.bg, border: `1px solid ${typeMeta.color}40` }}
          >
            {typeMeta.label}
          </span>
          {contextInfo && (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
              {contextInfo}
            </span>
          )}
        </div>

        {/* Question Prompt */}
        <h3 style={{
          color: '#ffffff',
          fontFamily: 'var(--font-heading)',
          fontSize: '1.25rem',
          fontWeight: 700,
          margin: '12px 0 16px',
          lineHeight: 1.5,
          whiteSpace: 'pre-line'
        }}>
          {prompt}
        </h3>

        {/* Options 2x2 or Stacked Grid */}
        <div className="options-grid">
          {options.map((opt, idx) => {
            const isSelected = selectedAnswer === opt;
            const isOptCorrect = opt === correctAnswer;

            let btnClass = 'option-choice-btn';
            if (isAnswered) {
              if (isOptCorrect) {
                btnClass += ' correct';
              } else if (isSelected) {
                btnClass += ' wrong';
              } else {
                btnClass += ' dim';
              }
            } else if (isSelected) {
              btnClass += ' selected';
            }

            return (
              <button
                key={idx}
                className={btnClass}
                onClick={() => onSelectOption(opt)}
                disabled={isAnswered}
              >
                <span className="option-letter">{['A', 'B', 'C', 'D'][idx]}</span>
                <span className="option-text">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Post-Answer Explanation Box */}
        {isAnswered && (
          <div className={`answer-explanation-box ${isCorrect ? 'correct' : 'wrong'}`}>
            <div className="explanation-header">
              <span>{isCorrect ? '🎉 Correct!' : '💡 Need a Clue?'}</span>
            </div>
            <p className="explanation-body">
              {explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
