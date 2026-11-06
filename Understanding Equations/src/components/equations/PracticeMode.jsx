import React, { useState, useEffect } from 'react';
import QuestionCard from './QuestionCard.jsx';
import FeedbackModal from './FeedbackModal.jsx';
import { generateQuestionSet } from '../../utils/equationsQuestionEngine.js';
import { NARRATION } from '../../utils/equationsNarration.js';
import { narrate, sounds, stopNarration } from '../../utils/audio.js';
import confetti from 'canvas-confetti';

const TOTAL_PRACTICE_QUESTIONS = 6;

export default function PracticeMode({ state, onNext, onRecordPractice, onAddXP }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [sessionStreak, setSessionStreak] = useState(0);

  // Modal feedback
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // Generate fresh 6-question set
    const qSet = generateQuestionSet(TOTAL_PRACTICE_QUESTIONS);
    setQuestions(qSet);

    // Welcome narration
    narrate(NARRATION.practice.welcome, 'instruction');

    return () => {
      stopNarration();
    };
  }, []);

  const currentQuestion = questions[currentIndex];

  const handleSelectOption = (option) => {
    if (isAnswered || !currentQuestion) return;

    setSelectedOption(option);
    setIsAnswered(true);

    const correct = String(option).trim() === String(currentQuestion.correctAnswer).trim();
    setIsCorrect(correct);

    // Call reducer dispatch to record practice stats (Fixes Bug #1)
    onRecordPractice(correct, currentQuestion);

    if (correct) {
      sounds.correct();
      setScore(s => s + 1);
      const newStreak = sessionStreak + 1;
      setSessionStreak(newStreak);

      if (newStreak >= 3) {
        try {
          confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
        } catch {
          // ignore
        }
      }

      // Play positive audio line
      const correctVoice = Math.random() > 0.5 ? NARRATION.practice.correct[0] : NARRATION.practice.correct[1];
      narrate(correctVoice, 'encouragement');
    } else {
      sounds.wrong();
      setSessionStreak(0);

      // Play coaching audio line
      const wrongVoice = Math.random() > 0.5 ? NARRATION.practice.wrong[0] : NARRATION.practice.wrong[1];
      narrate(wrongVoice, 'thinking');
    }

    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleNextQuestion = () => {
    sounds.click();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
    } else {
      sounds.celebration();
      onNext();
    }
  };

  if (!currentQuestion) {
    return (
      <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '1.4rem', color: 'var(--text-muted)' }}>Loading practice questions...</div>
      </div>
    );
  }

  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <div className="glass-card practice-phase-card">
      <FeedbackModal
        isOpen={modalOpen}
        isCorrect={isCorrect}
        title={isCorrect ? 'Outstanding! 🌟' : 'Keep Going! 💡'}
        message={currentQuestion.explanation}
        onClose={handleModalClose}
      />

      {/* Top Header / Progress Stats */}
      <div className="practice-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="badge badge-purple">
            <span>🎮 Phase 04</span> <span>· Practice Challenge</span>
          </div>
          <div style={{ fontSize: '1.15rem', color: 'var(--text-muted)', fontWeight: 700 }}>
            Question {currentIndex + 1} / {questions.length}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="stats-pill" style={{ color: 'var(--gold-bright)' }}>
            <span>🔥 Streak:</span> <strong>{sessionStreak}</strong>
          </div>
          <div className="stats-pill" style={{ color: 'var(--neon-green)' }}>
            <span>✓ Score:</span> <strong>{score}/{questions.length}</strong>
          </div>
        </div>
      </div>

      {/* Main Question Display */}
      <div className="practice-body" style={{ flex: 1 }}>
        <QuestionCard
          question={currentQuestion}
          index={currentIndex}
          total={questions.length}
          selectedOption={selectedOption}
          onSelectOption={handleSelectOption}
          isAnswered={isAnswered}
          isCorrect={isCorrect}
        />
      </div>

      {/* Bottom Action Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
        <div style={{ color: 'var(--text-dim)', fontSize: '1.05rem', fontWeight: 600 }}>
          {isAnswered ? (isCorrect ? '✓ Great work! Advance to next.' : '💡 Review the explanation above.') : 'Select one of the 4 options above.'}
        </div>

        {isAnswered && (
          <button className="btn btn-gold" onClick={handleNextQuestion}>
            <span>{isLastQuestion ? 'Complete Practice & Reflect 📓' : 'Next Question ▶'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
