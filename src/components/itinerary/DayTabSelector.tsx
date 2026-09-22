import React from 'react';
import { Plus, Calendar } from 'lucide-react';
import { ItineraryDay } from '../../types/trip';
import { formatDateShort } from '../../utils/date';

interface DayTabSelectorProps {
  days: ItineraryDay[];
  activeDayId: string;
  onSelectDay: (dayId: string) => void;
  onAddDay: () => void;
}

export const DayTabSelector: React.FC<DayTabSelectorProps> = ({
  days,
  activeDayId,
  onSelectDay,
  onAddDay,
}) => {
  return (
    <div className="flex items-center gap-2.5 overflow-x-auto pb-3 pt-1 scrollbar-thin">
      {days.map((day) => {
        const isActive = day.id === activeDayId;
        const totalActs = day.activities.length;
        const completedActs = day.activities.filter((a) => a.completed).length;

        return (
          <button
            key={day.id}
            type="button"
            onClick={() => onSelectDay(day.id)}
            className={`flex-shrink-0 px-4 py-3 rounded-xl border text-left transition-all duration-200 ${
              isActive
                ? 'bg-stone-900 border-stone-900 text-stone-50 dark:bg-stone-100 dark:border-stone-100 dark:text-stone-900 shadow-sm'
                : 'bg-white dark:bg-stone-900/60 border-stone-200/80 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-300 dark:hover:border-stone-700 hover:bg-stone-50/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold uppercase tracking-wider font-sans">
                Day {day.dayNumber}
              </span>
              {totalActs > 0 && (
                <span
                  className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-stone-800 text-stone-200 dark:bg-stone-200 dark:text-stone-800'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400'
                  }`}
                >
                  {completedActs}/{totalActs}
                </span>
              )}
            </div>
            <div
              className={`text-[11px] font-medium flex items-center gap-1.5 mt-1 ${
                isActive
                  ? 'text-stone-300 dark:text-stone-600'
                  : 'text-stone-400 dark:text-stone-500'
              }`}
            >
              <Calendar className="w-3 h-3 shrink-0" />
              <span>{formatDateShort(day.date)}</span>
            </div>
          </button>
        );
      })}

      {/* Add Day Button */}
      <button
        type="button"
        onClick={onAddDay}
        className="flex-shrink-0 flex items-center gap-1.5 px-4 py-3 rounded-xl border border-dashed border-stone-300 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:border-brand-600 hover:text-brand-700 dark:hover:text-brand-400 hover:bg-brand-50/30 dark:hover:bg-brand-950/20 transition-all text-xs font-semibold"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Add Day</span>
      </button>
    </div>
  );
};

