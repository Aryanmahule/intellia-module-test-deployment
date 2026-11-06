import React, { useState, useEffect } from 'react';
import { generateQuestionSet } from '../../utils/twoStepQuestionEngine.js';
import { NARRATION } from '../../utils/twoStepNarration.js';
import { narrate, sounds, unlockAudio } from '../../utils/audio.js';
import QuestionCard from './QuestionCard.jsx';

export default function PracticeMode({ onRecordPractice, onNext, onAddXP }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answeredState, setAnsweredState] = useState(false);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    // Generate fresh set of 6 varied questions
    setQuestions(generateQuestionSet(6));
    narrate(NARRATION.practice.intro, 'statement');
  }, []);

  const currentQ = questions[currentIndex];

  const handleAnswer = (isCorrect, question) => {
    setAnsweredState(true);

    // FIX BUG #1: Fire onRecordPractice so App state records it!
    onRecordPractice(isCorrect, question);

    if (isCorrect) {
      setStreak(prev => prev + 1);
      setCorrectCount(prev => prev + 1);
      onAddXP?.(20 + streak * 5);

      const phrases = NARRATION.practice.correct;
      const pick = phrases[Math.floor(Math.random() * phrases.length)];
      narrate(pick, 'encouragement');
    } else {
      setStreak(0);
      const phrases = NARRATION.practice.wrong;
      const pick = phrases[Math.floor(Math.random() * phrases.length)];
      narrate(pick, 'thinking');
    }
  };

  const handleNextQuestion = () => {
    unlockAudio();
    sounds.click();
    setAnsweredState(false);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      sounds.levelup();
      onNext();
    }
  };

  if (!currentQ) {
    return <div className="phase-container loading-text">Loading Practice Questions...</div>;
  }

  const isLast = currentIndex === questions.length - 1;

  return (
    <div className="phase-container practice-screen">
      <div className="practice-header-bar">
        <div className="practice-meta-left">
          <span className="phase-badge">Phase 04 • Practice Arena</span>
          <h2 className="practice-title">Mastering Two-Step Equations</h2>
        </div>

        <div className="practice-stats-right">
          <div className="stat-pill streak-pill">
            <span className="stat-icon">🔥</span>
            <span className="stat-val">{streak}</span>
            <span className="stat-label">Streak</span>
          </div>
          <div className="stat-pill score-pill">
            <span className="stat-icon">⭐</span>
            <span className="stat-val">{correctCount} / {questions.length}</span>
            <span className="stat-label">Score</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="practice-progress-track">
        <div
          className="practice-progress-fill"
          style={{ width: `${((currentIndex + (answeredState ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      {/* Main Question Arena */}
      <div className="practice-card-wrapper">
        <QuestionCard
          key={currentIndex}
          question={currentQ}
          onAnswer={handleAnswer}
        />
      </div>

      {/* Bottom Bar */}
      <div className="phase-bottom-nav">
        <span className="practice-question-counter">
          Question {currentIndex + 1} of {questions.length}
        </span>

        {answeredState && (
          <button
            className="action-btn-primary pulse-ready"
            onClick={handleNextQuestion}
          >
            <span>{isLast ? 'Complete & Go to Reflect 📓' : 'Next Question ➡️'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
