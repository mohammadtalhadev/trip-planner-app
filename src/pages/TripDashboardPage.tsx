import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Users,
  MapPin,
  Layers,
  DollarSign,
  ArrowRight,
  Plus,
  Trash2,
} from 'lucide-react';
import { useTripStore } from '../store/useTripStore';
import { TripSummaryCards } from '../components/trip/TripSummaryCards';
import { formatDateShort } from '../utils/date';
import { formatCurrency } from '../utils/currency';

export const TripDashboardPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();

  const trip = useTripStore((state) => state.trips.find((t) => t.id === tripId));
  const updateTrip = useTripStore((state) => state.updateTrip);

  const [newTravelerName, setNewTravelerName] = useState('');
  const [isAddingTraveler, setIsAddingTraveler] = useState(false);

  if (!trip) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Trip Not Found</h2>
        <p className="text-sm text-slate-500">The requested trip itinerary does not exist or has been removed.</p>
        <Link
          to="/trips"
          className="inline-flex px-5 py-2.5 bg-[#c2410c] hover:bg-[#b91c1c] text-white text-xs font-bold rounded-xl shadow-md shadow-orange-600/20"
        >
          Return to Trips
        </Link>
      </div>
    );
  }

  const handleAddTraveler = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTravelerName.trim()) return;

    const newTraveler = {
      id: `trv-${Date.now()}`,
      name: newTravelerName.trim(),
      role: 'traveler' as const,
    };

    updateTrip(trip.id, {
      travelers: [...(trip.travelers || []), newTraveler],
    });

    setNewTravelerName('');
    setIsAddingTraveler(false);
  };

  const handleRemoveTraveler = (id: string) => {
    updateTrip(trip.id, {
      travelers: (trip.travelers || []).filter((t) => t.id !== id),
    });
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-stone-950 text-white min-h-[240px] shadow-card flex flex-col justify-between p-6 sm:p-8 border border-stone-800">
        {trip.coverImage && (
          <>
            <img
              src={trip.coverImage}
              alt={trip.destination}
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-transparent" />
          </>
        )}

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900/70 backdrop-blur-md text-xs font-medium border border-white/10 text-stone-200">
            <MapPin className="w-3 h-3 text-brand-300" />
            <span>{trip.destination}</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/destinations/${encodeURIComponent(
                trip.destination.toLowerCase().replace(/\s+/g, '-')
              )}?city=${encodeURIComponent(trip.destination)}&country=Destination&lat=${
                trip.coordinates?.lat || 48.85
              }&lon=${trip.coordinates?.lon || 2.35}`}
              className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-stone-200 hover:text-white transition-colors border border-white/10"
            >
              Explore City Guide
            </Link>
          </div>
        </div>

        <div className="relative z-10 space-y-2 mt-6">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-white drop-shadow-sm">
            {trip.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-stone-300 font-mono">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-stone-400" />
              {formatDateShort(trip.startDate)} → {formatDateShort(trip.endDate)} ({trip.days.length} Days)
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-stone-400" />
              {trip.travelers?.length || 1} {trip.travelers?.length === 1 ? 'Traveler' : 'Travelers'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-brand-300" />
              Budget: {formatCurrency(trip.budget, trip.currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Subnavigation Bar */}
      <div className="flex items-center gap-1 border-b border-stone-200/80 dark:border-stone-800 pb-2">
        <Link
          to={`/trips/${trip.id}`}
          className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#c2410c] text-white shadow-sm"
        >
          Dashboard Overview
        </Link>
        <Link
          to={`/trips/${trip.id}/itinerary`}
          className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800/60 transition-colors"
        >
          Itinerary ({trip.days.length} Days)
        </Link>
        <Link
          to={`/trips/${trip.id}/budget`}
          className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800/60 transition-colors"
        >
          Budget Ledger
        </Link>
      </div>

      {/* Summary Metrics & Upcoming Activities */}
      <TripSummaryCards trip={trip} />

      {/* Quick Action Navigation Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Itinerary Quick Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-subtle space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-xs font-mono text-stone-400">
                {trip.days.length} Days Scheduled
              </span>
            </div>
            <h3 className="text-base font-serif font-bold text-stone-900 dark:text-stone-100">
              Multi-Day Itinerary Planner
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed font-sans">
              Schedule activities day-by-day, reorganize seamlessly with drag & drop, move events between dates, and record notes.
            </p>
          </div>

          <Link
            to={`/trips/${trip.id}/itinerary`}
            className="inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-stone-100 hover:bg-stone-200/80 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
          >
            <span>Open Itinerary Planner</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Budget & Expense Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-subtle space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                <DollarSign className="w-4 h-4" />
              </div>
              <span className="text-xs font-mono text-stone-400">
                Cap: {formatCurrency(trip.budget, trip.currency)}
              </span>
            </div>
            <h3 className="text-base font-serif font-bold text-stone-900 dark:text-stone-100">
              Budget & Expense Ledger
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed font-sans">
              Record travel costs across accommodation, dining, transport, and leisure with instant visual breakdown.
            </p>
          </div>

          <Link
            to={`/trips/${trip.id}/budget`}
            className="inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-stone-100 hover:bg-stone-200/80 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
          >
            <span>Open Budget Ledger</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Travelers Management */}
      <div className="p-6 bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl shadow-subtle space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 dark:text-stone-500">
              Party & Companions
            </span>
            <h3 className="text-base font-serif font-bold text-stone-900 dark:text-stone-100 mt-0.5">
              Travelers ({trip.travelers?.length || 1})
            </h3>
          </div>

          {!isAddingTraveler && (
            <button
              onClick={() => setIsAddingTraveler(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200/80 dark:hover:bg-stone-700 text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Traveler</span>
            </button>
          )}
        </div>

        {isAddingTraveler && (
          <form onSubmit={handleAddTraveler} className="flex gap-2">
            <input
              type="text"
              autoFocus
              placeholder="Enter traveler's name..."
              value={newTravelerName}
              onChange={(e) => setNewTravelerName(e.target.value)}
              className="flex-1 px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-stone-400"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setIsAddingTraveler(false)}
              className="px-3 py-2 text-xs text-stone-500 hover:text-stone-700 font-medium"
            >
              Cancel
            </button>
          </form>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {trip.travelers?.map((traveler) => (
            <div
              key={traveler.id}
              className="p-3.5 rounded-xl bg-stone-50/80 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-stone-800 dark:bg-stone-700 text-stone-100 flex items-center justify-center font-mono text-xs font-bold">
                  {traveler.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900 dark:text-stone-100">
                    {traveler.name}
                  </p>
                  <p className="text-[10px] text-stone-400 capitalize font-mono">
                    {traveler.role || 'traveler'}
                  </p>
                </div>
              </div>

              {trip.travelers.length > 1 && traveler.role !== 'organizer' && (
                <button
                  onClick={() => handleRemoveTraveler(traveler.id)}
                  className="text-stone-400 hover:text-rose-600 p-1 transition-colors"
                  title="Remove traveler"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
