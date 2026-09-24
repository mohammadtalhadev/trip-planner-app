import { CurrencyCode } from '../types/settings';
import { BASELINE_EXCHANGE_RATES, convertCurrencyWithRates } from '../services/currency';

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CAD: 'CA$',
  AUD: 'AU$',
  INR: '₹',
};

export const CURRENCY_NAMES: Record<CurrencyCode, string> = {
  USD: 'US Dollar (USD)',
  EUR: 'Euro (EUR)',
  GBP: 'British Pound (GBP)',
  JPY: 'Japanese Yen (JPY)',
  CAD: 'Canadian Dollar (CAD)',
  AUD: 'Australian Dollar (AUD)',
  INR: 'Indian Rupee (INR)',
};

// Aliased for backward compatibility with existing tests
export const EXCHANGE_RATES: Record<CurrencyCode, number> = BASELINE_EXCHANGE_RATES;

/**
 * Format an amount with its currency symbol and appropriate decimal precision
 */
export function formatCurrency(
  amount: number,
  currency: CurrencyCode | string = 'USD'
): string {
  const code = (currency in CURRENCY_SYMBOLS ? currency : 'USD') as CurrencyCode;
  const symbol = CURRENCY_SYMBOLS[code] || '$';

  // For JPY, display whole numbers without decimals
  const decimals = code === 'JPY' ? 0 : 2;

  const formattedNum = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount || 0);

  return `${symbol}${formattedNum}`;
}

/**
 * Convert an amount between currencies using cached live rates or baseline rates
 */
export function convertCurrency(
  amount: number,
  from: CurrencyCode | string,
  to: CurrencyCode | string
): number {
  if (from === to) return amount;

  // Attempt to use cached live rates if available
  let activeRates: Record<string, number> = BASELINE_EXCHANGE_RATES;
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('tp_live_exchange_rates_v1') : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.rates?.EUR) {
        activeRates = parsed.rates;
      }
    }
  } catch {}

  return convertCurrencyWithRates(amount, from, to, activeRates);
}
