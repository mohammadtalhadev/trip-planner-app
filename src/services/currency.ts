import { CurrencyCode } from '../types/settings';

export interface ExchangeRatesData {
  base: CurrencyCode;
  rates: Record<CurrencyCode, number>;
  lastUpdated: string;
  source: 'live' | 'cached' | 'fallback';
}

const CACHE_KEY = 'tp_live_exchange_rates_v1';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1-hour cache

export const BASELINE_EXCHANGE_RATES: Record<CurrencyCode, number> = {
  USD: 1.0,
  EUR: 0.90,
  GBP: 0.77,
  JPY: 148.5,
  CAD: 1.35,
  AUD: 1.48,
  INR: 83.7,
};

// Free, fast public exchange rate APIs requiring no key
const PRIMARY_API = 'https://open.er-api.com/v6/latest/USD';
const FALLBACK_API = 'https://api.exchangerate-api.com/v4/latest/USD';

/**
 * Fetch live exchange rates from public API with caching and fallback
 */
export async function fetchLiveExchangeRates(forceFresh: boolean = false): Promise<ExchangeRatesData> {
  // 1. Check local cache
  if (!forceFresh) {
    try {
      const cachedRaw = localStorage.getItem(CACHE_KEY);
      if (cachedRaw) {
        const cached = JSON.parse(cachedRaw) as ExchangeRatesData & { timestamp?: number };
        const now = Date.now();
        if (cached.timestamp && now - cached.timestamp < CACHE_TTL_MS && cached.rates?.EUR) {
          return {
            ...cached,
            source: 'cached',
          };
        }
      }
    } catch {}
  }

  // 2. Fetch from Primary API (Open Exchange Rates)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(PRIMARY_API, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      if (json && json.rates) {
        const rates: Record<CurrencyCode, number> = {
          USD: 1.0,
          EUR: Number(json.rates.EUR) || BASELINE_EXCHANGE_RATES.EUR,
          GBP: Number(json.rates.GBP) || BASELINE_EXCHANGE_RATES.GBP,
          JPY: Number(json.rates.JPY) || BASELINE_EXCHANGE_RATES.JPY,
          CAD: Number(json.rates.CAD) || BASELINE_EXCHANGE_RATES.CAD,
          AUD: Number(json.rates.AUD) || BASELINE_EXCHANGE_RATES.AUD,
          INR: Number(json.rates.INR) || BASELINE_EXCHANGE_RATES.INR,
        };

        const result: ExchangeRatesData = {
          base: 'USD',
          rates,
          lastUpdated: new Date().toISOString(),
          source: 'live',
        };

        try {
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ ...result, timestamp: Date.now() })
          );
        } catch {}

        return result;
      }
    }
  } catch (err) {
    console.warn('Primary exchange rates API error, trying fallback...', err);
  }

  // 3. Fetch from Secondary API (ExchangeRate-API v4)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(FALLBACK_API, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      if (json && json.rates) {
        const rates: Record<CurrencyCode, number> = {
          USD: 1.0,
          EUR: Number(json.rates.EUR) || BASELINE_EXCHANGE_RATES.EUR,
          GBP: Number(json.rates.GBP) || BASELINE_EXCHANGE_RATES.GBP,
          JPY: Number(json.rates.JPY) || BASELINE_EXCHANGE_RATES.JPY,
          CAD: Number(json.rates.CAD) || BASELINE_EXCHANGE_RATES.CAD,
          AUD: Number(json.rates.AUD) || BASELINE_EXCHANGE_RATES.AUD,
          INR: Number(json.rates.INR) || BASELINE_EXCHANGE_RATES.INR,
        };

        const result: ExchangeRatesData = {
          base: 'USD',
          rates,
          lastUpdated: new Date().toISOString(),
          source: 'live',
        };

        try {
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ ...result, timestamp: Date.now() })
          );
        } catch {}

        return result;
      }
    }
  } catch (err) {
    console.warn('Secondary exchange rates API error, using baseline fallback', err);
  }

  // 4. Fallback to baseline rates
  return {
    base: 'USD',
    rates: BASELINE_EXCHANGE_RATES,
    lastUpdated: new Date().toISOString(),
    source: 'fallback',
  };
}

/**
 * Universal currency conversion using live exchange rates table
 */
export function convertCurrencyWithRates(
  amount: number,
  from: string,
  to: string,
  rates: Record<string, number> = BASELINE_EXCHANGE_RATES
): number {
  if (!amount || from === to) return amount;
  const fromCode = (from in rates ? from : 'USD') as CurrencyCode;
  const toCode = (to in rates ? to : 'USD') as CurrencyCode;
  if (fromCode === toCode) return amount;

  const rateFrom = rates[fromCode] || 1;
  const rateTo = rates[toCode] || 1;

  // Convert to USD base, then to target currency
  const inUSD = amount / rateFrom;
  return inUSD * rateTo;
}
