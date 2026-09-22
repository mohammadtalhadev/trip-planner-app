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
          className="inline-flex px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
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
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white min-h-[220px] shadow-lg flex flex-col justify-between p-6 sm:p-8">
        {trip.coverImage && (
          <>
            <img
              src={trip.coverImage}
              alt={trip.destination}
              className="absolute inset-0 w-full h-full object-cover opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          </>
        )}

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold">
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            <span>{trip.destination}</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/destinations/${encodeURIComponent(
                trip.destination.toLowerCase().replace(/\s+/g, '-')
              )}?city=${encodeURIComponent(trip.destination)}&country=Destination&lat=${
                trip.coordinates?.lat || 48.85
              }&lon=${trip.coordinates?.lon || 2.35}`}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-xs font-bold transition-colors"
            >
              Explore City Guide
            </Link>
          </div>
        </div>

        <div className="relative z-10 space-y-2 mt-4">
          <h1 className="text-3xl sm:text-4xl font-black">{trip.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {formatDateShort(trip.startDate)} → {formatDateShort(trip.endDate)} ({trip.days.length} Days)
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              {trip.travelers?.length || 1} Travelers
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              Budget: {formatCurrency(trip.budget, trip.currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Subnavigation Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <Link
          to={`/trips/${trip.id}`}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-sm"
        >
          Dashboard Overview
        </Link>
        <Link
          to={`/trips/${trip.id}/itinerary`}
          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Itinerary Planner ({trip.days.length} Days)
        </Link>
        <Link
          to={`/trips/${trip.id}/budget`}
          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Budget & Expenses
        </Link>
      </div>

      {/* Summary Metrics & Upcoming Activities */}
      <TripSummaryCards trip={trip} />

      {/* Quick Action Navigation Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Itinerary Quick Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-400">
                {trip.days.length} Days Organized
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Multi-Day Itinerary Builder
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Schedule activities for each day, reorder with drag & drop, move events across days, and mark completed.
            </p>
          </div>

          <Link
            to={`/trips/${trip.id}/itinerary`}
            className="inline-flex items-center justify-center gap-2 py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white text-xs font-bold rounded-xl transition-colors"
          >
            <span>Open Itinerary Builder</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Budget & Expense Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <DollarSign className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-400">
                Limit: {formatCurrency(trip.budget, trip.currency)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Budget & Expense Management
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Track flight, hotel, and food spending by category with automated progress tracking and financial filters.
            </p>
          </div>

          <Link
            to={`/trips/${trip.id}/budget`}
            className="inline-flex items-center justify-center gap-2 py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white text-xs font-bold rounded-xl transition-colors"
          >
            <span>Open Budget Manager</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Travelers Management */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Trip Companions
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Travelers ({trip.travelers?.length || 1})
            </h3>
          </div>

          {!isAddingTraveler && (
            <button
              onClick={() => setIsAddingTraveler(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
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
              className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setIsAddingTraveler(false)}
              className="px-3 py-2 text-xs text-slate-500"
            >
              Cancel
            </button>
          </form>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {trip.travelers?.map((traveler) => (
            <div
              key={traveler.id}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                  {traveler.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {traveler.name}
                  </p>
                  <p className="text-[10px] text-slate-400 capitalize">
                    {traveler.role || 'traveler'}
                  </p>
                </div>
              </div>

              {trip.travelers.length > 1 && traveler.role !== 'organizer' && (
                <button
                  onClick={() => handleRemoveTraveler(traveler.id)}
                  className="text-slate-300 hover:text-red-500 p-1"
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
