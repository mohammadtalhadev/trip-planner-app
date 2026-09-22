import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Users,
  Printer,
  Share2,
  Plus,
  Sparkles,
  LogIn,
  CheckCircle2,
} from 'lucide-react';
import { useTripStore, INITIAL_DEMO_TRIPS } from '../store/useTripStore';
import { useUserStore } from '../store/useUserStore';
import { ItineraryBuilder } from '../components/itinerary/ItineraryBuilder';
import { formatDateShort } from '../utils/date';

export const ItineraryPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const user = useUserStore((state) => state.user);
  const trips = useTripStore((state) => state.trips);
  const currentTripId = useTripStore((state) => state.currentTripId);

  // Modal & notification state
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  // If user is logged out, always default to demo trip
  const targetTripId = !user.isLoggedIn
    ? 'demo-turkey-vacation'
    : tripId || currentTripId || (trips.length > 0 ? trips[0].id : 'demo-turkey-vacation');

  const trip =
    trips.find((t) => t.id === targetTripId) ||
    INITIAL_DEMO_TRIPS.find((t) => t.id === targetTripId);

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

  const handleExportPDF = () => {
    window.print();
  };

  const handleShareItinerary = () => {
    navigator.clipboard?.writeText(window.location.href);
    setShowShareToast(true);
    setTimeout(() => {
      setShowShareToast(false);
    }, 2800);
  };

  return (
    <div className="space-y-6 py-2">
      {/* Stitch Top Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div className="space-y-1.5">
          {/* Status Badge & Curated Journey */}
          <div className="flex items-center gap-2">
            <Link
              to={!user.isLoggedIn ? '/' : `/trips/${trip.id}`}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mr-1"
              title="Back"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>In Planning</span>
              <span className="text-emerald-300 dark:text-emerald-700">•</span>
              <span className="text-slate-600 dark:text-slate-400 font-medium">Curated Journey</span>
            </div>

            {!user.isLoggedIn && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40">
                Interactive Demo
              </span>
            )}
          </div>

          {/* Large Trip Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black tracking-tight text-slate-900 dark:text-white">
            {trip.name}
          </h1>

          {/* Trip Metadata (Dates, Days, Travelers) */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#ff5a36]" />
              <span>
                {formatDateShort(trip.startDate)} - {formatDateShort(trip.endDate)}
              </span>
            </div>
            <span>•</span>
            <span>{trip.days.length} Days</span>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-sky-500" />
              <span>{trip.travelers?.length || 1} Travelers</span>
            </div>
          </div>
        </div>

        {/* Top Right Action Buttons (Export PDF, Share Itinerary, + Add Activity) */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportPDF}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
            title="Export itinerary to printable PDF"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span>Export PDF</span>
          </button>

          <button
            type="button"
            onClick={handleShareItinerary}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
            title="Share itinerary link"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Share Itinerary</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddActivityOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#ff5a36] hover:bg-[#e04826] active:bg-[#c2410c] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md shadow-orange-600/20 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Activity</span>
          </button>
        </div>
      </div>

      {/* Subnav Navigation */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {user.isLoggedIn && (
            <Link
              to={`/trips/${trip.id}`}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Dashboard
            </Link>
          )}
          <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#c2410c] text-white shadow-2xs">
            Itinerary
          </span>
          <Link
            to={!user.isLoggedIn ? '/budget' : `/trips/${trip.id}/budget`}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
              <strong>Interactive Demo Itinerary:</strong> You can add, edit, or delete activities freely (changes are in-memory demo only and not saved). Sign in to create and save your own permanent itineraries.
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
      <ItineraryBuilder
        trip={trip}
        isAddActivityOpen={isAddActivityOpen}
        onAddActivityClose={() => setIsAddActivityOpen(false)}
      />

      {/* Share Toast */}
      {showShareToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>Itinerary link copied to clipboard!</span>
        </div>
      )}
    </div>
  );
};
