import React, { useReducer, useEffect } from 'react';
import {
  PHASES,
  loadStoredProgress,
  progressReducer
} from './state/twoStepProgress.js';
import {
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

  const handleCompleteStation = (stationKey) => {
    dispatch({ type: 'COMPLETE_STATION', payload: stationKey });
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
      {/* Background Floating Geometric & Algebraic Watermarks */}
      <FloatingShapes />

      {/* Top Header Bar: Visible on all lesson phases and summary */}
      {!isIntro && (
        <header className="top-header-bar">
          {/* Top-Left: Home Pill */}
          <button className="home-btn" onClick={handleHomeClick} aria-label="Go to Home">
            <span>🏠</span> <span>Home</span>
          </button>

          {/* Top-Center Group: 5-Step Journey Bar + Audio Mute Pill */}
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
                    title={`${step.num} ${step.label}`}
                  >
                    <span className="step-dot">
                      {isCompleted ? '✓' : step.num}
                    </span>
                    <span className="step-icon">{step.icon}</span>
                    <span className="step-label">{step.label}</span>
                  </button>
                );
              })}

              {/* Mute Button located right inside journey bar */}
              <button
                className={`audio-toggle-btn ${state.isMuted ? 'muted' : 'unmuted'}`}
                onClick={handleAudioToggle}
                aria-label={state.isMuted ? 'Unmute Audio' : 'Mute Audio'}
                title={state.isMuted ? 'Unmute Audio' : 'Mute Audio'}
              >
                <span className="audio-icon">{state.isMuted ? '🔇' : '🔊'}</span>
                <span className="audio-label">{state.isMuted ? 'Muted' : 'Audio'}</span>
              </button>
            </nav>
          </div>

          {/* Top-Right: Close Button */}
          <button
            className="top-close-btn"
            onClick={handleHomeClick}
            aria-label="Exit to Home"
            title="Exit Lesson"
          >
            <span>✖</span>
          </button>
        </header>
      )}

      {/* Main Container - Fitted to Screen without Page Scroll */}
      <main className={`app-container ${isIntro ? 'intro-layout' : 'lesson-layout'}`}>
        {state.phase === 'intro' && (
          <IntroScreen
            state={state}
            onStart={(targetPhase) => dispatch({ type: 'SET_PHASE', payload: targetPhase })}
          />
        )}

        {state.phase === 'wonder' && (
          <WonderPhase
            onNext={() => handleNextPhase('story')}
            onAddXP={handleAddXP}
          />
        )}

        {state.phase === 'story' && (
          <StoryPhase
            onNext={() => handleNextPhase('stations')}
            onAddXP={handleAddXP}
          />
        )}

        {state.phase === 'stations' && (
          <StationsPhase
            stationsProgress={state.stationsProgress}
            onCompleteStation={handleCompleteStation}
            onNext={() => handleNextPhase('practice')}
            onAddXP={handleAddXP}
          />
        )}

        {state.phase === 'practice' && (
          <PracticeMode
            onRecordPractice={handleRecordPractice}
            onNext={() => handleNextPhase('reflect')}
            onAddXP={handleAddXP}
          />
        )}

        {state.phase === 'reflect' && (
          <ReflectCheck
            onSaveReflection={handleSaveReflection}
            onNext={() => handleNextPhase('summary')}
            onAddXP={handleAddXP}
          />
        )}

        {state.phase === 'summary' && (
          <SummaryScreen
            state={state}
            onRestart={handleRestart}
            onPracticeAgain={() => dispatch({ type: 'SET_PHASE', payload: 'practice' })}
          />
        )}
      </main>
    </div>
  );
}
