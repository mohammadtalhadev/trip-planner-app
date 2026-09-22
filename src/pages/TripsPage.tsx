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
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400">
            Journeys & Itineraries
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-stone-900 dark:text-stone-50 mt-1">
            Travel Portfolio
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1.5 max-w-xl leading-relaxed">
            Manage your scheduled journeys, custom multi-day agendas, and itemized travel expenses.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#c2410c] hover:bg-[#b91c1c] active:bg-[#9a3412] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md shadow-orange-600/20 transition-all hover:scale-[1.01] shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Plan New Journey</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search journeys by destination or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-transparent bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400 placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(['all', 'upcoming', 'past'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                filterTab === tab
                  ? 'bg-[#c2410c] text-white shadow-sm'
                  : 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab === 'all' ? 'All Journeys' : tab}
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
