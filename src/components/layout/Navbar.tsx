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
  UserCog,
  UserPlus,
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

  // Active target for Budget & Itinerary (always valid and clickable)
  const activeTripTarget = !user.isLoggedIn
    ? 'demo-turkey-vacation'
    : currentTripId || (trips.length > 0 ? trips[0].id : 'demo-turkey-vacation');
  const itineraryLink = `/trips/${activeTripTarget}/itinerary`;
  const budgetLink = `/trips/${activeTripTarget}/budget`;

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

  // Fallback high-res avatar if store has default placeholder
  const avatarSrc =
    user.avatar && user.avatar !== '/avatar.png'
      ? user.avatar
      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';

  return (
    <nav className="w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-full border border-slate-200/90 dark:border-slate-800 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] px-3 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-4 relative transition-colors duration-200">
      {/* LEFT SECTION: Logo, Brand Text & Header Search Bar */}
      <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
        <Link
          to="/"
          className="flex items-center gap-2.5 group shrink-0"
          title="Trip Planner Home"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden shadow-xs transition-transform duration-200 group-hover:scale-105 shrink-0">
            <img
              src="/logo.png"
              alt="Trip Planner Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-sans font-bold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white leading-none">
            Trip Planner
          </span>
        </Link>

        {/* Integrated Search Bar with ⌘K shortcut */}
        <div ref={searchContainerRef} className="relative">
          <form
            onSubmit={handleSearchSubmit}
            className={cn(
              'flex items-center rounded-full bg-[#f1f5f9] dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 px-3.5 py-1.5 transition-all duration-200',
              isSearchFocused
                ? 'ring-2 ring-[#ff5a36]/25 border-[#ff5a36] bg-white dark:bg-slate-800 shadow-xs'
                : 'hover:border-slate-300 dark:hover:border-slate-600'
            )}
          >
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-2" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search places..."
              className="bg-transparent text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none w-24 sm:w-32 md:w-36 lg:w-44 transition-all"
            />
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 dark:text-slate-400 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md shadow-2xs select-none ml-1.5 shrink-0">
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
                      <div className="w-7 h-7 rounded-lg bg-orange-50 dark:bg-orange-950/60 text-[#ff5a36] flex items-center justify-center text-xs font-bold">
                        {dest.city.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-stone-800 dark:text-stone-200 group-hover:text-[#ff5a36] transition-colors">
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
      <div className="hidden lg:flex items-center bg-[#f1f5f9] dark:bg-slate-800/85 p-1 rounded-full border border-slate-200/60 dark:border-slate-700/60">
        {/* Discover */}
        <Link
          to="/"
          className={cn(
            'text-xs px-4 py-1.5 rounded-full transition-all duration-150',
            isDiscoverActive
              ? 'bg-[#ff5a36] text-white font-semibold shadow-xs'
              : 'text-slate-600 dark:text-slate-300 font-medium hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
          )}
        >
          Discover
        </Link>

        {/* Itinerary */}
        <Link
          to={itineraryLink}
          className={cn(
            'text-xs px-4 py-1.5 rounded-full transition-all duration-150',
            isItineraryActive
              ? 'bg-[#ff5a36] text-white font-semibold shadow-xs'
              : 'text-slate-600 dark:text-slate-300 font-medium hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
          )}
        >
          Itinerary
        </Link>

        {/* Budget */}
        <Link
          to={budgetLink}
          title="Budget"
          className={cn(
            'text-xs px-4 py-1.5 rounded-full transition-all duration-150',
            isBudgetActive
              ? 'bg-[#ff5a36] text-white font-semibold shadow-xs'
              : 'text-slate-600 dark:text-slate-300 font-medium hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
          )}
        >
          Budget
        </Link>

        {/* Saved (only shown for logged-in users) */}
        {user.isLoggedIn && (
          <Link
            to="/saved"
            className={cn(
              'text-xs px-4 py-1.5 rounded-full transition-all duration-150 flex items-center gap-1.5',
              isSavedActive
                ? 'bg-[#ff5a36] text-white font-semibold shadow-xs'
                : 'text-slate-600 dark:text-slate-300 font-medium hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
            )}
          >
            <span>Saved</span>
            {savedPlaces.length > 0 && (
              <span
                className={cn(
                  'text-[10px] px-1.5 py-0.2 rounded-full font-bold',
                  isSavedActive
                    ? 'bg-white/25 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                )}
              >
                {savedPlaces.length}
              </span>
            )}
          </Link>
        )}

        {/* Settings */}
        <Link
          to="/settings"
          className={cn(
            'text-xs px-4 py-1.5 rounded-full transition-all duration-150',
            isSettingsActive
              ? 'bg-[#ff5a36] text-white font-semibold shadow-xs'
              : 'text-slate-600 dark:text-slate-300 font-medium hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
          )}
        >
          Settings
        </Link>
      </div>

      {/* RIGHT SECTION: Notification Bell with Blue Dot, User Avatar with Coral Ring, & Start Planning CTA */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Display Environment (Theme Mode) Quick Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className={cn(
            'w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 relative group cursor-pointer',
            preferences.theme === 'dark'
              ? 'bg-slate-800 text-amber-400 hover:bg-slate-700 hover:text-amber-300 ring-1 ring-slate-700/80 shadow-xs'
              : 'bg-[#f1f5f9] text-slate-700 hover:bg-slate-200/80 hover:text-slate-900 ring-1 ring-slate-200/70 shadow-2xs'
          )}
          aria-label={preferences.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          title={preferences.theme === 'dark' ? 'Display Environment: Dark (Switch to Light Mode)' : 'Display Environment: Light (Switch to Dark Mode)'}
        >
          {preferences.theme === 'dark' ? (
            <Sun className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
          ) : (
            <Moon className="w-4 h-4 transition-transform duration-300 group-hover:-rotate-12" />
          )}
        </button>

        {/* Notification Bell */}
        <div ref={notificationsRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setIsNotificationsOpen((prev) => !prev);
              setIsProfileOpen(false);
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#f1f5f9] dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 flex items-center justify-center transition-colors relative"
            aria-label="View notifications"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-slate-700 dark:text-slate-200" />
            {/* Vivid blue notification dot matching screenshot */}
            <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-[#00a6ff] border-2 border-white dark:border-slate-900 shadow-xs" />
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
                    <span className="px-1.5 py-0.2 rounded-full bg-orange-100 dark:bg-orange-950/80 text-[#ff5a36] text-[10px] font-bold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-[10px] font-medium text-[#ff5a36] hover:underline"
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
                          : 'bg-orange-50/50 dark:bg-orange-950/20 border-orange-100 dark:border-orange-900/40 text-stone-900 dark:text-stone-100'
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

        {/* Profile Picture Avatar with Coral-Orange Ring */}
        <div ref={profileRef} className="relative">
          {user.isLoggedIn ? (
            <button
              type="button"
              onClick={() => {
                setIsProfileOpen((prev) => !prev);
                setIsNotificationsOpen(false);
              }}
              className="flex items-center focus:outline-none group rounded-full"
              aria-label="Open user profile menu"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full ring-[2.5px] ring-[#ff5a36] ring-offset-2 ring-offset-white dark:ring-offset-slate-900 overflow-hidden transition-all shadow-xs shrink-0 bg-slate-900 hover:opacity-95">
                <img
                  src={avatarSrc}
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
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full ring-[2.5px] ring-[#ff5a36] ring-offset-2 ring-offset-white dark:ring-offset-slate-900 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 flex items-center justify-center text-slate-700 dark:text-slate-200 transition-colors shadow-xs"
              aria-label="Account sign in"
              title="Account & Sign In"
            >
              <User className="w-4 h-4" />
            </button>
          )}

          {/* User Profile Flyout Menu */}
          {isProfileOpen && user.isLoggedIn && (
            <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              {/* Profile Card Header */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 mb-2 border border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                  <img
                    src={avatarSrc}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-[#ff5a36] shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-stone-900 dark:text-white truncate">
                      {user.name}
                    </div>
                    <div className="text-[10px] text-stone-400 truncate">
                      {user.email}
                    </div>
                    <div className="inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/80 text-[#ff5a36] text-[10px] font-bold tracking-tight whitespace-nowrap shadow-2xs">
                      <span className="truncate max-w-[160px]">{user.tier}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate('/settings', { state: { openEditProfile: true } });
                  }}
                  className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-500 hover:text-stone-800 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors cursor-pointer"
                  title="Edit Profile Settings"
                >
                  <UserCog className="w-3.5 h-3.5 text-[#ff5a36]" />
                </button>
              </div>

              {/* Navigation Quick Links */}
              <div className="space-y-0.5 text-xs font-medium text-stone-700 dark:text-stone-300">
                <Link
                  to="/settings"
                  state={{ openEditProfile: true }}
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-left transition-colors font-semibold text-[#ff5a36]"
                >
                  <UserCog className="w-4 h-4" />
                  <span>Edit Profile & Settings</span>
                </Link>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    if (onOpenCreateTrip) onOpenCreateTrip();
                    else navigate('/trips/new');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-left transition-colors text-slate-800 dark:text-slate-200 font-semibold"
                >
                  <Plus className="w-4 h-4 text-[#ff5a36]" />
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
                  navigate('/', { replace: true });
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
                <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-950/70 text-[#ff5a36] flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900 dark:text-white">
                    Sign In to Trip Planner
                  </h4>
                  <p className="text-[10px] text-stone-400">
                    Access private ledgers & saved trips
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Link
                  to="/login"
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#ff5a36] hover:bg-[#e04825] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Create Account</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* "Start Planning Free ->" Button with interactive hover effect */}
        <button
          onClick={() => {
            if (!user.isLoggedIn) {
              navigate('/signup');
              return;
            }
            if (onOpenCreateTrip) onOpenCreateTrip();
            else navigate('/trips/new');
          }}
          className="group hidden sm:inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 border border-slate-200/90 dark:border-slate-700/90 rounded-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-semibold text-xs sm:text-sm shadow-2xs hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50/90 dark:hover:bg-slate-750 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
        >
          <span>Start Planning Free</span>
          <ArrowRight className="w-4 h-4 text-slate-700 dark:text-slate-300 transition-transform duration-200 ease-out group-hover:translate-x-1.5" />
        </button>

        {/* Mobile Hamburger Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="lg:hidden p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
                  ? 'bg-[#ff5a36] text-white shadow-xs'
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
                  ? 'bg-[#ff5a36] text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
              )}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Itinerary</span>
            </Link>

            <Link
              to={budgetLink}
              onClick={() => setIsMobileMenuOpen(false)}
              title="Budget"
              className={cn(
                'px-3.5 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 text-center justify-center transition-colors',
                isBudgetActive
                  ? 'bg-[#ff5a36] text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
              )}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Budget</span>
            </Link>

            {user.isLoggedIn && (
              <Link
                to="/saved"
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  'px-3.5 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 text-center justify-center transition-colors',
                  isSavedActive
                    ? 'bg-[#ff5a36] text-white shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                )}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Saved{savedPlaces.length > 0 ? ` (${savedPlaces.length})` : ''}</span>
              </Link>
            )}
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
              if (!user.isLoggedIn) {
                navigate('/signup');
                return;
              }
              if (onOpenCreateTrip) onOpenCreateTrip();
              else navigate('/trips/new');
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#ff5a36] hover:bg-[#e04825] text-white font-semibold text-xs rounded-2xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Plan New Vacation</span>
          </button>

          {user.isLoggedIn ? (
            <button
              onClick={() => {
                logout();
                setIsMobileMenuOpen(false);
                navigate('/', { replace: true });
              }}
              className="w-full flex items-center justify-center gap-2 py-2 text-rose-600 dark:text-rose-400 font-semibold text-xs rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 pt-1">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 py-2 text-center text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 py-2 text-center text-xs font-bold text-white bg-[#ff5a36] rounded-xl"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
