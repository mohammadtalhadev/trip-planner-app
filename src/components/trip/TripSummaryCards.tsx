import React from 'react';
import { Calendar, CheckCircle2, DollarSign, Clock, MapPin } from 'lucide-react';
import { Trip } from '../../types/trip';
import { formatCurrency } from '../../utils/currency';

interface TripSummaryCardsProps {
  trip: Trip;
}

export const TripSummaryCards: React.FC<TripSummaryCardsProps> = ({ trip }) => {
  // Aggregate stats from actual state
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

  const daysPlanned = trip.days.filter((d) => d.activities.length > 0).length;
  const totalDays = trip.days.length;

  // Find upcoming activities (e.g. from Day 1 or next uncompleted day)
  const upcomingDay =
    trip.days.find((d) => d.activities.some((a) => !a.completed)) || trip.days[0];
  const upcomingActivities = upcomingDay ? upcomingDay.activities : [];

  return (
    <div className="space-y-6">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Days Planned */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Days Planned
            </span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {daysPlanned} <span className="text-sm font-semibold text-slate-400">/ {totalDays}</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {totalDays - daysPlanned} days open to plan
          </p>
        </div>

        {/* Total Activities */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Total Activities
            </span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {totalActivities}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Across {totalDays} days
          </p>
        </div>

        {/* Completed Activities */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Completed
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {completedActivities}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {totalActivities > 0
              ? `${Math.round((completedActivities / totalActivities) * 100)}% progress`
              : 'None completed'}
          </p>
        </div>

        {/* Budget Spending */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Budget
            </span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white truncate">
            {formatCurrency(totalSpent, trip.currency)}{' '}
            <span className="text-xs font-semibold text-slate-400">
              / {formatCurrency(trip.budget, trip.currency)}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {trip.budget >= totalSpent
              ? `${formatCurrency(trip.budget - totalSpent, trip.currency)} remaining`
              : 'Budget exceeded'}
          </p>
        </div>
      </div>

      {/* Upcoming Activities Section (PDF Page 8) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Schedule Overview
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Upcoming Activities {upcomingDay ? `(${upcomingDay.title || `Day ${upcomingDay.dayNumber}`})` : ''}
            </h3>
          </div>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
            {upcomingDay ? upcomingDay.date : 'Upcoming'}
          </span>
        </div>

        {upcomingActivities.length === 0 ? (
          <p className="text-sm text-slate-500 italic py-2">
            No activities scheduled for this day yet. Add some in the Itinerary Builder!
          </p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/70">
            {upcomingActivities.map((act) => (
              <div key={act.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-xs font-bold text-blue-600 dark:text-blue-400 shrink-0">
                    {act.time || '10:00'}
                  </span>
                  <div className="min-w-0">
                    <p className={`text-sm font-bold truncate ${act.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                      {act.title}
                    </p>
                    {act.location && (
                      <p className="text-xs text-slate-400 flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3" />
                        {act.location}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {act.cost ? (
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {formatCurrency(act.cost, trip.currency)}
                    </span>
                  ) : null}
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      act.completed ? 'bg-emerald-500' : 'bg-blue-500'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
