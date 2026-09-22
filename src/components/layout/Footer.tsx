import React from 'react';
import { Compass, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-20 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <Compass className="w-5 h-5" />
            </div>
            <span className="font-bold text-base text-slate-800 dark:text-slate-200">
              TripPlanner
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              — Modern Client-Side Travel Architect
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span>Powered by:</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono">Geoapify</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono">Open-Meteo</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono">Wikipedia REST</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono">OpenTripMap</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono">Pexels</span>
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>using React, Zustand & Tailwind</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
