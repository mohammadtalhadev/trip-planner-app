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
    <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-[#15181e] rounded-2xl shadow-float border border-stone-200 dark:border-stone-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
      {status === 'loading' && (
        <div className="p-4 flex items-center gap-3 text-stone-500 dark:text-stone-400 text-xs">
          <div className="w-3.5 h-3.5 border-2 border-stone-900 dark:border-white border-t-transparent rounded-full animate-spin shrink-0" />
          <span>Locating "{query}" across world databases...</span>
        </div>
      )}

      {status === 'error' && (
        <div className="p-4 flex items-center gap-2.5 text-stone-700 dark:text-stone-300 text-xs bg-amber-50/50 dark:bg-amber-950/20 border-b border-amber-200/40">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{error || 'Unable to retrieve search results.'}</span>
        </div>
      )}

      {status === 'empty' && (
        <div className="p-6 text-center text-stone-500 text-xs">
          <Compass className="w-5 h-5 mx-auto mb-2 text-stone-400" />
          <p className="font-semibold text-stone-700 dark:text-stone-300">No destinations found</p>
          <p className="text-[11px] text-stone-400 mt-0.5">
            Try a major city name like Tokyo, Paris, Istanbul, or Rome.
          </p>
        </div>
      )}

      {(status === 'success' || status === 'refetching') && suggestions.length > 0 && (
        <ul className="py-1.5 divide-y divide-stone-100 dark:divide-stone-800/60 max-h-80 overflow-y-auto">
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
                      ? 'bg-stone-100 dark:bg-stone-800/90 text-stone-900 dark:text-white'
                      : 'hover:bg-stone-50 dark:hover:bg-stone-800/50 text-stone-700 dark:text-stone-300'
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        'w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs',
                        isSelected
                          ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-400'
                      )}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate text-stone-900 dark:text-white">
                        {item.city}
                      </p>
                      <p className="text-[11px] text-stone-400 truncate">
                        {item.country} {item.state ? `• ${item.state}` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-stone-400 shrink-0 font-mono">
                    <Navigation className="w-3 h-3 text-stone-400" />
                    <span>{item.lat.toFixed(1)}°, {item.lon.toFixed(1)}°</span>
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
