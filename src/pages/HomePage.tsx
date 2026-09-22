import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Zap,
  Calendar,
  Layers,
  Star,
} from 'lucide-react';
import { CitySearchInput } from '../components/search/CitySearchInput';
import { POPULAR_DESTINATIONS } from '../services/geoapify';
import { GeoapifyCity } from '../types/api';

const FEATURED_CITIES = [
  {
    city: 'Paris',
    country: 'France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    tagline: 'City of Lights & Grand Architecture',
    rating: 4.9,
    lat: 48.8566,
    lon: 2.3522,
  },
  {
    city: 'Tokyo',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    tagline: 'Historic Shrines & Cyberpunk Neon',
    rating: 4.9,
    lat: 35.6762,
    lon: 139.6503,
  },
  {
    city: 'Istanbul',
    country: 'Turkey',
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80',
    tagline: 'Where Europe Meets Asia in Grandeur',
    rating: 4.8,
    lat: 41.0082,
    lon: 28.9784,
  },
  {
    city: 'Rome',
    country: 'Italy',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
    tagline: 'Colosseum, Piazzas & Eternal Wonders',
    rating: 4.8,
    lat: 41.9028,
    lon: 12.4964,
  },
  {
    city: 'Dubai',
    country: 'United Arab Emirates',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    tagline: 'Futuristic Skylines & Desert Splendor',
    rating: 4.7,
    lat: 25.2048,
    lon: 55.2708,
  },
  {
    city: 'New York',
    country: 'United States',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
    tagline: 'The Electric Metropolis That Never Sleeps',
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
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-950 text-white px-6 py-16 sm:py-24 shadow-2xl text-center">
        {/* Background Subtle Map Graphic */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Smart Travel Architecture</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight sm:leading-none">
            Plan Your Dream Journey with{' '}
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
              Smart Precision
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Discover destinations worldwide with live Open-Meteo weather forecasts, Wikipedia insights,
            OpenTripMap attractions, debounced fast search, and multi-day itinerary management.
          </p>

          {/* Search Box */}
          <div className="pt-2 max-w-xl mx-auto">
            <CitySearchInput onSelectCity={handleSelectCity} autoFocus={false} />
          </div>

          {/* Quick Search Chips */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Quick explore:</span>
            {['London', 'Paris', 'Dubai', 'Istanbul', 'Tokyo', 'Lahore', 'New York'].map((c) => (
              <button
                key={c}
                onClick={() => {
                  const match = POPULAR_DESTINATIONS.find(
                    (p) => p.city.toLowerCase() === c.toLowerCase()
                  );
                  if (match) handleSelectCity(match);
                }}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white border border-white/10 transition-colors"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Trending / Popular Destinations */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Inspirational Getaways
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Trending Destinations
            </h2>
          </div>

          <Link
            to="/destinations"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
          >
            <span>Explore all destinations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_CITIES.map((item) => {
            const slug = encodeURIComponent(item.city.toLowerCase().replace(/\s+/g, '-'));
            const linkUrl = `/destinations/${slug}?city=${encodeURIComponent(
              item.city
            )}&country=${encodeURIComponent(item.country)}&lat=${item.lat}&lon=${item.lon}`;

            return (
              <Link
                key={item.city}
                to={linkUrl}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="relative h-56 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={item.image}
                    alt={item.city}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/60 backdrop-blur-md text-white text-xs font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    <span>{item.country}</span>
                  </div>

                  <div className="absolute top-4 right-4 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/60 backdrop-blur-md text-amber-300 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{item.rating}</span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-black text-white">{item.city}</h3>
                    <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">{item.tagline}</p>
                  </div>
                </div>

                <div className="p-4 flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
                  <span>View Live Weather & Attractions</span>
                  <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Engineering Highlights / Spec Capabilities */}
      <section className="p-8 sm:p-12 rounded-3xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Engineered for Reliability
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Real-World React Architecture
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            TripPlanner is built to test and showcase production-grade frontend engineering concepts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Race Condition Guard
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Debounced input with <code>AbortController</code> to cancel pending requests when new keystrokes occur.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Partial Failure Handling
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Concurrent fetching with <code>Promise.allSettled()</code>. One failed API never breaks the destination dashboard.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Nested Itinerary Builder
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Zustand store with nested trip days, activities, reordering, and moving items across days.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Zero Unnecessary Renders
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Strict <code>React.memo</code>, <code>useMemo</code>, and <code>useCallback</code> usage with measurable justification.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
