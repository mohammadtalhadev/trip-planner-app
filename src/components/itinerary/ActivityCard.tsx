import React, { memo, useState } from 'react';
import {
  MapPin,
  Check,
  ArrowUp,
  ArrowDown,
  ArrowRightLeft,
  Edit2,
  Trash2,
  GripVertical,
  Compass,
  Utensils,
  Landmark,
  Train,
  Bed,
  ShoppingBag,
  Pin,
} from 'lucide-react';
import { Activity, ActivityCategory } from '../../types/trip';
import { formatTime12Hour } from '../../utils/date';
import { useCurrency } from '../../hooks/useCurrency';

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
    const { format } = useCurrency();
    const [isPinned, setIsPinned] = useState(false);

    // Duration calculation or estimated duration
    const getEstimatedDuration = (cat: ActivityCategory): string => {
      switch (cat) {
        case 'sightseeing':
          return '2.5 hrs';
        case 'food':
          return '1.5 hrs';
        case 'activity':
          return '3.0 hrs';
        case 'transport':
          return '45 min';
        case 'shopping':
          return '2.0 hrs';
        case 'lodging':
          return 'Check-in';
        default:
          return '1.5 hrs';
      }
    };

    // Category styling & labels
    const getCategoryConfig = (cat: ActivityCategory) => {
      switch (cat) {
        case 'sightseeing':
          return {
            label: 'Culture & Sightseeing',
            icon: Landmark,
            color: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200/70 dark:border-indigo-900',
          };
        case 'food':
          return {
            label: 'Culinary & Dining',
            icon: Utensils,
            color: 'bg-orange-50 dark:bg-orange-950/60 text-[#c2410c] dark:text-orange-400 border-orange-200/70 dark:border-orange-900',
          };
        case 'activity':
          return {
            label: 'Tour & Experience',
            icon: Compass,
            color: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200/70 dark:border-emerald-900',
          };
        case 'transport':
          return {
            label: 'Transit & Transfer',
            icon: Train,
            color: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 border-purple-200/70 dark:border-purple-900',
          };
        case 'lodging':
          return {
            label: 'Lodging & Hotel',
            icon: Bed,
            color: 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 border-sky-200/70 dark:border-sky-900',
          };
        case 'shopping':
          return {
            label: 'Boutiques & Shopping',
            icon: ShoppingBag,
            color: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border-rose-200/70 dark:border-rose-900',
          };
        default:
          return {
            label: 'Activity',
            icon: Compass,
            color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
          };
      }
    };

    const catConfig = getCategoryConfig(activity.category);
    const CategoryIcon = catConfig.icon;

    return (
      <div
        draggable
        onDragStart={(e) => onDragStart(e, index)}
        onDragOver={(e) => onDragOver(e, index)}
        onDrop={(e) => onDrop(e, index)}
        className={`group relative bg-white dark:bg-slate-900 border rounded-2xl p-4 sm:p-5 transition-all duration-200 shadow-frost hover:shadow-card ${
          activity.completed
            ? 'border-slate-200/70 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 opacity-75'
            : isPinned
            ? 'border-amber-300 dark:border-amber-700/80 ring-2 ring-amber-400/20'
            : 'border-slate-200/90 dark:border-slate-800'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start gap-4">
          {/* Left Sub-Column: Time & Duration with Drag Handle */}
          <div className="flex sm:flex-col items-center sm:items-start justify-between w-full sm:w-28 shrink-0 pb-2 sm:pb-0 sm:border-r border-slate-100 dark:border-slate-800/80 sm:pr-3">
            <div className="flex items-center gap-1.5">
              <div
                className="cursor-grab active:cursor-grabbing text-slate-300 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 transition-colors"
                title="Drag to reorder"
              >
                <GripVertical className="w-4 h-4" />
              </div>
              <div>
                <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 block">
                  {formatTime12Hour(activity.time)}
                </span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium block">
                  {getEstimatedDuration(activity.category)}
                </span>
              </div>
            </div>

            {/* Mobile Actions Shortcut */}
            <div className="flex items-center gap-1 sm:hidden">
              <button
                type="button"
                onClick={() => onToggleComplete(activity.id)}
                className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                  activity.completed
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'border-slate-300 dark:border-slate-600 text-transparent'
                }`}
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>
          </div>

          {/* Right Sub-Column: Content & Actions */}
          <div className="flex-1 min-w-0 space-y-2.5">
            {/* Header Badges & Actions Bar */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Category Badge */}
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide border shadow-2xs ${catConfig.color}`}
                >
                  <CategoryIcon className="w-3 h-3" />
                  <span>{catConfig.label}</span>
                </span>

                {/* Cost Tag */}
                {activity.cost !== undefined && activity.cost > 0 ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200/80 dark:border-stone-700">
                    <span>{format(activity.cost, currency)}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/80">
                    Free entry
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => setIsPinned(!isPinned)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    isPinned
                      ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title={isPinned ? 'Unpin activity' : 'Pin activity'}
                >
                  <Pin className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onMoveUp(index)}
                  disabled={index === 0}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer"
                  title="Move earlier"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onMoveDown(index)}
                  disabled={index === totalActivities - 1}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer"
                  title="Move later"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onMoveToDay(activity)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Transfer to another day"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onEdit(activity)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-[#c2410c] dark:hover:text-orange-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Edit activity"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Delete activity "${activity.title}"?`)) {
                      onDelete(activity.id);
                    }
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                  title="Remove"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Title & Checkbox */}
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => onToggleComplete(activity.id)}
                className={`hidden sm:flex mt-0.5 w-5 h-5 rounded-full items-center justify-center border transition-all cursor-pointer shrink-0 ${
                  activity.completed
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xs'
                    : 'border-slate-300 dark:border-slate-600 text-transparent hover:border-indigo-500'
                }`}
                title={activity.completed ? 'Mark as incomplete' : 'Mark as done'}
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </button>

              <div className="min-w-0 flex-1 space-y-1">
                <h4
                  className={`text-base font-bold font-serif leading-snug transition-colors ${
                    activity.completed
                      ? 'line-through text-slate-400 dark:text-slate-500'
                      : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {activity.title}
                </h4>

                {activity.notes && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                    {activity.notes}
                  </p>
                )}

                {/* Location & Walking distance */}
                {activity.location && (
                  <div className="flex items-center gap-2 pt-1 text-xs text-slate-400 dark:text-slate-500 font-sans">
                    <span className="flex items-center gap-1 hover:text-slate-600 dark:hover:text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-[#ff5a36] shrink-0" />
                      <span>{activity.location}</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ActivityCard.displayName = 'ActivityCard';

