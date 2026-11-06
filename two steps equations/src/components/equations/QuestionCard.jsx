import React, { useState } from 'react';
import { sounds, unlockAudio } from '../../utils/audio.js';

export default function QuestionCard({ question, onAnswer, disabled = false }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleSelect = (option) => {
    if (isAnswered || disabled) return;
    unlockAudio();

    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option === question.correctAnswer;
    if (isCorrect) {
      sounds.correct();
    } else {
      sounds.wrong();
    }

    onAnswer(isCorrect, question);
  };

  const getOptionClass = (option) => {
    if (!isAnswered) return '';
    if (option === question.correctAnswer) return 'correct-opt';
    if (option === selectedOption && option !== question.correctAnswer) return 'wrong-opt';
    return 'faded-opt';
  };

  return (
    <div className="practice-question-card glass-panel">
      {/* Top Meta Bar */}
      <div className="card-meta-bar">
        <span className={`question-type-badge tag-${question.typeColor || 'purple'}`}>
          {question.typeLabel || 'Challenge'}
        </span>
        {question.equation && (
          <span className="equation-preview-badge">
            {question.displayEquation || `${question.equation.a}x = ${question.equation.c}`}
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
              className={`choice-card ${getOptionClass(opt)}`}
              onClick={() => handleSelect(opt)}
              disabled={isAnswered || disabled}
            >
              <span className="choice-letter">{letter}</span>
              <span className="choice-text">{opt}</span>
              {isAnswered && opt === question.correctAnswer && (
                <span className="choice-status-icon">✓</span>
              )}
              {isAnswered && opt === selectedOption && opt !== question.correctAnswer && (
                <span className="choice-status-icon">✗</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation Box */}
      {isAnswered && (
        <div className={`explanation-callout ${selectedOption === question.correctAnswer ? 'exp-correct' : 'exp-wrong'}`}>
          <div className="exp-icon">
            {selectedOption === question.correctAnswer ? '🎉' : '💡'}
          </div>
          <div className="exp-body">
            <span className="exp-status-title">
              {selectedOption === question.correctAnswer ? 'Spot on!' : 'Keep this in mind:'}
            </span>
            <p className="exp-text">{question.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
