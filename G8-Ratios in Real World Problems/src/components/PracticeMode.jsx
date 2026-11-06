import React, { useState, useEffect } from 'react';
import QuestionCard from './QuestionCard';
import { generateQuestion } from '../utils/ratiosQuestionEngine';
import { sounds, playNarration } from '../utils/audio';
import confetti from 'canvas-confetti';

export default function PracticeMode({
  streak = 0,
  bestStreak = 0,
  onRecordPractice,
  onNextPhase
}) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(() => generateQuestion(0));
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [answeredCount, setAnsweredCount] = useState(0);

  useEffect(() => {
    playNarration(
      'Welcome to Practice Mode! Test your skills on real-world ratio problems. Remember: add the parts, find one part, and scale!',
      'instruction'
    );
  }, []);

  const handleSelectOption = (opt) => {
    sounds.click();
    setUserAnswer(opt);
    const isCorrect = opt === currentQuestion.correctAnswer;
    setAnsweredCount(prev => prev + 1);

    // Call parent reducer handler (Fixes Bug #1 from plan!)
    onRecordPractice({ isCorrect });

    if (isCorrect) {
      sounds.correct();
      if ((streak + 1) % 3 === 0) {
        try {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
        } catch (e) {}
      }
      const praiseLines = [
        'Outstanding! You nailed the ratio calculations!',
        'Brilliant work! You scaled the parts accurately!'
      ];
      const praise = praiseLines[Math.floor(Math.random() * praiseLines.length)];
      playNarration(praise, 'celebration');
      setFeedback({ isCorrect: true, text: praise });
    } else {
      sounds.wrong();
      const hintLines = [
        'Not quite. Add up the parts, find the value of one part, then scale to the amount you need.',
        'Remember, ratios change by multiplying or dividing both parts, never by adding!'
      ];
      const hint = hintLines[Math.floor(Math.random() * hintLines.length)];
      playNarration(hint, 'thinking');
      setFeedback({ isCorrect: false, text: hint });
    }
  };

  const handleNext = () => {
    sounds.click();
    const nextIdx = questionIndex + 1;
    setQuestionIndex(nextIdx);
    setCurrentQuestion(generateQuestion(nextIdx));
    setUserAnswer('');
    setFeedback(null);
  };

  return (
    <div className="practice-mode-container">
      {/* Top Practice Bar: Streak & Answer Count */}
      <div className="practice-header-bar">
        <div className="practice-stats-group">
          <div className="streak-chip">
            <span>🔥 Streak: {streak}</span>
            {bestStreak > 0 && <span className="best-sub"> (Best: {bestStreak})</span>}
          </div>
          <div className="counter-chip">
            <span>Question {questionIndex + 1}</span>
          </div>
        </div>

        {answeredCount >= 5 && (
          <button
            className="btn-gold-sm"
            onClick={() => { sounds.fanfare(); onNextPhase(); }}
            title="Complete practice and move to Reflection"
          >
            Reflect on Discoveries ➔
          </button>
        )}
      </div>

      {/* Main Question Card Area */}
      <div className="practice-card-viewport">
        <QuestionCard
          question={currentQuestion}
          userAnswer={userAnswer}
          feedback={feedback}
          onSelectOption={handleSelectOption}
        />
      </div>

      {/* Next Question / Finish Button */}
      {feedback && (
        <div className="practice-footer-bar">
          <button
            className="btn-gold"
            onClick={handleNext}
            style={{ padding: '12px 36px' }}
          >
            Next Question ➔
          </button>
        </div>
      )}
    </div>
  );
}
