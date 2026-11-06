/* =========================================================
   PRACTICE MODE COMPONENT
   Practice Arena with 6 Question Types, Streak Multiplier, & Audio Feedback
   ========================================================= */

import React, { useState, useEffect } from 'react';
import { generateQuestionSet } from '../../utils/probabilityQuestionEngine';
import QuestionCard from './QuestionCard';
import { PRACTICE_NARRATION } from '../../utils/probabilityNarration';
import { sounds, playNarration } from '../../utils/audio';

export default function PracticeMode({ onNextPhase, onRecordPractice, streak = 0, bestStreak = 0 }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);

  useEffect(() => {
    const qSet = generateQuestionSet(6);
    setQuestions(qSet);
    playNarration(PRACTICE_NARRATION.welcome.text, PRACTICE_NARRATION.welcome.style);
  }, []);

  if (!questions || questions.length === 0) {
    return <div style={{ color: '#fff', padding: '20px' }}>Loading Probability Practice Arena...</div>;
  }

  const currentQ = questions[currentIndex];

  const handleSelectOption = (opt) => {
    if (isAnswered) return;

    setSelectedAnswer(opt);
    setIsAnswered(true);

    const correct = opt === currentQ.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      sounds.correct();
      setSessionScore(prev => prev + 1);
      const randomPraise = PRACTICE_NARRATION.correct[Math.floor(Math.random() * PRACTICE_NARRATION.correct.length)];
      playNarration(randomPraise.text, randomPraise.style);
    } else {
      sounds.wrong();
      const randomHint = PRACTICE_NARRATION.wrong[Math.floor(Math.random() * PRACTICE_NARRATION.wrong.length)];
      playNarration(randomHint.text, randomHint.style);
    }

    if (onRecordPractice) {
      onRecordPractice({ isCorrect: correct });
    }
  };

  const handleNextQuestion = () => {
    sounds.click();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setIsCorrect(false);
    } else {
      sounds.fanfare();
      onNextPhase();
    }
  };

  return (
    <div className="phase-container">
      {/* Header bar */}
      <div className="phase-header-bar">
        <div className="phase-title-group">
          <h2><span>🎮</span> Phase 04: Probability Practice Arena</h2>
          <p>Solve theoretical formulas, calculate experimental frequencies, and spot biased games.</p>
        </div>

        {/* Practice Stats Chip: Streak & Score */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className="streak-badge-chip">
            <span>🔥</span>
            <span>{streak} Streak (Best: {bestStreak})</span>
          </div>

          <div className="mascot-speaker-badge">
            <span className="avatar">🦊</span>
            <span className="speaker-name">Score: {sessionScore}/{currentIndex + (isAnswered ? 1 : 0)}</span>
          </div>
        </div>
      </div>

      {/* Progress pill */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
          QUESTION {currentIndex + 1} OF {questions.length}
        </span>
        <div style={{ display: 'flex', gap: '6px' }}>
          {questions.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === currentIndex ? '24px' : '10px',
                height: '8px',
                borderRadius: '4px',
                background: i === currentIndex ? 'var(--gold-400)' : i < currentIndex ? 'var(--teal-400)' : 'rgba(255,255,255,0.15)',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
      </div>

      {/* Question Card */}
      <QuestionCard
        question={currentQ}
        selectedAnswer={selectedAnswer}
        isAnswered={isAnswered}
        isCorrect={isCorrect}
        onSelectOption={handleSelectOption}
      />

      {/* Bottom Action */}
      <div className="phase-bottom-bar">
        <div style={{ color: 'var(--text-dim)', fontSize: '0.95rem' }}>
          {isAnswered
            ? (isCorrect ? '✨ Great job! Press next to continue.' : '💡 Review the explanation above.')
            : '👉 Choose the best answer from options A, B, C, or D.'}
        </div>

        {isAnswered && (
          <button
            className="btn-gold"
            onClick={handleNextQuestion}
          >
            <span>{currentIndex < questions.length - 1 ? 'Next Question →' : 'Complete Arena & Reflect →'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
