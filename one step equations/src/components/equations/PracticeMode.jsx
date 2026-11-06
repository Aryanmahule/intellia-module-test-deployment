import React, { useState, useEffect } from 'react';
import QuestionCard from './QuestionCard.jsx';
import FeedbackModal from './FeedbackModal.jsx';
import { generateQuestionSet } from '../../utils/equationsEngine.js';
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
    const qSet = generateQuestionSet(TOTAL_PRACTICE_QUESTIONS);
    setQuestions(qSet);

    // Welcome narration
    narrate('practice_welcome', 'instruction');

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

    // Record stats
    onRecordPractice(correct, currentQuestion);

    if (correct) {
      sounds.correct();
      setScore(s => s + 1);
      const newStreak = sessionStreak + 1;
      setSessionStreak(newStreak);

      if (newStreak >= 3) {
        try {
          confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
        } catch {}
      }

      // Play positive audio line
      const pool = NARRATION.practice.correctPool;
      const pick = pool[Math.floor(Math.random() * pool.length)];
      narrate(pick.id, 'encouragement');
    } else {
      sounds.wrong();
      setSessionStreak(0);

      const pool = NARRATION.practice.wrongPool;
      const pick = pool[Math.floor(Math.random() * pool.length)];
      narrate(pick.id, 'thinking');
    }

    // Open feedback modal
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleNextQuestion = () => {
    sounds.click();
    setModalOpen(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
    } else {
      sounds.celebration();
      onNext('reflect');
    }
  };

  if (!currentQuestion) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '40px' }}>
        <p>Loading questions...</p>
      </div>
    );
  }

  return (
    <div className="glass-card practice-phase-card">
      {/* Top Header Row with Practice HUD */}
      <div className="phase-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div>
          <div className="badge badge-purple" style={{ marginBottom: '4px' }}>
            <span>🎮 Phase 04</span> <span>· Mastery Practice</span>
          </div>
          <h2 style={{ fontSize: '1.45rem', color: 'var(--text-main)', fontFamily: 'var(--font-fun)', fontWeight: 800 }}>
            Algebra Practice Arena
          </h2>
        </div>

        {/* Practice Stats HUD */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="badge badge-gold" style={{ fontSize: '0.85rem' }}>
            <span>🔥 Streak:</span> <span style={{ fontWeight: 800 }}>{sessionStreak}</span>
          </div>
          <div className="badge badge-teal" style={{ fontSize: '0.85rem' }}>
            <span>⭐ Score:</span> <span style={{ fontWeight: 800 }}>{score} / {questions.length}</span>
          </div>
          <div className="badge badge-purple" style={{ fontSize: '0.85rem' }}>
            <span>💎 XP:</span> <span style={{ fontWeight: 800 }}>{state.xp}</span>
          </div>
        </div>
      </div>

      {/* Main Question Card Area */}
      <div className="practice-card-container" style={{ margin: '8px 0', minHeight: '340px' }}>
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

      {/* Footer Navigation Bar */}
      <div className="phase-footer-row" style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Hint or status message */}
        <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', maxWidth: '60%' }}>
          {isAnswered ? (
            <span style={{ color: isCorrect ? 'var(--neon-green-bright)' : 'var(--coral-bright)', fontWeight: 700 }}>
              {isCorrect ? '✓ Correct! Both sides match.' : '✗ Keep both sides balanced.'}
            </span>
          ) : (
            <span>💡 Select an option above. Remember to apply the same inverse operation to both sides!</span>
          )}
        </div>

        {isAnswered && (
          <button className="btn-next-phase" onClick={handleNextQuestion}>
            <span>{currentIndex === questions.length - 1 ? 'Go to Reflection ➔' : 'Next Question ➔'}</span>
          </button>
        )}
      </div>

      {/* Correctness Feedback Modal (Hooks-safe) */}
      <FeedbackModal
        isOpen={modalOpen}
        isCorrect={isCorrect}
        title={isCorrect ? 'Spot On! 🌟' : 'Scale Tilted! 💡'}
        message={isCorrect ? currentQuestion.explanation : (currentQuestion.hint || currentQuestion.explanation)}
        onClose={handleCloseModal}
      />
    </div>
  );
}
