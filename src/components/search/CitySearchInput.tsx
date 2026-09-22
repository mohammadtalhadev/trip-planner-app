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
  placeholder = 'Search destinations (e.g. Paris, Tokyo, Istanbul, New York)...',
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
      // Default behavior: navigate to destination details page
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
          'relative flex items-center bg-white dark:bg-slate-900 border rounded-2xl transition-all shadow-sm',
          isFocused
            ? 'border-blue-500 ring-4 ring-blue-500/10 shadow-md'
            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
        )}
      >
        <div className="pl-4 text-slate-400 dark:text-slate-500">
          {isSearching ? (
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          ) : (
            <Search className="w-5 h-5" />
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
          className="w-full py-3.5 pl-3 pr-10 text-sm md:text-base bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              clearSearch();
              inputRef.current?.focus();
            }}
            className="absolute right-3 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
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
