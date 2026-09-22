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
    <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-thin">
      {days.map((day) => {
        const isActive = day.id === activeDayId;
        const totalActs = day.activities.length;
        const completedActs = day.activities.filter((a) => a.completed).length;

        return (
          <button
            key={day.id}
            type="button"
            onClick={() => onSelectDay(day.id)}
            className={`flex-shrink-0 px-4 py-2.5 rounded-2xl border text-left transition-all ${
              isActive
                ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold">Day {day.dayNumber}</span>
              {totalActs > 0 && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? 'bg-blue-700 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {completedActs}/{totalActs}
                </span>
              )}
            </div>
            <div
              className={`text-[11px] font-medium flex items-center gap-1 mt-0.5 ${
                isActive ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              <Calendar className="w-3 h-3" />
              <span>{formatDateShort(day.date)}</span>
            </div>
          </button>
        );
      })}

      {/* Add Day Button */}
      <button
        type="button"
        onClick={onAddDay}
        className="flex-shrink-0 flex items-center gap-1.5 px-4 py-3 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-xs font-bold"
      >
        <Plus className="w-4 h-4" />
        <span>Add Day</span>
      </button>
    </div>
  );
};
