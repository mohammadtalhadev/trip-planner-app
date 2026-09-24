import { GeoapifyCity } from '../types/api';

const GEOAPIFY_KEY = import.meta.env.VITE_GEOAPIFY_KEY;

// Popular worldwide destinations as instantaneous fallback or initial discovery
export const POPULAR_DESTINATIONS: GeoapifyCity[] = [
  {
    id: 'paris-france',
    city: 'Paris',
    country: 'France',
    countryCode: 'fr',
    formatted: 'Paris, Île-de-France, France',
    lat: 48.8566,
    lon: 2.3522,
    state: 'Île-de-France',
  },
  {
    id: 'tokyo-japan',
    city: 'Tokyo',
    country: 'Japan',
    countryCode: 'jp',
    formatted: 'Tokyo, Japan',
    lat: 35.6762,
    lon: 139.6503,
    state: 'Kanto',
  },
  {
    id: 'istanbul-turkey',
    city: 'Istanbul',
    country: 'Turkey',
    countryCode: 'tr',
    formatted: 'Istanbul, Marmara Region, Turkey',
    lat: 41.0082,
    lon: 28.9784,
    state: 'Istanbul',
  },
  {
    id: 'new-york-usa',
    city: 'New York',
    country: 'United States',
    countryCode: 'us',
    formatted: 'New York, New York, United States',
    lat: 40.7128,
    lon: -74.006,
    state: 'New York',
  },
  {
    id: 'london-uk',
    city: 'London',
    country: 'United Kingdom',
    countryCode: 'gb',
    formatted: 'London, Greater London, United Kingdom',
    lat: 51.5074,
    lon: -0.1278,
    state: 'England',
  },
  {
    id: 'dubai-uae',
    city: 'Dubai',
    country: 'United Arab Emirates',
    countryCode: 'ae',
    formatted: 'Dubai, United Arab Emirates',
    lat: 25.2048,
    lon: 55.2708,
    state: 'Dubai',
  },
  {
    id: 'rome-italy',
    city: 'Rome',
    country: 'Italy',
    countryCode: 'it',
    formatted: 'Rome, Lazio, Italy',
    lat: 41.9028,
    lon: 12.4964,
    state: 'Lazio',
  },
  {
    id: 'lahore-pakistan',
    city: 'Lahore',
    country: 'Pakistan',
    countryCode: 'pk',
    formatted: 'Lahore, Punjab, Pakistan',
    lat: 31.5204,
    lon: 74.3587,
    state: 'Punjab',
  },
  {
    id: 'barcelona-spain',
    city: 'Barcelona',
    country: 'Spain',
    countryCode: 'es',
    formatted: 'Barcelona, Catalonia, Spain',
    lat: 41.3851,
    lon: 2.1734,
    state: 'Catalonia',
  },
  {
    id: 'kyoto-japan',
    city: 'Kyoto',
    country: 'Japan',
    countryCode: 'jp',
    formatted: 'Kyoto, Kansai, Japan',
    lat: 35.0116,
    lon: 135.7681,
    state: 'Kyoto',
  },
];

// In-memory cache for ultra-fast autocomplete search responses
const CITY_SEARCH_CACHE = new Map<string, GeoapifyCity[]>();

export async function searchCities(
  query: string,
  signal?: AbortSignal
): Promise<GeoapifyCity[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const lowerQuery = trimmed.toLowerCase();

  // 0. Instant Cache Lookup (0ms return)
  if (CITY_SEARCH_CACHE.has(lowerQuery)) {
    return CITY_SEARCH_CACHE.get(lowerQuery)!;
  }

  const cacheAndReturn = (results: GeoapifyCity[]) => {
    if (results && results.length > 0) {
      CITY_SEARCH_CACHE.set(lowerQuery, results);
    }
    return results;
  };

  // 1. If Geoapify Key is available, use Geoapify Autocomplete API with 1.8s timeout
  if (GEOAPIFY_KEY && GEOAPIFY_KEY.trim() !== '' && GEOAPIFY_KEY !== 'your_geoapify_key_here') {
    try {
      const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
        trimmed
      )}&type=city&apiKey=${GEOAPIFY_KEY}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1800);

      const onAbort = () => controller.abort();
      signal?.addEventListener('abort', onAbort);

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      signal?.removeEventListener('abort', onAbort);

      if (!response.ok) {
        throw new Error(`Geoapify error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (data.features && Array.isArray(data.features) && data.features.length > 0) {
        const results = data.features.map((feature: any, index: number) => ({
          id: feature.properties.place_id || `geo-${index}-${feature.properties.lat}`,
          city: feature.properties.city || feature.properties.name || trimmed,
          country: feature.properties.country || '',
          countryCode: feature.properties.country_code?.toLowerCase() || '',
          formatted: feature.properties.formatted || `${feature.properties.city || trimmed}, ${feature.properties.country || ''}`,
          lat: feature.properties.lat,
          lon: feature.properties.lon,
          state: feature.properties.state,
        }));
        return cacheAndReturn(results);
      }
    } catch (err: any) {
      if (err.name === 'AbortError' && signal?.aborted) {
        throw err;
      }
      console.warn('Geoapify request timed out or failed, falling back to instant search', err);
    }
  }

  // 2. Fallback: OpenStreetMap Nominatim Free Geocoding API
  try {
    const osmUrl = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(
      trimmed
    )}&format=json&addressdetails=1&limit=6`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);

    const onAbort = () => controller.abort();
    signal?.addEventListener('abort', onAbort);

    const response = await fetch(osmUrl, {
      signal: controller.signal,
      headers: {
        'Accept-Language': 'en',
      },
    });
    clearTimeout(timeoutId);
    signal?.removeEventListener('abort', onAbort);

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        const results = data.map((item: any) => {
          const city =
            item.address?.city ||
            item.address?.town ||
            item.address?.municipality ||
            item.name ||
            trimmed;
          const country = item.address?.country || '';
          return {
            id: `osm-${item.place_id}`,
            city,
            country,
            countryCode: item.address?.country_code?.toLowerCase() || '',
            formatted: item.display_name,
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
            state: item.address?.state,
          };
        });
        return cacheAndReturn(results);
      }
    }
  } catch (err: any) {
    if (err.name === 'AbortError' && signal?.aborted) {
      throw err;
    }
    console.warn('Nominatim search failed, using local curated list', err);
  }

  // 3. Fallback: Filter curated popular destinations
  const matches = POPULAR_DESTINATIONS.filter(
    (dest) =>
      dest.city.toLowerCase().includes(lowerQuery) ||
      dest.country.toLowerCase().includes(lowerQuery) ||
      dest.formatted.toLowerCase().includes(lowerQuery)
  );
  return cacheAndReturn(matches);
}
