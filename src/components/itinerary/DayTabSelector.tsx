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
            className={`flex-shrink-0 px-4 py-3 rounded-2xl border text-left transition-all duration-200 ${
              isActive
                ? 'bg-[#c2410c] border-[#c2410c] text-white shadow-md shadow-orange-600/20'
                : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'
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
                      ? 'bg-black/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {completedActs}/{totalActs}
                </span>
              )}
            </div>
            <div
              className={`text-[11px] font-medium flex items-center gap-1.5 mt-1 ${
                isActive
                  ? 'text-orange-100'
                  : 'text-slate-400 dark:text-slate-500'
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
        className="flex-shrink-0 flex items-center gap-1.5 px-4 py-3 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-[#c2410c] hover:text-[#c2410c] hover:bg-orange-50/40 dark:hover:bg-orange-950/20 transition-all text-xs font-semibold"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Add Day</span>
      </button>
    </div>
  );
};

