import React, { useState, useCallback, useMemo } from 'react';
import { Plus, FileEdit, Trash2, Compass } from 'lucide-react';
import { Trip, Activity } from '../../types/trip';
import { useTripStore } from '../../store/useTripStore';
import { DayTabSelector } from './DayTabSelector';
import { ActivityCard } from './ActivityCard';
import { ActivityModal } from './ActivityModal';
import { MoveActivityModal } from './MoveActivityModal';
import { formatDate } from '../../utils/date';

interface ItineraryBuilderProps {
  trip: Trip;
}

export const ItineraryBuilder: React.FC<ItineraryBuilderProps> = ({ trip }) => {
  const [activeDayId, setActiveDayId] = useState<string>(trip.days[0]?.id || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modals state
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [activityToEdit, setActivityToEdit] = useState<Activity | null>(null);
  const [activityToMove, setActivityToMove] = useState<Activity | null>(null);
  const [isNotesEditing, setIsNotesEditing] = useState(false);
  const [notesDraft, setNotesDraft] = useState('');

  // Drag-and-drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Store actions
  const addDay = useTripStore((state) => state.addDay);
  const removeDay = useTripStore((state) => state.removeDay);
  const updateDayNotes = useTripStore((state) => state.updateDayNotes);
  const addActivity = useTripStore((state) => state.addActivity);
  const updateActivity = useTripStore((state) => state.updateActivity);
  const deleteActivity = useTripStore((state) => state.deleteActivity);
  const toggleActivityCompleted = useTripStore((state) => state.toggleActivityCompleted);
  const reorderActivities = useTripStore((state) => state.reorderActivities);
  const moveActivity = useTripStore((state) => state.moveActivity);

  // Active day object
  const activeDay = useMemo(() => {
    return trip.days.find((d) => d.id === activeDayId) || trip.days[0];
  }, [trip.days, activeDayId]);

  // Keep activeDayId valid if a day is removed
  if (!activeDay && trip.days.length > 0) {
    setActiveDayId(trip.days[0].id);
  }

  // Sorted and filtered activities for the active day
  const filteredActivities = useMemo(() => {
    if (!activeDay) return [];
    const acts = [...activeDay.activities].sort((a, b) => a.orderIndex - b.orderIndex);
    if (selectedCategory === 'all') return acts;
    return acts.filter((a) => a.category === selectedCategory);
  }, [activeDay, selectedCategory]);

  // Handlers with useCallback for memoized children
  const handleToggleComplete = useCallback(
    (activityId: string) => {
      toggleActivityCompleted(trip.id, activityId);
    },
    [trip.id, toggleActivityCompleted]
  );

  const handleMoveUp = useCallback(
    (index: number) => {
      if (!activeDay || index <= 0) return;
      reorderActivities(trip.id, activeDay.id, index, index - 1);
    },
    [trip.id, activeDay, reorderActivities]
  );

  const handleMoveDown = useCallback(
    (index: number) => {
      if (!activeDay || index >= activeDay.activities.length - 1) return;
      reorderActivities(trip.id, activeDay.id, index, index + 1);
    },
    [trip.id, activeDay, reorderActivities]
  );

  const handleOpenEdit = useCallback((activity: Activity) => {
    setActivityToEdit(activity);
    setIsActivityModalOpen(true);
  }, []);

  const handleDeleteActivity = useCallback(
    (activityId: string) => {
      deleteActivity(trip.id, activityId);
    },
    [trip.id, deleteActivity]
  );

  const handleOpenMove = useCallback((activity: Activity) => {
    setActivityToMove(activity);
  }, []);

  // HTML5 Drag and Drop handlers
  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, targetIndex: number) => {
      e.preventDefault();
      if (draggedIndex === null || draggedIndex === targetIndex || !activeDay) {
        setDraggedIndex(null);
        return;
      }
      reorderActivities(trip.id, activeDay.id, draggedIndex, targetIndex);
      setDraggedIndex(null);
    },
    [trip.id, activeDay, draggedIndex, reorderActivities]
  );

  const handleSaveActivity = (activityData: Omit<Activity, 'id' | 'dayId' | 'orderIndex'>) => {
    if (!activeDay) return;
    if (activityToEdit) {
      updateActivity(trip.id, activityToEdit.id, activityData);
    } else {
      addActivity(trip.id, activeDay.id, activityData);
    }
  };

  const handleSaveNotes = () => {
    if (activeDay) {
      updateDayNotes(trip.id, activeDay.id, notesDraft);
      setIsNotesEditing(false);
    }
  };

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Activities' },
    { id: 'sightseeing', label: 'Sightseeing' },
    { id: 'food', label: 'Food & Dining' },
    { id: 'activity', label: 'Tours & Activities' },
    { id: 'transport', label: 'Transport' },
    { id: 'shopping', label: 'Shopping' },
  ];

  if (!activeDay) {
    return (
      <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-frost p-8">
        <p className="text-slate-500 text-sm font-medium">No days scheduled in this journey yet.</p>
        <button
          onClick={() => addDay(trip.id)}
          className="mt-4 px-5 py-2.5 bg-[#c2410c] hover:bg-[#b91c1c] active:bg-[#9a3412] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md shadow-orange-600/20 transition-all hover:scale-[1.02]"
        >
          Add Day 1
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Day Selector Tabs */}
      <DayTabSelector
        days={trip.days}
        activeDayId={activeDay.id}
        onSelectDay={(dayId) => setActiveDayId(dayId)}
        onAddDay={() => addDay(trip.id)}
      />

      {/* Active Day Header Bar */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-frost space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-serif font-bold tracking-tight text-slate-900 dark:text-slate-50">
                Day {activeDay.dayNumber}
              </h2>
              <span className="text-xs font-mono font-medium text-slate-400 dark:text-slate-500">
                / {formatDate(activeDay.date)}
              </span>
            </div>
            {activeDay.title && (
              <p className="text-xs font-semibold text-[#c2410c] dark:text-[#fb923c] mt-1 uppercase tracking-wider">
                {activeDay.title}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActivityToEdit(null);
                setIsActivityModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#c2410c] hover:bg-[#b91c1c] active:bg-[#9a3412] text-white text-xs font-bold tracking-wider uppercase rounded-xl shadow-md shadow-orange-600/20 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Activity</span>
            </button>

            {trip.days.length > 1 && (
              <button
                onClick={() => {
                  if (window.confirm(`Remove Day ${activeDay.dayNumber} and all its activities?`)) {
                    removeDay(trip.id, activeDay.id);
                  }
                }}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-colors"
                title="Remove this day"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Day Notes */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
          {isNotesEditing ? (
            <div className="space-y-2.5">
              <textarea
                rows={2}
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                placeholder="Add special notes, reminders, or tickets for this day..."
                className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNotesEditing(false)}
                  className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#c2410c] hover:bg-[#b91c1c] text-white rounded-lg shadow-sm shadow-orange-600/20"
                >
                  Save Notes
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <p className="italic font-serif leading-relaxed">
                {activeDay.notes || 'No notes added for this day. Click to add daily directions, confirmations, or packing notes.'}
              </p>
              <button
                onClick={() => {
                  setNotesDraft(activeDay.notes || '');
                  setIsNotesEditing(true);
                }}
                className="inline-flex items-center gap-1.5 font-semibold text-[#c2410c] dark:text-[#fb923c] hover:underline shrink-0 ml-3 text-xs"
              >
                <FileEdit className="w-3.5 h-3.5" />
                <span>{activeDay.notes ? 'Edit notes' : 'Add notes'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#c2410c] text-white shadow-sm shadow-orange-600/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-stone-400">
          {filteredActivities.length} {filteredActivities.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Activities List */}
      {filteredActivities.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl shadow-frost space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-100 dark:border-sky-900/40 flex items-center justify-center text-sky-600 dark:text-sky-400 mx-auto">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-base text-slate-800 dark:text-slate-200">
            No activities scheduled for Day {activeDay.dayNumber}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Curate your day by adding architectural visits, dining reservations, guided walks, or scenic train rides.
          </p>
          <button
            onClick={() => {
              setActivityToEdit(null);
              setIsActivityModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#c2410c] hover:bg-[#b91c1c] active:bg-[#9a3412] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md shadow-orange-600/20 transition-all hover:scale-[1.01]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add First Activity</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredActivities.map((activity, idx) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              index={idx}
              totalActivities={filteredActivities.length}
              currency={trip.currency}
              onToggleComplete={handleToggleComplete}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              onEdit={handleOpenEdit}
              onDelete={handleDeleteActivity}
              onMoveToDay={handleOpenMove}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Activity Modal */}
      <ActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => {
          setIsActivityModalOpen(false);
          setActivityToEdit(null);
        }}
        dayNumber={activeDay.dayNumber}
        activityToEdit={activityToEdit}
        onSave={handleSaveActivity}
      />

      {/* Move Activity Modal */}
      <MoveActivityModal
        isOpen={!!activityToMove}
        onClose={() => setActivityToMove(null)}
        activity={activityToMove}
        currentDayId={activeDay.id}
        days={trip.days}
        onMove={(actId, fromDay, toDay) => {
          moveActivity(trip.id, actId, fromDay, toDay);
        }}
      />
    </div>
  );
};
