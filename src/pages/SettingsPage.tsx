import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
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
  LogIn,
  ArrowRight,
  RefreshCw,
  Calculator,
} from 'lucide-react';
import { usePreferencesStore } from '../store/usePreferencesStore';
import { useUserStore } from '../store/useUserStore';
import { useCurrency } from '../hooks/useCurrency';
import { EditProfileModal } from '../components/user/EditProfileModal';
import { CurrencyCode, TempUnit, ThemeMode, TravelStyle } from '../types/settings';
import { CURRENCY_NAMES, CURRENCY_SYMBOLS } from '../utils/currency';
import { formatTemperature } from '../utils/weatherCodes';

export const SettingsPage: React.FC = () => {
  const location = useLocation();
  const user = useUserStore((state) => state.user);
  const {
    preferences,
    setCurrency,
    setTempUnit,
    setTheme,
    setDefaultTravelers,
    setTravelStyle,
  } = usePreferencesStore();

  const {
    exchangeRates,
    ratesSource,
    convertBetween,
    formatRaw,
    refreshRates,
  } = useCurrency();

  const [savedNotice, setSavedNotice] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'profile' | 'password'>('profile');

  // Currency Converter Tool State
  const [calcAmount, setCalcAmount] = useState<number>(100);
  const [calcFrom, setCalcFrom] = useState<CurrencyCode>('USD');
  const [calcTo, setCalcTo] = useState<CurrencyCode>(preferences.currency);
  const [isRefreshingRates, setIsRefreshingRates] = useState(false);

  useEffect(() => {
    setCalcTo(preferences.currency);
  }, [preferences.currency]);

  useEffect(() => {
    if (location.state && (location.state as { openEditProfile?: boolean }).openEditProfile) {
      setModalTab('profile');
      setIsEditModalOpen(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.state]);

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
        <section className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-frost space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-2xl bg-orange-50 dark:bg-orange-950/60 text-[#c2410c] dark:text-[#fb923c] border border-orange-100 dark:border-orange-900/40">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-serif font-bold text-slate-900 dark:text-slate-100">
                  Account Profile & Security
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage your traveler identity, contact email, avatar image, and credentials.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{user.isLoggedIn ? 'Authenticated' : 'Guest Mode (Offline)'}</span>
            </div>
          </div>

          {!user.isLoggedIn ? (
            <div className="p-5 rounded-2xl border border-dashed border-stone-300 dark:border-stone-700 bg-stone-50/60 dark:bg-slate-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center text-stone-500 ring-2 ring-stone-300 dark:ring-stone-600 shrink-0">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      Guest Explorer
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300">
                      Unauthenticated Session
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md leading-relaxed">
                    Sign in to customize your profile, sync saved destinations across devices, and manage your private travel ledgers.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
                <Link
                  to="/login"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#c2410c] hover:bg-[#b91c1c] active:bg-[#9a3412] text-white text-xs font-bold shadow-md shadow-orange-600/20 transition-all hover:scale-[1.01]"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/signup"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-xs transition-colors"
                >
                  <span>Sign Up</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {user.name}
                    </h4>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 whitespace-nowrap tracking-tight">
                      {user.tier}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{user.email}</span>
                  </div>
                  {user.bio && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-md line-clamp-1 italic">
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
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-xs transition-colors"
                >
                  Edit Profile
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setModalTab('password');
                    setIsEditModalOpen(true);
                  }}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#c2410c] hover:bg-[#b91c1c] active:bg-[#9a3412] text-white text-xs font-bold shadow-md shadow-orange-600/20 transition-all hover:scale-[1.01]"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Change Password</span>
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Appearance / Theme */}
        <section className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-frost space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <Sun className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-slate-900 dark:text-slate-100">
                Display Environment
              </h3>
              <p className="text-xs text-slate-500">
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
                  className={`p-4 rounded-2xl border text-center flex flex-col items-center gap-2 transition-all ${
                    isSelected
                      ? 'border-[#c2410c] bg-[#c2410c] text-white font-bold shadow-md shadow-orange-600/20'
                      : 'border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
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
        <section className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-frost space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-slate-900 dark:text-slate-100">
                Financial Currency & Units
              </h3>
              <p className="text-xs text-slate-500">
                Controls price formatting in itineraries, budgets, and weather forecasts.
              </p>
            </div>
          </div>

          <div className="space-y-5 pt-1">
            {/* Live Exchange API Status & Refresh Header */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Live Exchange Rate API ({ratesSource})
                </span>
                <span className="hidden sm:inline text-slate-400 font-mono text-[11px]">
                  • open.er-api.com
                </span>
              </div>
              <button
                type="button"
                onClick={async () => {
                  setIsRefreshingRates(true);
                  await refreshRates();
                  setTimeout(() => setIsRefreshingRates(false), 500);
                  triggerSavedNotice();
                }}
                disabled={isRefreshingRates}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#c2410c] ${isRefreshingRates ? 'animate-spin' : ''}`} />
                <span>Sync Live Rates</span>
              </button>
            </div>

            {/* Currency Selector */}
            <div>
              <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-2">
                Preferred Currency (propagates across all trips & budgets)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {currencies.map((c) => {
                  const isSelected = preferences.currency === c;
                  const rateVal = exchangeRates[c] || 1;
                  return (
                    <button
                      key={c}
                      onClick={() => handleCurrencyChange(c)}
                      className={`p-3 rounded-2xl border text-left flex flex-col justify-between gap-1 transition-all ${
                        isSelected
                          ? 'border-[#c2410c] bg-[#c2410c] text-white font-bold shadow-md shadow-orange-600/20'
                          : 'border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-mono font-bold block">{c}</span>
                        <span className={`text-sm font-mono font-bold ${isSelected ? 'text-orange-100' : 'text-slate-400'}`}>
                          {CURRENCY_SYMBOLS[c]}
                        </span>
                      </div>
                      <span className={`text-[10px] truncate block ${isSelected ? 'text-orange-100' : 'text-slate-400'}`}>
                        {CURRENCY_NAMES[c].split(' ')[0]}
                      </span>
                      <span className={`text-[9px] font-mono block ${isSelected ? 'text-orange-200' : 'text-slate-400'}`}>
                        1 USD = {rateVal.toFixed(c === 'JPY' ? 0 : 2)} {c}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* INTERACTIVE REAL-TIME CURRENCY CONVERTER */}
            <div className="p-4 rounded-2xl bg-orange-50/40 dark:bg-slate-800/40 border border-orange-200/60 dark:border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-[#c2410c]" />
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                    Currency Calculator
                  </h4>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 mb-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={calcAmount || ''}
                    onChange={(e) => setCalcAmount(parseFloat(e.target.value) || 0)}
                    placeholder="100"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-500 mb-1">
                    From
                  </label>
                  <select
                    value={calcFrom}
                    onChange={(e) => setCalcFrom(e.target.value as CurrencyCode)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-none"
                  >
                    {currencies.map((c) => (
                      <option key={c} value={c}>
                        {c} ({CURRENCY_SYMBOLS[c]})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-500 mb-1">
                    To
                  </label>
                  <select
                    value={calcTo}
                    onChange={(e) => setCalcTo(e.target.value as CurrencyCode)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-none"
                  >
                    {currencies.map((c) => (
                      <option key={c} value={c}>
                        {c} ({CURRENCY_SYMBOLS[c]})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col justify-center">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">
                    Result
                  </span>
                  <span className="text-sm font-mono font-black text-[#c2410c] dark:text-orange-400 truncate">
                    {formatRaw(convertBetween(calcAmount || 0, calcFrom, calcTo), calcTo)}
                  </span>
                </div>
              </div>
            </div>

            {/* Temperature Unit */}
            <div>
              <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-2">
                Temperature Unit
              </label>
              <div className="grid grid-cols-2 gap-3 max-w-xs">
                <button
                  onClick={() => handleTempUnitChange('celsius')}
                  className={`p-3 rounded-2xl border text-center font-mono font-bold text-xs transition-all ${
                    preferences.tempUnit === 'celsius'
                      ? 'border-[#c2410c] bg-[#c2410c] text-white shadow-md shadow-orange-600/20'
                      : 'border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  Celsius (°C)
                </button>
                <button
                  onClick={() => handleTempUnitChange('fahrenheit')}
                  className={`p-3 rounded-2xl border text-center font-mono font-bold text-xs transition-all ${
                    preferences.tempUnit === 'fahrenheit'
                      ? 'border-[#c2410c] bg-[#c2410c] text-white shadow-md shadow-orange-600/20'
                      : 'border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  Fahrenheit (°F)
                </button>
              </div>
            </div>

            {/* Live Preview Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="text-slate-500 font-mono text-[11px]">Format Preview:</span>
              <div className="flex items-center gap-3 font-mono font-bold text-slate-800 dark:text-slate-200 flex-wrap">
                <span>Budget: {formatRaw(convertBetween(2500, 'USD', preferences.currency), preferences.currency)}</span>
                <span>•</span>
                <span>Weather: {formatTemperature(22, preferences.tempUnit)}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Travel Defaults */}
        <section className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-frost space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-slate-900 dark:text-slate-100">
                Itinerary Defaults
              </h3>
              <p className="text-xs text-slate-500">
                Configure baseline traveler party size and preferred vacation pacing.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-1">
            {/* Default Travelers */}
            <div>
              <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-2">
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
                  className="w-24 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-sm font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
                <span className="text-xs text-slate-500">
                  Default number of travelers when inaugurating a journey.
                </span>
              </div>
            </div>

            {/* Travel Style */}
            <div>
              <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-2">
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
                          ? 'border-[#c2410c] bg-[#c2410c] text-white shadow-md shadow-orange-600/20'
                          : 'border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-serif font-bold">
                        <span>{style.title}</span>
                        {isSelected && <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
                      </div>
                      <p className={`text-[11px] mt-0.5 leading-relaxed ${isSelected ? 'text-orange-100' : 'text-slate-500 dark:text-slate-400'}`}>
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
