import React, { memo } from 'react';
import {
  Clock,
  MapPin,
  CheckCircle2,
  Circle,
  ArrowUp,
  ArrowDown,
  ArrowRightLeft,
  Edit2,
  Trash2,
  DollarSign,
  GripVertical,
} from 'lucide-react';
import { Activity } from '../../types/trip';
import { formatCurrency } from '../../utils/currency';

interface ActivityCardProps {
  activity: Activity;
  index: number;
  totalActivities: number;
  currency: string;
  onToggleComplete: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onEdit: (activity: Activity) => void;
  onDelete: (id: string) => void;
  onMoveToDay: (activity: Activity) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = memo(
  ({
    activity,
    index,
    totalActivities,
    currency,
    onToggleComplete,
    onMoveUp,
    onMoveDown,
    onEdit,
    onDelete,
    onMoveToDay,
    onDragStart,
    onDragOver,
    onDrop,
  }) => {
    return (
      <div
        draggable
        onDragStart={(e) => onDragStart(e, index)}
        onDragOver={(e) => onDragOver(e, index)}
        onDrop={(e) => onDrop(e, index)}
        className={`group relative bg-white dark:bg-slate-900 border rounded-2xl p-4 transition-all duration-200 shadow-frost hover:shadow-card ${
          activity.completed
            ? 'border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 opacity-75'
            : 'border-slate-200/90 dark:border-slate-800'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          {/* Left: Drag Handle, Completion Checkbox & Details */}
          <div className="flex items-start gap-3 min-w-0 flex-1">
            {/* Drag handle */}
            <div
              className="cursor-grab active:cursor-grabbing text-slate-300 dark:text-slate-600 hover:text-slate-500 pt-1 shrink-0 hidden sm:block"
              title="Drag to reorder in day"
            >
              <GripVertical className="w-4 h-4" />
            </div>

            {/* Completion checkbox */}
            <button
              onClick={() => onToggleComplete(activity.id)}
              className="mt-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors shrink-0"
              title={activity.completed ? 'Mark as incomplete' : 'Mark as done'}
            >
              {activity.completed ? (
                <CheckCircle2 className="w-5 h-5 text-[#c2410c] dark:text-[#fb923c]" />
              ) : (
                <Circle className="w-5 h-5" />
              )}
            </button>

            {/* Content Details */}
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-md">
                  <Clock className="w-3 h-3 text-stone-400" />
                  {activity.time || '10:00'}
                </span>

                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200/60 dark:border-stone-700">
                  {activity.category}
                </span>

                {activity.cost !== undefined && activity.cost > 0 && (
                  <span className="inline-flex items-center text-xs font-semibold text-stone-600 dark:text-stone-300">
                    <DollarSign className="w-3 h-3 text-stone-400" />
                    {formatCurrency(activity.cost, currency)}
                  </span>
                )}
              </div>

              <h4
                className={`font-serif text-base font-bold transition-colors ${
                  activity.completed
                    ? 'line-through text-stone-400 dark:text-stone-500'
                    : 'text-stone-900 dark:text-white'
                }`}
              >
                {activity.title}
              </h4>

              {activity.location && (
                <p className="flex items-center gap-1 text-xs text-stone-400 font-sans">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span>{activity.location}</span>
                </p>
              )}

              {activity.notes && (
                <p className="text-xs text-stone-600 dark:text-stone-400 bg-stone-50 dark:bg-stone-800/40 p-2.5 rounded-xl mt-1 leading-relaxed border border-stone-100 dark:border-stone-800 font-sans">
                  {activity.notes}
                </p>
              )}
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-0.5 shrink-0 pt-0.5">
            <button
              onClick={() => onMoveUp(index)}
              disabled={index === 0}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-20 disabled:pointer-events-none transition-colors"
              title="Move earlier"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onMoveDown(index)}
              disabled={index === totalActivities - 1}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-20 disabled:pointer-events-none transition-colors"
              title="Move later"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onMoveToDay(activity)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title="Transfer to another day"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onEdit(activity)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-[#c2410c] dark:hover:text-[#fb923c] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Edit event"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                if (window.confirm(`Delete activity "${activity.title}"?`)) {
                  onDelete(activity.id);
                }
              }}
              className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Remove"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }
);

ActivityCard.displayName = 'ActivityCard';
