import React, { useState } from 'react';
import {
  DollarSign,
  Moon,
  Sun,
  Users,
  Compass,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { usePreferencesStore } from '../store/usePreferencesStore';
import { CurrencyCode, TempUnit, ThemeMode, TravelStyle } from '../types/settings';
import { CURRENCY_NAMES, formatCurrency } from '../utils/currency';
import { formatTemperature } from '../utils/weatherCodes';

export const SettingsPage: React.FC = () => {
  const {
    preferences,
    setCurrency,
    setTempUnit,
    setTheme,
    setDefaultTravelers,
    setTravelStyle,
  } = usePreferencesStore();

  const [savedNotice, setSavedNotice] = useState(false);

  const triggerSavedNotice = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleCurrencyChange = (c: CurrencyCode) => {
    setCurrency(c);
    triggerSavedNotice();
  };

  const handleTempUnitChange = (u: TempUnit) => {
    setTempUnit(u);
    triggerSavedNotice();
  };

  const handleThemeChange = (t: ThemeMode) => {
    setTheme(t);
    triggerSavedNotice();
  };

  const currencies: CurrencyCode[] = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'INR'];

  const travelStyles: { id: TravelStyle; title: string; description: string }[] = [
    { id: 'budget', title: 'Budget Explorer', description: 'Affordable hostels, public transit, street food' },
    { id: 'balanced', title: 'Balanced Comfort', description: 'Standard hotels, curated tours, mix of dining' },
    { id: 'luxury', title: 'Luxury & Premium', description: '5-star resorts, private transfers, fine dining' },
    { id: 'adventure', title: 'Adventure & Outdoor', description: 'Hiking, outdoor activities, scenic nature' },
    { id: 'cultural', title: 'Culture & Heritage', description: 'Museums, historic monuments, local workshops' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Configuration
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1">
            User Preferences
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Customize currency displays, temperature units, theme modes, and travel defaults.
          </p>
        </div>

        {savedNotice && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Saved to LocalStorage</span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Appearance / Theme */}
        <section className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Display Theme
              </h3>
              <p className="text-xs text-slate-500">
                Switch between Dark and Light mode, or follow system preferences.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { id: 'light', label: 'Light', icon: Sun },
              { id: 'dark', label: 'Dark', icon: Moon },
              { id: 'system', label: 'System', icon: Compass },
            ].map((option) => {
              const Icon = option.icon;
              const isSelected = preferences.theme === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleThemeChange(option.id as ThemeMode)}
                  className={`p-4 rounded-2xl border text-center flex flex-col items-center gap-2 transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold ring-2 ring-blue-500/20 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{option.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Currency & Units */}
        <section className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Currency & Units
              </h3>
              <p className="text-xs text-slate-500">
                Controls price formatting in trips, budget management, and weather cards.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-1">
            {/* Currency Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Preferred Currency
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {currencies.map((c) => {
                  const isSelected = preferences.currency === c;
                  return (
                    <button
                      key={c}
                      onClick={() => handleCurrencyChange(c)}
                      className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-bold ring-2 ring-emerald-500/20'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold block">{c}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate block">
                          {CURRENCY_NAMES[c].split(' ')[0]}
                        </span>
                      </div>
                      <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(100, c).charAt(0)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Temperature Unit */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Temperature Unit
              </label>
              <div className="grid grid-cols-2 gap-3 max-w-xs">
                <button
                  onClick={() => handleTempUnitChange('celsius')}
                  className={`p-3 rounded-2xl border text-center font-bold text-xs transition-all ${
                    preferences.tempUnit === 'celsius'
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  Celsius (°C)
                </button>
                <button
                  onClick={() => handleTempUnitChange('fahrenheit')}
                  className={`p-3 rounded-2xl border text-center font-bold text-xs transition-all ${
                    preferences.tempUnit === 'fahrenheit'
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  Fahrenheit (°F)
                </button>
              </div>
            </div>

            {/* Live Preview Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Live Setting Preview:</span>
              <div className="flex items-center gap-4 font-bold text-slate-800 dark:text-slate-200">
                <span>Budget Sample: {formatCurrency(2500, preferences.currency)}</span>
                <span>•</span>
                <span>Weather Sample: {formatTemperature(22, preferences.tempUnit)}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Travel Defaults */}
        <section className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Trip Planning Defaults
              </h3>
              <p className="text-xs text-slate-500">
                Configure baseline travelers count and preferred vacation style.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-1">
            {/* Default Travelers */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Default Number of Travelers
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={preferences.defaultTravelers}
                  onChange={(e) => {
                    setDefaultTravelers(parseInt(e.target.value, 10) || 1);
                    triggerSavedNotice();
                  }}
                  className="w-24 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-xs text-slate-500">
                  Pre-filled when creating new vacation itineraries.
                </span>
              </div>
            </div>

            {/* Travel Style */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Travel Style & Pace
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {travelStyles.map((style) => {
                  const isSelected = preferences.travelStyle === style.id;
                  return (
                    <button
                      key={style.id}
                      onClick={() => {
                        setTravelStyle(style.id);
                        triggerSavedNotice();
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/50 ring-2 ring-purple-500/20'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                        <span>{style.title}</span>
                        {isSelected && <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {style.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
