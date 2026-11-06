import React, { useReducer, useEffect } from 'react';
import {
  PHASES,
  loadStoredProgress,
  progressReducer
} from './state/equationsProgress.js';
import {
  isNarrationMuted,
  setNarrationMuted,
  stopNarration,
  sounds
} from './utils/audio.js';

import FloatingShapes from './components/equations/FloatingShapes.jsx';
import IntroScreen from './components/equations/IntroScreen.jsx';
import WonderPhase from './components/equations/WonderPhase.jsx';
import StoryPhase from './components/equations/StoryPhase.jsx';
import StationsPhase from './components/equations/StationsPhase.jsx';
import PracticeMode from './components/equations/PracticeMode.jsx';
import ReflectCheck from './components/equations/ReflectCheck.jsx';
import SummaryScreen from './components/equations/SummaryScreen.jsx';

export default function App() {
  const [state, dispatch] = useReducer(progressReducer, null, loadStoredProgress);

  useEffect(() => {
    setNarrationMuted(state.isMuted);
  }, [state.isMuted]);

  const handleAudioToggle = () => {
    sounds.click();
    dispatch({ type: 'TOGGLE_MUTE' });
    if (!state.isMuted) {
      stopNarration();
    }
  };

  const handleHomeClick = () => {
    sounds.click();
    stopNarration();
    dispatch({ type: 'SET_PHASE', payload: 'intro' });
  };

  const handleStepClick = (stepId) => {
    sounds.click();
    stopNarration();
    dispatch({ type: 'SET_PHASE', payload: stepId });
  };

  const handleNextPhase = (nextPhaseId) => {
    stopNarration();
    dispatch({ type: 'COMPLETE_PHASE', payload: state.phase });
    dispatch({ type: 'SET_PHASE', payload: nextPhaseId });
  };

  const handleAddXP = (amount) => {
    dispatch({ type: 'ADD_XP', payload: amount });
  };

  const handleCompleteStation = (payload) => {
    dispatch({ type: 'COMPLETE_STATION', payload });
  };

  const handleRecordPractice = (isCorrect, question) => {
    dispatch({ type: 'RECORD_PRACTICE', payload: { isCorrect, question } });
  };

  const handleSaveReflection = (data) => {
    dispatch({ type: 'SAVE_REFLECTION', payload: data });
  };

  const handleRestart = () => {
    sounds.click();
    stopNarration();
    dispatch({ type: 'RESET_ALL' });
  };

  const isIntro = state.phase === 'intro';

  return (
    <div className="app-root">
      {/* Background Floating Geometric and Algebraic Glyphs */}
      <FloatingShapes />

      {/* Top Header Bar: Visible on all lesson phases and summary */}
      {!isIntro && (
        <header className="top-header-bar">
          {/* Top-Left: Home Pill */}
          <button className="home-btn" onClick={handleHomeClick} aria-label="Go to Home">
            <span>🏠</span> <span>Home</span>
          </button>

          {/* Top-Center Group: 5-Step Journey Bar + Audio Pill */}
          <div className="journey-and-audio-group">
            <nav className="journey-bar" aria-label="Lesson Journey">
              {PHASES.map((step) => {
                const isActive = state.phase === step.id;
                const isCompleted = state.completedPhases.includes(step.id);

                return (
                  <button
                    key={step.id}
                    className={`journey-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                    onClick={() => handleStepClick(step.id)}
                    title={`Go to ${step.label}`}
                  >
                    <span className="step-dot">{step.num}</span>
                    <span>{step.icon}</span>
                    <span>{step.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Audio Pill Button (Matches Reference Screenshot) */}
            <button
              className={`audio-pill-btn ${state.isMuted ? 'muted' : ''}`}
              onClick={handleAudioToggle}
              title={state.isMuted ? 'Unmute Audio' : 'Mute Audio'}
              aria-label={state.isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              <span>{state.isMuted ? '🔇' : '🔊'}</span>
              <span>{state.isMuted ? 'Muted' : 'Voice'}</span>
            </button>
          </div>

          {/* Top-Right: Close Button (Matches Reference Screenshot) */}
          <button
            className="top-close-btn"
            onClick={handleHomeClick}
            aria-label="Close to Home"
            title="Return to Home"
          >
            <span>✕</span>
          </button>
        </header>
      )}

      {/* Main Content Viewport */}
      <main className="main-viewport">
        {state.phase === 'intro' && (
          <IntroScreen
            state={state}
            onStart={(targetPhase) => handleNextPhase(targetPhase || 'wonder')}
          />
        )}

        {state.phase === 'wonder' && (
          <WonderPhase
            state={state}
            onNext={(nextPhase) => handleNextPhase(nextPhase || 'story')}
            onAddXP={handleAddXP}
          />
        )}

        {state.phase === 'story' && (
          <StoryPhase
            state={state}
            onNext={(nextPhase) => handleNextPhase(nextPhase || 'stations')}
            onAddXP={handleAddXP}
          />
        )}

        {state.phase === 'stations' && (
          <StationsPhase
            state={state}
            onNext={(nextPhase) => handleNextPhase(nextPhase || 'practice')}
            onCompleteStation={handleCompleteStation}
            onAddXP={handleAddXP}
          />
        )}

        {state.phase === 'practice' && (
          <PracticeMode
            state={state}
            onNext={(nextPhase) => handleNextPhase(nextPhase || 'reflect')}
            onRecordPractice={handleRecordPractice}
            onAddXP={handleAddXP}
          />
        )}

        {state.phase === 'reflect' && (
          <ReflectCheck
            state={state}
            onNext={(nextPhase) => handleNextPhase(nextPhase || 'summary')}
            onSaveReflection={handleSaveReflection}
            onAddXP={handleAddXP}
          />
        )}

        {state.phase === 'summary' && (
          <SummaryScreen
            state={state}
            onRestart={handleRestart}
            onPracticeMore={() => handleStepClick('practice')}
          />
        )}
      </main>
    </div>
  );
}
