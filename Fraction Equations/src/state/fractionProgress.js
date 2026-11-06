// State management and LocalStorage persistence for Fraction Equations module
// Key: intellia_fraction_equations_v1

export const STORAGE_KEY = 'intellia_fraction_equations_v1';

export const PHASES = [
  { id: 'wonder', num: '01', icon: '🌟', label: 'Wonder' },
  { id: 'story', num: '02', icon: '📖', label: 'Story' },
  { id: 'stations', num: '03', icon: '⚙️', label: 'Simulate' },
  { id: 'practice', num: '04', icon: '🎗️', label: 'Practice' },
  { id: 'reflect', num: '05', icon: '🎗️', label: 'Reflect' }
];

export const INITIAL_STATE = {
  phase: 'intro',
  xp: 0,
  streak: 0,
  highestStreak: 0,
  isMuted: false,
  completedPhases: [],
  stationsProgress: {
    station1: false,
    station2: false,
    station3: false
  },
  practiceStats: {
    attempted: 0,
    correct: 0,
    currentStreak: 0,
    bestStreak: 0
  },
  reflectionAnswers: {}
};

export function loadStoredProgress() {
  if (typeof window === 'undefined') return INITIAL_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STATE;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_STATE,
      ...parsed,
      stationsProgress: {
        ...INITIAL_STATE.stationsProgress,
        ...(parsed.stationsProgress || {})
      },
      practiceStats: {
        ...INITIAL_STATE.practiceStats,
        ...(parsed.practiceStats || {})
      },
      reflectionAnswers: {
        ...(parsed.reflectionAnswers || {})
      }
    };
  } catch (e) {
    console.warn('Could not load saved state from localStorage:', e);
    return INITIAL_STATE;
  }
}

export function progressReducer(state, action) {
  let nextState;
  switch (action.type) {
    case 'SET_PHASE':
      nextState = { ...state, phase: action.payload };
      break;

    case 'COMPLETE_PHASE': {
      const phaseId = action.payload;
      const completed = state.completedPhases.includes(phaseId)
        ? state.completedPhases
        : [...state.completedPhases, phaseId];
      nextState = { ...state, completedPhases: completed };
      break;
    }

    case 'ADD_XP': {
      const added = action.payload || 10;
      nextState = { ...state, xp: state.xp + added };
      break;
    }

    case 'COMPLETE_STATION': {
      const key = action.payload;
      nextState = {
        ...state,
        stationsProgress: {
          ...state.stationsProgress,
          [key]: true
        }
      };
      break;
    }

    case 'RECORD_PRACTICE': {
      const { isCorrect } = action.payload;
      const attempted = state.practiceStats.attempted + 1;
      const correct = state.practiceStats.correct + (isCorrect ? 1 : 0);
      const currentStreak = isCorrect ? state.practiceStats.currentStreak + 1 : 0;
      const bestStreak = Math.max(state.practiceStats.bestStreak, currentStreak);
      nextState = {
        ...state,
        streak: currentStreak,
        highestStreak: Math.max(state.highestStreak, currentStreak),
        practiceStats: {
          attempted,
          correct,
          currentStreak,
          bestStreak
        }
      };
      break;
    }

    case 'SAVE_REFLECTION': {
      const payload = action.payload || {};
      const newAnswers = payload.promptId !== undefined
        ? { [payload.promptId]: payload.answerIdx }
        : payload;
      nextState = {
        ...state,
        reflectionAnswers: {
          ...state.reflectionAnswers,
          ...newAnswers
        },
        xp: state.xp + 40
      };
      break;
    }

    case 'TOGGLE_MUTE':
      nextState = { ...state, isMuted: !state.isMuted };
      break;

    case 'RESET_ALL':
      nextState = INITIAL_STATE;
      break;

    default:
      return state;
  }

  // Persist to localStorage
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  return nextState;
}
