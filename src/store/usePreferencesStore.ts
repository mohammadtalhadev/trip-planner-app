import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CurrencyCode, TempUnit, ThemeMode, TravelStyle, UserPreferences } from '../types/settings';

interface PreferencesState {
  preferences: UserPreferences;
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
  theme: 'system',
  defaultTravelers: 2,
  travelStyle: 'balanced',
};

function resolveTheme(mode: ThemeMode): boolean {
  if (mode === 'dark') return true;
  if (mode === 'light') return false;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set, get) => ({
      preferences: DEFAULT_PREFERENCES,

      setCurrency: (currency) => {
        set((state) => ({
          preferences: { ...state.preferences, currency },
        }));
      },

      setTempUnit: (tempUnit) => {
        set((state) => ({
          preferences: { ...state.preferences, tempUnit },
        }));
      },

      setTheme: (theme) => {
        set((state) => ({
          preferences: { ...state.preferences, theme },
        }));
        const isDark = resolveTheme(theme);
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      setDefaultTravelers: (defaultTravelers) => {
        set((state) => ({
          preferences: { ...state.preferences, defaultTravelers: Math.max(1, defaultTravelers) },
        }));
      },

      setTravelStyle: (travelStyle) => {
        set((state) => ({
          preferences: { ...state.preferences, travelStyle },
        }));
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
    }),
    {
      name: 'trip-planner-preferences',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.applyTheme();
        }
      },
    }
  )
);
