import React from 'react';
import { QUESTION_TYPES } from '../utils/ratiosQuestionEngine';
import RatioBarCanvas from './RatioBarCanvas';

export default function QuestionCard({
  question,
  userAnswer,
  feedback,
  onSelectOption
}) {
  const typeInfo = QUESTION_TYPES[question.type] || {
    label: 'Ratio Challenge',
    color: '#00e5ff'
  };

  return (
    <div className="practice-question-card">
      {/* Card Header with Question Type Badge */}
      <div className="question-card-header">
        <span
          className="question-type-badge"
          style={{
            borderColor: typeInfo.color,
            color: typeInfo.color,
            boxShadow: `0 0 12px ${typeInfo.color}33`
          }}
        >
          {typeInfo.label}
        </span>
      </div>

      {/* Visual Canvas Thumbnail if visual ratio is available */}
      {question.visualRatio && (
        <div className="question-mini-canvas">
          <RatioBarCanvas
            mode={question.type === 'shareRatio' ? 'bar' : 'parts'}
            ratio={question.visualRatio}
            labels={question.visualLabels || ['Part A', 'Part B']}
            total={question.total || 72}
          />
        </div>
      )}

      {/* Question Prompt */}
      <h3 className="practice-prompt-text">
        {question.prompt}
      </h3>

      {/* Options Grid */}
      <div className="practice-options-grid">
        {question.options.map((opt, i) => {
          const isSelected = userAnswer === opt;
          const isCorrect = opt === question.correctAnswer;
          let btnClass = 'practice-option-btn';

          if (feedback) {
            if (isCorrect) btnClass += ' opt-correct';
            else if (isSelected) btnClass += ' opt-wrong';
          } else if (isSelected) {
            btnClass += ' opt-selected';
          }

          return (
            <button
              key={i}
              className={btnClass}
              onClick={() => !feedback && onSelectOption(opt)}
              disabled={!!feedback}
            >
              <span className="opt-letter">{String.fromCharCode(65 + i)}</span>
              <span className="opt-text">{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Explanation Banner */}
      {feedback && (
        <div className={`practice-explanation-banner ${feedback.isCorrect ? 'success' : 'hint'}`}>
          <div className="banner-title">
            {feedback.isCorrect ? '✨ Excellent!' : '💡 Think About It:'}
          </div>
          <p className="banner-text">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
