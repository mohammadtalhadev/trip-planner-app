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

  const renderWeatherIcon = (iconName: string, className: string = 'w-6 h-6') => {
    switch (iconName) {
      case 'sun':
        return <Sun className={`${className} text-amber-500`} />;
      case 'rain':
      case 'drizzle':
        return <CloudRain className={`${className} text-blue-500`} />;
      case 'snow':
        return <CloudSnow className={`${className} text-cyan-400`} />;
      case 'thunderstorm':
        return <CloudLightning className={`${className} text-purple-500`} />;
      default:
        return <Cloud className={`${className} text-slate-400`} />;
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Open-Meteo Weather
          </span>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Current Conditions
          </h3>
        </div>
        <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
          {renderWeatherIcon(currentCondition.icon, 'w-7 h-7')}
        </div>
      </div>

      {/* Main Temp & Condition */}
      <div className="flex items-baseline gap-4">
        <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
          {formatTemperature(current.temperature, tempUnit)}
        </span>
        <div className="space-y-0.5">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {currentCondition.label}
          </p>
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            {current.windSpeed !== undefined && (
              <span className="flex items-center gap-1">
                <Wind className="w-3.5 h-3.5" />
                {current.windSpeed} km/h
              </span>
            )}
            {current.humidity !== undefined && (
              <span className="flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5" />
                {current.humidity}% humidity
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 4-Day Daily Forecast */}
      {daily && daily.length > 0 && (
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-2.5 block">
            Upcoming Forecast
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {daily.slice(1, 5).map((day) => {
              const dayCondition = getWeatherCondition(day.weatherCode);
              return (
                <div
                  key={day.date}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center text-center gap-1.5"
                >
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {formatDateShort(day.date)}
                  </span>
                  {renderWeatherIcon(dayCondition.icon, 'w-5 h-5')}
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    <span>{formatTemperature(day.maxTemp, tempUnit)}</span>
                    <span className="text-slate-400 dark:text-slate-500 text-[10px] ml-1">
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
