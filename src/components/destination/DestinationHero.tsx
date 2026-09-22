import React from 'react';
import { MapPin, Navigation, Sparkles, Bookmark, BookmarkCheck } from 'lucide-react';
import { useSavedPlacesStore } from '../../store/useSavedPlacesStore';

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
    <div className="relative w-full h-[360px] sm:h-[420px] rounded-3xl overflow-hidden shadow-xl mb-8 group">
      {/* Background Image */}
      <img
        src={heroImage}
        alt={cityName}
        className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/20" />

      {/* Top Floating Badges */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/60 backdrop-blur-md text-white text-xs font-semibold border border-white/10">
          <Navigation className="w-3.5 h-3.5 text-blue-400" />
          <span>{lat.toFixed(2)}° N, {lon.toFixed(2)}° E</span>
        </div>

        <button
          onClick={handleToggleSave}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md text-xs font-bold transition-all shadow-md ${
            isSaved
              ? 'bg-blue-600 text-white shadow-blue-500/30'
              : 'bg-white/20 hover:bg-white/30 text-white border border-white/20'
          }`}
        >
          {isSaved ? (
            <>
              <BookmarkCheck className="w-4 h-4 fill-white text-white" />
              <span>Saved in Bookmarks</span>
            </>
          ) : (
            <>
              <Bookmark className="w-4 h-4" />
              <span>Bookmark Place</span>
            </>
          )}
        </button>
      </div>

      {/* Bottom Content Banner */}
      <div className="absolute bottom-8 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 text-blue-400 font-bold uppercase tracking-wider text-xs mb-2">
            <MapPin className="w-4 h-4" />
            <span>{countryName || 'Destination'}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-none drop-shadow-md">
            {cityName}
          </h1>
        </div>

        <button
          onClick={onPlanTrip}
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/30 transition-all hover:scale-[1.03] shrink-0"
        >
          <Sparkles className="w-5 h-5 text-amber-300" />
          <span>Plan a Trip to {cityName}</span>
        </button>
      </div>
    </div>
  );
};
