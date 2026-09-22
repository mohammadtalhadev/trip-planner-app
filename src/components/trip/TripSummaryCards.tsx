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
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-subtle">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 dark:text-stone-500">
              Days Planned
            </span>
            <div className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
              <Calendar className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">
            {daysPlanned} <span className="text-xs font-mono font-normal text-stone-400">/ {totalDays}</span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 font-sans">
            {totalDays - daysPlanned} days open to curate
          </p>
        </div>

        {/* Total Activities */}
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-subtle">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 dark:text-stone-500">
              Activities
            </span>
            <div className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">
            {totalActivities}
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 font-sans">
            Scheduled across {totalDays} days
          </p>
        </div>

        {/* Completed Activities */}
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-subtle">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 dark:text-stone-500">
              Completed
            </span>
            <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">
            {completedActivities}
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 font-sans font-mono">
            {totalActivities > 0
              ? `${Math.round((completedActivities / totalActivities) * 100)}% progress`
              : 'None completed'}
          </p>
        </div>

        {/* Budget Spending */}
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-subtle">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 dark:text-stone-500">
              Expenditure
            </span>
            <div className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-base sm:text-lg font-mono font-bold text-stone-900 dark:text-stone-100 truncate">
            {formatCurrency(totalSpent, trip.currency)}{' '}
            <span className="text-xs font-normal text-stone-400">
              / {formatCurrency(trip.budget, trip.currency)}
            </span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 font-sans">
            {trip.budget >= totalSpent
              ? `${formatCurrency(trip.budget - totalSpent, trip.currency)} remaining`
              : 'Budget exceeded'}
          </p>
        </div>
      </div>

      {/* Upcoming Activities Section */}
      <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-subtle space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 dark:text-stone-500">
              Agenda Stream
            </span>
            <h3 className="text-base font-serif font-bold text-stone-900 dark:text-stone-100 mt-0.5">
              Scheduled Highlights {upcomingDay ? `(${upcomingDay.title || `Day ${upcomingDay.dayNumber}`})` : ''}
            </h3>
          </div>
          <span className="text-xs font-mono text-stone-500">
            {upcomingDay ? upcomingDay.date : 'Upcoming'}
          </span>
        </div>

        {upcomingActivities.length === 0 ? (
          <p className="text-xs text-stone-500 italic py-4">
            No activities scheduled for this day yet. Add them in the Itinerary Planner.
          </p>
        ) : (
          <div className="divide-y divide-stone-100 dark:divide-stone-800/80">
            {upcomingActivities.map((act) => (
              <div key={act.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 font-mono text-[11px] font-medium text-stone-700 dark:text-stone-300 shrink-0">
                    {act.time || '10:00'}
                  </span>
                  <div className="min-w-0">
                    <p className={`text-xs font-semibold truncate ${act.completed ? 'line-through text-stone-400' : 'text-stone-900 dark:text-stone-100'}`}>
                      {act.title}
                    </p>
                    {act.location && (
                      <p className="text-[11px] text-stone-400 flex items-center gap-1 truncate mt-0.5">
                        <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                        {act.location}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {act.cost ? (
                    <span className="text-xs font-mono font-medium text-stone-700 dark:text-stone-300">
                      {formatCurrency(act.cost, trip.currency)}
                    </span>
                  ) : null}
                  <span
                    className={`w-2 h-2 rounded-full ${
                      act.completed ? 'bg-stone-400' : 'bg-brand-600'
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
