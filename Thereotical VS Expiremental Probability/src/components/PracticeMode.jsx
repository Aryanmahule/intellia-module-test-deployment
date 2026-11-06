import React, { useState, useEffect } from 'react';
import { generateQuestionSet, generateQuestion } from '../utils/patternsQuestionEngine';
import QuestionCard from './QuestionCard';
import { PRACTICE_NARRATION } from '../utils/patternsNarration';
import { sounds, playNarration } from '../utils/audio';

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
    return <div style={{ color: '#fff' }}>Loading Practice Arena...</div>;
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

    // Call prop to update global state and summary metrics!
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
    <div className="phase-container" style={{ alignItems: 'center' }}>
      {/* Top Header */}
      <div className="phase-header-bar" style={{ maxWidth: '960px' }}>
        <div className="phase-title-group">
          <h2><span>🎮</span> Phase 04: Detective Practice Arena</h2>
          <p>Question {currentIndex + 1} of {questions.length} — Earn streak bonuses and solve pattern mysteries!</p>
        </div>
        <div className="mascot-speaker-badge">
          <span className="avatar">🦊</span>
          <span className="speaker-name">Streak: {streak} 🔥</span>
        </div>
      </div>

      <div className="practice-container">
        {/* Stats bar */}
        <div className="practice-stats-bar">
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
              Accuracy: <strong style={{ color: '#ffffff' }}>{sessionScore} / {currentIndex + (isAnswered ? 1 : 0)}</strong>
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--gold-300)' }}>
              Best Streak: <strong>{bestStreak} 🔥</strong>
            </span>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            {questions.map((_, i) => (
              <div
                key={i}
                style={{
                  width: '18px',
                  height: '6px',
                  borderRadius: '3px',
                  background: i === currentIndex
                    ? 'var(--gold-400)'
                    : i < currentIndex
                    ? 'var(--emerald-500)'
                    : 'rgba(255,255,255,0.15)'
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

        {/* Action Row */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px' }}>
          {isAnswered && (
            <button className="btn-gold" onClick={handleNextQuestion}>
              <span>{currentIndex === questions.length - 1 ? 'Finish Practice ➔' : 'Next Question ➔'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
