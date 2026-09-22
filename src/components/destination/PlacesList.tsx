import React, { useState, useMemo, memo } from 'react';
import { Compass, Bookmark, BookmarkCheck, Plus, Star, MapPin, ExternalLink } from 'lucide-react';
import { AsyncSection, AttractionPlace } from '../../types/api';
import { useSavedPlacesStore } from '../../store/useSavedPlacesStore';
import { CardSkeleton } from '../common/Skeleton';
import { ErrorCard } from '../common/ErrorCard';
import { toEnglishPlaceName } from '../../utils/englishPlaces';
import { getRealPlaceImage, handleImageError, DEFAULT_FALLBACK_IMAGE } from '../../utils/placeImages';

interface PlaceCardProps {
  place: AttractionPlace;
  cityName: string;
  countryName: string;
  isSaved: boolean;
  onToggleSave: (place: AttractionPlace) => void;
  onAddToTrip?: (place: AttractionPlace) => void;
}

// Memoized individual place card
const PlaceCard: React.FC<PlaceCardProps> = memo(
  ({ place, cityName, countryName, isSaved, onToggleSave, onAddToTrip }) => {
    const englishName = toEnglishPlaceName(place.name, cityName, place.category);
    const placeImage = getRealPlaceImage(
      englishName,
      place.category,
      cityName,
      place.preview?.source
    );

    return (
      <div className="group bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-frost hover:shadow-card transition-all duration-300 flex flex-col justify-between">
        <div>
          {/* Image & Tags */}
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
            <img
              src={placeImage}
              alt={englishName}
              loading="lazy"
              onError={(e) => handleImageError(e, DEFAULT_FALLBACK_IMAGE)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

            {/* Category tag */}
            <div className="absolute top-3 left-3">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 backdrop-blur-md shadow-sm">
                {place.category || 'Sight'}
              </span>
            </div>

            {/* Bookmark button */}
            <button
              onClick={() => onToggleSave(place)}
              aria-label={isSaved ? 'Remove from saved' : 'Save place'}
              className={`absolute top-3 right-3 p-1.5 rounded-xl backdrop-blur-md transition-all ${
                isSaved
                  ? 'bg-[#c2410c] text-white shadow-md shadow-orange-600/20'
                  : 'bg-slate-950/60 text-white hover:bg-slate-950/90'
              }`}
            >
              {isSaved ? (
                <BookmarkCheck className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Bookmark className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Rating */}
            <div className="absolute bottom-2.5 left-3 flex items-center gap-1 text-white text-[11px] font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{place.rate ? `${place.rate}.0` : '4.5'}</span>
            </div>
          </div>

          {/* Details */}
          <div className="p-4 space-y-1.5">
            <h4 className="font-serif font-bold text-slate-900 dark:text-white text-sm line-clamp-1 group-hover:text-[#c2410c] dark:group-hover:text-[#fb923c] transition-colors">
              {englishName}
            </h4>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{cityName}, {countryName}</span>
            </div>
          </div>
        </div>

        {/* Action footer */}
        <div className="p-4 pt-0 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800/60 mt-2">
          {place.wikipedia && (
            <a
              href={place.wikipedia}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-xl text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Read on Wikipedia"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          {onAddToTrip && (
            <button
              onClick={() => onAddToTrip(place)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-[#c2410c] hover:text-white dark:hover:bg-[#c2410c] dark:hover:text-white text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Day</span>
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
    { id: 'all', label: 'All Highlights' },
    { id: 'attraction', label: 'Landmarks' },
    { id: 'restaurant', label: 'Gastronomy' },
    { id: 'hotel', label: 'Stays' },
    { id: 'culture', label: 'Art & Culture' },
  ];

  const handleToggleSave = (place: AttractionPlace) => {
    const englishName = toEnglishPlaceName(place.name, cityName, place.category);
    const resolvedImage = getRealPlaceImage(englishName, place.category, cityName, place.preview?.source);
    toggleSavePlace({
      id: place.xid,
      name: englishName,
      category: (place.category as any) || 'attraction',
      cityName,
      country: countryName,
      imageUrl: resolvedImage,
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
          <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
            Curated Places
          </span>
          <h3 className="font-serif text-2xl font-bold text-stone-900 dark:text-white">
            Points of Interest in {cityName}
          </h3>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 bg-slate-100/70 dark:bg-slate-900/60 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#c2410c] text-white shadow-sm shadow-orange-600/20 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
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
          message={places.error || 'Failed to communicate with places database.'}
          onRetry={onRetry}
        />
      )}

      {/* Empty State */}
      {places.status === 'success' && filteredPlaces.length === 0 && (
        <div className="p-10 text-center bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl shadow-frost">
          <Compass className="w-6 h-6 text-slate-400 mx-auto mb-2" />
          <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">No places found in this category</p>
          <p className="text-xs text-slate-400 mt-1">Select another filter or browse all highlights.</p>
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
