import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, BookmarkCheck, Trash2, MapPin, Star, ExternalLink, Compass } from 'lucide-react';
import { useSavedPlacesStore } from '../store/useSavedPlacesStore';
import { EmptyState } from '../components/common/EmptyState';
import { Badge } from '../components/common/Badge';

export const SavedPlacesPage: React.FC = () => {
  const savedPlaces = useSavedPlacesStore((state) => state.savedPlaces);
  const removeSavedPlace = useSavedPlacesStore((state) => state.removeSavedPlace);
  const clearAllSavedPlaces = useSavedPlacesStore((state) => state.clearAllSavedPlaces);

  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredPlaces = useMemo(() => {
    if (filterCategory === 'all') return savedPlaces;
    return savedPlaces.filter((p) => p.category === filterCategory);
  }, [savedPlaces, filterCategory]);

  const categories = [
    { id: 'all', label: 'All Saved' },
    { id: 'destination', label: 'Destinations' },
    { id: 'attraction', label: 'Attractions' },
    { id: 'restaurant', label: 'Restaurants & Cafes' },
    { id: 'hotel', label: 'Hotels & Lodging' },
  ];

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Personal Collection
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1">
            Saved Places & Bookmarks
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Your personal collection of saved destinations, attractions, dining spots, and hotels.
          </p>
        </div>

        {savedPlaces.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear all saved places?')) {
                clearAllSavedPlaces();
              }
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-red-200 dark:border-red-900/60 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Category Filter Tabs */}
      {savedPlaces.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Grid or Empty State */}
      {filteredPlaces.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title={savedPlaces.length === 0 ? 'No saved places yet' : 'No places in this category'}
          description={
            savedPlaces.length === 0
              ? 'When browsing destinations and attractions, click the bookmark icon to save places for your trips.'
              : 'Try selecting "All Saved" or bookmark additional places from our destination guides.'
          }
          actionText={savedPlaces.length === 0 ? 'Discover Destinations' : undefined}
          onAction={savedPlaces.length === 0 ? () => (window.location.href = '/destinations') : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map((place) => {
            const defaultImg =
              place.imageUrl ||
              'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';

            const destinationLink = `/destinations/${encodeURIComponent(
              place.cityName.toLowerCase().replace(/\s+/g, '-')
            )}?city=${encodeURIComponent(place.cityName)}&country=${encodeURIComponent(
              place.country || ''
            )}&lat=${place.coordinates?.lat || 48.85}&lon=${place.coordinates?.lon || 2.35}`;

            return (
              <div
                key={place.id}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={defaultImg}
                      alt={place.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                    <div className="absolute top-3 left-3">
                      <Badge variant="primary" size="sm" className="bg-slate-900/80 text-white border-none backdrop-blur-md capitalize">
                        {place.category}
                      </Badge>
                    </div>

                    <button
                      onClick={() => removeSavedPlace(place.id)}
                      className="absolute top-3 right-3 p-2 rounded-xl bg-slate-900/70 text-rose-400 hover:bg-rose-600 hover:text-white backdrop-blur-md transition-colors"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                      <h3 className="text-base font-bold truncate drop-shadow">{place.name}</h3>
                      {place.rating && (
                        <div className="flex items-center gap-1 text-xs font-bold text-amber-300">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{place.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      <span>{place.cityName} {place.country ? `• ${place.country}` : ''}</span>
                    </div>

                    {place.description && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {place.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <Link
                    to={destinationLink}
                    className="w-full py-2 px-3 flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    <span>View in {place.cityName}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
