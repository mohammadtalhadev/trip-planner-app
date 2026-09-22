import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Compass,
  Map,
  Bookmark,
  Settings,
  PlusCircle,
  Sun,
  Moon,
  Menu,
  X,
  Globe2,
} from 'lucide-react';
import { usePreferencesStore } from '../../store/usePreferencesStore';
import { useSavedPlacesStore } from '../../store/useSavedPlacesStore';
import { cn } from '../../utils/cn';

interface NavbarProps {
  onOpenCreateTrip?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCreateTrip }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { preferences, setTheme } = usePreferencesStore();
  const savedPlaces = useSavedPlacesStore((state) => state.savedPlaces);

  const toggleTheme = () => {
    const nextTheme = preferences.theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  const navLinks = [
    { to: '/', label: 'Discover', icon: Compass },
    { to: '/destinations', label: 'Destinations', icon: Globe2 },
    { to: '/trips', label: 'My Trips', icon: Map },
    {
      to: '/saved',
      label: 'Saved',
      icon: Bookmark,
      badge: savedPlaces.length > 0 ? savedPlaces.length : null,
    },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Compass className="w-6 h-6 animate-[spin_12s_linear_infinite]" />
          </div>
          <div>
            <span className="font-black text-xl tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              TripPlanner
            </span>
            <span className="hidden sm:inline-block text-[10px] ml-1.5 font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              Pro
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all relative',
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                  )
                }
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
                {link.badge !== null && (
                  <span className="px-1.5 py-0.2 text-[11px] font-bold rounded-full bg-blue-600 text-white">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Quick New Trip Button */}
          <button
            onClick={() => {
              if (onOpenCreateTrip) {
                onOpenCreateTrip();
              } else {
                navigate('/trips/new');
              }
            }}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-xl shadow-sm shadow-blue-500/20 transition-all hover:scale-[1.02]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Trip</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {preferences.theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Open menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors',
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </div>
                {link.badge !== null && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-blue-600 text-white">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
          <div className="pt-3">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (onOpenCreateTrip) onOpenCreateTrip();
                else navigate('/trips/new');
              }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-semibold rounded-xl"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Create New Trip</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
