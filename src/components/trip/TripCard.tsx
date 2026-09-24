import React, { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, MapPin, CheckCircle2, DollarSign, Trash2, ArrowRight } from 'lucide-react';
import { Trip } from '../../types/trip';
import { formatDateShort } from '../../utils/date';
import { useCurrency } from '../../hooks/useCurrency';

interface TripCardProps {
  trip: Trip;
  onDelete: (id: string) => void;
}

export const TripCard: React.FC<TripCardProps> = memo(({ trip, onDelete }) => {
  const { format } = useCurrency();
  // Compute activity stats
  const stats = useMemo(() => {
    let totalActivities = 0;
    let completedActivities = 0;
    let totalSpent = 0;

    trip.days.forEach((day) => {
      totalActivities += day.activities.length;
      completedActivities += day.activities.filter((a) => a.completed).length;
      day.expenses.forEach((e) => {
        totalSpent += e.amount;
      });
    });

    const completionPercent =
      totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0;

    return { totalActivities, completedActivities, totalSpent, completionPercent };
  }, [trip.days]);

  const defaultCover =
    trip.coverImage ||
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="group bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl overflow-hidden shadow-subtle hover:shadow-card transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Cover Photo */}
        <div className="relative h-52 w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
          <img
            src={defaultCover}
            alt={trip.destination}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/25 to-transparent" />

          {/* Destination Badge */}
          <div className="absolute top-3.5 left-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-950/60 backdrop-blur-md text-stone-200 text-xs font-medium border border-white/10">
            <MapPin className="w-3 h-3 text-brand-300" />
            <span>{trip.destination}</span>
          </div>

          {/* Delete Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (window.confirm(`Are you sure you want to delete "${trip.name}"?`)) {
                onDelete(trip.id);
              }
            }}
            className="absolute top-3.5 right-3.5 p-2 rounded-xl bg-stone-950/50 hover:bg-rose-600/90 text-stone-300 hover:text-white backdrop-blur-md transition-colors"
            title="Delete trip"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          {/* Trip Name on Image */}
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-xl font-serif font-bold text-white tracking-tight truncate drop-shadow-sm">
              {trip.name}
            </h3>
            <div className="flex items-center gap-2.5 text-xs text-stone-300 mt-1 font-mono">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-stone-400" />
                {formatDateShort(trip.startDate)} - {formatDateShort(trip.endDate)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3 text-stone-400" />
                {trip.travelers?.length || 1} {trip.travelers?.length === 1 ? 'traveler' : 'travelers'}
              </span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-1.5 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
                Activities ({stats.completedActivities}/{stats.totalActivities})
              </span>
              <span className="font-mono text-slate-500">{stats.completionPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#c2410c] dark:bg-[#ea580c] rounded-full transition-all duration-500"
                style={{ width: `${stats.completionPercent}%` }}
              />
            </div>
          </div>

          {/* Budget Info */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <DollarSign className="w-3.5 h-3.5 text-slate-400" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">Spent</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {format(stats.totalSpent, trip.currency)}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">Budget</span>
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                {format(trip.budget, trip.currency)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation Buttons */}
      <div className="p-5 pt-0 grid grid-cols-2 gap-2.5">
        <Link
          to={`/trips/${trip.id}/itinerary`}
          className="py-2.5 px-3 text-center rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 transition-colors"
        >
          Itinerary
        </Link>
        <Link
          to={`/trips/${trip.id}`}
          className="py-2.5 px-3 flex items-center justify-center gap-1.5 rounded-xl bg-[#c2410c] hover:bg-[#b91c1c] active:bg-[#9a3412] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all hover:scale-[1.01]"
        >
          <span>Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
});

TripCard.displayName = 'TripCard';

