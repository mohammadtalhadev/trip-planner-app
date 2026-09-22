import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  Bell,
  Plus,
  Sun,
  Moon,
  Menu,
  X,
  Settings,
  Bookmark,
  Map,
  Compass,
  DollarSign,
  LogOut,
  LogIn,
  User,
  ArrowRight,
} from 'lucide-react';
import { usePreferencesStore } from '../../store/usePreferencesStore';
import { useSavedPlacesStore } from '../../store/useSavedPlacesStore';
import { useTripStore } from '../../store/useTripStore';
import { useUserStore } from '../../store/useUserStore';
import { POPULAR_DESTINATIONS } from '../../services/geoapify';
import { cn } from '../../utils/cn';

interface NavbarProps {
  onOpenCreateTrip?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCreateTrip }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Stores
  const { preferences, setTheme } = usePreferencesStore();
  const savedPlaces = useSavedPlacesStore((state) => state.savedPlaces);
  const { trips, currentTripId } = useTripStore();
  const {
    user,
    notifications,
    login,
    logout,
    markAllNotificationsAsRead,
    clearNotifications,
  } = useUserStore();

  // Local state for search & dropdowns
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Unread notifications count
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Active target for Budget & Itinerary
  const activeTripTarget = currentTripId || (trips.length > 0 ? trips[0].id : null);
  const itineraryLink = activeTripTarget ? `/trips/${activeTripTarget}/itinerary` : '/trips';
  const budgetLink = activeTripTarget ? `/trips/${activeTripTarget}/budget` : '/trips';

  // Toggle Theme
  const toggleTheme = () => {
    const nextTheme = preferences.theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  // Keyboard shortcut listener: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchFocused(true);
      }
      if (e.key === 'Escape') {
        setIsSearchFocused(false);
        setIsNotificationsOpen(false);
        setIsProfileOpen(false);
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside listeners to close flyouts
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchFocused(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(e.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter search suggestions
  const filteredSuggestions = searchQuery.trim()
    ? POPULAR_DESTINATIONS.filter(
        (dest) =>
          dest.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dest.country.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : POPULAR_DESTINATIONS.slice(0, 4);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/destinations?search=${encodeURIComponent(searchQuery.trim())}`);
    setIsSearchFocused(false);
    searchInputRef.current?.blur();
  };

  const handleSelectDestination = (city: string, id: string) => {
    setSearchQuery(city);
    setIsSearchFocused(false);
    navigate(`/destinations/${id}`);
  };

  // Determine active tab state
  const isDiscoverActive =
    location.pathname === '/' ||
    location.pathname.startsWith('/destinations');
  const isItineraryActive =
    location.pathname.startsWith('/trips') && !location.pathname.includes('/budget');
  const isBudgetActive = location.pathname.includes('/budget');
  const isSavedActive = location.pathname.startsWith('/saved');
  const isSettingsActive = location.pathname.startsWith('/settings');

  return (
    <nav className="w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full border border-slate-200/80 dark:border-slate-800 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] px-3 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-4 relative transition-colors duration-200">
      {/* LEFT SECTION: Logo & Header Search Bar */}
      <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
        {/* Logo matching Light Frost design */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group shrink-0"
          title="TripPlanner Home"
        >
          <div className="w-8 h-8 rounded-xl bg-[#c2410c] flex items-center justify-center text-white shadow-sm shadow-orange-500/25 transition-transform duration-200 group-hover:scale-105">
            {/* Sparkling 4-point star icon */}
            <svg
              className="w-4 h-4 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
            </svg>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-sans font-bold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white leading-none hidden xs:inline-block">
              TripPlanner
            </span>
            <span className="hidden sm:inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-orange-100 dark:bg-orange-950/70 text-[#c2410c] dark:text-[#ea580c] uppercase font-mono tracking-wider">
              AI v2.4
            </span>
          </div>
        </Link>

        {/* Integrated Search Bar with ⌘K shortcut */}
        <div ref={searchContainerRef} className="relative">
          <form
            onSubmit={handleSearchSubmit}
            className={cn(
              'flex items-center rounded-full bg-stone-100/90 dark:bg-stone-800/90 border border-stone-200/80 dark:border-stone-700/80 px-3 py-1.5 transition-all duration-200',
              isSearchFocused
                ? 'ring-2 ring-sky-500/25 border-sky-500 bg-white dark:bg-stone-800 shadow-sm'
                : 'hover:border-stone-300 dark:hover:border-stone-600'
            )}
          >
            <Search className="w-3.5 h-3.5 text-stone-400 shrink-0 mr-2" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search places..."
              className="bg-transparent text-xs text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none w-24 sm:w-32 md:w-36 lg:w-44 transition-all"
            />
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium text-stone-400 dark:text-stone-500 bg-white dark:bg-stone-700/90 border border-stone-200 dark:border-stone-600 rounded shadow-2xs select-none ml-1.5 shrink-0">
              ⌘K
            </kbd>
          </form>

          {/* Autocomplete / Instant Suggestions Dropdown */}
          {isSearchFocused && (
            <div className="absolute left-0 top-full mt-2 w-72 sm:w-80 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-stone-400 dark:text-stone-500 flex items-center justify-between">
                <span>{searchQuery.trim() ? 'Matching Places' : 'Popular Destinations'}</span>
                <span className="text-[9px] lowercase font-sans">Press ↵ to view all</span>
              </div>
              <div className="space-y-0.5 mt-1">
                {filteredSuggestions.map((dest) => (
                  <button
                    key={dest.id}
                    type="button"
                    onClick={() => handleSelectDestination(dest.city, dest.id)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-stone-100 dark:hover:bg-stone-800/80 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center text-xs font-bold">
                        {dest.city.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-stone-800 dark:text-stone-200 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                          {dest.city}
                        </div>
                        <div className="text-[10px] text-stone-400 dark:text-stone-500">
                          {dest.country}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-stone-400 group-hover:text-stone-700 dark:group-hover:text-stone-300">
                      Explore →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CENTER SECTION: Segmented Pill Navigation Tabs */}
      <div className="hidden lg:flex items-center bg-stone-100/80 dark:bg-stone-800/70 p-1 rounded-full border border-stone-200/60 dark:border-stone-700/60">
        {/* Discover */}
        <Link
          to="/"
          className={cn(
            'text-xs font-medium px-4 py-1.5 rounded-full transition-all duration-150',
            isDiscoverActive
              ? 'bg-[#0ea5e9] text-white font-semibold shadow-sm shadow-sky-500/25'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
          )}
        >
          Discover
        </Link>

        {/* Itinerary */}
        <Link
          to={itineraryLink}
          className={cn(
            'text-xs font-medium px-4 py-1.5 rounded-full transition-all duration-150',
            isItineraryActive
              ? 'bg-[#0ea5e9] text-white font-semibold shadow-sm shadow-sky-500/25'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
          )}
        >
          Itinerary
        </Link>

        {/* Budget */}
        <Link
          to={budgetLink}
          className={cn(
            'text-xs font-medium px-4 py-1.5 rounded-full transition-all duration-150',
            isBudgetActive
              ? 'bg-[#0ea5e9] text-white font-semibold shadow-sm shadow-sky-500/25'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
          )}
        >
          Budget
        </Link>

        {/* Saved */}
        <Link
          to="/saved"
          className={cn(
            'text-xs font-medium px-4 py-1.5 rounded-full transition-all duration-150 relative flex items-center gap-1.5',
            isSavedActive
              ? 'bg-[#0ea5e9] text-white font-semibold shadow-sm shadow-sky-500/25'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
          )}
        >
          <span>Saved</span>
          {savedPlaces.length > 0 && (
            <span
              className={cn(
                'text-[9px] px-1.5 py-0.2 rounded-full font-bold',
                isSavedActive
                  ? 'bg-white/20 text-white'
                  : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
              )}
            >
              {savedPlaces.length}
            </span>
          )}
        </Link>

        {/* Settings */}
        <Link
          to="/settings"
          className={cn(
            'text-xs font-medium px-4 py-1.5 rounded-full transition-all duration-150',
            isSettingsActive
              ? 'bg-[#0ea5e9] text-white font-semibold shadow-sm shadow-sky-500/25'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
          )}
        >
          Settings
        </Link>
      </div>

      {/* RIGHT SECTION: Notification Bell with Blue Dot & Profile Picture */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Notification Bell */}
        <div ref={notificationsRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setIsNotificationsOpen((prev) => !prev);
              setIsProfileOpen(false);
            }}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 flex items-center justify-center transition-colors relative"
            aria-label="View notifications"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-slate-700 dark:text-slate-200" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#0ea5e9] border-2 border-white dark:border-slate-900 shadow-xs" />
            )}
          </button>

          {/* Notifications Flyout */}
          {isNotificationsOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-88 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100 dark:border-stone-800 px-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-900 dark:text-white">
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 text-[10px] font-bold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-[10px] font-medium text-sky-600 dark:text-sky-400 hover:underline"
                  >
                    Mark read
                  </button>
                )}
              </div>

              <div className="space-y-1.5 max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-stone-400">
                    No new alerts or flight changes.
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={cn(
                        'p-2.5 rounded-xl border text-xs transition-colors',
                        notif.read
                          ? 'bg-stone-50/50 dark:bg-stone-800/40 border-stone-100 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                          : 'bg-sky-50/50 dark:bg-sky-950/20 border-sky-100 dark:border-sky-900/40 text-stone-900 dark:text-stone-100'
                      )}
                    >
                      <div className="flex items-center justify-between font-semibold mb-0.5">
                        <span className="text-stone-900 dark:text-white text-xs">
                          {notif.title}
                        </span>
                        <span className="text-[10px] font-mono text-stone-400">
                          {notif.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {notifications.length > 0 && (
                <div className="pt-2 mt-2 border-t border-stone-100 dark:border-stone-800 flex justify-end">
                  <button
                    onClick={clearNotifications}
                    className="text-[10px] text-stone-400 hover:text-stone-700 dark:hover:text-stone-300"
                  >
                    Clear history
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile Picture Avatar (Shown after login) */}
        <div ref={profileRef} className="relative">
          {user.isLoggedIn ? (
            <button
              type="button"
              onClick={() => {
                setIsProfileOpen((prev) => !prev);
                setIsNotificationsOpen(false);
              }}
              className="flex items-center focus:outline-none group"
              aria-label="Open user profile menu"
            >
              <div className="w-9 h-9 rounded-full ring-2 ring-[#38bdf8] p-0.5 overflow-hidden transition-all shadow-sm">
                <img
                  src={user.avatar || '/avatar.png'}
                  alt={user.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
                  }}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsProfileOpen((prev) => !prev);
                setIsNotificationsOpen(false);
              }}
              className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 flex items-center justify-center text-slate-700 dark:text-slate-200 transition-colors"
              aria-label="Account sign in"
              title="Account & Sign In"
            >
              <User className="w-4 h-4" />
            </button>
          )}

          {/* User Profile Flyout Menu */}
          {isProfileOpen && user.isLoggedIn && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              {/* Profile Card Header */}
              <div className="flex items-center gap-3 p-2 rounded-xl bg-stone-50 dark:bg-stone-800/60 mb-2 border border-stone-100 dark:border-stone-800">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-sky-400"
                />
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-stone-900 dark:text-white truncate">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-stone-400 truncate">
                    {user.email}
                  </div>
                  <div className="inline-block mt-0.5 px-1.5 py-0.2 rounded-full bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 text-[9px] font-bold">
                    {user.tier}
                  </div>
                </div>
              </div>

              {/* Navigation Quick Links */}
              <div className="space-y-0.5 text-xs font-medium text-stone-700 dark:text-stone-300">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    if (onOpenCreateTrip) onOpenCreateTrip();
                    else navigate('/trips/new');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-left transition-colors text-sky-600 dark:text-sky-400 font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Vacation</span>
                </button>

                <Link
                  to="/trips"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  <Map className="w-4 h-4 text-stone-400" />
                  <span>My Itineraries</span>
                </Link>

                <Link
                  to="/saved"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  <Bookmark className="w-4 h-4 text-stone-400" />
                  <span>Saved Places</span>
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  <Settings className="w-4 h-4 text-stone-400" />
                  <span>Settings & Currency</span>
                </Link>
              </div>

              <div className="my-2 border-t border-stone-100 dark:border-stone-800" />

              {/* Theme Switcher Quick Toggle */}
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-medium text-stone-700 dark:text-stone-300 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  {preferences.theme === 'dark' ? (
                    <Sun className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Moon className="w-4 h-4 text-stone-500" />
                  )}
                  <span>Theme: {preferences.theme === 'dark' ? 'Dark' : 'Light'}</span>
                </div>
                <span className="text-[10px] text-stone-400 uppercase font-mono">Toggle</span>
              </button>

              {/* Sign Out */}
              <button
                onClick={() => {
                  logout();
                  setIsProfileOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-medium transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}

          {/* Quick Sign In Popover (When Logged Out) */}
          {isProfileOpen && !user.isLoggedIn && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-950/70 text-[#c2410c] dark:text-[#ea580c] flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900 dark:text-white">
                    Sign In to TripPlanner
                  </h4>
                  <p className="text-[10px] text-stone-400">
                    Access private ledgers & DP
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  login();
                  setIsProfileOpen(false);
                }}
                className="w-full py-2 px-3 rounded-xl bg-[#c2410c] hover:bg-[#b91c1c] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In as Sophia</span>
              </button>
            </div>
          )}
        </div>

        {/* Start Planning Free CTA button in terracotta */}
        <button
          onClick={() => {
            if (onOpenCreateTrip) onOpenCreateTrip();
            else navigate('/trips/new');
          }}
          className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 bg-[#c2410c] hover:bg-[#b91c1c] text-white text-xs font-semibold rounded-full shadow-sm shadow-orange-500/20 transition-all hover:scale-[1.02]"
        >
          <span>Start Planning Free</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {/* Mobile Hamburger Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="lg:hidden p-2 rounded-full text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* MOBILE EXPANDED MENU DRAWER */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 mt-2 p-3 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl z-50 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-2 gap-1.5">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                'px-3.5 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 text-center justify-center transition-colors',
                isDiscoverActive
                  ? 'bg-[#0ea5e9] text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
              )}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Discover</span>
            </Link>

            <Link
              to={itineraryLink}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                'px-3.5 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 text-center justify-center transition-colors',
                isItineraryActive
                  ? 'bg-[#0ea5e9] text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
              )}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Itinerary</span>
            </Link>

            <Link
              to={budgetLink}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                'px-3.5 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 text-center justify-center transition-colors',
                isBudgetActive
                  ? 'bg-[#0ea5e9] text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
              )}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Budget</span>
            </Link>

            <Link
              to="/saved"
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                'px-3.5 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 text-center justify-center transition-colors',
                isSavedActive
                  ? 'bg-[#0ea5e9] text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
              )}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Saved ({savedPlaces.length})</span>
            </Link>
          </div>

          <div className="pt-1 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between px-1">
            <Link
              to="/settings"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white py-1.5"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Link>

            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 text-xs font-medium text-stone-600 dark:text-stone-400 py-1.5"
            >
              {preferences.theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-stone-600" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>

          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              if (onOpenCreateTrip) onOpenCreateTrip();
              else navigate('/trips/new');
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-stone-950 dark:bg-white text-white dark:text-stone-950 font-semibold text-xs rounded-2xl shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Plan New Vacation</span>
          </button>
        </div>
      )}
    </nav>
  );
};
