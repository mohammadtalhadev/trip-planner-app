import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  Plane,
  Star,
  Sun,
  Snowflake,
  CloudSun,
  Cloud,
} from 'lucide-react';
import { fetchWeather } from '../../services/weather';
import { fetchRealtimePlaceRating } from '../../services/ratings';
import { getWeatherCondition } from '../../utils/weatherCodes';

interface DestinationCardData {
  id: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
  tag: string;
  transit: string;
  budget: string;
  budgetPeriod: string;
  image: string;
  weather: {
    temp: number;
    condition: string;
    icon: string;
  };
  rating: {
    rate: number;
    count: string;
  };
}

const INITIAL_FEATURED: DestinationCardData[] = [
  {
    id: 'tokyo',
    city: 'Tokyo',
    country: 'Japan',
    lat: 35.6762,
    lon: 139.6503,
    tag: 'Neon & Shrines',
    transit: 'Haneda / Narita • Japan',
    budget: '¥280k',
    budgetPeriod: '/wk',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    weather: {
      temp: 22,
      condition: 'Mild',
      icon: 'sun',
    },
    rating: {
      rate: 4.9,
      count: '1.2k',
    },
  },
  {
    id: 'amalfi-coast',
    city: 'Amalfi Coast',
    country: 'Italy',
    lat: 40.6340,
    lon: 14.6027,
    tag: 'Mediterranean Romance',
    transit: 'Naples Capodichino • Italy',
    budget: '€2,400',
    budgetPeriod: '/wk',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
    weather: {
      temp: 25,
      condition: 'Golden',
      icon: 'sun',
    },
    rating: {
      rate: 4.8,
      count: '890',
    },
  },
  {
    id: 'zermatt',
    city: 'Zermatt',
    country: 'Switzerland',
    lat: 45.9765,
    lon: 7.7491,
    tag: 'Winter Escape',
    transit: 'Geneva / Zurich • Switzerland',
    budget: 'CHF 3,100',
    budgetPeriod: '/wk',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
    weather: {
      temp: -2,
      condition: 'Alpine',
      icon: 'snow',
    },
    rating: {
      rate: 4.9,
      count: '740',
    },
  },
];

export const FeaturedDestinations: React.FC = () => {
  const [destinations, setDestinations] = useState<DestinationCardData[]>(INITIAL_FEATURED);

  // Fetch live meteorological & live analytics ratings asynchronously
  useEffect(() => {
    let isMounted = true;

    async function updateRealtimeData() {
      const updated = await Promise.all(
        INITIAL_FEATURED.map(async (dest) => {
          let liveWeather = dest.weather;
          let liveRating = dest.rating;

          try {
            // Live Open-Meteo Weather
            const weatherRes = await fetchWeather(dest.lat, dest.lon);
            if (weatherRes?.current) {
              const condition = getWeatherCondition(weatherRes.current.weatherCode);
              liveWeather = {
                temp: Math.round(weatherRes.current.temperature),
                condition: condition.label.replace(' sky', '').replace('Mainly ', ''),
                icon: condition.icon,
              };
            }
          } catch {
            // Keep baseline weather on network hiccup
          }

          try {
            // Live Wikipedia/Wikimedia Analytics Rating
            const ratingRes = await fetchRealtimePlaceRating({
              name: dest.city,
              cityName: dest.country,
              lat: dest.lat,
              lon: dest.lon,
              category: 'attraction',
            });
            if (ratingRes && ratingRes.rate > 0) {
              liveRating = {
                rate: ratingRes.rate,
                count: ratingRes.userRatingsTotal > 1000
                  ? `${(ratingRes.userRatingsTotal / 1000).toFixed(1)}k`
                  : `${ratingRes.userRatingsTotal}`,
              };
            }
          } catch {
            // Keep baseline rating
          }

          return {
            ...dest,
            weather: liveWeather,
            rating: liveRating,
          };
        })
      );

      if (isMounted) {
        setDestinations(updated);
      }
    }

    updateRealtimeData();

    return () => {
      isMounted = false;
    };
  }, []);

  const renderWeatherIcon = (iconName: string) => {
    switch (iconName) {
      case 'snow':
        return <Snowflake className="w-3.5 h-3.5 text-sky-200" />;
      case 'cloud-sun':
        return <CloudSun className="w-3.5 h-3.5 text-amber-300" />;
      case 'cloud':
        return <Cloud className="w-3.5 h-3.5 text-slate-200" />;
      default:
        return <Sun className="w-3.5 h-3.5 text-amber-300" />;
    }
  };

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-950/70 text-[#ff5a36] flex items-center justify-center shrink-0">
              <Compass className="w-3.5 h-3.5" />
            </span>
            <h2 className="font-sans text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Featured Destinations
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Selected based on seasonal optimal weather, air transit liquidity, and traveler satisfaction.
          </p>
        </div>

        <Link
          to="/destinations"
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-2xs group"
        >
          <span>Explore All</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>

      {/* 3 High-Impact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {destinations.map((item) => {
          const detailUrl = `/destinations/${item.id}?city=${encodeURIComponent(
            item.city
          )}&country=${encodeURIComponent(item.country)}&lat=${item.lat}&lon=${item.lon}`;

          return (
            <div
              key={item.id}
              className="group relative rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 aspect-[4/5] flex flex-col justify-between p-5 bg-slate-900"
            >
              {/* Card Photo with Parallax-like Zoom */}
              <img
                src={item.image}
                alt={item.city}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Sophisticated Dark Gradient Overlays for AA Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/35 to-slate-950/40" />

              {/* TOP ROW: Frosted Weather Glassmorphism Capsule */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 dark:bg-black/30 backdrop-blur-md border border-white/30 text-white text-xs font-medium shadow-sm">
                  {renderWeatherIcon(item.weather.icon)}
                  <span>
                    {item.weather.temp > 0 ? `${item.weather.temp}°C` : `${item.weather.temp}°C`} •{' '}
                    {item.weather.condition}
                  </span>
                </div>
              </div>

              {/* BOTTOM CONTENT AREA */}
              <div className="relative z-10 space-y-3 pt-6">
                {/* Tag & Rating Row */}
                <div className="flex items-center justify-between gap-2">
                  {/* Liquid Glassmorphism Transparent Tag */}
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white/15 dark:bg-white/10 backdrop-blur-md border border-white/25 dark:border-white/20 text-white shadow-[0_4px_16px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.3)]">
                    {item.tag}
                  </span>

                  {/* Rating with review count */}
                  <div className="flex items-center gap-1 text-xs font-semibold text-amber-300 drop-shadow-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{item.rating.rate}</span>
                    <span className="text-white/70 font-normal text-[11px]">
                      ({item.rating.count})
                    </span>
                  </div>
                </div>

                {/* City Title */}
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
                    {item.city}
                  </h3>
                  {/* Transit line */}
                  <div className="flex items-center gap-1.5 text-xs text-white/80 mt-1">
                    <Plane className="w-3 h-3 text-sky-400" />
                    <span>{item.transit}</span>
                  </div>
                </div>

                {/* Card Footer: Budget + Explore CTA */}
                <div className="pt-2 border-t border-white/15 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-white/60 block font-medium">
                      Est. Budget
                    </span>
                    <div className="text-base font-bold text-white">
                      {item.budget}{' '}
                      <span className="text-xs text-white/70 font-normal">
                        {item.budgetPeriod}
                      </span>
                    </div>
                  </div>

                  <Link
                    to={detailUrl}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/90 hover:bg-white text-slate-900 font-semibold text-xs shadow-sm hover:shadow-md hover:scale-[1.03] active:scale-[0.97] transition-all group/btn"
                  >
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
