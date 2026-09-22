export interface GeoapifyCity {
  id: string;
  city: string;
  country: string;
  countryCode: string;
  formatted: string;
  lat: number;
  lon: number;
  state?: string;
}

export interface WeatherDayForecast {
  date: string;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
}

export interface WeatherData {
  current: {
    temperature: number;
    weatherCode: number;
    windSpeed?: number;
    humidity?: number;
  };
  daily: WeatherDayForecast[];
  timezone: string;
}

export interface WikipediaSummary {
  title: string;
  extract: string;
  description?: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  pageUrl?: string;
  coordinates?: {
    lat: number;
    lon: number;
  };
}

export interface AttractionPlace {
  xid: string;
  name: string;
  kinds: string;
  point: {
    lon: number;
    lat: number;
  };
  rate: number;
  preview?: {
    source: string;
  };
  wikipedia?: string;
  category?: 'attraction' | 'restaurant' | 'hotel' | 'culture';
}

export interface PexelsPhoto {
  id: number;
  url: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
  };
  alt: string;
  photographer: string;
}

export interface CountryInfo {
  name: string;
  officialName: string;
  capital: string;
  population: number;
  region: string;
  subregion: string;
  flag: string;
  flagUrl: string;
  currencies: Record<string, { name: string; symbol: string }>;
  languages: Record<string, string>;
}

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncSection<T> {
  status: AsyncStatus;
  data: T | null;
  error: string | null;
}

export interface DestinationDetailsData {
  city: string;
  country: string;
  lat: number;
  lon: number;
  weather: AsyncSection<WeatherData>;
  wiki: AsyncSection<WikipediaSummary>;
  places: AsyncSection<AttractionPlace[]>;
  photos: AsyncSection<PexelsPhoto[]>;
  countryInfo: AsyncSection<CountryInfo>;
}
