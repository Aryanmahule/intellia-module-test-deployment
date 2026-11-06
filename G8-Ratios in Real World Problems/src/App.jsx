import React, { useReducer, useState } from 'react';
import {
  PHASES,
  INITIAL_STATE,
  loadSavedProgress,
  progressReducer
} from './state/ratiosProgress';
import { sounds, setNarrationMuted, stopNarration } from './utils/audio';

// Components
import IntroScreen from './components/IntroScreen';
import WonderPhase from './components/WonderPhase';
import StoryPhase from './components/StoryPhase';
import StationsPhase from './components/StationsPhase';
import PracticeMode from './components/PracticeMode';
import ReflectCheck from './components/ReflectCheck';
import SummaryScreen from './components/SummaryScreen';
import FeedbackModal from './components/FeedbackModal';
import FloatingShapes from './components/FloatingShapes';

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
    <div className="app-root-container">
      {/* Background Floating Ambient Numbers & Ratio Watermarks */}
      <FloatingShapes />

      {/* Top Header Bar (Visible on all phases except intro) */}
      {!isIntro && (
        <header className="top-header-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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

          {/* Journey Steps Navigation Group */}
          <div className="journey-and-audio-group">
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
                      {isCompleted && <span className="step-check">✓</span>}
                    </button>

                    {idx < PHASES.length - 1 && (
                      <div
                        className={`journey-connector ${isCompleted ? 'filled' : ''}`}
                      />
                    )}
                  </React.Fragment>
                );
              })}

              {/* Audio Mute Toggle Button styled exactly like reference pill */}
              <button
                className={`audio-toggle-btn ${state.isMuted ? 'muted' : ''}`}
                onClick={handleToggleMute}
                title={state.isMuted ? 'Unmute Audio & Narration' : 'Mute Audio & Narration'}
                aria-label="Toggle Audio"
              >
                <span>{state.isMuted ? '🔇' : '🔊'}</span>
                <span>{state.isMuted ? 'Muted' : 'Sound'}</span>
              </button>
            </nav>

            {/* Quick Reference Help Button */}
            <button
              className="quick-help-btn"
              onClick={() => { sounds.click(); setIsHelpOpen(true); }}
              title="Quick Ratio Formula Cheat Sheet"
            >
              📖
            </button>

            {/* Top-right close button (cyan rounded square like in reference image) */}
            <button
              className="close-topbar-btn"
              onClick={() => handleNavigate('intro')}
              title="Close and Return to Home"
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

      {/* Quick Reference Modal */}
      <FeedbackModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
