import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce any rapidly changing value (e.g. search query input).
 * Waits for `delay` milliseconds of silence before updating the debounced value.
 */
export function useDebounce<T>(value: T, delay: number = 350): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
