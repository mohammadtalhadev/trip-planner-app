import { TempUnit } from '../types/settings';

export interface WeatherCondition {
  label: string;
  icon: 'sun' | 'cloud-sun' | 'cloud' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'thunderstorm';
}

export function getWeatherCondition(wmoCode: number): WeatherCondition {
  // WMO Weather interpretation codes (WW)
  switch (wmoCode) {
    case 0:
      return { label: 'Clear sky', icon: 'sun' };
    case 1:
      return { label: 'Mainly clear', icon: 'cloud-sun' };
    case 2:
      return { label: 'Partly cloudy', icon: 'cloud-sun' };
    case 3:
      return { label: 'Overcast', icon: 'cloud' };
    case 45:
    case 48:
      return { label: 'Foggy', icon: 'fog' };
    case 51:
    case 53:
    case 55:
      return { label: 'Drizzle', icon: 'drizzle' };
    case 56:
    case 57:
      return { label: 'Freezing Drizzle', icon: 'drizzle' };
    case 61:
    case 63:
      return { label: 'Rain', icon: 'rain' };
    case 65:
      return { label: 'Heavy Rain', icon: 'rain' };
    case 66:
    case 67:
      return { label: 'Freezing Rain', icon: 'rain' };
    case 71:
    case 73:
    case 75:
      return { label: 'Snow fall', icon: 'snow' };
    case 77:
      return { label: 'Snow grains', icon: 'snow' };
    case 80:
    case 81:
    case 82:
      return { label: 'Rain showers', icon: 'rain' };
    case 85:
    case 86:
      return { label: 'Snow showers', icon: 'snow' };
    case 95:
      return { label: 'Thunderstorm', icon: 'thunderstorm' };
    case 96:
    case 99:
      return { label: 'Thunderstorm with hail', icon: 'thunderstorm' };
    default:
      return { label: 'Fair', icon: 'cloud-sun' };
  }
}

export function formatTemperature(celsius: number, unit: TempUnit = 'celsius'): string {
  if (unit === 'fahrenheit') {
    const fahrenheit = (celsius * 9) / 5 + 32;
    return `${Math.round(fahrenheit)}°F`;
  }
  return `${Math.round(celsius)}°C`;
}
