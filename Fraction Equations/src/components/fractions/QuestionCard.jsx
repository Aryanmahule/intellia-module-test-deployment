import React, { useState, useEffect } from 'react';
import { sounds, unlockAudio } from '../../utils/audio.js';
import FractionModelCanvas from './FractionModelCanvas.jsx';

export default function QuestionCard({ question, onAnswer, disabled = false }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setSelectedOption(null);
    setIsAnswered(false);
    setShowHint(false);
  }, [question]);

  const handleSelect = (option) => {
    if (isAnswered || disabled) return;
    unlockAudio();

    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option === question.answer;
    if (isCorrect) {
      sounds.correct();
    } else {
      sounds.wrong();
    }

    onAnswer(isCorrect, question);
  };

  const getOptionClass = (option) => {
    if (!isAnswered) return '';
    if (option === question.answer) return 'correct-opt';
    if (option === selectedOption && option !== question.answer) return 'wrong-opt';
    return 'faded-opt';
  };

  return (
    <div className="practice-question-card glass-panel">
      {/* Top Meta Bar */}
      <div className="card-meta-bar">
        <span className="question-type-badge tag-purple">
          {question.badge || 'Fraction Quest'}
        </span>
        {question.displayEquation && (
          <span className="equation-preview-badge">
            {question.displayEquation}
          </span>
        )}
      </div>

      {/* Visual Model Canvas if present */}
      {question.model && (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
          <FractionModelCanvas
            type={question.model.type}
            num={question.model.fractions?.[0]?.num || 1}
            den={question.model.fractions?.[0]?.den || 2}
            width={320}
            height={90}
          />
        </div>
      )}

      {/* Question Prompt */}
      <h3 className="question-prompt-text">{question.question}</h3>

      {/* Options Grid */}
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
              <span className="choice-value">{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Hint & Explanation */}
      {isAnswered && (
        <div className={`explanation-box ${selectedOption === question.answer ? 'correct' : 'wrong'}`}>
          <div className="explanation-title">
            {selectedOption === question.answer ? '🎉 Excellent Solution!' : '💡 Step-by-Step Insight:'}
          </div>
          <p className="explanation-text">{question.explanation}</p>
        </div>
      )}

      {!isAnswered && question.hint && (
        <div style={{ textAlign: 'right', marginTop: '10px' }}>
          {showHint ? (
            <div style={{ fontSize: '13px', color: '#facc15', background: 'rgba(250, 204, 21, 0.1)', padding: '6px 12px', borderRadius: '8px', display: 'inline-block' }}>
              💡 {question.hint}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => { sounds.pop(); setShowHint(true); }}
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '13px' }}
            >
              Need a hint? 💡
            </button>
          )}
        </div>
      )}
    </div>
  );
}
