import { CurrencyCode } from '../types/settings';

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

// Base conversion rates (relative to USD 1.0)
export const EXCHANGE_RATES: Record<CurrencyCode, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 154.2,
  CAD: 1.36,
  AUD: 1.52,
  INR: 84.5,
};

export function formatCurrency(
  amount: number,
  currency: CurrencyCode | string = 'USD'
): string {
  const code = (currency in CURRENCY_SYMBOLS ? currency : 'USD') as CurrencyCode;
  const symbol = CURRENCY_SYMBOLS[code] || '$';

  // For JPY, usually whole numbers without decimals
  const decimals = code === 'JPY' ? 0 : 2;

  const formattedNum = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);

  return `${symbol}${formattedNum}`;
}

export function convertCurrency(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode
): number {
  if (from === to) return amount;
  const inUSD = amount / EXCHANGE_RATES[from];
  return inUSD * EXCHANGE_RATES[to];
}
