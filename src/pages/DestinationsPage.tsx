import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, MapPin, Star, ChevronLeft, ChevronRight, Bookmark, BookmarkCheck } from 'lucide-react';
import { useSavedPlacesStore } from '../store/useSavedPlacesStore';
import { usePagination } from '../hooks/usePagination';
import { handleImageError, DEFAULT_FALLBACK_IMAGE } from '../utils/placeImages';
import { CustomSelect } from '../components/common/CustomSelect';

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
  const { paginatedItems, totalPages, currentPage, goToPage, hasNextPage, hasPrevPage } =
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

  const countryOptions = useMemo(
    () => [
      { value: 'all', label: 'All Regions' },
      ...countries.map((c) => ({ value: c.toLowerCase(), label: c })),
    ],
    [countries]
  );

  const sortOptions = [
    { value: 'rating', label: 'Top Rated' },
    { value: 'city', label: 'City (A-Z)' },
    { value: 'country', label: 'Country (A-Z)' },
  ];

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="border-b border-stone-200/80 dark:border-stone-800 pb-5">
        <span className="text-[11px] font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400">
          Global Atlas
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-stone-900 dark:text-stone-50 mt-1">
          Curated Destinations
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-xl leading-relaxed">
          Explore world capitals and cultural centers, complete with live meteorology, historical context, and notable landmarks.
        </p>
      </div>

      {/* Filter and Search Bar (Preserved in URL State) */}
      <div className="p-3 bg-white dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 rounded-2xl shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search text filter */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by city, country, or cultural notes..."
            value={searchQuery}
            onChange={(e) => updateParams({ search: e.target.value, page: 1 })}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-transparent bg-stone-50 dark:bg-stone-800/60 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:ring-1 focus:ring-stone-400 placeholder:text-stone-400"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Country Selector */}
          <CustomSelect
            options={countryOptions}
            value={countryFilter}
            onChange={(val) => updateParams({ country: val, page: 1 })}
            className="w-36 sm:w-44"
            size="md"
          />

          {/* Sort Selector */}
          <CustomSelect
            options={sortOptions}
            value={sortBy}
            onChange={(val) => updateParams({ sort: val, page: 1 })}
            className="w-36 sm:w-40"
            size="md"
          />
        </div>
      </div>

      {/* Destinations Cards Grid */}
      {paginatedItems.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-stone-900/40 border border-dashed border-stone-200 dark:border-stone-800 rounded-2xl space-y-2">
          <p className="font-serif font-bold text-base text-stone-700 dark:text-stone-300">No destinations found matching your criteria</p>
          <p className="text-xs text-stone-500">Try adjusting your search terms or regional filter.</p>
          <button
            onClick={() => updateParams({ search: '', country: 'all', page: 1 })}
            className="mt-3 px-4 py-2 bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm"
          >
            Reset Filters
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
                className="group bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl overflow-hidden shadow-subtle hover:shadow-card transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-52 w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
                    <img
                      src={dest.image}
                      alt={dest.city}
                      loading="lazy"
                      onError={(e) => handleImageError(e, DEFAULT_FALLBACK_IMAGE)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-transparent" />

                    <div className="absolute top-3.5 left-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/60 backdrop-blur-md text-slate-200 text-xs font-medium border border-white/10">
                      <MapPin className="w-3 h-3 text-sky-400" />
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
                      className={`absolute top-3.5 right-3.5 p-2 rounded-xl backdrop-blur-md transition-all ${
                        isSaved
                          ? 'bg-[#c2410c] text-white shadow-sm'
                          : 'bg-slate-950/50 text-slate-200 hover:text-white border border-white/10'
                      }`}
                      title={isSaved ? 'Remove from collection' : 'Save destination'}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-3.5 h-3.5 fill-white text-white" />
                      ) : (
                        <Bookmark className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                      <h3 className="text-xl font-serif font-bold tracking-tight">{dest.city}</h3>
                      <div className="flex items-center gap-1 text-xs font-mono font-semibold text-amber-300">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{dest.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed font-sans">
                      {dest.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    to={`/destinations/${slug}?city=${encodeURIComponent(
                      dest.city
                    )}&country=${encodeURIComponent(dest.country)}&lat=${dest.lat}&lon=${dest.lon}`}
                    className="w-full py-2.5 px-4 flex items-center justify-center gap-2 rounded-xl bg-slate-100 hover:bg-[#c2410c] hover:text-white dark:bg-slate-800 dark:hover:bg-[#c2410c] dark:hover:text-white text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 transition-all duration-200"
                  >
                    <span>View Destination Guide</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-6">
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
                className={`w-9 h-9 rounded-xl text-xs font-mono font-bold transition-all ${
                  isActive
                    ? 'bg-[#c2410c] text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!hasNextPage}
            className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
