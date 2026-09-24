import { useCallback } from 'react';
import { usePreferencesStore } from '../store/usePreferencesStore';
import { CurrencyCode } from '../types/settings';
import { convertCurrencyWithRates } from '../services/currency';
import { formatCurrency } from '../utils/currency';

/**
 * Universal Currency Hook:
 * Provides preferred currency, live exchange rates, dynamic conversion, and formatting.
 */
export function useCurrency() {
  const preferences = usePreferencesStore((state) => state.preferences);
  const setCurrency = usePreferencesStore((state) => state.setCurrency);
  const exchangeRates = usePreferencesStore((state) => state.exchangeRates);
  const ratesStatus = usePreferencesStore((state) => state.ratesStatus);
  const ratesSource = usePreferencesStore((state) => state.ratesSource);
  const lastRatesUpdated = usePreferencesStore((state) => state.lastRatesUpdated);
  const fetchRates = usePreferencesStore((state) => state.fetchRates);

  const preferredCurrency = (preferences.currency || 'USD') as CurrencyCode;

  // Convert from origin currency (e.g. trip.currency or expense.currency) to preferredCurrency
  const convert = useCallback(
    (amount: number, fromCurrency: string = 'USD'): number => {
      return convertCurrencyWithRates(
        amount,
        fromCurrency,
        preferredCurrency,
        exchangeRates
      );
    },
    [preferredCurrency, exchangeRates]
  );

  // Convert between any arbitrary pair of currencies
  const convertBetween = useCallback(
    (amount: number, from: string, to: string): number => {
      return convertCurrencyWithRates(amount, from, to, exchangeRates);
    },
    [exchangeRates]
  );

  // Format directly in preferredCurrency, automatically converting from source currency if different
  const format = useCallback(
    (amount: number, fromCurrency: string = 'USD'): string => {
      const converted = convert(amount, fromCurrency);
      return formatCurrency(converted, preferredCurrency);
    },
    [convert, preferredCurrency]
  );

  // Format amount directly in a specified currency without converting
  const formatRaw = useCallback(
    (amount: number, currency: string = preferredCurrency): string => {
      return formatCurrency(amount, currency);
    },
    [preferredCurrency]
  );

  // Get current live rate relative to USD
  const getRate = useCallback(
    (code: CurrencyCode): number => {
      return exchangeRates[code] || 1;
    },
    [exchangeRates]
  );

  return {
    preferredCurrency,
    setCurrency,
    exchangeRates,
    ratesStatus,
    ratesSource,
    lastRatesUpdated,
    convert,
    convertBetween,
    format,
    formatRaw,
    getRate,
    refreshRates: () => fetchRates(true),
  };
}
