import { useState, useEffect, useCallback, useRef } from 'react';
import { DestinationDetailsData } from '../types/api';
import { fetchWeather } from '../services/weather';
import { fetchWikiSummary } from '../services/wikipedia';
import { fetchAttractions } from '../services/openTripMap';
import { fetchDestinationPhotos } from '../services/pexels';
import { fetchCountryInfo } from '../services/countries';

interface UseDestinationDetailsParams {
  cityName: string;
  countryName: string;
  lat: number;
  lon: number;
}

interface UseDestinationDetailsResult {
  data: DestinationDetailsData | null;
  isLoading: boolean;
  refetchSection: (section: 'weather' | 'wiki' | 'places' | 'photos') => Promise<void>;
  refetchAll: () => Promise<void>;
}

// In-memory cache for instant (0ms) repeat navigation across destinations
const DESTINATION_CACHE = new Map<string, DestinationDetailsData>();

export function useDestinationDetails({
  cityName,
  countryName,
  lat,
  lon,
}: UseDestinationDetailsParams): UseDestinationDetailsResult {
  const cacheKey = cityName.trim().toLowerCase();

  // Try to retrieve existing cached data immediately (0ms initial render)
  const getCachedData = (): DestinationDetailsData | null => {
    if (DESTINATION_CACHE.has(cacheKey)) {
      return DESTINATION_CACHE.get(cacheKey)!;
    }
    try {
      const local = localStorage.getItem(`tp_dest_${cacheKey}`);
      if (local) {
        const parsed = JSON.parse(local);
        DESTINATION_CACHE.set(cacheKey, parsed);
        return parsed;
      }
    } catch {}
    return null;
  };

  const cachedInitial = getCachedData();

  const [data, setData] = useState<DestinationDetailsData | null>(
    () =>
      cachedInitial || {
        city: cityName,
        country: countryName,
        lat,
        lon,
        weather: { status: 'loading', data: null, error: null },
        wiki: { status: 'loading', data: null, error: null },
        places: { status: 'loading', data: null, error: null },
        photos: { status: 'loading', data: null, error: null },
        countryInfo: { status: 'loading', data: null, error: null },
      }
  );

  const [isLoading, setIsLoading] = useState<boolean>(!cachedInitial);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadAll = useCallback(async () => {
    if (!cityName) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Check cache: if cached, show immediately
    const cached = getCachedData();
    if (cached) {
      setData(cached);
      setIsLoading(false);
    } else {
      setIsLoading(true);
      setData({
        city: cityName,
        country: countryName,
        lat,
        lon,
        weather: { status: 'loading', data: null, error: null },
        wiki: { status: 'loading', data: null, error: null },
        places: { status: 'loading', data: null, error: null },
        photos: { status: 'loading', data: null, error: null },
        countryInfo: { status: 'loading', data: null, error: null },
      });
    }

    // Stream each section progressively as soon as each API responds
    const pWeather = fetchWeather(lat, lon, controller.signal)
      .then((res) => {
        setData((prev) => (prev ? { ...prev, weather: { status: 'success', data: res, error: null } } : null));
        return { section: 'weather', data: res };
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setData((prev) => (prev ? { ...prev, weather: { status: 'error', data: null, error: err.message } } : null));
        }
      });

    const pWiki = fetchWikiSummary(cityName, controller.signal)
      .then((res) => {
        setData((prev) => (prev ? { ...prev, wiki: { status: 'success', data: res, error: null } } : null));
        return { section: 'wiki', data: res };
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setData((prev) => (prev ? { ...prev, wiki: { status: 'error', data: null, error: err.message } } : null));
        }
      });

    const pCountry = (countryName ? fetchCountryInfo(countryName, controller.signal) : Promise.reject(new Error('No country')))
      .then((res) => {
        setData((prev) => (prev ? { ...prev, countryInfo: { status: 'success', data: res, error: null } } : null));
        return { section: 'country', data: res };
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setData((prev) => (prev ? { ...prev, countryInfo: { status: 'error', data: null, error: err.message } } : null));
        }
      });

    const pPhotos = fetchDestinationPhotos(cityName, controller.signal)
      .then((res) => {
        setData((prev) => (prev ? { ...prev, photos: { status: 'success', data: res, error: null } } : null));
        return { section: 'photos', data: res };
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setData((prev) => (prev ? { ...prev, photos: { status: 'error', data: null, error: err.message } } : null));
        }
      });

    const pPlaces = fetchAttractions(lat, lon, cityName, controller.signal)
      .then((res) => {
        setData((prev) => (prev ? { ...prev, places: { status: 'success', data: res, error: null } } : null));
        return { section: 'places', data: res };
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setData((prev) => (prev ? { ...prev, places: { status: 'error', data: null, error: err.message } } : null));
        }
      });

    // When fast primary sections resolve, release global loading state
    Promise.race([
      Promise.allSettled([pWeather, pWiki, pCountry, pPhotos]),
      new Promise((resolve) => setTimeout(resolve, 600)),
    ]).then(() => {
      setIsLoading(false);
    });

    // When all complete, persist full snapshot into cache
    Promise.allSettled([pWeather, pWiki, pCountry, pPhotos, pPlaces]).then(() => {
      setIsLoading(false);
      setData((latest) => {
        if (latest) {
          DESTINATION_CACHE.set(cacheKey, latest);
          try {
            localStorage.setItem(`tp_dest_${cacheKey}`, JSON.stringify(latest));
          } catch {}
        }
        return latest;
      });
    });
  }, [cityName, countryName, lat, lon, cacheKey]);

  useEffect(() => {
    loadAll();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadAll]);

  // Section-specific retry handler (e.g. user clicks [Retry] on Weather or Attractions)
  const refetchSection = useCallback(
    async (section: 'weather' | 'wiki' | 'places' | 'photos') => {
      if (!data) return;

      // Update state of the section to loading
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          [section]: {
            ...prev[section],
            status: 'loading',
            error: null,
          },
        };
      });

      try {
        if (section === 'weather') {
          const res = await fetchWeather(lat, lon);
          setData((prev) =>
            prev ? { ...prev, weather: { status: 'success', data: res, error: null } } : null
          );
        } else if (section === 'wiki') {
          const res = await fetchWikiSummary(cityName);
          setData((prev) =>
            prev ? { ...prev, wiki: { status: 'success', data: res, error: null } } : null
          );
        } else if (section === 'places') {
          const res = await fetchAttractions(lat, lon, cityName);
          setData((prev) =>
            prev ? { ...prev, places: { status: 'success', data: res, error: null } } : null
          );
        } else if (section === 'photos') {
          const res = await fetchDestinationPhotos(cityName);
          setData((prev) =>
            prev ? { ...prev, photos: { status: 'success', data: res, error: null } } : null
          );
        }
      } catch (err: any) {
        setData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            [section]: {
              status: 'error',
              data: null,
              error: err.message || `Failed to reload ${section}`,
            },
          };
        });
      }
    },
    [data, cityName, lat, lon]
  );

  return {
    data,
    isLoading,
    refetchSection,
    refetchAll: loadAll,
  };
}
