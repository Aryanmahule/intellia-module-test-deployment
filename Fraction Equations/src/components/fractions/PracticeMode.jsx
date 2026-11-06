import React, { useState, useEffect } from 'react';
import { generateQuestionSet } from '../../utils/fractionsQuestionEngine.js';
import { sounds, unlockAudio } from '../../utils/audio.js';
import QuestionCard from './QuestionCard.jsx';

export default function PracticeMode({ onRecordPractice, onNext, onAddXP }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answeredState, setAnsweredState] = useState(false);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    setQuestions(generateQuestionSet(8));
  }, []);

  const currentQ = questions[currentIndex];

  const handleAnswer = (isCorrect, question) => {
    setAnsweredState(true);
    onRecordPractice?.(isCorrect, question);

    if (isCorrect) {
      setStreak(prev => prev + 1);
      setCorrectCount(prev => prev + 1);
      onAddXP?.(20 + streak * 5);
    } else {
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    unlockAudio();
    sounds.click();
    setAnsweredState(false);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      sounds.celebration();
      onNext();
    }
  };

  if (!currentQ) {
    return <div className="phase-container loading-text">Loading Practice Questions...</div>;
  }

  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="practice-screen-layout">
      {/* Top Practice Meta Panel */}
      <div className="practice-top-panel">
        <div className="practice-meta-left">
          <span className="practice-progress-pill">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="streak-counter-pill">
            🔥 {streak} Streak
          </span>
        </div>

        <div className="practice-meta-right">
          <span className="score-counter-pill">
            ⭐ {correctCount} / {currentIndex + (answeredState ? 1 : 0)} Correct
          </span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="practice-progress-bar">
        <div
          className="practice-progress-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Question Card */}
      <div className="practice-card-container">
        <QuestionCard
          question={currentQ}
          onAnswer={handleAnswer}
          disabled={answeredState}
        />
      </div>

      {/* Bottom Nav Action */}
      <div className="practice-nav-bar">
        {answeredState && (
          <button className="btn-gold" onClick={handleNextQuestion}>
            <span>{currentIndex === questions.length - 1 ? 'Complete Practice & Reflect 🎗️' : 'Next Challenge →'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
