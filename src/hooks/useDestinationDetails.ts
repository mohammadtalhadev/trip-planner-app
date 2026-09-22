import { useState, useEffect, useCallback, useRef } from 'react';
import { DestinationDetailsData } from '../types/api';
import { fetchDestinationDetails } from '../services/api';
import { fetchWeather } from '../services/weather';
import { fetchWikiSummary } from '../services/wikipedia';
import { fetchAttractions } from '../services/openTripMap';
import { fetchDestinationPhotos } from '../services/pexels';

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

export function useDestinationDetails({
  cityName,
  countryName,
  lat,
  lon,
}: UseDestinationDetailsParams): UseDestinationDetailsResult {
  const [data, setData] = useState<DestinationDetailsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const abortControllerRef = useRef<AbortController | null>(null);

  const loadAll = useCallback(async () => {
    if (!cityName) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);

    try {
      const result = await fetchDestinationDetails({
        cityName,
        countryName,
        lat,
        lon,
        signal: controller.signal,
      });
      setData(result);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Failed to load destination details:', err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [cityName, countryName, lat, lon]);

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
