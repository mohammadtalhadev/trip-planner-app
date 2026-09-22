import React, { useState } from 'react';
import { ArrowRight, Calendar } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Activity, ItineraryDay } from '../../types/trip';
import { formatDateShort } from '../../utils/date';

interface MoveActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: Activity | null;
  currentDayId: string;
  days: ItineraryDay[];
  onMove: (activityId: string, fromDayId: string, toDayId: string) => void;
}

export const MoveActivityModal: React.FC<MoveActivityModalProps> = ({
  isOpen,
  onClose,
  activity,
  currentDayId,
  days,
  onMove,
}) => {
  const otherDays = days.filter((d) => d.id !== currentDayId);
  const [targetDayId, setTargetDayId] = useState<string>(
    otherDays[0]?.id || ''
  );

  if (!activity) return null;

  const handleConfirm = () => {
    if (targetDayId) {
      onMove(activity.id, currentDayId, targetDayId);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Relocate Activity"
      maxWidth="sm"
    >
      <div className="space-y-4">
        <p className="text-xs text-stone-600 dark:text-stone-400 font-sans">
          Reassign <strong className="text-stone-900 dark:text-stone-100 font-semibold font-serif">"{activity.title}"</strong> to which journey date?
        </p>

        {otherDays.length === 0 ? (
          <p className="text-xs text-amber-700 dark:text-amber-400">
            No alternate days scheduled in this journey. Add a day first to move activities.
          </p>
        ) : (
          <div className="space-y-2">
            {otherDays.map((day) => (
              <button
                key={day.id}
                type="button"
                onClick={() => setTargetDayId(day.id)}
                className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                  targetDayId === day.id
                    ? 'border-[#c2410c] bg-[#c2410c] text-white font-bold shadow-md shadow-orange-600/20'
                    : 'border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-mono uppercase tracking-wider">Day {day.dayNumber}</span>
                  <span className={`text-[11px] font-mono ${targetDayId === day.id ? 'text-orange-100' : 'text-slate-400'}`}>
                    ({formatDateShort(day.date)})
                  </span>
                </div>
                <span className={`text-xs font-mono ${targetDayId === day.id ? 'text-orange-100' : 'text-slate-400'}`}>
                  {day.activities.length} {day.activities.length === 1 ? 'event' : 'events'}
                </span>
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!targetDayId || otherDays.length === 0}
            onClick={handleConfirm}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#c2410c] hover:bg-[#b91c1c] active:bg-[#9a3412] text-white disabled:opacity-40 text-xs font-bold uppercase tracking-wider rounded-xl shadow-md shadow-orange-600/20 transition-all hover:scale-[1.01]"
          >
            <span>Confirm Relocation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </Modal>
  );
};
