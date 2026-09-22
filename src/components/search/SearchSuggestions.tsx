import React from 'react';
import { MapPin, Navigation, Compass, AlertCircle } from 'lucide-react';
import { GeoapifyCity, AsyncStatus } from '../../types/api';
import { cn } from '../../utils/cn';

interface SearchSuggestionsProps {
  suggestions: GeoapifyCity[];
  status: AsyncStatus | 'empty' | 'refetching';
  error: string | null;
  selectedIndex: number;
  onSelect: (city: GeoapifyCity) => void;
  query: string;
}

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  status,
  error,
  selectedIndex,
  onSelect,
  query,
}) => {
  if (status === 'idle') return null;

  return (
    <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
      {status === 'loading' && (
        <div className="p-4 flex items-center gap-3 text-slate-500 dark:text-slate-400 text-sm">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin shrink-0" />
          <span>Searching for "{query}"...</span>
        </div>
      )}

      {status === 'error' && (
        <div className="p-4 flex items-center gap-2.5 text-amber-700 dark:text-amber-400 text-sm bg-amber-50/50 dark:bg-amber-950/30">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error || 'Unable to retrieve search results.'}</span>
        </div>
      )}

      {status === 'empty' && (
        <div className="p-6 text-center text-slate-500 dark:text-slate-400 text-sm">
          <Compass className="w-6 h-6 mx-auto mb-2 text-slate-400 dark:text-slate-500" />
          <p className="font-semibold text-slate-700 dark:text-slate-300">No destinations found</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Try another city name like Paris, Tokyo, Istanbul, or London.
          </p>
        </div>
      )}

      {(status === 'success' || status === 'refetching') && suggestions.length > 0 && (
        <ul className="py-2 divide-y divide-slate-100 dark:divide-slate-800/60 max-h-80 overflow-y-auto">
          {suggestions.map((item, index) => {
            const isSelected = index === selectedIndex;
            return (
              <li key={item.id || `${item.lat}-${item.lon}`}>
                <button
                  type="button"
                  onClick={() => onSelect(item)}
                  className={cn(
                    'w-full px-4 py-3 text-left flex items-center justify-between gap-3 transition-colors',
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        'w-8 h-8 rounded-xl flex items-center justify-center shrink-0',
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      )}
                    >
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {item.city}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {item.country} {item.state ? `• ${item.state}` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 shrink-0">
                    <Navigation className="w-3.5 h-3.5" />
                    <span>{item.lat.toFixed(2)}°, {item.lon.toFixed(2)}°</span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
