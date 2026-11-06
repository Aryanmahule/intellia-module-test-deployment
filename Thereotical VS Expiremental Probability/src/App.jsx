/* =========================================================
   APP MAIN COMPONENT — PROBABILITY QUEST
   Grade 7: Theoretical vs Experimental Probability
   Features:
   - Identical UI to reference designs
   - Top Header Bar: Home pill, XP counter, 5-Step Journey Bar, Audio Mute Toggle, Cheat Sheet Modal, Close Button
   - Full State & Persistence integration
   ========================================================= */

import React, { useReducer, useState } from 'react';
import {
  PHASES,
  loadSavedProgress,
  progressReducer
} from './state/probabilityProgress';
import { sounds, setNarrationMuted, stopNarration } from './utils/audio';

// Probability Components
import IntroScreen from './components/probability/IntroScreen';
import WonderPhase from './components/probability/WonderPhase';
import StoryPhase from './components/probability/StoryPhase';
import StationsPhase from './components/probability/StationsPhase';
import PracticeMode from './components/probability/PracticeMode';
import ReflectCheck from './components/probability/ReflectCheck';
import SummaryScreen from './components/probability/SummaryScreen';
import FeedbackModal from './components/probability/FeedbackModal';

export default function App() {
  const [state, dispatch] = useReducer(progressReducer, null, loadSavedProgress);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const handleNavigate = (phaseId) => {
    sounds.click();
    stopNarration();
    dispatch({ type: 'SET_PHASE', payload: phaseId });
  };

  const handleToggleMute = () => {
    const newMuted = !state.isMuted;
    setNarrationMuted(newMuted);
    dispatch({ type: 'TOGGLE_MUTE' });
  };

  const handleAddXp = (amount) => {
    dispatch({ type: 'ADD_XP', payload: amount });
  };

  const handleRecordPractice = (result) => {
    dispatch({ type: 'RECORD_PRACTICE', payload: result });
  };

  const handleCompleteStation = (stationId) => {
    dispatch({ type: 'COMPLETE_STATION', payload: stationId });
  };

  const handleSaveReflection = (notes) => {
    dispatch({ type: 'SAVE_REFLECTION', payload: notes });
  };

  const handleReset = () => {
    dispatch({ type: 'RESET_PROGRESS' });
  };

  const isIntro = state.currentPhase === 'intro';

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Top Header Bar (Visible on all phases except intro) */}
      {!isIntro && (
        <header className="top-header-bar">
          {/* Left Group: Home & XP Badge */}
          <div className="header-left-group">
            <button
              className="home-btn"
              onClick={() => handleNavigate('intro')}
              title="Return to Introduction"
            >
              <span>🏠</span>
              <span>Home</span>
            </button>

            <div className="xp-badge-chip">
              <span>⚡</span>
              <span>{state.xp} XP</span>
            </div>
          </div>

          {/* Center Group: Journey Steps Navigation Bar (Top-Center Position) */}
          <div className="header-center-group">
            <nav className="journey-bar" aria-label="Learning Journey">
              {PHASES.map((phase, idx) => {
                const isActive = state.currentPhase === phase.id;
                const isCompleted = state.completedPhases.includes(phase.id);

                return (
                  <React.Fragment key={phase.id}>
                    <button
                      className={`journey-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                      onClick={() => handleNavigate(phase.id)}
                      title={`Go to ${phase.label}`}
                    >
                      <span className="step-num">{phase.num}</span>
                      <span className="step-dot" />
                      <span>{phase.icon}</span>
                      <span>{phase.label}</span>
                      {isCompleted && <span style={{ fontSize: '0.8rem', marginLeft: '2px' }}>✓</span>}
                    </button>

                    {idx < PHASES.length - 1 && (
                      <div
                        className={`journey-connector ${isCompleted ? 'filled' : ''}`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </nav>
          </div>

          {/* Right Group: Cheat Sheet, Audio Toggle & Close */}
          <div className="header-right-group">
            {/* Quick Reference Help Button */}
            <button
              className="audio-toggle-btn"
              onClick={() => { sounds.click(); setIsHelpOpen(true); }}
              title="Quick Probability Cheat Sheet"
            >
              <span>⚡</span>
              <span>Cheat Sheet</span>
            </button>

            {/* Audio Mute Toggle */}
            <button
              className={`audio-toggle-btn ${state.isMuted ? 'muted' : ''}`}
              onClick={handleToggleMute}
              title={state.isMuted ? 'Unmute Audio & Narration' : 'Mute Audio & Narration'}
              aria-label="Toggle Audio"
            >
              {state.isMuted ? '🔇 Muted' : '🔊 Audio'}
            </button>

            {/* Close / Return Button */}
            <button
              className="close-header-btn"
              onClick={() => handleNavigate('intro')}
              title="Return to Title Screen"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </header>
      )}

      {/* Main Phase Viewport */}
      <main className="main-phase-viewport">
        {state.currentPhase === 'intro' && (
          <IntroScreen onStartJourney={() => handleNavigate('wonder')} />
        )}

        {state.currentPhase === 'wonder' && (
          <WonderPhase
            onNextPhase={() => {
              dispatch({ type: 'COMPLETE_PHASE', payload: 'wonder', xp: 50 });
            }}
            onAddXp={handleAddXp}
          />
        )}

        {state.currentPhase === 'story' && (
          <StoryPhase
            onNextPhase={() => {
              dispatch({ type: 'COMPLETE_PHASE', payload: 'story', xp: 50 });
            }}
            onAddXp={handleAddXp}
          />
        )}

        {state.currentPhase === 'simulate' && (
          <StationsPhase
            completedStations={state.stationsCompleted}
            onCompleteStation={handleCompleteStation}
            onNextPhase={() => {
              dispatch({ type: 'COMPLETE_PHASE', payload: 'simulate', xp: 50 });
            }}
            onAddXp={handleAddXp}
          />
        )}

        {state.currentPhase === 'practice' && (
          <PracticeMode
            streak={state.streak}
            bestStreak={state.bestStreak}
            onRecordPractice={handleRecordPractice}
            onNextPhase={() => {
              dispatch({ type: 'COMPLETE_PHASE', payload: 'practice', xp: 50 });
            }}
          />
        )}

        {state.currentPhase === 'reflect' && (
          <ReflectCheck
            initialNotes={state.reflectionNotes}
            onSaveReflection={handleSaveReflection}
            onNextPhase={() => {
              dispatch({ type: 'COMPLETE_PHASE', payload: 'reflect', xp: 50 });
            }}
          />
        )}

        {state.currentPhase === 'summary' && (
          <SummaryScreen
            state={state}
            onNavigatePhase={handleNavigate}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Quick Reference Cheat Sheet Modal */}
      <FeedbackModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
