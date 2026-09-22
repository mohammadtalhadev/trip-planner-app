import React, { memo } from 'react';
import {
  Clock,
  MapPin,
  CheckCircle2,
  Circle,
  MoreVertical,
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
import { Badge } from '../common/Badge';

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
  // HTML5 Drag and Drop handlers
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
    const categoryColors = {
      sightseeing: 'primary',
      food: 'warning',
      transport: 'info',
      lodging: 'purple',
      activity: 'success',
      shopping: 'neutral',
      other: 'neutral',
    } as const;

    return (
      <div
        draggable
        onDragStart={(e) => onDragStart(e, index)}
        onDragOver={(e) => onDragOver(e, index)}
        onDrop={(e) => onDrop(e, index)}
        className={`group relative bg-white dark:bg-slate-900 border rounded-2xl p-4 transition-all duration-200 shadow-sm hover:shadow-md ${
          activity.completed
            ? 'border-emerald-200 dark:border-emerald-950/60 bg-emerald-50/20 dark:bg-emerald-950/10'
            : 'border-slate-200 dark:border-slate-800'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          {/* Left: Drag Handle, Completion Checkbox & Details */}
          <div className="flex items-start gap-3 min-w-0 flex-1">
            {/* Drag handle */}
            <div
              className="cursor-grab active:cursor-grabbing text-slate-300 dark:text-slate-600 hover:text-slate-500 pt-1 shrink-0 hidden sm:block"
              title="Drag to reorder"
            >
              <GripVertical className="w-4 h-4" />
            </div>

            {/* Completion checkbox */}
            <button
              onClick={() => onToggleComplete(activity.id)}
              className="mt-0.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors shrink-0"
              title={activity.completed ? 'Mark as incomplete' : 'Mark as completed'}
            >
              {activity.completed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50 dark:fill-emerald-950" />
              ) : (
                <Circle className="w-5 h-5" />
              )}
            </button>

            {/* Content Details */}
            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                  <Clock className="w-3 h-3" />
                  {activity.time || '10:00'}
                </span>
                <Badge variant={categoryColors[activity.category] || 'neutral'} size="sm">
                  {activity.category}
                </Badge>
                {activity.cost !== undefined && activity.cost > 0 && (
                  <span className="inline-flex items-center text-xs font-bold text-slate-600 dark:text-slate-400">
                    <DollarSign className="w-3 h-3 text-emerald-500" />
                    {formatCurrency(activity.cost, currency)}
                  </span>
                )}
              </div>

              <h4
                className={`text-base font-bold transition-colors ${
                  activity.completed
                    ? 'line-through text-slate-400 dark:text-slate-500'
                    : 'text-slate-900 dark:text-white'
                }`}
              >
                {activity.title}
              </h4>

              {activity.location && (
                <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  <span>{activity.location}</span>
                </p>
              )}

              {activity.notes && (
                <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl mt-1 leading-relaxed border border-slate-100 dark:border-slate-800">
                  {activity.notes}
                </p>
              )}
            </div>
          </div>

          {/* Right: Quick Action Buttons (Move Up/Down, Move to Day, Edit, Delete) */}
          <div className="flex items-center gap-1 shrink-0 pt-0.5">
            {/* Move Up */}
            <button
              onClick={() => onMoveUp(index)}
              disabled={index === 0}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-20 disabled:pointer-events-none transition-colors"
              title="Move Up"
            >
              <ArrowUp className="w-4 h-4" />
            </button>

            {/* Move Down */}
            <button
              onClick={() => onMoveDown(index)}
              disabled={index === totalActivities - 1}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-20 disabled:pointer-events-none transition-colors"
              title="Move Down"
            >
              <ArrowDown className="w-4 h-4" />
            </button>

            {/* Move to another day */}
            <button
              onClick={() => onMoveToDay(activity)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Move activity to another day"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>

            {/* Edit */}
            <button
              onClick={() => onEdit(activity)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Edit activity"
            >
              <Edit2 className="w-4 h-4" />
            </button>

            {/* Delete */}
            <button
              onClick={() => {
                if (window.confirm(`Delete activity "${activity.title}"?`)) {
                  onDelete(activity.id);
                }
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
              title="Delete activity"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }
);

ActivityCard.displayName = 'ActivityCard';
