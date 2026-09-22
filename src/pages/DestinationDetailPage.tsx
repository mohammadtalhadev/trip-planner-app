import React, { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { useDestinationDetails } from '../hooks/useDestinationDetails';
import { DestinationHero } from '../components/destination/DestinationHero';
import { WeatherCard } from '../components/destination/WeatherCard';
import { WikiSummaryCard } from '../components/destination/WikiSummaryCard';
import { CountryInfoCard } from '../components/destination/CountryInfoCard';
import { PlacesList } from '../components/destination/PlacesList';
import { PhotoGallery } from '../components/destination/PhotoGallery';
import { CreateTripModal } from '../components/trip/CreateTripModal';
import { AttractionPlace } from '../types/api';
import { useTripStore } from '../store/useTripStore';

export const DestinationDetailPage: React.FC = () => {
  const { destinationId } = useParams<{ destinationId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Extract query params or fallback
  const cityParam = searchParams.get('city') || destinationId?.replace(/-/g, ' ') || 'Paris';
  const countryParam = searchParams.get('country') || 'France';
  const lat = parseFloat(searchParams.get('lat') || '48.8566');
  const lon = parseFloat(searchParams.get('lon') || '2.3522');

  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  // Zustand trip store to optionally add places to current trip
  const currentTripId = useTripStore((state) => state.currentTripId);
  const currentTrip = useTripStore((state) =>
    state.trips.find((t) => t.id === currentTripId)
  );
  const addActivity = useTripStore((state) => state.addActivity);

  // Hook managing concurrent API fetching with Promise.allSettled and partial failure resilience
  const { data, isLoading, refetchSection, refetchAll } = useDestinationDetails({
    cityName: cityParam,
    countryName: countryParam,
    lat,
    lon,
  });

  const handleAddToTrip = (place: AttractionPlace) => {
    if (!currentTrip || currentTrip.days.length === 0) {
      // Prompt user to create or select a trip first
      setIsPlanModalOpen(true);
      return;
    }

    const firstDay = currentTrip.days[0];
    addActivity(currentTrip.id, firstDay.id, {
      title: place.name,
      time: '11:00',
      category: (place.category as any) || 'sightseeing',
      location: `${cityParam}, ${countryParam}`,
      notes: `Added from ${cityParam} destination explorer`,
      completed: false,
    });

    alert(`Added "${place.name}" to Day 1 of "${currentTrip.name}"!`);
  };

  return (
    <div className="space-y-8 py-4">
      {/* Back Button & Global Refresh */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <button
          onClick={() => refetchAll()}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
          <span>Refresh All Data</span>
        </button>
      </div>

      {/* Hero Banner */}
      <DestinationHero
        cityName={cityParam}
        countryName={countryParam}
        lat={lat}
        lon={lon}
        coverImage={
          data?.photos?.data?.[0]?.src?.large ||
          data?.wiki?.data?.thumbnail?.source
        }
        onPlanTrip={() => setIsPlanModalOpen(true)}
      />

      {/* Main Content Grid: Weather & Info (Left) + Places (Right/Bottom) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Weather & Wikipedia & Country */}
        <div className="lg:col-span-1 space-y-6">
          {data ? (
            <>
              <WeatherCard
                weather={data.weather}
                onRetry={() => refetchSection('weather')}
              />
              <WikiSummaryCard
                wiki={data.wiki}
                cityName={cityParam}
                onRetry={() => refetchSection('wiki')}
              />
              <CountryInfoCard countryInfo={data.countryInfo} />
            </>
          ) : (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
              <p className="text-xs text-slate-500">Connecting to live weather and knowledge APIs...</p>
            </div>
          )}
        </div>

        {/* Right Column: Attractions & Places */}
        <div className="lg:col-span-2 space-y-6">
          {data ? (
            <PlacesList
              places={data.places}
              cityName={cityParam}
              countryName={countryParam}
              onAddToTrip={handleAddToTrip}
              onRetry={() => refetchSection('places')}
            />
          ) : (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
              <p className="text-xs text-slate-500">Discovering points of interest...</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom: Photo Gallery */}
      {data && (
        <PhotoGallery
          photos={data.photos}
          cityName={cityParam}
          onRetry={() => refetchSection('photos')}
        />
      )}

      {/* Pre-filled Create Trip Modal */}
      <CreateTripModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        initialDestination={{
          city: cityParam,
          country: countryParam,
          lat,
          lon,
          coverImage:
            data?.photos?.data?.[0]?.src?.large ||
            data?.wiki?.data?.thumbnail?.source,
        }}
      />
    </div>
  );
};
