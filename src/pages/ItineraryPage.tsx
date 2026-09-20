import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Sparkles, LogIn } from 'lucide-react';
import { useTripStore, INITIAL_DEMO_TRIPS } from '../store/useTripStore';
import { useUserStore } from '../store/useUserStore';
import { ItineraryBuilder } from '../components/itinerary/ItineraryBuilder';

export const ItineraryPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const user = useUserStore((state) => state.user);
  const trips = useTripStore((state) => state.trips);
  const currentTripId = useTripStore((state) => state.currentTripId);

  // If user is logged out, always default to demo trip
  const targetTripId = !user.isLoggedIn
    ? 'demo-turkey-vacation'
    : tripId || currentTripId || (trips.length > 0 ? trips[0].id : 'demo-turkey-vacation');

  const trip = trips.find((t) => t.id === targetTripId) || INITIAL_DEMO_TRIPS.find((t) => t.id === targetTripId);

  if (!trip) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Trip Not Found</h2>
        <p className="text-sm text-slate-500">The requested trip does not exist.</p>
        <Link
          to="/trips"
          className="inline-flex px-5 py-2.5 bg-[#c2410c] hover:bg-[#b91c1c] text-white text-xs font-bold rounded-xl shadow-md shadow-orange-600/20"
        >
          Return to Trips
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to={!user.isLoggedIn ? '/' : `/trips/${trip.id}`}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Back to Home / Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>{trip.name}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-sky-500" />
                {trip.destination}
              </span>
              {!user.isLoggedIn && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40">
                  Interactive Demo
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Itinerary Builder
            </h1>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2">
          {user.isLoggedIn && (
            <Link
              to={`/trips/${trip.id}`}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Dashboard
            </Link>
          )}
          <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#c2410c] text-white shadow-sm">
            Itinerary
          </span>
          <Link
            to={!user.isLoggedIn ? '/budget' : `/trips/${trip.id}/budget`}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Budget
          </Link>
        </div>
      </div>

      {/* Guest Interactive Demo Banner */}
      {!user.isLoggedIn && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200 animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              <strong>Interactive Demo Itinerary:</strong> You can add or delete days and activities freely to test the planner (changes are in-memory demo only and not saved). Sign in to create and save your own permanent itineraries.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/signup"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#c2410c] hover:bg-[#b91c1c] text-white text-xs font-bold shadow-xs transition-colors shrink-0"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In to Save</span>
            </Link>
          </div>
        </div>
      )}

      {/* Main Itinerary Builder Component */}
      <ItineraryBuilder trip={trip} />
    </div>
  );
};
