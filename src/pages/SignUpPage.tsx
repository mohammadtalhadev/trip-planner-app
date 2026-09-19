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
  ArrowLeft,
  Loader2,
  AlertCircle,
  Search,
  MapPin,
  Globe,
  Sun,
  SkipForward,
} from 'lucide-react';
import { registerUser, TravelPreferencesData } from '../services/auth';
import { useUserStore } from '../store/useUserStore';
import { usePreferencesStore } from '../store/usePreferencesStore';
import { CurrencyCode } from '../types/settings';

interface DestinationOption {
  id: string;
  city: string;
  country: string;
  tag: string;
  description: string;
  image: string;
}

const CURATED_DESTINATIONS: DestinationOption[] = [
  {
    id: 'tokyo-japan',
    city: 'Tokyo',
    country: 'Japan',
    tag: 'Neon & Shrines',
    description: 'Electric metropolis, Michelin ramen, and tranquil shrines.',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'amalfi-italy',
    city: 'Amalfi Coast',
    country: 'Italy',
    tag: 'Coastal Romance',
    description: 'Pastel cliffs, azure waters, and cliffside lemon groves.',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'paris-france',
    city: 'Paris',
    country: 'France',
    tag: 'Art & Boulevards',
    description: 'Haute cuisine, world-class museums, and grand boulevards.',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'kyoto-japan',
    city: 'Kyoto',
    country: 'Japan',
    tag: 'Zen Serenity',
    description: 'Ancient wooden pagodas, bamboo groves, and tea ceremonies.',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'rome-italy',
    city: 'Rome',
    country: 'Italy',
    tag: 'Living History',
    description: 'Colosseum marvels, cobblestone piazzas, and authentic pasta.',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'bali-indonesia',
    city: 'Bali',
    country: 'Indonesia',
    tag: 'Tropical Sanctuary',
    description: 'Emerald rice paddies, cliffside temples, and surf beaches.',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'new-york-usa',
    city: 'New York City',
    country: 'United States',
    tag: 'Urban Pulse',
    description: 'Iconic skyscrapers, Broadway stages, and world gastronomy.',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'swiss-alps',
    city: 'Swiss Alps',
    country: 'Switzerland',
    tag: 'Pure Alpine',
    description: 'Snow-capped peaks, scenic panorama trains, and pristine lakes.',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=85',
  },
];

const VIBE_TAGS = [
  { id: 'Michelin & Street Food', label: 'Michelin & Street Food', icon: Utensils },
  { id: 'Historic Temples', label: 'Historic Temples', icon: Landmark },
  { id: 'Scenic Nature', label: 'Scenic Nature', icon: Mountain },
  { id: 'Design & Architecture', label: 'Design & Architecture', icon: Building2 },
  { id: 'Hidden Speakeasies', label: 'Hidden Speakeasies', icon: Wine },
  { id: 'Boutique Stays', label: 'Boutique Stays', icon: Bed },
  { id: 'Coastal Beaches', label: 'Coastal Beaches', icon: Sun },
  { id: 'Cultural Exploration', label: 'Cultural Exploration', icon: Globe },
];

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useUserStore();
  const { setCurrency } = usePreferencesStore();

  // Wizard Step Control
  const [step, setStep] = useState<1 | 2 | 3>(1);

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
  const [currency, setLocalCurrency] = useState<'USD' | 'EUR' | 'JPY' | 'GBP' | 'AUD' | 'CAD'>('USD');
  const [distanceMetric, setDistanceMetric] = useState<'km' | 'mi'>('km');

  // Step 3: First Destination State
  const [selectedDestination, setSelectedDestination] = useState<DestinationOption | null>(
    CURATED_DESTINATIONS[0]
  );
  const [customDestinationQuery, setCustomDestinationQuery] = useState('');

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
  const isPasswordMismatch = confirmPassword.length > 0 && password !== confirmPassword;
  const isPasswordMatch = confirmPassword.length > 0 && password.length >= 8 && password === confirmPassword;

  const toggleVibe = (vibeId: string) => {
    setSelectedVibes((prev) =>
      prev.includes(vibeId) ? prev.filter((v) => v !== vibeId) : [...prev, vibeId]
    );
  };

  // Step 1 Validation -> Proceed to Step 2
  const handleProceedToPreferences = (e: React.FormEvent) => {
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
      setErrorMessage('Passwords do not match. Please ensure both passwords match.');
      return;
    }

    // Validation passed -> Advance to Step 2
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Final Registration Handler
  const handleCompleteRegistration = async (includeDestination: boolean) => {
    setErrorMessage('');
    setIsLoading(true);

    try {
      const preferencesData: TravelPreferencesData = {
        pace,
        vibes: selectedVibes,
        currency,
        distanceMetric,
      };

      let initialDest: { city: string; country: string; coverImage?: string } | undefined = undefined;

      if (includeDestination) {
        if (customDestinationQuery.trim()) {
          const parts = customDestinationQuery.split(',');
          initialDest = {
            city: parts[0].trim(),
            country: parts[1] ? parts[1].trim() : 'Global Destination',
            coverImage: selectedDestination?.image || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=85',
          };
        } else if (selectedDestination) {
          initialDest = {
            city: selectedDestination.city,
            country: selectedDestination.country,
            coverImage: selectedDestination.image,
          };
        }
      }

      const newUser = await registerUser({
        name: fullName,
        email,
        password,
        preferences: preferencesData,
        initialDestination: initialDest,
      });

      // Update active user in Zustand store (automatically syncs user across stores)
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

  // Filtered destinations in Step 3 based on search query
  const filteredDestinations = CURATED_DESTINATIONS.filter(
    (d) =>
      d.city.toLowerCase().includes(customDestinationQuery.toLowerCase()) ||
      d.country.toLowerCase().includes(customDestinationQuery.toLowerCase()) ||
      d.tag.toLowerCase().includes(customDestinationQuery.toLowerCase())
  );

  return (
    <div className="min-h-[85vh] py-6 sm:py-10 max-w-5xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* 1. TOP DYNAMIC STEPPER CAPSULE */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-full border border-slate-200/90 dark:border-slate-800 shadow-sm p-2 sm:p-2.5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 px-2 sm:px-4">
          {/* Step 1: Account Basics */}
          <button
            type="button"
            onClick={() => {
              if (step > 1) setStep(1);
            }}
            className={`flex items-center gap-3 w-full sm:w-auto text-left transition-all ${
              step > 1 ? 'cursor-pointer hover:opacity-80' : 'cursor-default'
            }`}
          >
            {step > 1 ? (
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            ) : (
              <div className="w-7 h-7 rounded-full bg-[#ff5a36] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                1
              </div>
            )}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block leading-none">
                {step === 1 ? 'Current Phase' : 'Step 01'}
              </span>
              <span
                className={`text-xs font-bold flex items-center gap-1.5 ${
                  step === 1 ? 'text-[#ff5a36]' : 'text-slate-900 dark:text-white'
                }`}
              >
                Account Basics
                <Lock className="w-3 h-3 text-slate-400" />
              </span>
            </div>
            {step === 1 && <span className="w-2 h-2 rounded-full bg-[#ff5a36] animate-pulse ml-1" />}
          </button>

          <div className="hidden sm:block w-8 h-[1px] bg-slate-200 dark:bg-slate-800" />

          {/* Step 2: Travel Preferences */}
          <button
            type="button"
            onClick={() => {
              if (!fullName.trim() || !email.trim() || !password) {
                setErrorMessage('Please complete your account basics first.');
                return;
              }
              if (password.length < 8) {
                setErrorMessage('Password must be at least 8 characters long.');
                return;
              }
              if (password !== confirmPassword) {
                setErrorMessage('Passwords do not match. Please ensure both passwords match.');
                return;
              }
              setErrorMessage('');
              setStep(2);
            }}
            className={`flex items-center gap-3 w-full sm:w-auto text-left transition-all ${
              step === 2
                ? 'p-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-full bg-orange-50/80 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/40'
                : step > 2
                ? 'cursor-pointer hover:opacity-80'
                : 'opacity-60 cursor-default'
            }`}
          >
            {step > 2 ? (
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            ) : (
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ${
                  step === 2
                    ? 'bg-[#ff5a36] text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}
              >
                2
              </div>
            )}
            <div>
              <span
                className={`text-[10px] font-mono uppercase tracking-wider block leading-none ${
                  step === 2 ? 'text-[#ff5a36] font-bold' : 'text-slate-400'
                }`}
              >
                {step === 2 ? 'Current Phase' : 'Step 02'}
              </span>
              <span
                className={`text-xs font-bold ${
                  step === 2
                    ? 'text-slate-900 dark:text-white'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                Personalize Preferences
              </span>
            </div>
            {step === 2 && <span className="w-2 h-2 rounded-full bg-[#ff5a36] animate-pulse ml-1" />}
          </button>

          <div className="hidden sm:block w-8 h-[1px] bg-slate-200 dark:bg-slate-800" />

          {/* Step 3: First Destination */}
          <div
            className={`flex items-center gap-3 w-full sm:w-auto ${
              step === 3
                ? 'p-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-full bg-orange-50/80 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/40'
                : 'opacity-60'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ${
                step === 3
                  ? 'bg-[#ff5a36] text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}
            >
              3
            </div>
            <div>
              <span
                className={`text-[10px] font-mono uppercase tracking-wider block leading-none ${
                  step === 3 ? 'text-[#ff5a36] font-bold' : 'text-slate-400'
                }`}
              >
                {step === 3 ? 'Current Phase' : 'Step 03'}
              </span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                First Destination
                <Compass className="w-3 h-3 text-slate-400" />
              </span>
            </div>
            {step === 3 && <span className="w-2 h-2 rounded-full bg-[#ff5a36] animate-pulse ml-1" />}
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

      {/* ============================================================ */}
      {/* STEP 1: ACCOUNT BASICS                                       */}
      {/* ============================================================ */}
      {step === 1 && (
        <form
          onSubmit={handleProceedToPreferences}
          className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-6 sm:p-10 space-y-8 animate-in fade-in duration-200"
        >
          <div className="max-w-2xl space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              Step 01 • Free Forever for Explorers
            </span>

            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
              Create Your Free Account
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
              Start crafting intelligent journeys in minutes. Built for mindful, effortless exploration.
            </p>
          </div>

          {/* Social Auth Buttons */}
          <div className="grid grid-cols-2 gap-3 max-w-md">
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
              <span>Quick Demo Google</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setFullName('Sarah Parker');
                setEmail('sarah.parker@apple.id');
                setPassword('Password123!');
                setConfirmPassword('Password123!');
              }}
              className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors shadow-2xs"
            >
              <svg className="w-4 h-4 fill-current text-slate-900 dark:text-white" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.62-.75 1.04-1.8 0.92-2.84-.9.04-1.99.6-2.64 1.36-.57.65-1.07 1.72-.94 2.74 1 .08 2.03-.51 2.66-1.26z" />
              </svg>
              <span>Quick Demo Apple</span>
            </button>
          </div>

          <div className="relative flex items-center justify-start max-w-xl">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            <span className="absolute bg-white dark:bg-slate-900 pr-3 text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Or Register With Email
            </span>
          </div>

          {/* Form Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl">
            {/* Full Name */}
            <div className="space-y-1.5 sm:col-span-2">
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
            <div className="space-y-1.5 sm:col-span-2">
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
                  Password
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
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="••••••••••••"
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

              {/* 4-Segment Strength Indicator */}
              {password && (
                <div className="pt-1 space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">Security</span>
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
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="••••••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all font-medium border ${
                    isPasswordMismatch
                      ? 'border-rose-500 bg-rose-50/40 dark:bg-rose-950/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                      : isPasswordMatch
                      ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 focus:border-[#ff5a36] focus:ring-2 focus:ring-[#ff5a36]/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Real-time Inline Feedback for Confirm Password */}
              {isPasswordMismatch && (
                <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-semibold pt-1 animate-in fade-in duration-150">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                  <span>Passwords do not match. Please ensure both passwords match.</span>
                </div>
              )}
              {isPasswordMatch && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold pt-1 animate-in fade-in duration-150">
                  <Check className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                  <span>Passwords match!</span>
                </div>
              )}
            </div>
          </div>

          {/* Form-level Error Banner for Instant Visibility */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center gap-3 text-xs text-rose-700 dark:text-rose-300 font-semibold animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-xs text-slate-500">
                Already registered?{' '}
                <Link to="/login" className="font-bold text-[#ff5a36] hover:underline">
                  Sign In instead
                </Link>
              </span>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#ff5a36] to-[#f97316] hover:from-[#e04825] hover:to-[#ea580c] text-white text-sm font-semibold shadow-md shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Continue to Preferences</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* ============================================================ */}
      {/* STEP 2: PERSONALIZE YOUR PREFERENCES (WITH SKIP OPTION)       */}
      {/* ============================================================ */}
      {step === 2 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-6 sm:p-10 space-y-8 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#ff5a36]">
                <Sliders className="w-5 h-5" />
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
                  Personalize Your Preferences
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                Curate your travel temperament. Real-time itinerary weights and currency adapt immediately.
              </p>
            </div>

            {/* Prominent Skip Button */}
            <button
              type="button"
              onClick={() => {
                setStep(3);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 transition-colors self-start sm:self-auto cursor-pointer"
            >
              <span>Skip this step</span>
              <SkipForward className="w-3.5 h-3.5 text-slate-400" />
            </button>
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
                className={`p-4 rounded-2xl border text-left transition-all ${
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
                className={`p-4 rounded-2xl border text-left transition-all ${
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
                className={`p-4 rounded-2xl border text-left transition-all ${
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
                Select your favorites
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {VIBE_TAGS.map((tag) => {
                const Icon = tag.icon;
                const isSelected = selectedVibes.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleVibe(tag.id)}
                    className={`p-3 rounded-xl border flex items-center gap-2 text-left transition-all text-xs font-medium ${
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            {/* Preferred Currency */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Preferred Currency
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                {(['USD', 'EUR', 'JPY', 'GBP', 'AUD', 'CAD'] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setLocalCurrency(c)}
                    className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      currency === c
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {c}
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

          {/* Navigation Controls */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => {
                setStep(1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Basics</span>
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  setStep(3);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                Skip this step
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep(3);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-[#ff5a36] to-[#f97316] hover:from-[#e04825] hover:to-[#ea580c] text-white text-xs sm:text-sm font-semibold shadow-md shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Continue to Destination</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* STEP 3: FIRST DESTINATION (WITH SKIP OPTION)                 */}
      {/* ============================================================ */}
      {step === 3 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-6 sm:p-10 space-y-8 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#ff5a36]">
                <Compass className="w-5 h-5" />
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
                  Where are you dreaming of going first?
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                Choose an initial dream destination to seed your workspace, or search any city across the world.
              </p>
            </div>

            {/* Prominent Skip Button */}
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleCompleteRegistration(false)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 transition-colors self-start sm:self-auto cursor-pointer disabled:opacity-50"
            >
              <span>Skip & Finish</span>
              <SkipForward className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          {/* Search or Custom City Input */}
          <div className="relative max-w-xl">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={customDestinationQuery}
              onChange={(e) => setCustomDestinationQuery(e.target.value)}
              placeholder="Search or enter any city (e.g. Tokyo, Paris, Rome, Bali...)"
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#ff5a36] focus:ring-2 focus:ring-[#ff5a36]/20 transition-all font-medium"
            />
          </div>

          {/* Curated Popular Destinations Grid */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              Curated Destinations
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredDestinations.map((dest) => {
                const isSelected = selectedDestination?.id === dest.id && !customDestinationQuery;
                return (
                  <div
                    key={dest.id}
                    onClick={() => {
                      setSelectedDestination(dest);
                      setCustomDestinationQuery('');
                    }}
                    className={`group relative rounded-2xl overflow-hidden border cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'border-[#ff5a36] ring-2 ring-[#ff5a36]/30 shadow-md scale-[1.02]'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="h-36 w-full relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={dest.image}
                        alt={dest.city}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                      <div className="absolute top-2.5 left-2.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 backdrop-blur-md">
                          {dest.tag}
                        </span>
                      </div>

                      {isSelected && (
                        <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-[#ff5a36] text-white flex items-center justify-center shadow-xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}

                      <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                        <h3 className="font-bold text-sm leading-tight">{dest.city}</h3>
                        <p className="text-[11px] text-slate-200 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#ff5a36]" />
                          <span>{dest.country}</span>
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-white dark:bg-slate-850">
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {dest.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => {
                setStep(2);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Preferences</span>
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleCompleteRegistration(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer disabled:opacity-50"
              >
                Skip & Finish
              </button>

              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleCompleteRegistration(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#ff5a36] to-[#f97316] hover:from-[#e04825] hover:to-[#ea580c] text-white text-xs sm:text-sm font-semibold shadow-md shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Setting Up Account...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Setup & Start Planning</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
