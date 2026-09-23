import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Bookmark,
  BookmarkCheck,
  Search,
  Star,
  Plus,
  ArrowUpRight,
  Folder,
  FolderPlus,
  Compass,
  Sparkles,
  Utensils,
  Landmark,
  Bed,
  Coffee,
  Globe,
  Calendar,
  LogIn,
  Sun,
  X,
} from 'lucide-react';
import { useSavedPlacesStore } from '../store/useSavedPlacesStore';
import { useUserStore } from '../store/useUserStore';
import { SavedPlace } from '../types/trip';
import { CustomSelect } from '../components/common/CustomSelect';
import { AddToTripModal } from '../components/destination/AddToTripModal';
import { Modal } from '../components/common/Modal';
import { handleImageError, DEFAULT_FALLBACK_IMAGE } from '../utils/placeImages';

export const SavedPlacesPage: React.FC = () => {
  const user = useUserStore((state) => state.user);

  // Store data & actions
  const savedPlaces = useSavedPlacesStore((state) => state.savedPlaces);
  const boards = useSavedPlacesStore((state) => state.boards);
  const activeBoardId = useSavedPlacesStore((state) => state.activeBoardId);
  const setActiveBoard = useSavedPlacesStore((state) => state.setActiveBoard);
  const createBoard = useSavedPlacesStore((state) => state.createBoard);
  const toggleSavePlace = useSavedPlacesStore((state) => state.toggleSavePlace);

  // Local filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');

  // Modals state
  const [selectedPlaceForTrip, setSelectedPlaceForTrip] = useState<SavedPlace | null>(null);
  const [isNewBoardModalOpen, setIsNewBoardModalOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardDesc, setNewBoardDesc] = useState('');

  // Filtered by active board
  const boardFilteredPlaces = useMemo(() => {
    if (activeBoardId === 'all') return savedPlaces;
    return savedPlaces.filter((p) => p.boardId === activeBoardId);
  }, [savedPlaces, activeBoardId]);

  // Dynamic counts for category tabs
  const categoryCounts = useMemo(() => {
    const counts = {
      all: boardFilteredPlaces.length,
      destination: 0,
      attraction: 0,
      dining: 0,
      hotel: 0,
    };

    boardFilteredPlaces.forEach((p) => {
      if (p.category === 'destination') counts.destination++;
      else if (p.category === 'attraction') counts.attraction++;
      else if (p.category === 'restaurant' || p.category === 'cafe') counts.dining++;
      else if (p.category === 'hotel') counts.hotel++;
    });

    return counts;
  }, [boardFilteredPlaces]);

  // Filtered by category, search & sorted
  const processedPlaces = useMemo(() => {
    let list = [...boardFilteredPlaces];

    // Category filter
    if (categoryFilter !== 'all') {
      if (categoryFilter === 'dining') {
        list = list.filter((p) => p.category === 'restaurant' || p.category === 'cafe');
      } else {
        list = list.filter((p) => p.category === categoryFilter);
      }
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.cityName.toLowerCase().includes(q) ||
          (p.country && p.country.toLowerCase().includes(q)) ||
          (p.tag && p.tag.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'rating') {
        return (b.rating || 0) - (a.rating || 0);
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      // 'recent' by default (newest savedAt first)
      return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
    });

    return list;
  }, [boardFilteredPlaces, categoryFilter, searchQuery, sortBy]);


  // Category tab definitions matching Stitch
  const categoryTabs = [
    { id: 'all', label: 'All', count: categoryCounts.all },
    { id: 'destination', label: 'Destinations', count: categoryCounts.destination },
    { id: 'attraction', label: 'Sights & Attractions', count: categoryCounts.attraction },
    { id: 'dining', label: 'Dining & Bars', count: categoryCounts.dining },
    { id: 'hotel', label: 'Hotels & Stays', count: categoryCounts.hotel },
  ];

  const sortOptions = [
    { value: 'recent', label: 'Recently Added' },
    { value: 'rating', label: 'Top Rated' },
    { value: 'name', label: 'Name (A-Z)' },
  ];

  // Helper for tag icon
  const renderTagIcon = (tag?: string, category?: string) => {
    if (tag?.toLowerCase().includes('shrine') || tag?.toLowerCase().includes('temple')) {
      return <Landmark className="w-3 h-3 text-[#ff5a36]" />;
    }
    if (category === 'restaurant' || tag?.toLowerCase().includes('dining')) {
      return <Utensils className="w-3 h-3 text-orange-500" />;
    }
    if (category === 'hotel' || tag?.toLowerCase().includes('ryokan') || tag?.toLowerCase().includes('cabin')) {
      return <Bed className="w-3 h-3 text-indigo-500" />;
    }
    if (category === 'cafe' || tag?.toLowerCase().includes('coffee')) {
      return <Coffee className="w-3 h-3 text-amber-500" />;
    }
    return <Globe className="w-3 h-3 text-sky-500" />;
  };

  const handleCreateBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardName.trim()) return;
    createBoard(newBoardName.trim(), newBoardDesc.trim());
    setNewBoardName('');
    setNewBoardDesc('');
    setIsNewBoardModalOpen(false);
  };

  // Active board name for subtitle
  const activeBoardObj = boards.find((b) => b.id === activeBoardId);
  const activeBoardName = activeBoardObj ? activeBoardObj.name : 'All Boards';

  return (
    <div className="space-y-6 py-3">
      {/* 1. Header Section strictly matching Stitch Screenshot */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          {/* Status live badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-semibold shadow-2xs mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Curated Collection</span>
            {!user.isLoggedIn && (
              <>
                <span className="text-emerald-300 dark:text-emerald-700">•</span>
                <span className="text-amber-600 dark:text-amber-400 font-mono">Demo Mode</span>
              </>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-slate-900 dark:text-white">
            Saved Places & Bookmarks
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            {boardFilteredPlaces.length} hand-picked spots across {activeBoardName} • 6 added this week
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3">
          <div className="relative min-w-[260px] sm:min-w-[320px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved places, cities, tags..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#ff5a36]/20 focus:border-[#ff5a36] placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Guest Interactive Demo Banner */}
      {!user.isLoggedIn && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200 animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              <strong>Curated Bookmarks Demo:</strong> You are exploring 24 reference gems in Demo Mode. Sign in to create custom boards and permanently sync saved bookmarks.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/signup"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#c2410c] hover:bg-[#b91c1c] text-white text-xs font-bold shadow-xs transition-colors shrink-0"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In to Sync</span>
            </Link>
          </div>
        </div>
      )}

      {/* 2. Category Filter Pills & Sort Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-y border-slate-200/80 dark:border-slate-800 py-3">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {categoryTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCategoryFilter(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                categoryFilter === tab.id
                  ? 'bg-[#ff5a36] text-white shadow-2xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  categoryFilter === tab.id
                    ? 'bg-black/20 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <span className="text-[11px] font-mono uppercase font-bold text-slate-400">SORT:</span>
          <CustomSelect
            options={sortOptions}
            value={sortBy}
            onChange={(val) => setSortBy(val)}
            className="w-40"
            size="md"
          />
        </div>
      </div>

      {/* 3. Board Collections Bar strictly matching Stitch */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold tracking-wider text-slate-400 uppercase mr-1 shrink-0">
          <Folder className="w-3.5 h-3.5 text-amber-500" />
          <span>BOARDS:</span>
        </div>

        {/* All Boards Option */}
        <button
          type="button"
          onClick={() => setActiveBoard('all')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
            activeBoardId === 'all'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xs font-bold'
              : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-700'
          }`}
        >
          <span>All Boards</span>
          <span className="text-[10px] font-mono opacity-80">({savedPlaces.length})</span>
        </button>

        {/* Individual Boards */}
        {boards.map((board) => {
          const boardCount = savedPlaces.filter((p) => p.boardId === board.id).length;
          const isActive = activeBoardId === board.id;

          return (
            <button
              key={board.id}
              type="button"
              onClick={() => setActiveBoard(board.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                  : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
              <span>{board.name}</span>
              <span className={`text-[10px] font-mono ${isActive ? 'text-indigo-200' : 'text-slate-400'}`}>
                {boardCount}
              </span>
            </button>
          );
        })}

        {/* + New Collection Button */}
        <button
          type="button"
          onClick={() => setIsNewBoardModalOpen(true)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-dashed border-slate-300 dark:border-slate-700 text-[#ff5a36] hover:bg-orange-50/50 dark:hover:bg-orange-950/20 text-xs font-semibold transition-all cursor-pointer shrink-0"
        >
          <FolderPlus className="w-3.5 h-3.5" />
          <span>+ New Collection</span>
        </button>
      </div>

      {/* 4. Content Area: Grid View vs Map Split View */}
      {processedPlaces.length === 0 ? (
        <div className="p-16 text-center bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl shadow-frost space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/60 text-[#ff5a36] flex items-center justify-center mx-auto">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100">
            No saved places found in this view
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            {searchQuery
              ? `No bookmarks match "${searchQuery}". Try clearing search or selecting another board.`
              : 'Explore our curated destination catalog and bookmark sights to build your dream collection.'}
          </p>
          <div className="pt-2">
            <Link
              to="/destinations"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#ff5a36] hover:bg-[#e04826] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition-transform hover:scale-[1.01]"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore Global Atlas</span>
            </Link>
          </div>
        </div>
      ) : (
        /* Full 3-Column Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processedPlaces.map((place) => {
            const isSaved = true; // Present in saved list
            const destUrl = `/destinations/${encodeURIComponent(
              place.cityName.toLowerCase().replace(/\s+/g, '-')
            )}?city=${encodeURIComponent(place.cityName)}&country=${encodeURIComponent(
              place.country || ''
            )}&lat=${place.coordinates?.lat || 35.0}&lon=${place.coordinates?.lon || 135.7}`;

            return (
              <div
                key={place.id}
                className="group bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl overflow-hidden shadow-frost hover:shadow-card transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Photo Container */}
                  <div className="relative h-56 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={place.imageUrl || DEFAULT_FALLBACK_IMAGE}
                      alt={place.name}
                      loading="lazy"
                      onError={(e) => handleImageError(e, DEFAULT_FALLBACK_IMAGE)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

                    {/* Top-Left Category Tag Pill */}
                    <div className="absolute top-3.5 left-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 dark:bg-slate-900/90 backdrop-blur-md text-slate-800 dark:text-slate-100 text-[11px] font-bold shadow-xs border border-white/20">
                      {renderTagIcon(place.tag, place.category)}
                      <span>{place.tag || place.category}</span>
                    </div>

                    {/* Top-Right Bookmark Ribbon Toggle */}
                    <button
                      type="button"
                      onClick={() => toggleSavePlace(place)}
                      className="absolute top-3.5 right-3.5 p-2 rounded-xl bg-white/95 dark:bg-slate-900/90 text-[#ff5a36] hover:bg-[#ff5a36] hover:text-white backdrop-blur-md shadow-xs transition-all cursor-pointer"
                      title={isSaved ? 'Remove bookmark' : 'Bookmark place'}
                    >
                      <BookmarkCheck className="w-4 h-4 fill-current" />
                    </button>

                    {/* Bottom Photo Row: Rating & Highlight Pill */}
                    <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between text-white">
                      {/* Rating Badge */}
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-md text-xs font-mono font-bold text-amber-300 border border-white/10">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{place.rating || 4.9}</span>
                        {place.reviewCount && (
                          <span className="text-white/80 font-normal text-[10px]">
                            ({place.reviewCount})
                          </span>
                        )}
                      </div>

                      {/* Highlight Pill (Best at sunrise, $$ Moderate, etc.) */}
                      {place.highlight && (
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-md text-[10px] font-bold text-white border border-white/10 truncate max-w-[55%]">
                          {place.highlight.toLowerCase().includes('sunrise') ||
                          place.highlight.toLowerCase().includes('peak') ? (
                            <Sun className="w-3 h-3 text-amber-300 shrink-0" />
                          ) : place.highlight.toLowerCase().includes('summer') ||
                            place.highlight.toLowerCase().includes('winter') ? (
                            <Calendar className="w-3 h-3 text-sky-300 shrink-0" />
                          ) : null}
                          <span className="truncate">{place.highlight}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                        {place.name}
                      </h3>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 shrink-0 pt-0.5">
                        {place.cityName}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed font-sans">
                      {place.description}
                    </p>
                  </div>
                </div>

                {/* Card Footer: Dual Buttons strictly matching Stitch */}
                <div className="p-5 pt-0 flex items-center gap-2">
                  {/* + Add to Active Trip */}
                  <button
                    type="button"
                    onClick={() => setSelectedPlaceForTrip(place)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-[#f0f4ff] hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Add to Active Trip</span>
                  </button>

                  {/* [↗] External Link button */}
                  <Link
                    to={destUrl}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer shrink-0"
                    title={`Explore ${place.name} in ${place.cityName}`}
                  >
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add To Trip Modal */}
      <AddToTripModal
        isOpen={!!selectedPlaceForTrip}
        onClose={() => setSelectedPlaceForTrip(null)}
        destination={
          selectedPlaceForTrip
            ? {
                city: selectedPlaceForTrip.cityName,
                country: selectedPlaceForTrip.country || 'Global',
                image: selectedPlaceForTrip.imageUrl,
                lat: selectedPlaceForTrip.coordinates?.lat,
                lon: selectedPlaceForTrip.coordinates?.lon,
                description: selectedPlaceForTrip.description,
              }
            : null
        }
      />

      {/* Create New Collection Modal */}
      <Modal
        isOpen={isNewBoardModalOpen}
        onClose={() => setIsNewBoardModalOpen(false)}
        title="Create New Collection"
      >
        <form onSubmit={handleCreateBoard} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-1.5">
              Collection Name
            </label>
            <input
              type="text"
              required
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              placeholder="e.g. Paris Winter 2026, Greek Island Hopping..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-[#ff5a36]/20 focus:border-[#ff5a36]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-1.5">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={newBoardDesc}
              onChange={(e) => setNewBoardDesc(e.target.value)}
              placeholder="A brief note about this collection..."
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-[#ff5a36]/20 focus:border-[#ff5a36]"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsNewBoardModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#ff5a36] hover:bg-[#e04826] text-white text-xs font-bold uppercase tracking-wider shadow-xs"
            >
              Create Board
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
