import React, { useState } from 'react';
import { sounds, unlockAudio } from '../../utils/audio.js';

export default function QuestionCard({ question, onAnswer, disabled = false }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleSelect = (idx) => {
    if (isAnswered || disabled) return;
    unlockAudio();

    setSelectedIndex(idx);
    setIsAnswered(true);

    const isCorrect = idx === question.answerIndex;
    if (isCorrect) {
      sounds.correct();
    } else {
      sounds.wrong();
    }

    onAnswer(isCorrect, question);
  };

  const getOptionClass = (idx) => {
    if (!isAnswered) return '';
    if (idx === question.answerIndex) return 'correct-opt';
    if (idx === selectedIndex && idx !== question.answerIndex) return 'wrong-opt';
    return 'faded-opt';
  };

  return (
    <div className="practice-question-card glass-panel">
      {/* Top Meta Bar */}
      <div className="card-meta-bar">
        <span className="question-type-badge tag-purple">
          {question.badge || 'Bracket Challenge'}
        </span>
        {question.equation && (
          <span className="equation-preview-badge">
            {question.equation}
          </span>
        )}
      </div>

      {/* Question Prompt */}
      <h3 className="question-prompt-text">{question.prompt}</h3>

      {/* Answer Options Grid */}
      <div className="options-choice-grid">
        {question.options.map((opt, idx) => {
          const letter = String.fromCharCode(65 + idx);
          return (
            <button
              key={idx}
              className={`choice-card ${getOptionClass(idx)}`}
              onClick={() => handleSelect(idx)}
              disabled={isAnswered || disabled}
            >
              <span className="choice-letter">{letter}</span>
              <span className="choice-text">{opt}</span>
              {isAnswered && idx === question.answerIndex && (
                <span className="choice-status-icon">✓</span>
              )}
              {isAnswered && idx === selectedIndex && idx !== question.answerIndex && (
                <span className="choice-status-icon">✗</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation Box */}
      {isAnswered && (
        <div className={`explanation-callout ${selectedIndex === question.answerIndex ? 'exp-correct' : 'exp-wrong'}`}>
          <div className="exp-icon">
            {selectedIndex === question.answerIndex ? '🎉' : '💡'}
          </div>
          <div className="exp-body">
            <span className="exp-status-title">
              {selectedIndex === question.answerIndex ? 'Spot on!' : 'Step-by-Step Guidance:'}
            </span>
            <p className="exp-text">{question.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
