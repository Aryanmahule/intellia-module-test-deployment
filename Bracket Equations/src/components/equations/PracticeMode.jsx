import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { generateQuestionSet } from '../../utils/bracketsQuestionEngine.js';
import { PRACTICE_NARRATION } from '../../utils/bracketsNarration.js';
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
    narrate(PRACTICE_NARRATION.intro, 'statement');
  }, []);

  const currentQ = questions[currentIndex];

  const handleAnswer = (isCorrect, question) => {
    setAnsweredState(true);

    onRecordPractice(isCorrect, question);

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setCorrectCount(prev => prev + 1);
      onAddXP?.(20 + newStreak * 5);

      if (newStreak >= 3) {
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.8 }
          });
        } catch {
          // ignore
        }
      }

      const phrases = PRACTICE_NARRATION.correct;
      const pick = phrases[Math.floor(Math.random() * phrases.length)];
      narrate(pick, 'encouragement');
    } else {
      setStreak(0);
      const phrases = PRACTICE_NARRATION.wrong;
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
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
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
          <h2 className="practice-title">Mastering Bracket Equations</h2>
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
