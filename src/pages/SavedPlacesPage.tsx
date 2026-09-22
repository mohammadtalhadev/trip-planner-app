import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Trash2, MapPin, Star, ExternalLink } from 'lucide-react';
import { useSavedPlacesStore } from '../store/useSavedPlacesStore';
import { EmptyState } from '../components/common/EmptyState';

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
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-5">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400">
            Personal Collection
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-stone-900 dark:text-stone-50 mt-1">
            Curated Bookmarks
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1.5 max-w-xl leading-relaxed">
            Your personal archive of bookmarked destinations, historical attractions, dining recommendations, and accommodations.
          </p>
        </div>

        {savedPlaces.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear all saved places?')) {
                clearAllSavedPlaces();
              }
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-800 text-xs font-semibold text-stone-500 hover:text-rose-600 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Collection</span>
          </button>
        )}
      </div>

      {/* Category Filter Tabs */}
      {savedPlaces.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                filterCategory === cat.id
                  ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 shadow-sm'
                  : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200/80 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800'
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
          title={savedPlaces.length === 0 ? 'No bookmarked places yet' : 'No entries in this category'}
          description={
            savedPlaces.length === 0
              ? 'When exploring destinations and landmarks, bookmark notable spots to easily incorporate them into your itineraries.'
              : 'Try selecting "All Saved" or bookmark additional landmarks from our destination guides.'
          }
          actionText={savedPlaces.length === 0 ? 'Explore Destinations' : undefined}
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
                className="group bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl overflow-hidden shadow-subtle hover:shadow-card transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
                    <img
                      src={defaultImg}
                      alt={place.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-transparent" />

                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-stone-950/60 backdrop-blur-md text-[10px] font-mono uppercase tracking-wider text-stone-200 border border-white/10">
                        {place.category}
                      </span>
                    </div>

                    <button
                      onClick={() => removeSavedPlace(place.id)}
                      className="absolute top-3 right-3 p-2 rounded-xl bg-stone-950/50 text-stone-300 hover:bg-rose-600 hover:text-white backdrop-blur-md transition-colors border border-white/10"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                      <h3 className="text-base font-serif font-bold truncate drop-shadow-sm">{place.name}</h3>
                      {place.rating && (
                        <div className="flex items-center gap-1 text-xs font-mono font-semibold text-amber-300">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{place.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-brand-600" />
                      <span>{place.cityName} {place.country ? `• ${place.country}` : ''}</span>
                    </div>

                    {place.description && (
                      <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed font-sans">
                        {place.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <Link
                    to={destinationLink}
                    className="w-full py-2.5 px-3 flex items-center justify-center gap-1.5 rounded-xl bg-stone-100 hover:bg-stone-900 hover:text-stone-50 dark:bg-stone-800 dark:hover:bg-stone-100 dark:hover:text-stone-900 text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 transition-colors"
                  >
                    <span>Explore in {place.cityName}</span>
                    <ExternalLink className="w-3 h-3" />
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
