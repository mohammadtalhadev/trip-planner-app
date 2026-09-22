import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarPlus,
  MapPin,
  Clock,
  CheckCircle2,
  Tag,
  Compass,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { CustomSelect } from '../common/CustomSelect';
import { useTripStore, INITIAL_DEMO_TRIPS } from '../../store/useTripStore';
import { useUserStore } from '../../store/useUserStore';
import { ActivityCategory } from '../../types/trip';

export interface DestinationAddData {
  city: string;
  country: string;
  image?: string;
  lat?: number;
  lon?: number;
  description?: string;
}

interface AddToTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination: DestinationAddData | null;
}

export const AddToTripModal: React.FC<AddToTripModalProps> = ({
  isOpen,
  onClose,
  destination,
}) => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const trips = useTripStore((state) => state.trips);
  const currentTripId = useTripStore((state) => state.currentTripId);
  const addActivity = useTripStore((state) => state.addActivity);

  // Fallback demo trips if guest has empty store
  const availableTrips = trips.length > 0 ? trips : INITIAL_DEMO_TRIPS;

  const [selectedTripId, setSelectedTripId] = useState<string>(
    currentTripId || availableTrips[0]?.id || ''
  );
  const [selectedDayId, setSelectedDayId] = useState<string>('');
  const [activityTime, setActivityTime] = useState<string>('10:00');
  const [activityCategory, setActivityCategory] = useState<ActivityCategory>('sightseeing');
  const [customTitle, setCustomTitle] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Synchronize trip and day selection
  useEffect(() => {
    if (destination) {
      setCustomTitle(`Explore ${destination.city} Highlights`);
      setNotes(`Bookmarked from ${destination.city}, ${destination.country} destination guide.`);
    }
    const targetTrip = availableTrips.find((t) => t.id === selectedTripId) || availableTrips[0];
    if (targetTrip && targetTrip.days.length > 0) {
      setSelectedDayId(targetTrip.days[0].id);
    }
    setIsSuccess(false);
  }, [destination, isOpen]);

  useEffect(() => {
    const targetTrip = availableTrips.find((t) => t.id === selectedTripId);
    if (targetTrip && targetTrip.days.length > 0) {
      if (!targetTrip.days.some((d) => d.id === selectedDayId)) {
        setSelectedDayId(targetTrip.days[0].id);
      }
    }
  }, [selectedTripId, availableTrips]);

  if (!destination) return null;

  const currentTrip = availableTrips.find((t) => t.id === selectedTripId) || availableTrips[0];
  const currentDay = currentTrip?.days.find((d) => d.id === selectedDayId) || currentTrip?.days[0];

  const tripOptions = availableTrips.map((t) => ({
    value: t.id,
    label: `${t.name} (${t.destination})`,
  }));

  const dayOptions = (currentTrip?.days || []).map((d) => ({
    value: d.id,
    label: `Day ${d.dayNumber} • ${d.date || 'Scheduled'}`,
  }));

  const categoryOptions = [
    { value: 'sightseeing', label: 'Sightseeing' },
    { value: 'food', label: 'Food & Dining' },
    { value: 'activity', label: 'Tour & Activity' },
    { value: 'transport', label: 'Transportation' },
    { value: 'lodging', label: 'Lodging' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'other', label: 'Other' },
  ];

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTrip || !currentDay) return;

    addActivity(currentTrip.id, currentDay.id, {
      title: customTitle.trim() || `Explore ${destination.city}`,
      time: activityTime || '10:00',
      category: activityCategory,
      location: `${destination.city}, ${destination.country}`,
      notes: notes.trim(),
      completed: false,
    });

    setIsSuccess(true);
    setTimeout(() => {
      onClose();
      setIsSuccess(false);
    }, 1200);
  };

  const handleCreateNewTrip = () => {
    onClose();
    navigate(
      `/trips/new?city=${encodeURIComponent(destination.city)}&country=${encodeURIComponent(
        destination.country
      )}`
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Add ${destination.city} to Itinerary`}
    >
      {isSuccess ? (
        <div className="py-10 text-center space-y-3 animate-in fade-in duration-200">
          <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white">
            Added to Itinerary!
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            {customTitle} has been scheduled for Day {currentDay?.dayNumber || 1} in {currentTrip?.name}.
          </p>
        </div>
      ) : (
        <form onSubmit={handleAddActivity} className="space-y-4">
          {/* Destination Header Summary */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-800">
            {destination.image && (
              <img
                src={destination.image}
                alt={destination.city}
                className="w-14 h-14 rounded-xl object-cover ring-1 ring-black/10 shrink-0"
              />
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
                <MapPin className="w-3.5 h-3.5 text-[#ff5a36]" />
                <span>{destination.country}</span>
              </div>
              <h4 className="text-base font-serif font-bold text-stone-900 dark:text-stone-100 truncate">
                {destination.city}
              </h4>
            </div>
            {!user.isLoggedIn && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 shrink-0">
                Demo Mode
              </span>
            )}
          </div>

          {/* Activity Title */}
          <div>
            <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-1.5">
              Activity Name
            </label>
            <input
              type="text"
              required
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-[#ff5a36]/20 focus:border-[#ff5a36]"
            />
          </div>

          {/* Select Trip & Day */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Target Journey
              </label>
              <CustomSelect
                options={tripOptions}
                value={selectedTripId}
                onChange={(val) => setSelectedTripId(val)}
                className="w-full"
                size="md"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Scheduled Day
              </label>
              <CustomSelect
                options={dayOptions}
                value={selectedDayId}
                onChange={(val) => setSelectedDayId(val)}
                className="w-full"
                size="md"
              />
            </div>
          </div>

          {/* Time & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Planned Time
              </label>
              <div className="relative">
                <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="time"
                  value={activityTime}
                  onChange={(e) => setActivityTime(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-[#ff5a36]/20 focus:border-[#ff5a36]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Category
              </label>
              <CustomSelect
                options={categoryOptions}
                value={activityCategory}
                onChange={(val) => setActivityCategory(val as ActivityCategory)}
                triggerIcon={<Tag className="w-3.5 h-3.5 text-slate-400" />}
                className="w-full"
                size="md"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-1.5">
              Tour Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Bring camera for sunset panoramic view..."
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-[#ff5a36]/20 focus:border-[#ff5a36]"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleCreateNewTrip}
              className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-[#ff5a36] font-medium transition-colors cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Or build a new trip for {destination.city} →</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#c2410c] hover:bg-[#b91c1c] active:bg-[#9a3412] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md shadow-orange-600/20 transition-all hover:scale-[1.01]"
              >
                <CalendarPlus className="w-3.5 h-3.5" />
                <span>Add to Day {currentDay?.dayNumber || 1}</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
};
