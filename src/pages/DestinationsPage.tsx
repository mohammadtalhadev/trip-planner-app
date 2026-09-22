import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, ArrowUpDown, MapPin, Star, ChevronLeft, ChevronRight, Bookmark, BookmarkCheck } from 'lucide-react';
import { POPULAR_DESTINATIONS } from '../services/geoapify';
import { useSavedPlacesStore } from '../store/useSavedPlacesStore';
import { usePagination } from '../hooks/usePagination';

interface DestinationItem {
  id: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
  image: string;
  rating: number;
  description: string;
}

const ALL_CATALOG_DESTINATIONS: DestinationItem[] = [
  {
    id: 'paris-france',
    city: 'Paris',
    country: 'France',
    lat: 48.8566,
    lon: 2.3522,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    description: 'Iconic cafes, haute cuisine, Eiffel Tower, and world-class museums.',
  },
  {
    id: 'tokyo-japan',
    city: 'Tokyo',
    country: 'Japan',
    lat: 35.6762,
    lon: 139.6503,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    description: 'Ultra-modern skyscrapers, historic temples, and legendary cuisine.',
  },
  {
    id: 'istanbul-turkey',
    city: 'Istanbul',
    country: 'Turkey',
    lat: 41.0082,
    lon: 28.9784,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80',
    description: 'A historic crossroads of Byzantine, Ottoman, and European culture.',
  },
  {
    id: 'new-york-usa',
    city: 'New York',
    country: 'United States',
    lat: 40.7128,
    lon: -74.006,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
    description: 'Broadway shows, Central Park, Statue of Liberty, and diverse boroughs.',
  },
  {
    id: 'london-uk',
    city: 'London',
    country: 'United Kingdom',
    lat: 51.5074,
    lon: -0.1278,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
    description: 'Big Ben, River Thames, West End theatres, and royal palaces.',
  },
  {
    id: 'dubai-uae',
    city: 'Dubai',
    country: 'United Arab Emirates',
    lat: 25.2048,
    lon: 55.2708,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    description: 'Burj Khalifa, futuristic architecture, desert safaris, and luxury dining.',
  },
  {
    id: 'rome-italy',
    city: 'Rome',
    country: 'Italy',
    lat: 41.9028,
    lon: 12.4964,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
    description: 'Colosseum, Vatican City, ancient Roman forum, and exquisite pasta.',
  },
  {
    id: 'lahore-pakistan',
    city: 'Lahore',
    country: 'Pakistan',
    lat: 31.5204,
    lon: 74.3587,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1598887142487-3c854d51d2c2?auto=format&fit=crop&w=800&q=80',
    description: 'Badshahi Mosque, historic Mughal gardens, and famous food street.',
  },
  {
    id: 'barcelona-spain',
    city: 'Barcelona',
    country: 'Spain',
    lat: 41.3851,
    lon: 2.1734,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80',
    description: 'Gaudí architecture, Sagrada Familia, Mediterranean beaches, and tapas.',
  },
  {
    id: 'kyoto-japan',
    city: 'Kyoto',
    country: 'Japan',
    lat: 35.0116,
    lon: 135.7681,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    description: 'Historic wooden temples, peaceful bamboo groves, and geisha districts.',
  },
];

export const DestinationsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL State
  const searchQuery = searchParams.get('search') || '';
  const countryFilter = searchParams.get('country') || 'all';
  const sortBy = searchParams.get('sort') || 'rating';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const savedPlaces = useSavedPlacesStore((state) => state.savedPlaces);
  const toggleSavePlace = useSavedPlacesStore((state) => state.toggleSavePlace);

  // Helper to update search params while preserving existing keys
  const updateParams = (newParams: Record<string, string | number>) => {
    const updated = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === '' || value === 'all') {
        updated.delete(key);
      } else {
        updated.set(key, String(value));
      }
    });
    setSearchParams(updated);
  };

  // Filtered & Sorted items
  const filteredDestinations = useMemo(() => {
    let list = [...ALL_CATALOG_DESTINATIONS];

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (item) =>
          item.city.toLowerCase().includes(q) ||
          item.country.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
      );
    }

    // Filter by country
    if (countryFilter !== 'all') {
      list = list.filter(
        (item) => item.country.toLowerCase() === countryFilter.toLowerCase()
      );
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'city') return a.city.localeCompare(b.city);
      if (sortBy === 'country') return a.country.localeCompare(b.country);
      return 0;
    });

    return list;
  }, [searchQuery, countryFilter, sortBy]);

  // Pagination hook
  const { paginatedItems, totalPages, currentPage, goToPage, nextPage, prevPage, hasNextPage, hasPrevPage } =
    usePagination({
      items: filteredDestinations,
      initialPage: pageParam,
      pageSize: 6,
    });

  const handlePageChange = (page: number) => {
    goToPage(page);
    updateParams({ page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Unique countries list
  const countries = useMemo(() => {
    const set = new Set<string>();
    ALL_CATALOG_DESTINATIONS.forEach((d) => set.add(d.country));
    return Array.from(set).sort();
  }, []);

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          Global Directory
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1">
          Explore Destinations
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Browse through popular world cities, inspect real-time weather and tourist attractions.
        </p>
      </div>

      {/* Filter and Search Bar (Preserved in URL State) */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search text filter */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Filter destinations by name or description..."
            value={searchQuery}
            onChange={(e) => updateParams({ search: e.target.value, page: 1 })}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Country Selector */}
          <div className="relative">
            <select
              value={countryFilter}
              onChange={(e) => updateParams({ country: e.target.value, page: 1 })}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="all">All Countries</option>
              {countries.map((country) => (
                <option key={country} value={country.toLowerCase()}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => updateParams({ sort: e.target.value, page: 1 })}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="rating">Top Rated</option>
              <option value="city">City Name (A-Z)</option>
              <option value="country">Country (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Destinations Cards Grid */}
      {paginatedItems.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl space-y-2">
          <p className="font-bold text-slate-700 dark:text-slate-300">No destinations found matching your filters</p>
          <p className="text-xs text-slate-500">Try adjusting your search terms or country filter.</p>
          <button
            onClick={() => updateParams({ search: '', country: 'all', page: 1 })}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedItems.map((dest) => {
            const slug = encodeURIComponent(dest.city.toLowerCase().replace(/\s+/g, '-'));
            const isSaved = savedPlaces.some((p) => p.id === `dest-${dest.city.toLowerCase()}`);

            return (
              <div
                key={dest.id}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={dest.image}
                      alt={dest.city}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                    <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/60 backdrop-blur-md text-white text-xs font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-blue-400" />
                      <span>{dest.country}</span>
                    </div>

                    <button
                      onClick={() =>
                        toggleSavePlace({
                          id: `dest-${dest.city.toLowerCase()}`,
                          name: dest.city,
                          category: 'destination',
                          cityName: dest.city,
                          country: dest.country,
                          imageUrl: dest.image,
                          rating: dest.rating,
                          coordinates: { lat: dest.lat, lon: dest.lon },
                        })
                      }
                      className={`absolute top-4 right-4 p-2 rounded-xl backdrop-blur-md transition-all ${
                        isSaved
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-900/60 text-white hover:bg-slate-900'
                      }`}
                      title={isSaved ? 'Remove from saved' : 'Save place'}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4 fill-white text-white" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>

                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                      <h3 className="text-xl font-bold">{dest.city}</h3>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-300">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{dest.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {dest.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    to={`/destinations/${slug}?city=${encodeURIComponent(
                      dest.city
                    )}&country=${encodeURIComponent(dest.country)}&lat=${dest.lat}&lon=${dest.lon}`}
                    className="w-full py-2.5 px-4 flex items-center justify-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white text-xs font-bold text-slate-700 dark:text-slate-300 transition-all duration-200"
                  >
                    <span>View Destination Dashboard</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!hasPrevPage}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            const isActive = pageNum === currentPage;
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!hasNextPage}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
