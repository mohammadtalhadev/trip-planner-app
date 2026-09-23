import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  AtSign,
  Lock,
  Eye,
  EyeOff,
  Shield,
  ShieldCheck,
  Sliders,
  Scale,
  Compass,
  Coffee,
  Sparkles,
  Utensils,
  Landmark,
  Mountain,
  Building2,
  Wine,
  Bed,
  Check,
  ArrowRight,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { registerUser, TravelPreferencesData } from '../services/auth';
import { useUserStore } from '../store/useUserStore';
import { usePreferencesStore } from '../store/usePreferencesStore';
import { CurrencyCode } from '../types/settings';

const VIBE_TAGS = [
  { id: 'Michelin & Street Food', label: 'Michelin & Street Food', icon: Utensils },
  { id: 'Historic Temples', label: 'Historic Temples', icon: Landmark },
  { id: 'Scenic Nature', label: 'Scenic Nature', icon: Mountain },
  { id: 'Design & Architecture', label: 'Design & Architecture', icon: Building2 },
  { id: 'Hidden Speakeasies', label: 'Hidden Speakeasies', icon: Wine },
  { id: 'Boutique Stays', label: 'Boutique Stays', icon: Bed },
];

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useUserStore();
  const { setCurrency } = usePreferencesStore();

  // Step 1: Account Basics State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 2: Travel Preferences State
  const [pace, setPace] = useState<'relaxed' | 'balanced' | 'packed'>('balanced');
  const [selectedVibes, setSelectedVibes] = useState<string[]>([
    'Michelin & Street Food',
    'Historic Temples',
    'Design & Architecture',
  ]);
  const [currency, setLocalCurrency] = useState<'USD' | 'EUR' | 'JPY'>('USD');
  const [distanceMetric, setDistanceMetric] = useState<'km' | 'mi'>('km');

  // UI Flow State
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: 'Empty', color: 'bg-slate-200' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    switch (score) {
      case 1:
        return { score: 1, label: 'Weak', color: 'bg-rose-500' };
      case 2:
        return { score: 2, label: 'Fair', color: 'bg-amber-500' };
      case 3:
        return { score: 3, label: 'Good', color: 'bg-sky-500' };
      case 4:
        return { score: 4, label: 'Strong', color: 'bg-emerald-500' };
      default:
        return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    }
  };

  const strength = getPasswordStrength(password);

  const toggleVibe = (vibeId: string) => {
    setSelectedVibes((prev) =>
      prev.includes(vibeId) ? prev.filter((v) => v !== vibeId) : [...prev, vibeId]
    );
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter your password.');
      return;
    }

    setIsLoading(true);

    try {
      const preferencesData: TravelPreferencesData = {
        pace,
        vibes: selectedVibes,
        currency,
        distanceMetric,
      };

      const newUser = await registerUser({
        name: fullName,
        email,
        password,
        preferences: preferencesData,
      });

      // Update active user in Zustand store
      setUser(newUser);

      // Sync currency preference
      setCurrency(currency as CurrencyCode);

      // Smooth redirect to Discover page
      navigate('/', { replace: true });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('An unexpected registration error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-6 sm:py-10 max-w-6xl mx-auto space-y-6 sm:space-y-8">
      {/* 1. TOP STEPPER CAPSULE HEADER */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-full border border-slate-200/90 dark:border-slate-800 shadow-sm p-2 sm:p-2.5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 px-2 sm:px-4">
          {/* Step 1: Account Basics */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block leading-none">
                Step 01
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                Account Basics
                <Lock className="w-3 h-3 text-slate-400" />
              </span>
            </div>
          </div>

          <div className="hidden sm:block w-8 h-[1px] bg-slate-200 dark:bg-slate-800" />

          {/* Step 2: Travel Preferences (Current Active) */}
          <div className="flex items-center gap-3 w-full sm:w-auto p-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-full bg-orange-50/80 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/40">
            <div className="w-7 h-7 rounded-full bg-[#ff5a36] text-white flex items-center justify-center font-bold text-xs shrink-0">
              2
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#ff5a36] font-bold block leading-none">
                Current Phase
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Travel Preferences
              </span>
            </div>
            <span className="w-2 h-2 rounded-full bg-[#ff5a36] animate-pulse ml-1" />
          </div>

          <div className="hidden sm:block w-8 h-[1px] bg-slate-200 dark:bg-slate-800" />

          {/* Step 3: First Destination */}
          <div className="flex items-center gap-3 opacity-60 w-full sm:w-auto">
            <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center font-bold text-xs shrink-0">
              3
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block leading-none">
                Step 03
              </span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                First Destination
                <Compass className="w-3 h-3 text-slate-400" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ERROR BANNER */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center gap-3 text-xs text-rose-700 dark:text-rose-300 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 2. TWO-COLUMN MAIN WORKSPACE */}
      <form onSubmit={handleSignUpSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">
          {/* COLUMN 1: ACCOUNT BASICS */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
                <Sparkles className="w-3 h-3 text-indigo-500" />
                Free Forever for Explorers
              </span>

              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                Create Your Free Account
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                Start crafting intelligent journeys in minutes. Built for mindful, effortless exploration.
              </p>
            </div>

            {/* Social Auth Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setFullName('Alex Mercer');
                  setEmail('alex.mercer@wanderlust.io');
                  setPassword('Password123!');
                  setConfirmPassword('Password123!');
                }}
                className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors shadow-2xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFullName('Alex Mercer');
                  setEmail('alex.mercer@apple.id');
                  setPassword('Password123!');
                  setConfirmPassword('Password123!');
                }}
                className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors shadow-2xs"
              >
                <svg className="w-4 h-4 fill-current text-slate-900 dark:text-white" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.62-.75 1.04-1.8 0.92-2.84-.9.04-1.99.6-2.64 1.36-.57.65-1.07 1.72-.94 2.74 1 .08 2.03-.51 2.66-1.26z" />
                </svg>
                <span>Apple</span>
              </button>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              <span className="absolute bg-white dark:bg-slate-900 px-3 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                Or Email Registration
              </span>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Mercer"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#ff5a36] focus:ring-2 focus:ring-[#ff5a36]/20 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Email address
                </label>
                <div className="relative flex items-center">
                  <AtSign className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex.mercer@wanderlust.io"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#ff5a36] focus:ring-2 focus:ring-[#ff5a36]/20 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Create a secure password
                  </label>
                  <span className="text-[10px] font-mono text-[#ff5a36] font-semibold">
                    Min 8 chars
                  </span>
                </div>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#ff5a36] focus:ring-2 focus:ring-[#ff5a36]/20 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* 4-Segment Password Strength Indicator */}
                {password && (
                  <div className="pt-1.5 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">Password Strength</span>
                      <span className="font-bold flex items-center gap-1 text-slate-700 dark:text-slate-300">
                        <ShieldCheck className="w-3 h-3 text-emerald-500" />
                        {strength.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5 h-1.5">
                      {[1, 2, 3, 4].map((seg) => (
                        <div
                          key={seg}
                          className={`rounded-full h-full transition-all ${
                            strength.score >= seg ? strength.color : 'bg-slate-100 dark:bg-slate-800'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Confirm Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#ff5a36] focus:ring-2 focus:ring-[#ff5a36]/20 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">
              By signing up, you agree to our{' '}
              <span className="text-indigo-600 dark:text-indigo-400 font-medium">Terms of Service</span>{' '}
              & <span className="text-indigo-600 dark:text-indigo-400 font-medium">Privacy Policy</span>.
            </p>
          </div>

          {/* COLUMN 2: PERSONALIZE YOUR PREFERENCES */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#ff5a36]">
                <Sliders className="w-5 h-5" />
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
                  Personalize Your Preferences
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                Curate your travel temperament. Real-time itinerary weights adapt immediately.
              </p>
            </div>

            {/* Travel Pace */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  What is your primary travel pace?
                </span>
                <span className="text-[10px] font-mono text-slate-400 uppercase">
                  Custom daily rhythms
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Relaxed */}
                <button
                  type="button"
                  onClick={() => setPace('relaxed')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    pace === 'relaxed'
                      ? 'border-[#ff5a36] bg-orange-50/50 dark:bg-orange-950/20 ring-2 ring-[#ff5a36]/20'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Coffee className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                    {pace === 'relaxed' && (
                      <span className="w-4 h-4 rounded-full bg-[#ff5a36] text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Relaxed & Mindful
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    1–2 curated stops / day
                  </div>
                </button>

                {/* Balanced Flow (Default) */}
                <button
                  type="button"
                  onClick={() => setPace('balanced')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    pace === 'balanced'
                      ? 'border-[#ff5a36] bg-orange-50/50 dark:bg-orange-950/20 ring-2 ring-[#ff5a36]/20'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Scale className="w-4 h-4 text-[#ff5a36]" />
                    {pace === 'balanced' && (
                      <span className="w-4 h-4 rounded-full bg-[#ff5a36] text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Balanced Flow
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    3–4 harmonized stops
                  </div>
                </button>

                {/* Packed Explorer */}
                <button
                  type="button"
                  onClick={() => setPace('packed')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    pace === 'packed'
                      ? 'border-[#ff5a36] bg-orange-50/50 dark:bg-orange-950/20 ring-2 ring-[#ff5a36]/20'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Compass className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                    {pace === 'packed' && (
                      <span className="w-4 h-4 rounded-full bg-[#ff5a36] text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Packed Explorer
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    5+ intensive points / day
                  </div>
                </button>
              </div>
            </div>

            {/* Curated Vibe Tags */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Curated Vibe Tags
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Select all that apply
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {VIBE_TAGS.map((tag) => {
                  const Icon = tag.icon;
                  const isSelected = selectedVibes.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleVibe(tag.id)}
                      className={`p-2.5 rounded-xl border flex items-center gap-2 text-left transition-all text-xs font-medium ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{tag.label}</span>
                      {isSelected && <Check className="w-3 h-3 ml-auto shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* System Settings: Currency & Distance */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Preferred Currency */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Preferred Currency
                </label>
                <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  {(['USD', 'EUR', 'JPY'] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setLocalCurrency(c)}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        currency === c
                          ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {c === 'USD' ? 'USD ($)' : c === 'EUR' ? 'EUR (€)' : 'JPY (¥)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Distance Metrics */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Distance Metrics
                </label>
                <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  {(['km', 'mi'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setDistanceMetric(m)}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        distanceMetric === m
                          ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {m === 'km' ? 'Kilometers (km)' : 'Miles (mi)'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. BOTTOM GUARANTEE & SUBMIT BAR */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Instant Setup Guarantee
              </span>
              <span className="text-[11px] text-slate-400">
                No credit card required • Cancel anytime
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto justify-end">
            <span className="text-xs text-slate-500">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-bold text-[#ff5a36] hover:underline"
              >
                Sign In
              </Link>
            </span>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#ff5a36] to-[#f97316] hover:from-[#e04825] hover:to-[#ea580c] text-white text-sm font-semibold shadow-md shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Complete Setup & Build First Trip</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
