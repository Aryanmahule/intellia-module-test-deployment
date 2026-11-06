import React, { useReducer, useEffect, useState } from 'react';
import {
  PHASES,
  loadStoredProgress,
  progressReducer
} from './state/bracketsProgress.js';
import {
  setNarrationMuted,
  stopNarration,
  sounds,
  unlockAudio
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
    unlockAudio();
    sounds.click();
    dispatch({ type: 'TOGGLE_MUTE' });
    if (!state.isMuted) {
      stopNarration();
    }
  };

  const handleHomeClick = () => {
    unlockAudio();
    sounds.click();
    stopNarration();
    dispatch({ type: 'SET_PHASE', payload: 'intro' });
  };

  const handleStepClick = (stepId) => {
    unlockAudio();
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
    unlockAudio();
    sounds.click();
    stopNarration();
    dispatch({ type: 'RESET_ALL' });
  };

  const isIntro = state.phase === 'intro';

  return (
    <div className="app-root" style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Background Floating Geometric & Algebraic Watermarks */}
      <FloatingShapes />

      {/* Top Header Bar: Visible on all lesson phases and summary (Matches Image 2) */}
      {!isIntro && (
        <header className="top-header-bar">
          {/* Top-Left: Home Pill + XP Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="home-btn" onClick={handleHomeClick} aria-label="Go to Home">
              <span>🏠</span> <span>Home</span>
            </button>
            <div className="xp-badge-chip">
              <span>⭐</span>
              <span>{state.xp} XP</span>
            </div>
          </div>

          {/* Top-Center Group: 5-Step Journey Bar + Audio Mute Button (Matches Image 2) */}
          <div className="journey-and-audio-group">
            <nav className="journey-bar" aria-label="Lesson Journey">
              {PHASES.map((step, idx) => {
                const isActive = state.phase === step.id;
                const isCompleted = state.completedPhases.includes(step.id);

                return (
                  <React.Fragment key={step.id}>
                    <button
                      className={`journey-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                      onClick={() => handleStepClick(step.id)}
                      title={`${step.num} ${step.label}`}
                    >
                      <span className="step-num">{step.num}</span>
                      <span className="step-dot" />
                      <span className="step-icon">{step.icon}</span>
                      <span className="step-label">{step.label}</span>
                      {isCompleted && <span style={{ fontSize: '0.8rem', marginLeft: '2px' }}>✓</span>}
                    </button>

                    {idx < PHASES.length - 1 && (
                      <div
                        className={`journey-connector ${
                          state.completedPhases.includes(step.id) ? 'filled' : ''
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </nav>

            {/* Mute Button located right beside journey bar (Matches Image 2) */}
            <button
              className={`audio-toggle-btn ${state.isMuted ? 'muted' : ''}`}
              onClick={handleAudioToggle}
              aria-label={state.isMuted ? 'Unmute Audio' : 'Mute Audio'}
              title={state.isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {state.isMuted ? '🔇' : '🔊'}
            </button>
          </div>

          {/* Top-Right: Cyan Square Close Button (Matches Image 1 & Image 2) */}
          <button
            className="close-intro-btn"
            style={{ position: 'static' }}
            onClick={handleHomeClick}
            aria-label="Exit to Home"
            title="Exit Lesson"
          >
            ✕
          </button>
        </header>
      )}

      {/* Main Viewport Container */}
      <main className="main-phase-viewport">
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
