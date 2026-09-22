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
      title="Move Activity to Another Day"
      maxWidth="sm"
    >
      <div className="space-y-4">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Move <strong className="text-slate-900 dark:text-white">"{activity.title}"</strong> to which day?
        </p>

        {otherDays.length === 0 ? (
          <p className="text-xs text-amber-600 dark:text-amber-400">
            No other days exist in this trip. Add a day first to move activities.
          </p>
        ) : (
          <div className="space-y-2">
            {otherDays.map((day) => (
              <button
                key={day.id}
                type="button"
                onClick={() => setTargetDayId(day.id)}
                className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-colors ${
                  targetDayId === day.id
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-bold'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Day {day.dayNumber}</span>
                  <span className="text-xs text-slate-500 font-normal">({formatDateShort(day.date)})</span>
                </div>
                <span className="text-xs text-slate-400 font-normal">
                  {day.activities.length} activities
                </span>
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!targetDayId || otherDays.length === 0}
            onClick={handleConfirm}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
          >
            <span>Confirm Move</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Modal>
  );
};
