import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  FileEdit,
  Trash2,
  Compass,
  Sunset,
  Bookmark,
  Sparkles,
  Clock,
  Umbrella,
} from 'lucide-react';
import { Trip, Activity, ActivityCategory } from '../../types/trip';
import { useTripStore } from '../../store/useTripStore';
import { useSavedPlacesStore } from '../../store/useSavedPlacesStore';
import { DayTabSelector } from './DayTabSelector';
import { ActivityCard } from './ActivityCard';
import { ActivityModal } from './ActivityModal';
import { MoveActivityModal } from './MoveActivityModal';
import { formatDayOfWeek, formatDateShort } from '../../utils/date';
import { formatCurrency } from '../../utils/currency';

interface ItineraryBuilderProps {
  trip: Trip;
  isAddActivityOpen?: boolean;
  onAddActivityClose?: () => void;
}

export const ItineraryBuilder: React.FC<ItineraryBuilderProps> = ({
  trip,
  isAddActivityOpen = false,
  onAddActivityClose,
}) => {
  const navigate = useNavigate();
  const [activeDayId, setActiveDayId] = useState<string>(trip.days[0]?.id || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modals & form state
  const [internalAddOpen, setInternalAddOpen] = useState(false);
  const [activityToEdit, setActivityToEdit] = useState<Activity | null>(null);
  const [activityToMove, setActivityToMove] = useState<Activity | null>(null);
  const [isNotesEditing, setIsNotesEditing] = useState(false);
  const [notesDraft, setNotesDraft] = useState('');

  // Quick add bar inputs
  const [quickAddTitle, setQuickAddTitle] = useState('');
  const [quickAddTime, setQuickAddTime] = useState('14:00');

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

  // Saved places count for showcase
  const savedPlaces = useSavedPlacesStore((state) => state.savedPlaces);

  // Modal open resolution
  const isModalActive = isAddActivityOpen || internalAddOpen;
  const handleCloseModal = () => {
    setInternalAddOpen(false);
    onAddActivityClose?.();
    setActivityToEdit(null);
  };

  // Active day object
  const activeDay = useMemo(() => {
    return trip.days.find((d) => d.id === activeDayId) || trip.days[0];
  }, [trip.days, activeDayId]);

  // Keep activeDayId valid if a day is removed
  if (!activeDay && trip.days.length > 0) {
    setActiveDayId(trip.days[0].id);
  }

  // Filtered activities
  const filteredActivities = useMemo(() => {
    if (!activeDay) return [];
    const acts = [...activeDay.activities].sort((a, b) => a.orderIndex - b.orderIndex);
    if (selectedCategory === 'all') return acts;
    return acts.filter((a) => a.category === selectedCategory);
  }, [activeDay, selectedCategory]);

  // Budget allocations across trip
  const allExpenses = useMemo(() => {
    return trip.days.flatMap((d) => d.expenses || []);
  }, [trip.days]);

  const lodgingCost = useMemo(() => {
    const fromExp = allExpenses
      .filter((e) => e.category === 'Accommodation')
      .reduce((s, e) => s + e.amount, 0);
    const fromAct = trip.days
      .flatMap((d) => d.activities)
      .filter((a) => a.category === 'lodging')
      .reduce((s, a) => s + (a.cost || 0), 0);
    return fromExp + fromAct;
  }, [allExpenses, trip.days]);

  const stopsCost = useMemo(() => {
    const fromExp = allExpenses
      .filter((e) => e.category === 'Activities' || e.category === 'Transportation')
      .reduce((s, e) => s + e.amount, 0);
    const fromAct = trip.days
      .flatMap((d) => d.activities)
      .filter((a) => a.category === 'sightseeing' || a.category === 'activity' || a.category === 'transport')
      .reduce((s, a) => s + (a.cost || 0), 0);
    return fromExp + fromAct;
  }, [allExpenses, trip.days]);

  const diningCost = useMemo(() => {
    const fromExp = allExpenses
      .filter((e) => e.category === 'Food')
      .reduce((s, e) => s + e.amount, 0);
    const fromAct = trip.days
      .flatMap((d) => d.activities)
      .filter((a) => a.category === 'food')
      .reduce((s, a) => s + (a.cost || 0), 0);
    return fromExp + fromAct;
  }, [allExpenses, trip.days]);

  const totalSpent = lodgingCost + stopsCost + diningCost;
  const budgetTarget = trip.budget || 2500;

  // Segment widths (as percentages of budget target or total)
  const maxBar = Math.max(budgetTarget, totalSpent, 1);
  const lodgingPct = Math.min(100, Math.round((lodgingCost / maxBar) * 100));
  const stopsPct = Math.min(100 - lodgingPct, Math.round((stopsCost / maxBar) * 100));
  const diningPct = Math.min(100 - lodgingPct - stopsPct, Math.round((diningCost / maxBar) * 100));

  // Find a showcase/free day (unscheduled or upcoming)
  const freeDay = useMemo(() => {
    return (
      trip.days.find((d) => d.id !== activeDay?.id && d.activities.length === 0) ||
      trip.days.find((d) => d.activities.length === 0) ||
      trip.days[trip.days.length - 1]
    );
  }, [trip.days, activeDay]);

  // Handlers with useCallback
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
    setInternalAddOpen(true);
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

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAddTitle.trim() || !activeDay) return;

    addActivity(trip.id, activeDay.id, {
      title: quickAddTitle.trim(),
      time: quickAddTime || '14:00',
      category: 'sightseeing',
      completed: false,
      cost: 0,
      location: trip.destination,
    });
    setQuickAddTitle('');
  };

  const handleGenerateAiDayPlan = (targetDayId: string) => {
    const dest = trip.destination || 'the city';
    const day = trip.days.find((d) => d.id === targetDayId) || activeDay;
    if (!day) return;

    const curatedPlans = [
      {
        title: `Morning Architectural Walk in ${dest}`,
        time: '09:00',
        category: 'sightseeing' as ActivityCategory,
        location: `${dest} Historic Center`,
        cost: 20,
        notes: 'Explore UNESCO heritage alleys and quiet morning courtyards before crowds arrive.',
        completed: false,
      },
      {
        title: `Artisanal Tasting & Local Specialties`,
        time: '12:30',
        category: 'food' as ActivityCategory,
        location: `${dest} Covered Market`,
        cost: 35,
        notes: 'Authentic seasonal lunch paired with artisanal tea and handmade sweets.',
        completed: false,
      },
      {
        title: `Golden Hour Scenic Viewpoint`,
        time: '17:15',
        category: 'activity' as ActivityCategory,
        location: `${dest} Panoramic Summit`,
        cost: 0,
        notes: 'Spectacular sunset vantage point catching the evening light over the city.',
        completed: false,
      },
    ];

    curatedPlans.forEach((plan) => {
      addActivity(trip.id, day.id, plan);
    });

    setActiveDayId(day.id);
  };

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Activities' },
    { id: 'sightseeing', label: 'Culture & Sightseeing' },
    { id: 'food', label: 'Food & Dining' },
    { id: 'activity', label: 'Tours & Activities' },
    { id: 'transport', label: 'Transit' },
    { id: 'shopping', label: 'Shopping' },
  ];

  if (!activeDay) {
    return (
      <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-frost p-8">
        <p className="text-slate-500 text-sm font-medium">No days scheduled in this journey yet.</p>
        <button
          onClick={() => addDay(trip.id)}
          className="mt-4 px-5 py-2.5 bg-[#c2410c] hover:bg-[#b91c1c] active:bg-[#9a3412] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md shadow-orange-600/20 transition-all hover:scale-[1.02] cursor-pointer"
        >
          Add Day 1
        </button>
      </div>
    );
  }

  // Timeline node colors
  const nodeColors = [
    'bg-indigo-600 ring-4 ring-indigo-100 dark:ring-indigo-950',
    'bg-[#ff5a36] ring-4 ring-orange-100 dark:ring-orange-950',
    'bg-amber-500 ring-4 ring-amber-100 dark:ring-amber-950',
    'bg-sky-500 ring-4 ring-sky-100 dark:ring-sky-950',
  ];

  return (
    <div className="space-y-6">
      {/* 1. Day Selector Timeline Carousel */}
      <DayTabSelector
        days={trip.days}
        activeDayId={activeDay.id}
        onSelectDay={(dayId) => setActiveDayId(dayId)}
        onAddDay={() => addDay(trip.id)}
      />

      {/* 2. Active Day Subheader Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-frost">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-[#ff5a36] flex items-center justify-center shrink-0">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold font-serif text-slate-900 dark:text-white">
              {formatDayOfWeek(activeDay.date)}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {activeDay.title || trip.destination} • {activeDay.activities.length} Stops Planned
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-medium border border-amber-200/60 dark:border-amber-900/40">
            <Sunset className="w-3.5 h-3.5 text-amber-500" />
            <span>Golden Hour 17:08</span>
          </div>

          <button
            onClick={() => {
              setActivityToEdit(null);
              setInternalAddOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#c2410c] hover:bg-[#b91c1c] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Activity</span>
          </button>

          {trip.days.length > 1 && (
            <button
              onClick={() => {
                if (window.confirm(`Delete Day ${activeDay.dayNumber} and all its scheduled activities?`)) {
                  removeDay(trip.id, activeDay.id);
                }
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
              title="Remove this day"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Day Notes Bar */}
      <div className="px-5 py-3 rounded-2xl bg-stone-50 dark:bg-stone-900/40 border border-stone-200/70 dark:border-stone-800">
        {isNotesEditing ? (
          <div className="space-y-2">
            <textarea
              rows={2}
              value={notesDraft}
              onChange={(e) => setNotesDraft(e.target.value)}
              placeholder="Add packing tips, metro directions, or reservations for this day..."
              className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:ring-1 focus:ring-stone-400"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsNotesEditing(false)}
                className="px-3 py-1 text-xs text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNotes}
                className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider bg-[#c2410c] text-white rounded-lg shadow-2xs"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <p className="italic font-serif leading-relaxed line-clamp-1">
              {activeDay.notes || 'No notes added for this day. Click to add directions or reminders.'}
            </p>
            <button
              onClick={() => {
                setNotesDraft(activeDay.notes || '');
                setIsNotesEditing(true);
              }}
              className="inline-flex items-center gap-1 font-semibold text-[#c2410c] dark:text-[#fb923c] hover:underline shrink-0 ml-3 text-xs cursor-pointer"
            >
              <FileEdit className="w-3.5 h-3.5" />
              <span>{activeDay.notes ? 'Edit' : 'Add notes'}</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. Two-Column Layout (Timeline vs Sticky Widgets) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Timeline & Activities (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Category Filter Pills */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 no-scrollbar">
            <div className="flex items-center gap-1.5 flex-nowrap">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xs'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <span className="text-[11px] font-mono text-slate-400 shrink-0">
              {filteredActivities.length} {filteredActivities.length === 1 ? 'stop' : 'stops'}
            </span>
          </div>

          {/* Activities Timeline */}
          {filteredActivities.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl shadow-frost space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/60 border border-orange-100 dark:border-orange-900/40 flex items-center justify-center text-[#c2410c] dark:text-orange-400 mx-auto">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100">
                No activities scheduled for Day {activeDay.dayNumber}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Add an activity below or click Quick Add to schedule a stop.
              </p>
              <button
                onClick={() => {
                  setActivityToEdit(null);
                  setInternalAddOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#c2410c] hover:bg-[#b91c1c] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition-transform hover:scale-[1.01] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add First Activity</span>
              </button>
            </div>
          ) : (
            <div className="relative pl-6 sm:pl-8 before:absolute before:left-3 before:top-6 before:bottom-6 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800 space-y-4">
              {filteredActivities.map((activity, idx) => {
                const nodeColor = nodeColors[idx % nodeColors.length];

                return (
                  <div key={activity.id} className="relative">
                    {/* Concentric node on timeline stem */}
                    <div className="absolute -left-6 sm:-left-8 top-5 w-6 sm:w-6 flex items-center justify-center">
                      <div className={`w-3.5 h-3.5 rounded-full ${nodeColor}`} />
                    </div>

                    <ActivityCard
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
                  </div>
                );
              })}
            </div>
          )}

          {/* Quick Add Bar (Stitch bottom row) */}
          <form
            onSubmit={handleQuickAdd}
            className="p-3 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-subtle flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="flex items-center gap-2 w-full flex-1">
              <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-950/60 text-[#ff5a36] flex items-center justify-center shrink-0">
                <Plus className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={quickAddTitle}
                onChange={(e) => setQuickAddTitle(e.target.value)}
                placeholder="Quick add activity (e.g., 4:00 PM Matcha Parfait at Tsujiri)..."
                className="flex-1 w-full px-2 py-1.5 bg-transparent text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <div className="relative">
                <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                <input
                  type="time"
                  value={quickAddTime}
                  onChange={(e) => setQuickAddTime(e.target.value)}
                  className="pl-7 pr-2 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={!quickAddTitle.trim()}
                className="px-4 py-2 bg-[#ff5a36] hover:bg-[#e04826] active:bg-[#c2410c] text-white text-xs font-bold rounded-xl shadow-xs transition-all disabled:opacity-40 cursor-pointer"
              >
                + Add
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Sticky Widgets (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
          {/* Widget 1: Showcase Card / Free Day Widget */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase px-1">
              <span>SHOWCASE</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px]">
                {freeDay.activities.length === 0 ? 'Unscheduled' : 'Day Highlight'}
              </span>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-frost text-center space-y-3.5">
              <div className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 text-left">
                Day {freeDay.dayNumber} • {formatDateShort(freeDay.date)} ({freeDay.activities.length === 0 ? 'Free Day' : freeDay.title || 'Exploration'})
              </div>

              <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-100 dark:border-sky-900/40 text-sky-500 dark:text-sky-400 flex items-center justify-center mx-auto shadow-2xs">
                <Umbrella className="w-6 h-6" />
              </div>

              <h4 className="text-base font-serif font-bold text-slate-900 dark:text-white">
                Keep it Spontaneous
              </h4>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                No rigid schedules set — keep it open for wandering or draw inspirations from your bookmarked gems.
              </p>

              <button
                type="button"
                onClick={() => navigate('/saved')}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5 text-sky-500" />
                <span>Browse Saved Places ({savedPlaces.length})</span>
              </button>

              <button
                type="button"
                onClick={() => handleGenerateAiDayPlan(freeDay.id)}
                className="inline-flex items-center gap-1.5 text-xs text-[#c2410c] dark:text-orange-400 hover:underline font-semibold cursor-pointer pt-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate AI Day Plan</span>
              </button>
            </div>
          </div>

          {/* Widget 2: Trip Budget Allocation Widget */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-frost space-y-4">
            <div>
              <span className="text-[11px] font-mono font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase block">
                TRIP BUDGET ALLOCATION
              </span>
              <div className="flex items-baseline justify-between mt-1.5">
                <span className="text-2xl sm:text-3xl font-serif font-black text-slate-900 dark:text-white tracking-tight">
                  {formatCurrency(totalSpent, trip.currency)}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                  of {formatCurrency(budgetTarget, trip.currency)} target
                </span>
              </div>
            </div>

            {/* Segmented multi-color progress bar */}
            <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex shadow-inner">
              <div
                style={{ width: `${lodgingPct}%` }}
                className="h-full bg-indigo-500 transition-all duration-500"
                title={`Lodging: ${formatCurrency(lodgingCost, trip.currency)}`}
              />
              <div
                style={{ width: `${stopsPct}%` }}
                className="h-full bg-sky-400 transition-all duration-500"
                title={`Stops: ${formatCurrency(stopsCost, trip.currency)}`}
              />
              <div
                style={{ width: `${diningPct}%` }}
                className="h-full bg-[#ff5a36] transition-all duration-500"
                title={`Dining: ${formatCurrency(diningCost, trip.currency)}`}
              />
            </div>

            {/* Category breakdown grid */}
            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80 text-center">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-[10px] text-slate-400 block font-medium">Lodging</span>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 block mt-0.5">
                  {formatCurrency(lodgingCost, trip.currency)}
                </span>
              </div>

              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-[10px] text-slate-400 block font-medium">Stops</span>
                <span className="text-xs font-bold text-sky-600 dark:text-sky-400 block mt-0.5">
                  {formatCurrency(stopsCost, trip.currency)}
                </span>
              </div>

              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-[10px] text-slate-400 block font-medium">Dining</span>
                <span className="text-xs font-bold text-[#c2410c] dark:text-orange-400 block mt-0.5">
                  {formatCurrency(diningCost, trip.currency)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Activity Modal */}
      <ActivityModal
        isOpen={isModalActive}
        onClose={handleCloseModal}
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
