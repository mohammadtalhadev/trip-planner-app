import React from 'react';
import { MapPin, Navigation, Sparkles, Bookmark, BookmarkCheck } from 'lucide-react';
import { useSavedPlacesStore } from '../../store/useSavedPlacesStore';
import { handleImageError, DEFAULT_FALLBACK_IMAGE } from '../../utils/placeImages';

interface DestinationHeroProps {
  cityName: string;
  countryName: string;
  lat: number;
  lon: number;
  coverImage?: string;
  onPlanTrip: () => void;
}

export const DestinationHero: React.FC<DestinationHeroProps> = ({
  cityName,
  countryName,
  lat,
  lon,
  coverImage,
  onPlanTrip,
}) => {
  const isSaved = useSavedPlacesStore((state) =>
    state.isPlaceSaved(`dest-${cityName.toLowerCase()}`)
  );
  const toggleSavePlace = useSavedPlacesStore((state) => state.toggleSavePlace);

  const heroImage =
    coverImage ||
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80';

  const handleToggleSave = () => {
    toggleSavePlace({
      id: `dest-${cityName.toLowerCase()}`,
      name: cityName,
      category: 'destination',
      cityName,
      country: countryName,
      description: `Scenic travel destination in ${countryName}`,
      imageUrl: heroImage,
      coordinates: { lat, lon },
    });
  };

  return (
    <div className="relative w-full h-[380px] sm:h-[440px] rounded-3xl overflow-hidden shadow-card mb-8 group border border-stone-200/60 dark:border-stone-800">
      {/* Background Image */}
      <img
        src={heroImage}
        alt={cityName}
        onError={(e) => handleImageError(e, DEFAULT_FALLBACK_IMAGE)}
        className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-1000 ease-out"
      />

      {/* Atmospheric Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-stone-950/15" />

      {/* Top Floating Controls */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-950/60 backdrop-blur-md text-white/90 text-xs font-mono border border-white/10">
          <Navigation className="w-3 h-3 text-stone-300" />
          <span>{lat.toFixed(2)}° N, {lon.toFixed(2)}° E</span>
        </div>

        <button
          onClick={handleToggleSave}
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-md text-xs font-semibold transition-all ${
            isSaved
              ? 'bg-white text-stone-900 shadow-sm'
              : 'bg-stone-950/60 hover:bg-stone-950/80 text-white border border-white/15'
          }`}
        >
          {isSaved ? (
            <>
              <BookmarkCheck className="w-3.5 h-3.5 fill-stone-900 text-stone-900" />
              <span>Bookmarked</span>
            </>
          ) : (
            <>
              <Bookmark className="w-3.5 h-3.5" />
              <span>Bookmark</span>
            </>
          )}
        </button>
      </div>

      {/* Editorial Title Banner */}
      <div className="absolute bottom-8 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-stone-300 uppercase tracking-widest text-[11px] font-semibold mb-2">
            <MapPin className="w-3.5 h-3.5 text-stone-300" />
            <span>{countryName || 'Destination'}</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-white tracking-tight leading-none drop-shadow-sm">
            {cityName}
          </h1>
        </div>

        <button
          onClick={onPlanTrip}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white hover:bg-stone-100 text-stone-900 text-xs font-bold uppercase tracking-wider rounded-2xl shadow-float transition-all hover:scale-[1.02] shrink-0"
        >
          <Sparkles className="w-4 h-4 text-stone-900" />
          <span>Plan Itinerary in {cityName}</span>
        </button>
      </div>
    </div>
  );
};
