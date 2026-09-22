import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2 } from 'lucide-react';
import { useCitySearch } from '../../hooks/useCitySearch';
import { SearchSuggestions } from './SearchSuggestions';
import { GeoapifyCity } from '../../types/api';
import { cn } from '../../utils/cn';

interface CitySearchInputProps {
  placeholder?: string;
  initialValue?: string;
  onSelectCity?: (city: GeoapifyCity) => void;
  className?: string;
  autoFocus?: boolean;
}

export const CitySearchInput: React.FC<CitySearchInputProps> = ({
  placeholder = 'Search destination (e.g. Paris, Tokyo, Istanbul, Rome)...',
  initialValue = '',
  onSelectCity,
  className,
  autoFocus = false,
}) => {
  const navigate = useNavigate();
  const { query, setQuery, results, status, error, clearSearch, isSearching } = useCitySearch(300);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialValue && !query) {
      setQuery(initialValue);
    }
  }, [initialValue]);

  // Click outside listener to dismiss dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: GeoapifyCity) => {
    setIsFocused(false);
    setSelectedIndex(-1);

    if (onSelectCity) {
      onSelectCity(city);
    } else {
      const slug = encodeURIComponent(city.city.toLowerCase().replace(/\s+/g, '-'));
      navigate(`/destinations/${slug}?city=${encodeURIComponent(city.city)}&country=${encodeURIComponent(city.country)}&lat=${city.lat}&lon=${city.lon}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (status !== 'success' && status !== 'refetching') return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        handleSelect(results[selectedIndex]);
      } else if (results.length > 0) {
        handleSelect(results[0]);
      }
    } else if (e.key === 'Escape') {
      setIsFocused(false);
      setSelectedIndex(-1);
    }
  };

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <div
        className={cn(
          'relative flex items-center bg-slate-50/80 dark:bg-slate-900/70 border rounded-2xl transition-all duration-200',
          isFocused
            ? 'border-sky-500 dark:border-sky-400 ring-2 ring-sky-500/20 bg-white dark:bg-slate-900 shadow-sm'
            : 'border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
        )}
      >
        <div className="pl-4 text-slate-400 dark:text-slate-500">
          {isSearching ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#c2410c]" />
          ) : (
            <Search className="w-4 h-4 stroke-[2.2]" />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(-1);
            if (!isFocused) setIsFocused(true);
          }}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full py-3 pl-3 pr-10 text-xs sm:text-sm bg-transparent text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none font-medium"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              clearSearch();
              inputRef.current?.focus();
            }}
            className="absolute right-3 p-1 rounded-md text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {isFocused && (
        <SearchSuggestions
          suggestions={results}
          status={status}
          error={error}
          selectedIndex={selectedIndex}
          onSelect={handleSelect}
          query={query}
        />
      )}
    </div>
  );
};
