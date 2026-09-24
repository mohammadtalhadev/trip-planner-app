import { useState, useEffect, useRef, useCallback } from 'react';
import { GeoapifyCity, AsyncStatus } from '../types/api';
import { searchCities } from '../services/geoapify';
import { useDebounce } from './useDebounce';

interface UseCitySearchResult {
  query: string;
  setQuery: (q: string) => void;
  results: GeoapifyCity[];
  status: AsyncStatus | 'empty' | 'refetching';
  error: string | null;
  clearSearch: () => void;
  isSearching: boolean;
}

/**
 * Custom hook to handle destination searches with:
 * 1. Debounced query input (reduces redundant API calls)
 * 2. AbortController for cancelling previous in-flight requests (race condition protection)
 * 3. Exact request sequence counter (prevents stale responses from overwriting latest search)
 * 4. Explicit API lifecycle states (idle -> loading -> success / empty / error)
 */
export function useCitySearch(debounceMs: number = 180): UseCitySearchResult {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoapifyCity[]>([]);
  const [status, setStatus] = useState<AsyncStatus | 'empty' | 'refetching'>('idle');
  const [error, setError] = useState<string | null>(null);

  const debouncedQuery = useDebounce(query, debounceMs);

  // Keep references to current AbortController and latest request ID
  const abortControllerRef = useRef<AbortController | null>(null);
  const latestRequestIdRef = useRef<number>(0);

  const clearSearch = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setQuery('');
    setResults([]);
    setStatus('idle');
    setError(null);
  }, []);

  useEffect(() => {
    const trimmed = debouncedQuery.trim();

    // If query is empty, reset to idle
    if (!trimmed) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      setResults([]);
      setStatus('idle');
      setError(null);
      return;
    }

    // Cancel any ongoing in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Setup fresh controller & track current request ID
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const currentRequestId = ++latestRequestIdRef.current;

    setStatus((prev) => (prev === 'success' ? 'refetching' : 'loading'));
    setError(null);

    searchCities(trimmed, controller.signal)
      .then((data) => {
        // Guard against race conditions: ensure this is still the active request
        if (currentRequestId === latestRequestIdRef.current) {
          setResults(data);
          setStatus(data.length === 0 ? 'empty' : 'success');
        }
      })
      .catch((err: any) => {
        // If aborted, do nothing (a newer request took over)
        if (err.name === 'AbortError') {
          return;
        }
        if (currentRequestId === latestRequestIdRef.current) {
          setError(err.message || 'Failed to search destinations. Please try again.');
          setStatus('error');
          setResults([]);
        }
      });

    return () => {
      controller.abort();
    };
  }, [debouncedQuery]);

  return {
    query,
    setQuery,
    results,
    status,
    error,
    clearSearch,
    isSearching: status === 'loading' || status === 'refetching',
  };
}
