/* =========================================================
   STATE MANAGEMENT & LOCAL STORAGE PERSISTENCE
   Storage Key: intellia_algebraic_patterns_expressions_v1
   ========================================================= */

export const STORAGE_KEY = 'intellia_algebraic_patterns_expressions_v1';

export const PHASES = [
  { id: 'wonder', num: '01', icon: '🔮', label: 'Wonder' },
  { id: 'story', num: '02', icon: '📐', label: 'Story' },
  { id: 'simulate', num: '03', icon: '🧪', label: 'Simulate' },
  { id: 'practice', num: '04', icon: '🎮', label: 'Practice' },
  { id: 'reflect', num: '05', icon: '📓', label: 'Reflect' }
];

export const INITIAL_STATE = {
  currentPhase: 'intro', // 'intro' | 'wonder' | 'story' | 'simulate' | 'practice' | 'reflect' | 'summary'
  unlockedPhases: ['intro', 'wonder'],
  completedPhases: [],
  xp: 0,
  streak: 0,
  bestStreak: 0,
  questionsAnswered: 0,
  correctAnswers: 0,
  stationsCompleted: [], // ['station1', 'station2', 'station3']
  reflectionNotes: {
    ruleCheck: '',
    lessThanTrap: '',
    realWorld: '',
    confidence: 4
  },
  isMuted: false
};

export function loadSavedProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...INITIAL_STATE, ...parsed };
    }
  } catch (e) {
    console.warn('Failed to load progress from localStorage:', e);
  }
  return INITIAL_STATE;
}

export function saveProgress(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save progress to localStorage:', e);
  }
}

export function progressReducer(state, action) {
  let nextState = state;

  switch (action.type) {
    case 'SET_PHASE': {
      const phaseId = action.payload;
      const unlocked = state.unlockedPhases.includes(phaseId)
        ? state.unlockedPhases
        : [...state.unlockedPhases, phaseId];
      nextState = {
        ...state,
        currentPhase: phaseId,
        unlockedPhases: unlocked
      };
      break;
    }

    case 'COMPLETE_PHASE': {
      const phaseId = action.payload;
      const completed = state.completedPhases.includes(phaseId)
        ? state.completedPhases
        : [...state.completedPhases, phaseId];

      // Find next phase to unlock
      const phaseIndex = PHASES.findIndex(p => p.id === phaseId);
      let nextPhaseId = state.currentPhase;
      const unlocked = [...state.unlockedPhases];

      if (phaseIndex !== -1 && phaseIndex < PHASES.length - 1) {
        const nextId = PHASES[phaseIndex + 1].id;
        if (!unlocked.includes(nextId)) unlocked.push(nextId);
        nextPhaseId = nextId;
      } else if (phaseId === 'reflect') {
        if (!unlocked.includes('summary')) unlocked.push('summary');
        nextPhaseId = 'summary';
      }

      nextState = {
        ...state,
        completedPhases: completed,
        unlockedPhases: unlocked,
        currentPhase: nextPhaseId,
        xp: state.xp + (action.xp || 50)
      };
      break;
    }

    case 'RECORD_PRACTICE': {
      const isCorrect = action.payload.isCorrect;
      const newStreak = isCorrect ? state.streak + 1 : 0;
      const bestStreak = Math.max(state.bestStreak, newStreak);
      const earnedXp = isCorrect ? (20 + (newStreak > 2 ? 10 : 0)) : 5;

      nextState = {
        ...state,
        questionsAnswered: state.questionsAnswered + 1,
        correctAnswers: state.correctAnswers + (isCorrect ? 1 : 0),
        streak: newStreak,
        bestStreak: bestStreak,
        xp: state.xp + earnedXp
      };
      break;
    }

    case 'COMPLETE_STATION': {
      const stationId = action.payload;
      const stations = state.stationsCompleted.includes(stationId)
        ? state.stationsCompleted
        : [...state.stationsCompleted, stationId];

      const allStationsDone = ['station1', 'station2', 'station3'].every(s => stations.includes(s));
      const completedPhases = allStationsDone && !state.completedPhases.includes('simulate')
        ? [...state.completedPhases, 'simulate']
        : state.completedPhases;

      nextState = {
        ...state,
        stationsCompleted: stations,
        completedPhases: completedPhases,
        xp: state.xp + (action.xp || 40)
      };
      break;
    }

    case 'SAVE_REFLECTION': {
      nextState = {
        ...state,
        reflectionNotes: {
          ...state.reflectionNotes,
          ...action.payload
        },
        xp: state.xp + 30
      };
      break;
    }

    case 'ADD_XP': {
      nextState = {
        ...state,
        xp: state.xp + (action.payload || 10)
      };
      break;
    }

    case 'TOGGLE_MUTE': {
      nextState = {
        ...state,
        isMuted: !state.isMuted
      };
      break;
    }

    case 'RESET_PROGRESS': {
      nextState = { ...INITIAL_STATE };
      break;
    }

    default:
      return state;
  }

  saveProgress(nextState);
  return nextState;
}
