import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Users,
  Compass,
  X,
  ChevronDown,
  Plus,
  Minus,
} from 'lucide-react';

interface DiscoverFilterBarProps {
  onSearch?: (destination: string, dates: string, travelers: number) => void;
}

export const DiscoverFilterBar: React.FC<DiscoverFilterBarProps> = ({ onSearch }) => {
  const navigate = useNavigate();

  const [destination, setDestination] = useState('Kyoto, Japan');
  const [isEditingDestination, setIsEditingDestination] = useState(false);
  const [dateRange, setDateRange] = useState('Oct 14 — Oct 28');
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [travelers, setTravelers] = useState(2);
  const [isTravelersOpen, setIsTravelersOpen] = useState(false);

  const handleClearDestination = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDestination('');
    setIsEditingDestination(true);
  };

  const handleExploreGuides = () => {
    if (onSearch) {
      onSearch(destination, dateRange, travelers);
    }
    const cleanDest = destination.trim() || 'Kyoto';
    navigate(`/destinations?search=${encodeURIComponent(cleanDest)}`);
  };

  return (
    <div className="relative z-30 w-full bg-white dark:bg-slate-900 rounded-2xl sm:rounded-full border border-slate-200/90 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-2.5 sm:p-3 transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
        {/* 1. DESTINATION SELECTOR */}
        <div className="flex-1 flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors relative group">
          <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 block leading-tight">
              Destination
            </span>
            {isEditingDestination ? (
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onBlur={() => setIsEditingDestination(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setIsEditingDestination(false);
                }}
                autoFocus
                placeholder="Where to? (e.g. Kyoto, Paris)"
                className="bg-transparent text-sm font-semibold text-slate-900 dark:text-white focus:outline-none w-full"
              />
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingDestination(true)}
                className="text-left w-full truncate text-sm font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {destination || 'Select destination...'}
              </button>
            )}
          </div>

          {destination && (
            <button
              type="button"
              onClick={handleClearDestination}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
              title="Clear destination"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="hidden lg:block w-[1px] h-8 bg-slate-200 dark:bg-slate-800" />

        {/* 2. TRAVEL WINDOW SELECTOR */}
        <div className="flex-1 relative">
          <button
            type="button"
            onClick={() => {
              setIsDateOpen((prev) => !prev);
              setIsTravelersOpen(false);
            }}
            className="w-full flex items-center justify-between gap-3 px-3 py-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-950/60 text-[#ff5a36] flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 block leading-tight">
                  Travel Window
                </span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white truncate block">
                  {dateRange}
                </span>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
          </button>

          {/* Quick Date Range Popover */}
          {isDateOpen && (
            <div className="absolute left-0 lg:left-auto lg:right-0 top-full mt-2 w-64 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white block px-1">
                Select Travel Window
              </span>
              <div className="space-y-1">
                {[
                  'Oct 14 — Oct 28',
                  'Nov 02 — Nov 16',
                  'Dec 10 — Dec 24',
                  'Spring 2027 (Mar 15 — Mar 29)',
                  'Custom Dates',
                ].map((range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() => {
                      setDateRange(range);
                      setIsDateOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                      dateRange === range
                        ? 'bg-[#ff5a36] text-white font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="hidden lg:block w-[1px] h-8 bg-slate-200 dark:bg-slate-800" />

        {/* 3. TRAVELERS SELECTOR */}
        <div className="flex-1 relative">
          <button
            type="button"
            onClick={() => {
              setIsTravelersOpen((prev) => !prev);
              setIsDateOpen(false);
            }}
            className="w-full flex items-center justify-between gap-3 px-3 py-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 block leading-tight">
                  Travelers
                </span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white truncate block">
                  {travelers} {travelers === 1 ? 'Explorer' : 'Explorers'}
                </span>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
          </button>

          {/* Travelers Popover */}
          {isTravelersOpen && (
            <div className="absolute left-0 lg:left-auto lg:right-0 top-full mt-2 w-56 p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Travelers
                  </span>
                  <span className="text-[10px] text-slate-400">Ages 13 and above</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={travelers <= 1}
                    onClick={() => setTravelers((prev) => Math.max(1, prev - 1))}
                    className="w-7 h-7 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-bold w-4 text-center text-slate-900 dark:text-white">
                    {travelers}
                  </span>
                  <button
                    type="button"
                    disabled={travelers >= 10}
                    onClick={() => setTravelers((prev) => Math.min(10, prev + 1))}
                    className="w-7 h-7 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsTravelersOpen(false)}
                className="w-full py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>

        {/* 4. EXPLORE GUIDES CTA BUTTON */}
        <button
          type="button"
          onClick={handleExploreGuides}
          className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#ff5a36] hover:bg-[#e04825] text-white font-semibold text-sm rounded-xl sm:rounded-full shadow-sm shadow-orange-500/20 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shrink-0"
        >
          <Compass className="w-4 h-4" />
          <span>Explore Guides</span>
        </button>
      </div>
    </div>
  );
};
