import { create } from 'zustand';
import { CurrencyCode, TempUnit, ThemeMode, TravelStyle, UserPreferences } from '../types/settings';
import { getInitialActiveUserId } from './userStorageHelper';

export interface PreferencesState {
  preferences: UserPreferences;
  activeUserId: string;
  loadUserPreferences: (userId: string) => void;
  setCurrency: (currency: CurrencyCode) => void;
  setTempUnit: (unit: TempUnit) => void;
  setTheme: (theme: ThemeMode) => void;
  setDefaultTravelers: (count: number) => void;
  setTravelStyle: (style: TravelStyle) => void;
  applyTheme: () => void;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  currency: 'USD',
  tempUnit: 'celsius',
  theme: 'light',
  defaultTravelers: 2,
  travelStyle: 'balanced',
};

function resolveTheme(mode: ThemeMode): boolean {
  if (mode === 'dark') return true;
  return false; // Default to light theme
}

const getPrefKey = (userId: string) => `tp_pref_${userId || 'guest'}`;

export function loadStoredPreferences(userId: string): UserPreferences {
  // If guest, always return clean default preferences
  if (!userId || userId === 'guest') {
    const raw = localStorage.getItem(getPrefKey('guest'));
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') return { ...DEFAULT_PREFERENCES, ...parsed };
      } catch {}
    }
    return DEFAULT_PREFERENCES;
  }

  const key = getPrefKey(userId);
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return { ...DEFAULT_PREFERENCES, ...parsed };
    }
    // Legacy migration for admin
    if (userId === 'usr-admin') {
      const legacy = localStorage.getItem('trip-planner-preferences');
      if (legacy) {
        const parsed = JSON.parse(legacy);
        const prefs = parsed.state?.preferences || parsed;
        if (prefs) {
          localStorage.setItem(key, JSON.stringify(prefs));
          return { ...DEFAULT_PREFERENCES, ...prefs };
        }
      }
    }
  } catch (e) {
    console.warn('Failed to parse preferences for user:', userId, e);
  }
  return DEFAULT_PREFERENCES;
}

function saveUserPreferences(userId: string, prefs: UserPreferences) {
  try {
    localStorage.setItem(getPrefKey(userId), JSON.stringify(prefs));
  } catch (err) {
    console.warn('Failed to save user preferences:', err);
  }
}

const initialUserId = getInitialActiveUserId();
const initialPreferences = loadStoredPreferences(initialUserId);

export const usePreferencesStore = create<PreferencesState>((set, get) => ({
  preferences: initialPreferences,
  activeUserId: initialUserId,

  loadUserPreferences: (userId: string) => {
    const prefs = loadStoredPreferences(userId);
    set({ activeUserId: userId, preferences: prefs });
    const isDark = resolveTheme(prefs.theme);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  setCurrency: (currency) => {
    const updated = { ...get().preferences, currency };
    set({ preferences: updated });
    saveUserPreferences(get().activeUserId, updated);
  },

  setTempUnit: (tempUnit) => {
    const updated = { ...get().preferences, tempUnit };
    set({ preferences: updated });
    saveUserPreferences(get().activeUserId, updated);
  },

  setTheme: (theme) => {
    const updated = { ...get().preferences, theme };
    set({ preferences: updated });
    saveUserPreferences(get().activeUserId, updated);
    const isDark = resolveTheme(theme);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  setDefaultTravelers: (defaultTravelers) => {
    const updated = {
      ...get().preferences,
      defaultTravelers: Math.max(1, defaultTravelers),
    };
    set({ preferences: updated });
    saveUserPreferences(get().activeUserId, updated);
  },

  setTravelStyle: (travelStyle) => {
    const updated = { ...get().preferences, travelStyle };
    set({ preferences: updated });
    saveUserPreferences(get().activeUserId, updated);
  },

  applyTheme: () => {
    const theme = get().preferences.theme;
    const isDark = resolveTheme(theme);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },
}));

// Apply theme on module load
usePreferencesStore.getState().applyTheme();
