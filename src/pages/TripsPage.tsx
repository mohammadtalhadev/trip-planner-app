import React, { useState, useMemo } from 'react';
import { Plus, Search, Compass } from 'lucide-react';
import { useTripStore } from '../store/useTripStore';
import { TripCard } from '../components/trip/TripCard';
import { CreateTripModal } from '../components/trip/CreateTripModal';
import { EmptyState } from '../components/common/EmptyState';

export const TripsPage: React.FC = () => {
  const trips = useTripStore((state) => state.trips);
  const deleteTrip = useTripStore((state) => state.deleteTrip);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'upcoming' | 'past'>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      // Text search
      const matchesSearch =
        trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.destination.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Status filter
      if (filterTab === 'upcoming') {
        return trip.endDate >= today;
      }
      if (filterTab === 'past') {
        return trip.endDate < today;
      }
      return true;
    });
  }, [trips, searchQuery, filterTab, today]);

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Trip Management
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1">
            My Travel Itineraries
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your scheduled vacations, multi-day itineraries, and travel budgets.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Trip</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search trips by name or destination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(['all', 'upcoming', 'past'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                filterTab === tab
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab === 'all' ? 'All Trips' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Trips Grid or Empty State */}
      {filteredTrips.length === 0 ? (
        <EmptyState
          icon={Compass}
          title={searchQuery ? 'No matching trips found' : 'No trips created yet'}
          description={
            searchQuery
              ? 'Try searching with a different trip title or destination name.'
              : 'Create your first vacation itinerary to start adding daily activities, managing budgets, and organizing travelers.'
          }
          actionText={searchQuery ? undefined : 'Create Your First Trip'}
          onAction={() => setIsCreateOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} onDelete={deleteTrip} />
          ))}
        </div>
      )}

      {/* Create Trip Modal */}
      <CreateTripModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
};
