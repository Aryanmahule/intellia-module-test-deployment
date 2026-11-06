import React from 'react';
import PatternExpressionCanvas from './PatternExpressionCanvas';

export default function QuestionCard({
  question,
  selectedAnswer,
  isAnswered,
  isCorrect,
  onSelectOption
}) {
  const { prompt, options, correctAnswer, explanation, typeMeta, patternMeta, targetFig } = question;

  return (
    <div className="question-card-main">
      <div>
        {/* Type Badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span
            className="question-type-pill"
            style={{ color: typeMeta.color, background: typeMeta.bg, border: `1px solid ${typeMeta.color}40` }}
          >
            {typeMeta.label}
          </span>
          {question.contextInfo && (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
              {question.contextInfo}
            </span>
          )}
        </div>

        {/* Question Prompt */}
        <h3 style={{
          color: '#ffffff',
          fontFamily: 'var(--font-heading)',
          fontSize: '1.35rem',
          fontWeight: 700,
          margin: '12px 0 16px',
          lineHeight: 1.45
        }}>
          {prompt}
        </h3>

        {/* Visual Support Canvas if applicable */}
        {question.type === 'shapePattern' && patternMeta && (
          <div style={{ marginBottom: '14px' }}>
            <PatternExpressionCanvas
              mode="shape"
              family={patternMeta.family}
              figure={Math.min(targetFig || 3, 4)}
              rule={patternMeta.ruleStr}
            />
          </div>
        )}

        {/* Options 2x2 Grid */}
        <div className="options-grid">
          {options.map((opt, idx) => {
            const isSelected = selectedAnswer === opt;
            const isOptCorrect = opt === correctAnswer;

            let optionClass = 'option-btn';
            if (isAnswered) {
              if (isSelected && isCorrect) optionClass += ' correct';
              else if (isSelected && !isCorrect) optionClass += ' wrong';
              else if (isOptCorrect) optionClass += ' correct';
            }

            return (
              <button
                key={idx}
                className={optionClass}
                onClick={() => onSelectOption(opt)}
                disabled={isAnswered}
              >
                <span>{opt}</span>
                {isAnswered && isOptCorrect && <span>✓</span>}
                {isAnswered && isSelected && !isCorrect && <span>✗</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback & Step-by-Step Walkthrough */}
      {isAnswered && (
        <div className={`feedback-alert-box ${isCorrect ? 'correct' : 'wrong'}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '1rem', marginBottom: '4px' }}>
            <span>{isCorrect ? '🎉 Brilliant deduction!' : '💡 Detective Breakdown:'}</span>
          </div>
          <div style={{ fontSize: '0.92rem', lineHeight: 1.45 }}>
            {explanation}
          </div>
        </div>
      )}
    </div>
  );
}
