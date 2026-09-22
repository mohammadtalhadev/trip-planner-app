import React, { useState } from 'react';
import {
  DollarSign,
  Moon,
  Sun,
  Users,
  Compass,
  CheckCircle2,
  Sparkles,
  User,
  Mail,
  KeyRound,
  ShieldCheck,
  Camera,
} from 'lucide-react';
import { usePreferencesStore } from '../store/usePreferencesStore';
import { useUserStore } from '../store/useUserStore';
import { EditProfileModal } from '../components/user/EditProfileModal';
import { CurrencyCode, TempUnit, ThemeMode, TravelStyle } from '../types/settings';
import { CURRENCY_NAMES, formatCurrency } from '../utils/currency';
import { formatTemperature } from '../utils/weatherCodes';

export const SettingsPage: React.FC = () => {
  const user = useUserStore((state) => state.user);
  const {
    preferences,
    setCurrency,
    setTempUnit,
    setTheme,
    setDefaultTravelers,
    setTravelStyle,
  } = usePreferencesStore();

  const [savedNotice, setSavedNotice] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'profile' | 'password'>('profile');

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
      <div className="flex items-center justify-between border-b border-stone-200/80 dark:border-stone-800 pb-5">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400">
            System & Personalization
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-stone-900 dark:text-stone-50 mt-1">
            Preferences & Settings
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1.5 max-w-xl leading-relaxed">
            Configure financial currencies, temperature metrics, display modes, and default travel companions.
          </p>
        </div>

        {savedNotice && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 text-xs font-mono font-medium animate-in fade-in">
            <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />
            <span>Preferences Saved</span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Account Profile & Security Section */}
        <section className="p-6 bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl shadow-subtle space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-serif font-bold text-stone-900 dark:text-stone-100">
                  Account Profile & Security
                </h3>
                <p className="text-xs text-stone-500">
                  Manage your traveler identity, contact email, avatar image, and credentials.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{user.isLoggedIn ? 'Authenticated' : 'Offline'}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-stone-100 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="relative group cursor-pointer"
                onClick={() => {
                  setModalTab('profile');
                  setIsEditModalOpen(true);
                }}
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/avatar.png';
                  }}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-sky-400 shadow-sm"
                />
                <div className="absolute inset-0 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Camera className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-stone-900 dark:text-white">
                    {user.name}
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300">
                    {user.tier}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                  <span>{user.email}</span>
                </div>
                {user.bio && (
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 max-w-md line-clamp-1 italic">
                    "{user.bio}"
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  setModalTab('profile');
                  setIsEditModalOpen(true);
                }}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs font-bold text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-700 shadow-xs transition-colors"
              >
                Edit Profile
              </button>

              <button
                type="button"
                onClick={() => {
                  setModalTab('password');
                  setIsEditModalOpen(true);
                }}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-900 text-xs font-bold shadow-xs transition-colors"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Change Password</span>
              </button>
            </div>
          </div>
        </section>

        {/* Appearance / Theme */}
        <section className="p-6 bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl shadow-subtle space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
              <Sun className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-stone-900 dark:text-stone-100">
                Display Environment
              </h3>
              <p className="text-xs text-stone-500">
                Choose between tactile warm paper mode or architectural dark tone.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { id: 'light', label: 'Paper Light', icon: Sun },
              { id: 'dark', label: 'Charcoal Dark', icon: Moon },
              { id: 'system', label: 'System Match', icon: Compass },
            ].map((option) => {
              const Icon = option.icon;
              const isSelected = preferences.theme === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleThemeChange(option.id as ThemeMode)}
                  className={`p-4 rounded-xl border text-center flex flex-col items-center gap-2 transition-all ${
                    isSelected
                      ? 'border-stone-900 bg-stone-900 text-stone-50 dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900 font-bold shadow-sm'
                      : 'border-stone-200/80 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-mono font-medium">{option.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Currency & Units */}
        <section className="p-6 bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl shadow-subtle space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-stone-900 dark:text-stone-100">
                Financial Currency & Units
              </h3>
              <p className="text-xs text-stone-500">
                Controls price formatting in itineraries, budgets, and weather forecasts.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-1">
            {/* Currency Selector */}
            <div>
              <label className="block text-[11px] font-mono font-bold text-stone-500 uppercase tracking-widest mb-2">
                Preferred Currency
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {currencies.map((c) => {
                  const isSelected = preferences.currency === c;
                  return (
                    <button
                      key={c}
                      onClick={() => handleCurrencyChange(c)}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-stone-900 bg-stone-900 text-stone-50 dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900 font-bold shadow-sm'
                          : 'border-stone-200/80 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800/60'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-mono font-bold block">{c}</span>
                        <span className={`text-[10px] truncate block ${isSelected ? 'text-stone-300 dark:text-stone-600' : 'text-stone-400'}`}>
                          {CURRENCY_NAMES[c].split(' ')[0]}
                        </span>
                      </div>
                      <span className={`text-sm font-mono font-bold ${isSelected ? 'text-stone-200 dark:text-stone-800' : 'text-stone-400'}`}>
                        {formatCurrency(100, c).charAt(0)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Temperature Unit */}
            <div>
              <label className="block text-[11px] font-mono font-bold text-stone-500 uppercase tracking-widest mb-2">
                Temperature Unit
              </label>
              <div className="grid grid-cols-2 gap-3 max-w-xs">
                <button
                  onClick={() => handleTempUnitChange('celsius')}
                  className={`p-3 rounded-xl border text-center font-mono font-bold text-xs transition-all ${
                    preferences.tempUnit === 'celsius'
                      ? 'border-stone-900 bg-stone-900 text-stone-50 dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900 shadow-sm'
                      : 'border-stone-200/80 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800/60'
                  }`}
                >
                  Celsius (°C)
                </button>
                <button
                  onClick={() => handleTempUnitChange('fahrenheit')}
                  className={`p-3 rounded-xl border text-center font-mono font-bold text-xs transition-all ${
                    preferences.tempUnit === 'fahrenheit'
                      ? 'border-stone-900 bg-stone-900 text-stone-50 dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900 shadow-sm'
                      : 'border-stone-200/80 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800/60'
                  }`}
                >
                  Fahrenheit (°F)
                </button>
              </div>
            </div>

            {/* Live Preview Card */}
            <div className="p-3.5 rounded-xl bg-stone-50/80 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800 flex items-center justify-between text-xs">
              <span className="text-stone-500 font-mono text-[11px]">Format Preview:</span>
              <div className="flex items-center gap-4 font-mono font-bold text-stone-800 dark:text-stone-200">
                <span>Budget: {formatCurrency(2500, preferences.currency)}</span>
                <span>•</span>
                <span>Weather: {formatTemperature(22, preferences.tempUnit)}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Travel Defaults */}
        <section className="p-6 bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl shadow-subtle space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-stone-900 dark:text-stone-100">
                Itinerary Defaults
              </h3>
              <p className="text-xs text-stone-500">
                Configure baseline traveler party size and preferred vacation pacing.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-1">
            {/* Default Travelers */}
            <div>
              <label className="block text-[11px] font-mono font-bold text-stone-500 uppercase tracking-widest mb-2">
                Default Party Size
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
                  className="w-24 px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-mono text-sm font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-stone-400"
                />
                <span className="text-xs text-stone-500">
                  Default number of travelers when inaugurating a journey.
                </span>
              </div>
            </div>

            {/* Travel Style */}
            <div>
              <label className="block text-[11px] font-mono font-bold text-stone-500 uppercase tracking-widest mb-2">
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
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-stone-900 bg-stone-900 text-stone-50 dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900 shadow-sm'
                          : 'border-stone-200/80 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/60'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-serif font-bold">
                        <span>{style.title}</span>
                        {isSelected && <Sparkles className="w-3.5 h-3.5 text-stone-300 dark:text-stone-700" />}
                      </div>
                      <p className={`text-[11px] mt-0.5 leading-relaxed ${isSelected ? 'text-stone-300 dark:text-stone-600' : 'text-stone-500 dark:text-stone-400'}`}>
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

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        defaultTab={modalTab}
      />
    </div>
  );
};
