import React from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, Wind, Droplets } from 'lucide-react';
import { AsyncSection, WeatherData } from '../../types/api';
import { usePreferencesStore } from '../../store/usePreferencesStore';
import { getWeatherCondition, formatTemperature } from '../../utils/weatherCodes';
import { WeatherSkeleton } from '../common/Skeleton';
import { ErrorCard } from '../common/ErrorCard';
import { formatDateShort } from '../../utils/date';

interface WeatherCardProps {
  weather: AsyncSection<WeatherData>;
  onRetry?: () => void;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather, onRetry }) => {
  const tempUnit = usePreferencesStore((state) => state.preferences.tempUnit);

  if (weather.status === 'loading') {
    return <WeatherSkeleton />;
  }

  if (weather.status === 'error' || !weather.data) {
    return (
      <ErrorCard
        title="Weather Forecast Unavailable"
        message={weather.error || 'Unable to retrieve meteorological data for this location.'}
        onRetry={onRetry}
      />
    );
  }

  const { current, daily } = weather.data;
  const currentCondition = getWeatherCondition(current.weatherCode);

  const renderWeatherIcon = (iconName: string, className: string = 'w-5 h-5') => {
    switch (iconName) {
      case 'sun':
        return <Sun className={`${className} text-amber-500`} />;
      case 'rain':
      case 'drizzle':
        return <CloudRain className={`${className} text-teal-600 dark:text-teal-400`} />;
      case 'snow':
        return <CloudSnow className={`${className} text-sky-400`} />;
      case 'thunderstorm':
        return <CloudLightning className={`${className} text-stone-600 dark:text-stone-300`} />;
      default:
        return <Cloud className={`${className} text-stone-400`} />;
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-frost space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Meteorological Forecast
          </span>
          <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
            Current Weather
          </h3>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-100 dark:border-sky-900/40 flex items-center justify-center text-sky-600 dark:text-sky-400">
          {renderWeatherIcon(currentCondition.icon, 'w-5 h-5')}
        </div>
      </div>

      {/* Main Temp & Condition */}
      <div className="flex items-baseline gap-4">
        <span className="text-4xl font-serif font-bold text-stone-900 dark:text-white tracking-tight">
          {formatTemperature(current.temperature, tempUnit)}
        </span>
        <div className="space-y-0.5">
          <p className="text-xs font-semibold text-stone-700 dark:text-stone-300">
            {currentCondition.label}
          </p>
          <div className="flex items-center gap-3 text-[11px] text-stone-400 font-mono">
            {current.windSpeed !== undefined && (
              <span className="flex items-center gap-1">
                <Wind className="w-3 h-3" />
                {current.windSpeed} km/h
              </span>
            )}
            {current.humidity !== undefined && (
              <span className="flex items-center gap-1">
                <Droplets className="w-3 h-3" />
                {current.humidity}% humidity
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 4-Day Daily Forecast Strip */}
      {daily && daily.length > 0 && (
        <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80">
          <span className="text-[11px] font-semibold text-stone-400 mb-2.5 block uppercase tracking-wider">
            Outlook Ahead
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {daily.slice(1, 5).map((day) => {
              const dayCondition = getWeatherCondition(day.weatherCode);
              return (
                <div
                  key={day.date}
                  className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-800/50 flex flex-col items-center text-center gap-1.5"
                >
                  <span className="text-[10px] font-medium text-stone-400">
                    {formatDateShort(day.date)}
                  </span>
                  {renderWeatherIcon(dayCondition.icon, 'w-4 h-4')}
                  <div className="text-[11px] font-bold text-stone-800 dark:text-stone-200">
                    <span>{formatTemperature(day.maxTemp, tempUnit)}</span>
                    <span className="text-stone-400 text-[10px] ml-1">
                      {formatTemperature(day.minTemp, tempUnit)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
