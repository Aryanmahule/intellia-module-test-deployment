// State management & LocalStorage persistence for Understanding Equations module

const STORAGE_KEY = 'intellia_one_step_equations_v1';

export const PHASES = [
  { id: 'wonder', label: 'Wonder', icon: '🔮', num: '01' },
  { id: 'story', label: 'Story', icon: '📖', num: '02' },
  { id: 'stations', label: 'Simulate', icon: '🧪', num: '03' },
  { id: 'practice', label: 'Practice', icon: '🎮', num: '04' },
  { id: 'reflect', label: 'Reflect', icon: '📓', num: '05' },
];

export const INITIAL_STATE = {
  phase: 'intro', // 'intro' | 'wonder' | 'story' | 'stations' | 'practice' | 'reflect' | 'summary'
  xp: 0,
  streak: 0,
  highestStreak: 0,
  completedPhases: [],
  stationStats: {
    balance: { stars: 0, best: 0, completed: false },
    undo: { stars: 0, best: 0, completed: false },
    stall: { stars: 0, best: 0, completed: false }
  },
  badges: [],
  hearts: 3,
  practiceStats: {
    attempted: 0,
    correct: 0,
    currentStreak: 0,
    bestStreak: 0
  },
  reflectionAnswers: {},
  isMuted: false
};

export function loadStoredProgress() {
  if (typeof window === 'undefined') return INITIAL_STATE;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return INITIAL_STATE;
    const parsed = JSON.parse(data);
    return {
      ...INITIAL_STATE,
      ...parsed,
      stationStats: {
        ...INITIAL_STATE.stationStats,
        ...(parsed.stationStats || {})
      }
    };
  } catch (e) {
    console.error('Error loading progress from storage:', e);
    return INITIAL_STATE;
  }
}

export function saveProgress(state) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Error saving progress to storage:', e);
  }
}

export function progressReducer(state, action) {
  let newState = state;

  switch (action.type) {
    case 'SET_PHASE': {
      newState = { ...state, phase: action.payload };
      break;
    }
    case 'COMPLETE_PHASE': {
      const phaseId = action.payload;
      const completedPhases = state.completedPhases.includes(phaseId)
        ? state.completedPhases
        : [...state.completedPhases, phaseId];
      newState = { ...state, completedPhases };
      break;
    }
    case 'ADD_XP': {
      const xpToAdd = action.payload || 10;
      newState = { ...state, xp: state.xp + xpToAdd };
      break;
    }
    case 'COMPLETE_STATION': {
      const { stationKey, stars = 3, score = 100, badge = null } = (typeof action.payload === 'string') 
        ? { stationKey: action.payload, stars: 3, score: 100 } 
        : action.payload;

      const currentStation = state.stationStats[stationKey] || { stars: 0, best: 0, completed: false };
      const updatedStation = {
        stars: Math.max(currentStation.stars, stars),
        best: Math.max(currentStation.best, score),
        completed: true
      };

      const newStationStats = {
        ...state.stationStats,
        [stationKey]: updatedStation
      };

      const newBadges = [...state.badges];
      if (badge && !newBadges.includes(badge)) {
        newBadges.push(badge);
      }
      if (!newBadges.includes('first-balance') && stationKey === 'balance') {
        newBadges.push('first-balance');
      }

      const allStationsDone = Object.values(newStationStats).every(s => s.completed);
      const completedPhases = allStationsDone && !state.completedPhases.includes('stations')
        ? [...state.completedPhases, 'stations']
        : state.completedPhases;

      newState = {
        ...state,
        stationStats: newStationStats,
        badges: newBadges,
        completedPhases,
        xp: state.xp + 50 + (stars * 10)
      };
      break;
    }
    case 'UNLOCK_BADGE': {
      const badgeId = action.payload;
      if (!state.badges.includes(badgeId)) {
        newState = { ...state, badges: [...state.badges, badgeId], xp: state.xp + 25 };
      }
      break;
    }
    case 'SET_HEARTS': {
      newState = { ...state, hearts: Math.max(0, action.payload) };
      break;
    }
    case 'RECORD_PRACTICE': {
      const { isCorrect } = action.payload;
      const newStreak = isCorrect ? state.practiceStats.currentStreak + 1 : 0;
      const bestStreak = Math.max(state.practiceStats.bestStreak, newStreak);
      const xpGain = isCorrect ? (15 + newStreak * 5) : 5;

      const newBadges = [...state.badges];
      if (newStreak >= 5 && !newBadges.includes('combo-5')) {
        newBadges.push('combo-5');
      }

      newState = {
        ...state,
        xp: state.xp + xpGain,
        streak: newStreak,
        highestStreak: Math.max(state.highestStreak, newStreak),
        badges: newBadges,
        practiceStats: {
          attempted: state.practiceStats.attempted + 1,
          correct: state.practiceStats.correct + (isCorrect ? 1 : 0),
          currentStreak: newStreak,
          bestStreak
        }
      };
      break;
    }
    case 'SAVE_REFLECTION': {
      newState = {
        ...state,
        reflectionAnswers: { ...state.reflectionAnswers, ...action.payload },
        xp: state.xp + 40
      };
      break;
    }
    case 'TOGGLE_MUTE': {
      newState = { ...state, isMuted: !state.isMuted };
      break;
    }
    case 'RESET_ALL': {
      newState = { ...INITIAL_STATE };
      break;
    }
    default:
      return state;
  }

  saveProgress(newState);
  return newState;
}
