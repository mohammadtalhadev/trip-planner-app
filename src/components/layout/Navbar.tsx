import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Compass,
  Map,
  Bookmark,
  Settings,
  Plus,
  Sun,
  Moon,
  Menu,
  X,
  Globe,
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
    { to: '/destinations', label: 'Explore', icon: Globe },
    { to: '/trips', label: 'Itineraries', icon: Map },
    {
      to: '/saved',
      label: 'Bookmarks',
      icon: Bookmark,
      badge: savedPlaces.length > 0 ? savedPlaces.length : null,
    },
    { to: '/settings', label: 'Preferences', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#fafaf9]/85 dark:bg-[#0c0e12]/85 backdrop-blur-md border-b border-stone-200/70 dark:border-stone-800/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo / Editorial Brand */}
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-9 h-9 rounded-xl bg-stone-900 dark:bg-stone-100 flex items-center justify-center text-white dark:text-stone-900 transition-transform duration-200 group-hover:scale-105 shadow-sm">
            <Compass className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl font-bold tracking-tight text-stone-900 dark:text-white leading-none">
              TripPlanner
            </span>
            <span className="text-[10px] tracking-wider uppercase font-medium text-stone-400 dark:text-stone-500 font-sans mt-0.5">
              Bespoke Journeys
            </span>
          </div>
        </Link>

        {/* Center Minimalist Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-stone-100/70 dark:bg-stone-900/60 p-1 rounded-2xl border border-stone-200/60 dark:border-stone-800/50">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all relative',
                    isActive
                      ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white font-semibold shadow-sm'
                      : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                  )
                }
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
                {link.badge !== null && (
                  <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-stone-900 dark:bg-white text-white dark:text-stone-900">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Currency indicator pill */}
          <Link
            to="/settings"
            className="hidden sm:inline-flex items-center px-2.5 py-1.5 rounded-xl text-[11px] font-semibold text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800/60 transition-colors border border-transparent hover:border-stone-200 dark:hover:border-stone-700"
            title="Active Currency"
          >
            <span>{preferences.currency}</span>
            <span className="mx-1 text-stone-300 dark:text-stone-600">•</span>
            <span>{preferences.tempUnit === 'celsius' ? '°C' : '°F'}</span>
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-stone-200/80 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {preferences.theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-stone-600" />
            )}
          </button>

          {/* New Trip Button */}
          <button
            onClick={() => {
              if (onOpenCreateTrip) onOpenCreateTrip();
              else navigate('/trips/new');
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 dark:bg-white dark:hover:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold rounded-xl shadow-sm transition-all hover:scale-[1.01]"
          >
            <Plus className="w-4 h-4" />
            <span>Plan Trip</span>
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            aria-label="Open menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-5 border-t border-stone-200 dark:border-stone-800 bg-[#fafaf9] dark:bg-[#0c0e12] space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-stone-200/60 dark:bg-stone-800 text-stone-900 dark:text-white font-bold'
                      : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </div>
                {link.badge !== null && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-stone-900 dark:bg-white text-white dark:text-stone-900">
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
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-semibold text-xs rounded-xl"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Vacation Itinerary</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
