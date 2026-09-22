import React, { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, MapPin, CheckCircle2, DollarSign, Trash2, ArrowRight } from 'lucide-react';
import { Trip } from '../../types/trip';
import { formatDateShort } from '../../utils/date';
import { formatCurrency } from '../../utils/currency';

interface TripCardProps {
  trip: Trip;
  onDelete: (id: string) => void;
}

export const TripCard: React.FC<TripCardProps> = memo(({ trip, onDelete }) => {
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
    <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Cover Photo */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={defaultCover}
            alt={trip.destination}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

          {/* Destination Badge */}
          <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/70 backdrop-blur-md text-white text-xs font-semibold">
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
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
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900/60 hover:bg-red-600 text-white backdrop-blur-md transition-colors"
            title="Delete trip"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Trip Name on Image */}
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-xl font-black text-white truncate drop-shadow">
              {trip.name}
            </h3>
            <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatDateShort(trip.startDate)} - {formatDateShort(trip.endDate)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {trip.travelers?.length || 1} travelers
              </span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                Activities ({stats.completedActivities}/{stats.totalActivities})
              </span>
              <span>{stats.completionPercent}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${stats.completionPercent}%` }}
              />
            </div>
          </div>

          {/* Budget Info */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-xs">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Spent</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {formatCurrency(stats.totalSpent, trip.currency)}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Budget</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {formatCurrency(trip.budget, trip.currency)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation Buttons */}
      <div className="p-5 pt-0 grid grid-cols-2 gap-2">
        <Link
          to={`/trips/${trip.id}/itinerary`}
          className="py-2.5 px-3 text-center rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
        >
          Itinerary
        </Link>
        <Link
          to={`/trips/${trip.id}`}
          className="py-2.5 px-3 flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02]"
        >
          <span>Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
});

TripCard.displayName = 'TripCard';
