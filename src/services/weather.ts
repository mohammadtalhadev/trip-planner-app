import { WeatherData } from '../types/api';

export async function fetchWeather(
  lat: number,
  lon: number,
  signal?: AbortSignal
): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;

  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Weather API returned ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();

  const dailyForecasts = (data.daily?.time || []).map((date: string, index: number) => ({
    date,
    maxTemp: data.daily.temperature_2m_max[index] ?? 0,
    minTemp: data.daily.temperature_2m_min[index] ?? 0,
    weatherCode: data.daily.weather_code[index] ?? 0,
  }));

  return {
    current: {
      temperature: data.current?.temperature_2m ?? 0,
      weatherCode: data.current?.weather_code ?? 0,
      windSpeed: data.current?.wind_speed_10m,
      humidity: data.current?.relative_humidity_2m,
    },
    daily: dailyForecasts,
    timezone: data.timezone || 'UTC',
  };
}
