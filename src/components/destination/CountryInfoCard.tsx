import React from 'react';
import { Globe, Users, DollarSign, MapPin } from 'lucide-react';
import { AsyncSection, CountryInfo } from '../../types/api';
import { Skeleton } from '../common/Skeleton';

interface CountryInfoCardProps {
  countryInfo: AsyncSection<CountryInfo>;
}

export const CountryInfoCard: React.FC<CountryInfoCardProps> = ({ countryInfo }) => {
  if (countryInfo.status === 'loading') {
    return (
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-3">
        <Skeleton className="h-5 w-32" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
        </div>
      </div>
    );
  }

  if (countryInfo.status === 'error' || !countryInfo.data) {
    return null; // Graceful non-intrusive fallback if country API is unavailable
  }

  const data = countryInfo.data;

  // Format currency summary
  const currenciesFormatted = Object.values(data.currencies)
    .map((c) => `${c.name} (${c.symbol})`)
    .join(', ');

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-3xl" role="img" aria-label={data.name}>
          {data.flag}
        </span>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Country Overview
          </span>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {data.name}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center gap-2.5">
          <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Capital</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">
              {data.capital}
            </span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center gap-2.5">
          <Users className="w-4 h-4 text-emerald-500 shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Population</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">
              {(data.population / 1_000_000).toFixed(1)}M people
            </span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center gap-2.5">
          <DollarSign className="w-4 h-4 text-amber-500 shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Currency</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">
              {currenciesFormatted || 'Local'}
            </span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center gap-2.5">
          <Globe className="w-4 h-4 text-purple-500 shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Region</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">
              {data.region} {data.subregion ? `(${data.subregion})` : ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
