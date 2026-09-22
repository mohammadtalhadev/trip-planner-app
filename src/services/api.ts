import { DestinationDetailsData, AsyncSection } from '../types/api';
import { fetchWeather } from './weather';
import { fetchWikiSummary } from './wikipedia';
import { fetchAttractions } from './openTripMap';
import { fetchDestinationPhotos } from './pexels';
import { fetchCountryInfo } from './countries';

export interface FetchDestinationParams {
  cityName: string;
  countryName: string;
  lat: number;
  lon: number;
  signal?: AbortSignal;
}

function processSettled<T>(result: PromiseSettledResult<T>): AsyncSection<T> {
  if (result.status === 'fulfilled') {
    return {
      status: 'success',
      data: result.value,
      error: null,
    };
  }
  return {
    status: 'error',
    data: null,
    error: result.reason?.message || 'An unexpected error occurred while fetching data.',
  };
}

/**
 * Concurrently fetches destination information from 5 separate APIs
 * using Promise.allSettled() so that partial failure in any single endpoint
 * never breaks the rest of the destination page.
 */
export async function fetchDestinationDetails({
  cityName,
  countryName,
  lat,
  lon,
  signal,
}: FetchDestinationParams): Promise<DestinationDetailsData> {
  // Fire all requests concurrently with the provided AbortSignal
  const [weatherRes, wikiRes, placesRes, photosRes, countryRes] = await Promise.allSettled([
    fetchWeather(lat, lon, signal),
    fetchWikiSummary(cityName, signal),
    fetchAttractions(lat, lon, cityName, signal),
    fetchDestinationPhotos(cityName, signal),
    countryName ? fetchCountryInfo(countryName, signal) : Promise.reject(new Error('No country specified')),
  ]);

  return {
    city: cityName,
    country: countryName,
    lat,
    lon,
    weather: processSettled(weatherRes),
    wiki: processSettled(wikiRes),
    places: processSettled(placesRes),
    photos: processSettled(photosRes),
    countryInfo: processSettled(countryRes),
  };
}

// Re-export individual services for modular usage throughout the app
export * from './geoapify';
export * from './weather';
export * from './wikipedia';
export * from './openTripMap';
export * from './pexels';
export * from './countries';
