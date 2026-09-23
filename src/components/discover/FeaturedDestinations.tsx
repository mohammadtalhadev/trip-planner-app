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
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=85',
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
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=85',
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
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=85',
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
  {
    id: 'santorini',
    city: 'Santorini',
    country: 'Greece',
    lat: 36.3932,
    lon: 25.4615,
    tag: 'Cycladic Sunset',
    transit: 'Thira Airport • Greece',
    budget: '€1,950',
    budgetPeriod: '/wk',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=85',
    weather: {
      temp: 26,
      condition: 'Sunny',
      icon: 'sun',
    },
    rating: {
      rate: 4.9,
      count: '1.5k',
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
                count:
                  ratingRes.userRatingsTotal > 1000
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

      {/* 4-Columns High-Impact Bright Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {destinations.map((item) => {
          const detailUrl = `/destinations/${item.id}?city=${encodeURIComponent(
            item.city
          )}&country=${encodeURIComponent(item.country)}&lat=${item.lat}&lon=${item.lon}`;

          return (
            <div
              key={item.id}
              className="group relative rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 aspect-[3/4] sm:aspect-[4/5] flex flex-col justify-between p-4 sm:p-5 border border-slate-200/60 dark:border-slate-800/80 hover:-translate-y-1"
            >
              {/* Card Photo: Bright, high-contrast, sunlit photography */}
              <img
                src={item.image}
                alt={item.city}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
              />

              {/* Luminous gentle gradient: Keeps the top 65% bright and vibrant with soft bottom scrim for legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

              {/* TOP ROW: Luminous Frosted Weather Glassmorphism Capsule */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/35 dark:bg-black/35 backdrop-blur-md border border-white/50 text-white text-[11px] font-semibold shadow-xs">
                  {renderWeatherIcon(item.weather.icon)}
                  <span>
                    {item.weather.temp > 0 ? `${item.weather.temp}°C` : `${item.weather.temp}°C`} •{' '}
                    {item.weather.condition}
                  </span>
                </div>
              </div>

              {/* BOTTOM CONTENT AREA */}
              <div className="relative z-10 space-y-2.5 pt-4">
                {/* Tag & Rating Row */}
                <div className="flex items-center justify-between gap-1.5">
                  {/* Liquid Glassmorphism Transparent Tag */}
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold tracking-wider uppercase bg-white/20 dark:bg-white/15 backdrop-blur-md border border-white/35 text-white shadow-[0_2px_12px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.4)] truncate max-w-[65%]">
                    {item.tag}
                  </span>

                  {/* Rating with review count */}
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{item.rating.rate}</span>
                    <span className="text-white/80 font-normal text-[10px]">
                      ({item.rating.count})
                    </span>
                  </div>
                </div>

                {/* City Title */}
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                    {item.city}
                  </h3>
                  {/* Transit line */}
                  <div className="flex items-center gap-1 text-[11px] text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] mt-0.5 truncate">
                    <Plane className="w-3 h-3 text-sky-300 shrink-0" />
                    <span className="truncate">{item.transit}</span>
                  </div>
                </div>

                {/* Card Footer: Budget + Explore CTA */}
                <div className="pt-2 border-t border-white/20 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-white/70 block font-medium">
                      Est. Budget
                    </span>
                    <div className="text-sm sm:text-base font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                      {item.budget}{' '}
                      <span className="text-[11px] text-white/80 font-normal">
                        {item.budgetPeriod}
                      </span>
                    </div>
                  </div>

                  <Link
                    to={detailUrl}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-white/95 hover:bg-white text-slate-900 font-semibold text-xs shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all group/btn"
                  >
                    <span>Explore</span>
                    <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover/btn:translate-x-1" />
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
