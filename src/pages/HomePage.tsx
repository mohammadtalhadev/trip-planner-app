import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CitySearchInput } from '../components/search/CitySearchInput';
import { FeaturedDestinations } from '../components/discover/FeaturedDestinations';
import { DiscoverFilterBar } from '../components/discover/DiscoverFilterBar';
import { CommunityItineraries } from '../components/discover/CommunityItineraries';
import { POPULAR_DESTINATIONS } from '../services/geoapify';
import { GeoapifyCity } from '../types/api';

const POPULAR_ROUTES = ['Paris', 'Tokyo', 'Istanbul', 'London', 'Dubai', 'Rome', 'New York'];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectCity = (city: GeoapifyCity) => {
    const slug = encodeURIComponent(city.city.toLowerCase().replace(/\s+/g, '-'));
    navigate(
      `/destinations/${slug}?city=${encodeURIComponent(city.city)}&country=${encodeURIComponent(
        city.country
      )}&lat=${city.lat}&lon=${city.lon}`
    );
  };

  const handleFilterSearch = (destination: string) => {
    if (!destination.trim()) return;
    const cleanCity = destination.split(',')[0].trim();
    const match = POPULAR_DESTINATIONS.find(
      (p) => p.city.toLowerCase() === cleanCity.toLowerCase()
    );
    if (match) {
      handleSelectCity(match);
    } else {
      navigate(`/destinations?search=${encodeURIComponent(cleanCity)}`);
    }
  };

  return (
    <div className="space-y-16 sm:space-y-20 py-4 max-w-7xl mx-auto">
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 sm:pt-14 pb-4 text-center max-w-4xl mx-auto space-y-6">
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1] sm:leading-[1.05]">
          Curated journeys, <br className="hidden sm:inline" />
          <span className="italic font-normal bg-gradient-to-r from-[#ff5a36] via-[#f97316] to-[#6366f1] bg-clip-text text-transparent">
            crafted with precision.
          </span>
        </h1>

        <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-sans px-4">
          Discover destinations worldwide with live meteorological data, encyclopedia summaries,
          curated attractions, and intuitive multi-day itinerary building.
        </p>

        {/* Large Pill Search Input */}
        <div className="pt-2 max-w-2xl mx-auto px-3">
          <div className="bg-white dark:bg-slate-900 rounded-full shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] border border-slate-200/90 dark:border-slate-800 p-1.5 transition-all">
            <CitySearchInput
              placeholder="Search destinations (e.g. Paris, Tokyo, Istanbul, Rome)..."
              onSelectCity={handleSelectCity}
              autoFocus={false}
            />
          </div>
        </div>

        {/* Popular Routes Pill Filter Buttons */}
        <div className="pt-1 flex flex-wrap items-center justify-center gap-2 text-xs px-2">
          <span className="text-slate-400 dark:text-slate-500 font-medium">Popular routes:</span>
          {POPULAR_ROUTES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                const match = POPULAR_DESTINATIONS.find(
                  (p) => p.city.toLowerCase() === c.toLowerCase()
                );
                if (match) {
                  handleSelectCity(match);
                } else {
                  navigate(`/destinations?search=${encodeURIComponent(c)}`);
                }
              }}
              className="px-3.5 py-1 rounded-full bg-white dark:bg-slate-800/90 hover:border-[#ff5a36] hover:text-[#ff5a36] dark:hover:border-[#ff5a36] text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 transition-all font-medium shadow-2xs cursor-pointer active:scale-95"
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* 2. FEATURED DESTINATIONS (Tokyo, Amalfi Coast, Zermatt) */}
      <FeaturedDestinations />

      {/* 3. INTERACTIVE HORIZONTAL SEARCH / FILTER CAPSULE */}
      <DiscoverFilterBar onSearch={handleFilterSearch} />

      {/* 4. TRIP PLANS BY FELLOW EXPLORERS (Kyoto, Paris, Rome) */}
      <CommunityItineraries />
    </div>
  );
};
