import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowRight,
  Star,
  Compass,
} from 'lucide-react';
import { CitySearchInput } from '../components/search/CitySearchInput';
import { POPULAR_DESTINATIONS } from '../services/geoapify';
import { GeoapifyCity } from '../types/api';

const FEATURED_CITIES = [
  {
    city: 'Paris',
    country: 'France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Art, historic bistros & Haussmann boulevards',
    vibe: 'Culture & Gastronomy',
    rating: 4.9,
    lat: 48.8566,
    lon: 2.3522,
  },
  {
    city: 'Tokyo',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Ancient temples nestled beside neon skylines',
    vibe: 'Contrast & Architecture',
    rating: 4.9,
    lat: 35.6762,
    lon: 139.6503,
  },
  {
    city: 'Istanbul',
    country: 'Turkey',
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Bazaars, minarets, and the historic Bosphorus',
    vibe: 'Heritage & Grandeur',
    rating: 4.8,
    lat: 41.0082,
    lon: 28.9784,
  },
  {
    city: 'Rome',
    country: 'Italy',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Cobblestone piazzas, baroque fountains & antiquities',
    vibe: 'Ancient History',
    rating: 4.8,
    lat: 41.9028,
    lon: 12.4964,
  },
  {
    city: 'Dubai',
    country: 'United Arab Emirates',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Futuristic architectural wonders on desert shores',
    vibe: 'Modern Luxury',
    rating: 4.7,
    lat: 25.2048,
    lon: 55.2708,
  },
  {
    city: 'New York',
    country: 'United States',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
    tagline: 'World-renowned arts, skyline views & vibrant boroughs',
    vibe: 'Urban Energy',
    rating: 4.9,
    lat: 40.7128,
    lon: -74.006,
  },
];

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

  return (
    <div className="space-y-20 py-4">
      {/* Editorial Hero Section */}
      <section className="relative pt-6 sm:pt-12 pb-10 text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 text-xs font-medium">
          <Compass className="w-3.5 h-3.5 text-stone-700 dark:text-stone-300" />
          <span>Intentional Travel Planning</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-stone-900 dark:text-white leading-[1.1] sm:leading-[1.05]">
          Curated journeys, <br className="hidden sm:inline" />
          <span className="italic font-normal text-stone-600 dark:text-stone-300">
            crafted with precision.
          </span>
        </h1>

        <p className="text-stone-500 dark:text-stone-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed font-sans">
          Discover destinations worldwide with live meteorological data, encyclopedia summaries,
          curated attractions, and intuitive multi-day itinerary building.
        </p>

        {/* Tactile Search Box */}
        <div className="pt-4 max-w-2xl mx-auto px-2">
          <div className="bg-white dark:bg-[#15181e] p-2 rounded-2xl sm:rounded-3xl shadow-card border border-stone-200/80 dark:border-stone-800">
            <CitySearchInput
              placeholder="Search destinations (e.g. Paris, Tokyo, Istanbul, Rome)..."
              onSelectCity={handleSelectCity}
              autoFocus={false}
            />
          </div>
        </div>

        {/* Curated Passport Destination Tags */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-stone-400 font-medium">Popular routes:</span>
          {['Paris', 'Tokyo', 'Istanbul', 'London', 'Dubai', 'Rome', 'New York'].map((c) => (
            <button
              key={c}
              onClick={() => {
                const match = POPULAR_DESTINATIONS.find(
                  (p) => p.city.toLowerCase() === c.toLowerCase()
                );
                if (match) handleSelectCity(match);
              }}
              className="px-3 py-1 rounded-lg bg-stone-100 dark:bg-stone-900 hover:bg-stone-200/80 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200/60 dark:border-stone-800 transition-colors font-medium"
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Editorial Photo Grid */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200/70 dark:border-stone-800/70 pb-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-stone-400 dark:text-stone-500">
              Selected Destinations
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 dark:text-white mt-1">
              Trending Escapes
            </h2>
          </div>

          <Link
            to="/destinations"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-900 dark:text-white hover:text-stone-600 dark:hover:text-stone-300 transition-colors group"
          >
            <span>Browse Full Directory</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {FEATURED_CITIES.map((item) => {
            const slug = encodeURIComponent(item.city.toLowerCase().replace(/\s+/g, '-'));
            const linkUrl = `/destinations/${slug}?city=${encodeURIComponent(
              item.city
            )}&country=${encodeURIComponent(item.country)}&lat=${item.lat}&lon=${item.lon}`;

            return (
              <Link
                key={item.city}
                to={linkUrl}
                className="group flex flex-col bg-white dark:bg-[#15181e] rounded-2xl overflow-hidden border border-stone-200/80 dark:border-stone-800/80 shadow-subtle hover:shadow-card hover:-translate-y-0.5 transition-all duration-300"
              >
                {/* Photo with subtle border */}
                <div className="relative aspect-[16/11] w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
                  <img
                    src={item.image}
                    alt={item.city}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/15 to-transparent" />

                  {/* Vibe Pill */}
                  <div className="absolute top-3.5 left-3.5">
                    <span className="px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider bg-white/90 dark:bg-stone-900/90 text-stone-800 dark:text-stone-200 backdrop-blur-md shadow-sm">
                      {item.vibe}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="absolute top-3.5 right-3.5 flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-900/70 backdrop-blur-md text-amber-300 text-[11px] font-bold">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{item.rating}</span>
                  </div>

                  {/* Bottom Text */}
                  <div className="absolute bottom-3.5 left-4 right-4 text-white">
                    <span className="text-[11px] uppercase tracking-wider text-stone-300 font-medium block">
                      {item.country}
                    </span>
                    <h3 className="font-serif text-2xl font-bold tracking-tight leading-tight">
                      {item.city}
                    </h3>
                  </div>
                </div>

                {/* Details caption */}
                <div className="p-4 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 border-t border-stone-100 dark:border-stone-800/60">
                  <span className="truncate pr-2">{item.tagline}</span>
                  <span className="text-stone-900 dark:text-stone-200 font-semibold shrink-0 group-hover:underline flex items-center gap-1">
                    Explore <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Thoughtful Craft Section */}
      <section className="p-8 sm:p-12 rounded-3xl bg-stone-100/60 dark:bg-[#13161b] border border-stone-200/70 dark:border-stone-800/70 space-y-10">
        <div className="max-w-xl space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-stone-400 dark:text-stone-500">
            Engineered For Travelers
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 dark:text-white">
            Travel planning without friction.
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed font-sans">
            Built from scratch to balance rich asynchronous data with an uncluttered, tactile user experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#181c22] border border-stone-200/60 dark:border-stone-800/80 space-y-2 shadow-subtle">
            <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white flex items-center justify-center font-bold text-xs">
              01
            </div>
            <h4 className="font-semibold text-sm text-stone-900 dark:text-white">
              Debounced Fast Search
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              Real-time geocoding cancels stale requests on the fly with <code>AbortController</code>, preventing race conditions.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#181c22] border border-stone-200/60 dark:border-stone-800/80 space-y-2 shadow-subtle">
            <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white flex items-center justify-center font-bold text-xs">
              02
            </div>
            <h4 className="font-semibold text-sm text-stone-900 dark:text-white">
              Fault-Tolerant APIs
            </h4>
            <p className="text-xs text-stone-500 dark:text-slate-400 leading-relaxed">
              Concurrent fetching with <code>Promise.allSettled</code> ensures one slow or rate-limited service never blocks the page.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#181c22] border border-stone-200/60 dark:border-stone-800/80 space-y-2 shadow-subtle">
            <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white flex items-center justify-center font-bold text-xs">
              03
            </div>
            <h4 className="font-semibold text-sm text-stone-900 dark:text-white">
              Tactile Drag & Drop
            </h4>
            <p className="text-xs text-stone-500 dark:text-slate-400 leading-relaxed">
              Reorder activities within a day or move them across your vacation days with instant state updates.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#181c22] border border-stone-200/60 dark:border-stone-800/80 space-y-2 shadow-subtle">
            <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white flex items-center justify-center font-bold text-xs">
              04
            </div>
            <h4 className="font-semibold text-sm text-stone-900 dark:text-white">
              Persistent & Private
            </h4>
            <p className="text-xs text-stone-500 dark:text-slate-400 leading-relaxed">
              All your trips, expenses, and saved landmarks persist safely in local storage with zero cloud leaks.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
