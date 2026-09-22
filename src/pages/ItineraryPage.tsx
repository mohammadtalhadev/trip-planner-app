import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';
import { useTripStore } from '../store/useTripStore';
import { ItineraryBuilder } from '../components/itinerary/ItineraryBuilder';
import { formatDateShort } from '../utils/date';

export const ItineraryPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const trip = useTripStore((state) => state.trips.find((t) => t.id === tripId));

  if (!trip) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Trip Not Found</h2>
        <p className="text-sm text-slate-500">The requested trip does not exist.</p>
        <Link
          to="/trips"
          className="inline-flex px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
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
            to={`/trips/${trip.id}`}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>{trip.name}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-blue-500" />
                {trip.destination}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Itinerary Builder
            </h1>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2">
          <Link
            to={`/trips/${trip.id}`}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Dashboard
          </Link>
          <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-sm">
            Itinerary
          </span>
          <Link
            to={`/trips/${trip.id}/budget`}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Budget
          </Link>
        </div>
      </div>

      {/* Main Itinerary Builder Component */}
      <ItineraryBuilder trip={trip} />
    </div>
  );
};
