import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AtSign,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { authenticateUser } from '../services/auth';
import { useUserStore } from '../store/useUserStore';
import { usePreferencesStore } from '../store/usePreferencesStore';
import { CurrencyCode } from '../types/settings';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useUserStore();
  const { setCurrency } = usePreferencesStore();

  const [email, setEmail] = useState('admin@tripplanner.com');
  const [password, setPassword] = useState('Admin@321');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotTip, setShowForgotTip] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const { user: authedUser, preferences } = await authenticateUser(email, password);

      // Save user session to Zustand store
      setUser(authedUser);

      // If user had saved currency preferences, sync them
      if (preferences?.currency) {
        setCurrency(preferences.currency as CurrencyCode);
      }

      // Redirect immediately to Discover page
      navigate('/', { replace: true });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Failed to sign in. Please verify your email and password.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAdminLogin = async () => {
    setEmail('admin@tripplanner.com');
    setPassword('Admin@321');
    setErrorMessage('');
    setIsLoading(true);

    try {
      const { user: authedUser, preferences } = await authenticateUser(
        'admin@tripplanner.com',
        'Admin@321'
      );
      setUser(authedUser);
      if (preferences?.currency) {
        setCurrency(preferences.currency as CurrencyCode);
      }
      navigate('/', { replace: true });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8 sm:py-14 px-4 max-w-xl mx-auto">
      <div className="w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl p-6 sm:p-10 space-y-6 sm:space-y-7">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-xs transition-transform duration-200 group-hover:scale-105">
              <img src="/logo.png" alt="Trip Planner Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-sans font-bold text-xl tracking-tight text-slate-900 dark:text-white leading-none">
              Trip Planner
            </span>
          </Link>

          <div className="pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-orange-50 dark:bg-orange-950/60 text-[#ff5a36] border border-orange-100 dark:border-orange-900/40">
              <Sparkles className="w-3 h-3 text-[#ff5a36]" />
              Welcome Back
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white tracking-tight mt-2">
              Sign In to Your Account
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed max-w-sm mx-auto">
              Access your saved multi-day itineraries, private travel notes, and customized budgets.
            </p>
          </div>
        </div>

        {/* Quick Admin Auto-Sign In Banner */}
        <div className="p-3.5 rounded-2xl bg-orange-50/80 dark:bg-orange-950/30 border border-orange-200/80 dark:border-orange-900/40 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <ShieldCheck className="w-4 h-4 text-[#ff5a36] shrink-0" />
            <div className="min-w-0">
              <span className="font-bold text-slate-900 dark:text-white block truncate">
                Pre-Seeded Admin Access
              </span>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate block">
                admin@tripplanner.com • Admin@321
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleQuickAdminLogin}
            disabled={isLoading}
            className="px-3.5 py-1.5 rounded-full bg-[#ff5a36] hover:bg-[#e04825] text-white text-xs font-semibold shrink-0 shadow-2xs hover:scale-105 active:scale-95 transition-all"
          >
            1-Click Login
          </button>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center gap-2.5 text-xs text-rose-700 dark:text-rose-300 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Social Quick Auth */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleQuickAdminLogin}
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
            onClick={handleQuickAdminLogin}
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
            Or with email & password
          </span>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Email Address
            </label>
            <div className="relative flex items-center">
              <AtSign className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
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
              <button
                type="button"
                onClick={() => setShowForgotTip((prev) => !prev)}
                className="text-[11px] text-[#ff5a36] hover:underline font-medium"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            {showForgotTip && (
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-300 space-y-1 animate-in fade-in duration-150">
                <span className="font-bold block text-slate-900 dark:text-white">Need credentials?</span>
                <span>Use the default seeded admin account:</span>
                <div className="font-mono text-xs text-[#ff5a36] font-semibold">
                  admin@tripplanner.com / Admin@321
                </div>
              </div>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded text-[#ff5a36] focus:ring-[#ff5a36] border-slate-300"
            />
            <label htmlFor="remember" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
              Remember me on this device
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-full bg-gradient-to-r from-[#ff5a36] to-[#f97316] hover:from-[#e04825] hover:to-[#ea580c] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In to Trip Planner</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link to Sign Up */}
        <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800">
          Don't have an account?{' '}
          <Link to="/signup" className="font-bold text-[#ff5a36] hover:underline">
            Create Free Account
          </Link>
        </div>
      </div>
    </div>
  );
};
