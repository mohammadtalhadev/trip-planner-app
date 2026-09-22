import React, { useState, useMemo, memo } from 'react';
import { Compass, Bookmark, BookmarkCheck, Plus, Star, MapPin, ExternalLink } from 'lucide-react';
import { AsyncSection, AttractionPlace } from '../../types/api';
import { useSavedPlacesStore } from '../../store/useSavedPlacesStore';
import { CardSkeleton } from '../common/Skeleton';
import { ErrorCard } from '../common/ErrorCard';
import { Badge } from '../common/Badge';

interface PlaceCardProps {
  place: AttractionPlace;
  cityName: string;
  countryName: string;
  isSaved: boolean;
  onToggleSave: (place: AttractionPlace) => void;
  onAddToTrip?: (place: AttractionPlace) => void;
}

// Memoized individual place card to prevent re-rendering all items when one is saved or trip changes
const PlaceCard: React.FC<PlaceCardProps> = memo(
  ({ place, cityName, countryName, isSaved, onToggleSave, onAddToTrip }) => {
    const defaultImage =
      place.preview?.source ||
      'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=800&q=80';

    return (
      <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
        <div>
          {/* Image & Badges */}
          <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
            <img
              src={defaultImage}
              alt={place.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

            {/* Category badge */}
            <div className="absolute top-3 left-3">
              <Badge variant="primary" size="sm" className="bg-slate-900/80 text-white border-none backdrop-blur-md">
                {place.category || 'Attraction'}
              </Badge>
            </div>

            {/* Bookmark button with optimistic update */}
            <button
              onClick={() => onToggleSave(place)}
              aria-label={isSaved ? 'Remove from saved' : 'Save place'}
              className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-transform active:scale-90 ${
                isSaved
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-900/60 text-white hover:bg-slate-900/90'
              }`}
            >
              {isSaved ? (
                <BookmarkCheck className="w-4 h-4 fill-white text-white" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>

            {/* Rating badge */}
            <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-xs font-bold drop-shadow">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{place.rate ? `${place.rate}.0` : '4.5'}</span>
            </div>
          </div>

          {/* Details */}
          <div className="p-4 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {place.name}
            </h4>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{cityName}, {countryName}</span>
            </div>
          </div>
        </div>

        {/* Action buttons footer */}
        <div className="p-4 pt-0 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800/60 mt-2">
          {place.wikipedia && (
            <a
              href={place.wikipedia}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="View on Wikipedia"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          {onAddToTrip && (
            <button
              onClick={() => onAddToTrip(place)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-bold rounded-xl transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Trip</span>
            </button>
          )}
        </div>
      </div>
    );
  }
);

PlaceCard.displayName = 'PlaceCard';

interface PlacesListProps {
  places: AsyncSection<AttractionPlace[]>;
  cityName: string;
  countryName: string;
  onAddToTrip?: (place: AttractionPlace) => void;
  onRetry?: () => void;
}

export const PlacesList: React.FC<PlacesListProps> = ({
  places,
  cityName,
  countryName,
  onAddToTrip,
  onRetry,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const savedPlaces = useSavedPlacesStore((state) => state.savedPlaces);
  const toggleSavePlace = useSavedPlacesStore((state) => state.toggleSavePlace);

  const categories = [
    { id: 'all', label: 'All Places' },
    { id: 'attraction', label: 'Attractions' },
    { id: 'restaurant', label: 'Dining' },
    { id: 'hotel', label: 'Hotels' },
    { id: 'culture', label: 'Culture' },
  ];

  const handleToggleSave = (place: AttractionPlace) => {
    toggleSavePlace({
      id: place.xid,
      name: place.name,
      category: (place.category as any) || 'attraction',
      cityName,
      country: countryName,
      imageUrl: place.preview?.source,
      rating: place.rate,
      coordinates: {
        lat: place.point.lat,
        lon: place.point.lon,
      },
    });
  };

  const filteredPlaces = useMemo(() => {
    if (!places.data) return [];
    if (selectedCategory === 'all') return places.data;
    return places.data.filter((p) => p.category === selectedCategory);
  }, [places.data, selectedCategory]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            OpenTripMap Explorer
          </span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            Popular Attractions & Places
          </h3>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Skeleton */}
      {places.status === 'loading' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error Fallback */}
      {places.status === 'error' && (
        <ErrorCard
          title="Unable to Load Attractions"
          message={places.error || 'Failed to communicate with the places database.'}
          onRetry={onRetry}
        />
      )}

      {/* Empty State */}
      {places.status === 'success' && filteredPlaces.length === 0 && (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
          <Compass className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="font-bold text-slate-700 dark:text-slate-300">No places in this category</p>
          <p className="text-xs text-slate-500 mt-1">Select another category or view all places.</p>
        </div>
      )}

      {/* Success Grid */}
      {places.status === 'success' && filteredPlaces.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPlaces.map((place) => {
            const isSaved = savedPlaces.some((p) => p.id === place.xid);
            return (
              <PlaceCard
                key={place.xid}
                place={place}
                cityName={cityName}
                countryName={countryName}
                isSaved={isSaved}
                onToggleSave={handleToggleSave}
                onAddToTrip={onAddToTrip}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
