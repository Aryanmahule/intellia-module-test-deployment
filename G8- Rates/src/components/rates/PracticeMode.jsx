import React, { useState, useEffect } from 'react';
import QuestionCard from './QuestionCard.jsx';
import FeedbackModal from './FeedbackModal.jsx';
import { generateQuestionSet } from '../../utils/ratesQuestionEngine.js';
import { PRACTICE_NARRATION } from '../../utils/ratesNarration.js';
import { narrate, sounds, stopNarration, unlockAudio } from '../../utils/audio.js';
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
    unlockAudio();
    const qSet = generateQuestionSet(TOTAL_PRACTICE_QUESTIONS);
    setQuestions(qSet);
    narrate(PRACTICE_NARRATION.welcome.spoken, PRACTICE_NARRATION.welcome.style);

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

    // Call reducer dispatch to record practice stats (Bug #1 fixed)
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

      const correctVoice = Math.random() > 0.5 ? PRACTICE_NARRATION.correct[0] : PRACTICE_NARRATION.correct[1];
      narrate(correctVoice.spoken, correctVoice.style);
    } else {
      sounds.wrong();
      setSessionStreak(0);

      const wrongVoice = Math.random() > 0.5 ? PRACTICE_NARRATION.wrong[0] : PRACTICE_NARRATION.wrong[1];
      narrate(wrongVoice.spoken, wrongVoice.style);
    }
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
      <div className="glass-card practice-phase-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Preparing questions...</p>
      </div>
    );
  }

  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <div className="glass-card practice-phase-card">
      {/* Top Header & Streak Display */}
      <div className="phase-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="badge badge-coral" style={{ marginBottom: '6px' }}>
            <span>🎮 Phase 04</span> <span>• Rate Racer Arena</span>
          </div>
          <h2 style={{ fontSize: '2.1rem', color: 'var(--text-main)', fontFamily: 'var(--font-fun)' }}>
            Practice Racing Challenges
          </h2>
        </div>

        {/* Real-time score & streak stats pills */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <div className="badge badge-gold" style={{ fontSize: '0.95rem' }}>
            <span>🔥 Streak: {sessionStreak}</span>
          </div>
          <div className="badge badge-teal" style={{ fontSize: '0.95rem' }}>
            <span>🎯 Score: {score} / {questions.length}</span>
          </div>
        </div>
      </div>

      {/* Question Card Content Area */}
      <div style={{ margin: '8px 0', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '8px' }}>
        <div style={{ color: 'var(--text-dim)', fontSize: '0.95rem' }}>
          {isAnswered
            ? (isCorrect ? '✓ Correct! XP and streak awarded.' : 'Review the rate breakdown above.')
            : 'Select the option that gives the accurate rate and units.'}
        </div>

        <button
          className="btn-primary"
          onClick={handleNextQuestion}
          disabled={!isAnswered}
          style={{
            opacity: isAnswered ? 1 : 0.4,
            cursor: isAnswered ? 'pointer' : 'not-allowed',
            padding: '12px 32px'
          }}
        >
          <span>{isLastQuestion ? 'Proceed to Reflect' : 'Next Challenge'}</span>
          <span>➔</span>
        </button>
      </div>

      <FeedbackModal
        isOpen={modalOpen}
        isCorrect={isCorrect}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
