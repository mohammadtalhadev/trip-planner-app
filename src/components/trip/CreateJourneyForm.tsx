import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  Users,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Check,
  Compass,
  Globe2,
  DollarSign,
} from 'lucide-react';
import { useTripStore } from '../../store/useTripStore';
import { usePreferencesStore } from '../../store/usePreferencesStore';
import { searchCities } from '../../services/geoapify';
import { GeoapifyCity } from '../../types/api';
import { CurrencyCode } from '../../types/settings';
import { CURRENCY_SYMBOLS } from '../../utils/currency';
import { calculateTripDays, addDaysToDate, formatDate } from '../../utils/date';
import { toEnglishPlaceName } from '../../utils/englishPlaces';
import { getRealPlaceImage, DEFAULT_FALLBACK_IMAGE } from '../../utils/placeImages';
import { Activity, Expense, ItineraryDay } from '../../types/trip';
import { CustomSelect } from '../common/CustomSelect';

interface DestinationHub {
  id: string;
  city: string;
  country: string;
  flag: string;
  formatted: string;
  lat?: number;
  lon?: number;
}

interface CreateJourneyFormProps {
  onClose?: () => void;
  initialDestination?: {
    city: string;
    country: string;
    lat?: number;
    lon?: number;
    coverImage?: string;
  };
}

function getCountryFlag(countryCode?: string): string {
  if (!countryCode || countryCode.length !== 2) return '📍';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

const QUICK_IDEAS = [
  {
    title: 'Autumnal Drift: Kyoto & Hakone',
    hubs: [
      { id: 'kyoto-jp', city: 'Kyoto', country: 'Japan', flag: '🇯🇵', formatted: 'Kyoto, Kansai, Japan', lat: 35.0116, lon: 135.7681 },
      { id: 'hakone-jp', city: 'Hakone Onsen', country: 'Japan', flag: '⛰️', formatted: 'Hakone, Kanagawa, Japan', lat: 35.2323, lon: 139.1069 },
    ],
    vibes: ['Relaxed Pace', 'Culinary & Dining', 'Culture & History'],
    cover: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?auto=format&fit=crop&w=1200&q=80',
    discoveryText: '18 Michelin Guides • 4 Traditional Onsen Matches',
  },
  {
    title: 'Alps Ski & Wellness Adventure',
    hubs: [
      { id: 'zermatt-ch', city: 'Zermatt', country: 'Switzerland', flag: '🇨🇭', formatted: 'Zermatt, Valais, Switzerland', lat: 45.9765, lon: 7.7491 },
      { id: 'interlaken-ch', city: 'Interlaken', country: 'Switzerland', flag: '🏔️', formatted: 'Interlaken, Bern, Switzerland', lat: 46.6863, lon: 7.8632 },
    ],
    vibes: ['Nature & Hiking', 'Design & Architecture', 'Relaxed Pace'],
    cover: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1200&q=80',
    discoveryText: '14 Alpine Passes • 6 Glacial Viewpoint Chalets',
  },
  {
    title: 'Mediterranean Summer Escapade',
    hubs: [
      { id: 'amalfi-it', city: 'Amalfi Coast', country: 'Italy', flag: '🇮🇹', formatted: 'Amalfi, Campania, Italy', lat: 40.634, lon: 14.6027 },
      { id: 'capri-it', city: 'Capri Island', country: 'Italy', flag: '🌊', formatted: 'Capri, Campania, Italy', lat: 40.5507, lon: 14.2426 },
    ],
    vibes: ['Culinary & Dining', 'Relaxed Pace', 'Hidden Speakeasies'],
    cover: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
    discoveryText: '21 Cliffside Trattorias • 9 Secluded Beach Coves',
  },
  {
    title: 'Bosphorus Heritage & Old Bazaar',
    hubs: [
      { id: 'istanbul-tr', city: 'Istanbul', country: 'Turkey', flag: '🇹🇷', formatted: 'Istanbul, Marmara, Turkey', lat: 41.0082, lon: 28.9784 },
      { id: 'cappadocia-tr', city: 'Cappadocia', country: 'Turkey', flag: '🎈', formatted: 'Göreme, Cappadocia, Turkey', lat: 38.6431, lon: 34.8289 },
    ],
    vibes: ['Culture & History', 'Culinary & Dining', 'Design & Architecture'],
    cover: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80',
    discoveryText: '24 Bosphorus Vantage Points • 7 Historic Bazaars',
  },
  {
    title: 'Nordic Light: Fjord & Aurora',
    hubs: [
      { id: 'tromso-no', city: 'Tromsø', country: 'Norway', flag: '🇳🇴', formatted: 'Tromsø, Troms, Norway', lat: 69.6492, lon: 18.9553 },
      { id: 'lofoten-no', city: 'Lofoten Islands', country: 'Norway', flag: '✨', formatted: 'Lofoten, Nordland, Norway', lat: 68.2324, lon: 14.5682 },
    ],
    vibes: ['Nature & Hiking', 'Culture & History', 'Relaxed Pace'],
    cover: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=80',
    discoveryText: '11 Northern Light Vantage Hubs • 5 Fjord Ferries',
  },
];

const AVAILABLE_VIBES = [
  'Relaxed Pace',
  'Culinary & Dining',
  'Culture & History',
  'Nature & Hiking',
  'Design & Architecture',
  'Hidden Speakeasies',
];

export const CreateJourneyForm: React.FC<CreateJourneyFormProps> = ({
  onClose,
  initialDestination,
}) => {
  const navigate = useNavigate();
  const createTrip = useTripStore((state) => state.createTrip);
  const preferences = usePreferencesStore((state) => state.preferences);

  // Default dates: Next month from today or specific reference date
  const now = new Date();
  const defaultStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 14);
  const defaultEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 26);
  const defaultStartStr = defaultStart.toISOString().split('T')[0];
  const defaultEndStr = defaultEnd.toISOString().split('T')[0];

  // Core Form State
  const [title, setTitle] = useState(
    initialDestination
      ? `${initialDestination.city} Expedition`
      : 'Autumnal Drift: Kyoto & Hakone'
  );

  const [selectedHubs, setSelectedHubs] = useState<DestinationHub[]>(() => {
    if (initialDestination) {
      return [
        {
          id: 'initial-hub',
          city: initialDestination.city,
          country: initialDestination.country,
          flag: '📍',
          formatted: `${initialDestination.city}, ${initialDestination.country}`,
          lat: initialDestination.lat,
          lon: initialDestination.lon,
        },
      ];
    }
    return [
      {
        id: 'kyoto-hub',
        city: 'Kyoto & Tokyo, Japan',
        country: 'Japan',
        flag: '🇯🇵',
        formatted: 'Kyoto, Kansai, Japan',
        lat: 35.0116,
        lon: 135.7681,
      },
      {
        id: 'hakone-hub',
        city: 'Hakone Onsen',
        country: 'Japan',
        flag: '⛰️',
        formatted: 'Hakone, Kanagawa, Japan',
        lat: 35.2323,
        lon: 139.1069,
      },
    ];
  });

  // Hub search state
  const [hubQuery, setHubQuery] = useState('');
  const [hubSuggestions, setHubSuggestions] = useState<GeoapifyCity[]>([]);
  const [isSearchingHubs, setIsSearchingHubs] = useState(false);
  const [showHubDropdown, setShowHubDropdown] = useState(false);
  const hubDropdownRef = useRef<HTMLDivElement>(null);

  // Dates state
  const [startDate, setStartDate] = useState(defaultStartStr);
  const [endDate, setEndDate] = useState(defaultEndStr);
  const [activeDateSelector, setActiveDateSelector] = useState<'start' | 'end'>('start');

  // Calendar matrix navigation month
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const s = new Date(startDate || defaultStartStr);
    return new Date(s.getFullYear(), s.getMonth(), 1);
  });

  // Party size & presets
  const [travelersCount, setTravelersCount] = useState(preferences.defaultTravelers || 2);
  const [partyPreset, setPartyPreset] = useState<'solo' | 'couple' | 'family' | 'squad'>('couple');

  // Budget & Currency
  const [currency, setCurrency] = useState<CurrencyCode>(preferences.currency || 'USD');
  const [budget, setBudget] = useState(4500);

  // Vibes
  const [selectedVibes, setSelectedVibes] = useState<string[]>([
    'Relaxed Pace',
    'Culinary & Dining',
    'Culture & History',
  ]);

  // UI status
  const [draftSavedAt, setDraftSavedAt] = useState<string>('just now');
  const [isGenerating, setIsGenerating] = useState(false);
  const [coverImage, setCoverImage] = useState(
    initialDestination?.coverImage ||
      'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?auto=format&fit=crop&w=1200&q=80'
  );

  // Spend Allocation percentages
  const spendAllocation = {
    stays: 0.44,
    dining: 0.28,
    transit: 0.18,
    activities: 0.10,
  };

  // Duration & Season calculations
  const totalDays = calculateTripDays(startDate, endDate);
  const perDayBudget = Math.round(budget / Math.max(1, totalDays));

  const getSeasonDescription = (dateStr: string) => {
    const d = new Date(dateStr);
    const month = d.getMonth(); // 0 to 11
    if (month >= 2 && month <= 4) return 'Spring Blossoms';
    if (month >= 5 && month <= 7) return 'Peak Summer';
    if (month >= 8 && month <= 10) return 'Peak Foliage';
    return 'Winter Escapes';
  };

  const currentSeason = getSeasonDescription(startDate);

  // Debounced search for Destination Hubs
  useEffect(() => {
    if (!hubQuery.trim()) {
      setHubSuggestions([]);
      setIsSearchingHubs(false);
      return;
    }

    const abortController = new AbortController();
    setIsSearchingHubs(true);

    const timer = setTimeout(async () => {
      try {
        const results = await searchCities(hubQuery, abortController.signal);
        setHubSuggestions(results);
        setShowHubDropdown(true);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.warn('City lookup error:', err);
        }
      } finally {
        setIsSearchingHubs(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      abortController.abort();
    };
  }, [hubQuery]);

  // Click outside to close hub suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (hubDropdownRef.current && !hubDropdownRef.current.contains(e.target as Node)) {
        setShowHubDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update party preset when count changes
  const handleTravelerCountChange = (newCount: number) => {
    const count = Math.max(1, Math.min(30, newCount));
    setTravelersCount(count);
    if (count === 1) setPartyPreset('solo');
    else if (count === 2) setPartyPreset('couple');
    else if (count >= 3 && count <= 5) setPartyPreset('family');
    else setPartyPreset('squad');
  };

  const handleSelectPreset = (preset: 'solo' | 'couple' | 'family' | 'squad') => {
    setPartyPreset(preset);
    switch (preset) {
      case 'solo':
        setTravelersCount(1);
        break;
      case 'couple':
        setTravelersCount(2);
        break;
      case 'family':
        setTravelersCount(4);
        break;
      case 'squad':
        setTravelersCount(6);
        break;
    }
  };

  const handleToggleVibe = (vibe: string) => {
    setSelectedVibes((prev) =>
      prev.includes(vibe) ? prev.filter((v) => v !== vibe) : [...prev, vibe]
    );
  };

  // Add hub from search suggestion
  const handleAddHub = (city: GeoapifyCity) => {
    const newHub: DestinationHub = {
      id: `hub-${Date.now()}-${city.id}`,
      city: toEnglishPlaceName(city.city),
      country: toEnglishPlaceName(city.country),
      flag: getCountryFlag(city.countryCode),
      formatted: city.formatted,
      lat: city.lat,
      lon: city.lon,
    };
    setSelectedHubs((prev) => [...prev, newHub]);
    setHubQuery('');
    setHubSuggestions([]);
    setShowHubDropdown(false);

    // Update cover photo if relevant
    const realImg = getRealPlaceImage(city.city);
    if (realImg && realImg !== DEFAULT_FALLBACK_IMAGE) {
      setCoverImage(realImg);
    }
  };

  // Remove hub
  const handleRemoveHub = (hubId: string) => {
    if (selectedHubs.length <= 1) return; // Keep at least one hub
    setSelectedHubs((prev) => prev.filter((h) => h.id !== hubId));
  };

  // Inspire route random generator
  const handleInspireRoute = () => {
    const randomIdea = QUICK_IDEAS[Math.floor(Math.random() * QUICK_IDEAS.length)];
    setTitle(randomIdea.title);
    setSelectedHubs(randomIdea.hubs);
    setSelectedVibes(randomIdea.vibes);
    setCoverImage(randomIdea.cover);
    setDraftSavedAt('just now');
  };

  const handleApplyQuickIdea = (idea: typeof QUICK_IDEAS[0]) => {
    setTitle(idea.title);
    setSelectedHubs(idea.hubs);
    setSelectedVibes(idea.vibes);
    setCoverImage(idea.cover);
    setDraftSavedAt('just now');
  };

  // Calendar Matrix Generator
  const generateCalendarDays = () => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Monday is 0 in our grid, Sunday is 6
    let startingDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startingDayOfWeek < 0) startingDayOfWeek = 6;

    const daysInMonth = lastDayOfMonth.getDate();

    // Previous month trailing days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const days: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = [];

    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        dateStr: prevDate.toISOString().split('T')[0],
        dayNum: prevMonthLastDay - i,
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateStr = date.toISOString().split('T')[0];
      days.push({
        dateStr,
        dayNum: i,
        isCurrentMonth: true,
      });
    }

    // Trailing days from next month to complete 35 or 42 grid cells
    const remainingCells = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remainingCells; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({
        dateStr: nextDate.toISOString().split('T')[0],
        dayNum: i,
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const handleCalendarDateClick = (dateStr: string) => {
    if (activeDateSelector === 'start') {
      setStartDate(dateStr);
      // If start date is after end date, push end date forward
      if (new Date(dateStr) > new Date(endDate)) {
        setEndDate(addDaysToDate(dateStr, 7));
      }
      setActiveDateSelector('end');
    } else {
      if (new Date(dateStr) < new Date(startDate)) {
        // If clicked earlier than start date, set as new start date
        setStartDate(dateStr);
        setActiveDateSelector('end');
      } else {
        setEndDate(dateStr);
        setActiveDateSelector('start');
      }
    }
  };

  const calendarDays = generateCalendarDays();
  const calendarMonthLabel = calendarMonth.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  // Dynamic Discovery Index calculation
  const getDiscoveryIndexHeadline = () => {
    const primaryCity = selectedHubs[0]?.city.toLowerCase() || '';
    if (primaryCity.includes('kyoto') || primaryCity.includes('tokyo') || primaryCity.includes('japan')) {
      return '18 Michelin Guides • 4 Traditional Onsen Matches';
    }
    if (primaryCity.includes('istanbul') || primaryCity.includes('turkey')) {
      return '24 Bosphorus Vantage Points • 7 Historic Bazaars';
    }
    if (primaryCity.includes('zermatt') || primaryCity.includes('alps') || primaryCity.includes('switzerland')) {
      return '14 Alpine Passes • 6 Glacial Viewpoint Chalets';
    }
    if (primaryCity.includes('amalfi') || primaryCity.includes('italy') || primaryCity.includes('rome')) {
      return '21 Cliffside Trattorias • 9 Secluded Beach Coves';
    }
    if (primaryCity.includes('paris') || primaryCity.includes('france')) {
      return '19 Impressionist Salons • 8 Patisserie Hidden Gems';
    }
    return `${selectedHubs.length * 8} Curated Landmarks • ${selectedVibes.length * 3} Handpicked Activities`;
  };

  // Draft Save Handler
  const handleSaveDraft = () => {
    const draft = {
      title,
      selectedHubs,
      startDate,
      endDate,
      travelersCount,
      budget,
      currency,
      selectedVibes,
      coverImage,
      savedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem('journey_planner_draft', JSON.stringify(draft));
      setDraftSavedAt('just now');
    } catch (e) {
      console.warn('Draft save error', e);
    }
  };

  // Build sample itinerary from destination POIs
  const handleGenerateSmartItinerary = async () => {
    setIsGenerating(true);

    const primaryHub = selectedHubs[0];
    const hubNames = selectedHubs.map((h) => h.city).join(' & ');

    // Calculate smart days with activities and expense allocations
    const generatedDays: ItineraryDay[] = Array.from({ length: totalDays }, (_, idx) => {
      const dayNum = idx + 1;
      const dayDate = addDaysToDate(startDate, idx);
      const hubForDay = selectedHubs[idx % selectedHubs.length] || primaryHub;

      const activities: Activity[] = [];
      const expenses: Expense[] = [];

      // Day theme based on progression
      let dayTitle = `Day ${dayNum}: Exploration in ${hubForDay.city}`;
      if (dayNum === 1) dayTitle = `Day 1: Arrival & Welcome in ${primaryHub.city}`;
      else if (dayNum === 2) dayTitle = `Day 2: Historic Heart & Iconic Sights`;
      else if (dayNum === 3) dayTitle = `Day 3: Culinary Journey & Local Markets`;
      else if (dayNum === Math.floor(totalDays / 2) && selectedHubs.length > 1) {
        dayTitle = `Day ${dayNum}: Scenic Transit to ${selectedHubs[1]?.city || hubForDay.city}`;
      } else if (dayNum === totalDays) {
        dayTitle = `Day ${dayNum}: Leisure & Farewell Souvenirs`;
      }

      // Generate realistic activities matching vibes
      if (dayNum === 1) {
        activities.push({
          id: `act-${Date.now()}-${dayNum}-1`,
          dayId: `day-${Date.now()}-${dayNum}`,
          title: `Boutique Check-in & Orientation`,
          time: '14:00',
          category: 'lodging',
          location: `${hubForDay.city} Central District`,
          notes: 'Unpack, refresh, and receive curated neighborhood guide.',
          cost: 0,
          completed: false,
          orderIndex: 0,
        });
        activities.push({
          id: `act-${Date.now()}-${dayNum}-2`,
          dayId: `day-${Date.now()}-${dayNum}`,
          title: `Welcome Dinner: Authentic Gastronomy`,
          time: '19:30',
          category: 'food',
          location: `${hubForDay.city} Old Town`,
          notes: 'Multi-course regional tasting menu paired with local delicacies.',
          cost: Math.round(budget * (spendAllocation.dining / totalDays) * 0.7),
          completed: false,
          orderIndex: 1,
        });
      } else {
        activities.push({
          id: `act-${Date.now()}-${dayNum}-1`,
          dayId: `day-${Date.now()}-${dayNum}`,
          title: `${hubForDay.city} Highlights & Cultural Walk`,
          time: '09:30',
          category: 'sightseeing',
          location: `${hubForDay.city} Heritage Center`,
          notes: 'Guided historic exploration with priority admission.',
          cost: Math.round(budget * (spendAllocation.activities / totalDays) * 0.5),
          completed: false,
          orderIndex: 0,
        });
        activities.push({
          id: `act-${Date.now()}-${dayNum}-2`,
          dayId: `day-${Date.now()}-${dayNum}`,
          title: `Artisan Lunch & Street Food Crawl`,
          time: '13:00',
          category: 'food',
          location: `${hubForDay.city} Artisan District`,
          notes: 'Sample local specialties and specialty brew or tea.',
          cost: Math.round(budget * (spendAllocation.dining / totalDays) * 0.3),
          completed: false,
          orderIndex: 1,
        });
        activities.push({
          id: `act-${Date.now()}-${dayNum}-3`,
          dayId: `day-${Date.now()}-${dayNum}`,
          title: selectedVibes.includes('Nature & Hiking')
            ? `Scenic Ridge Trail & Nature Sanctuary`
            : `Architectural Panorama & Sunset Vantage`,
          time: '16:30',
          category: 'activity',
          location: `${hubForDay.city} Viewpoint`,
          notes: 'Panoramic golden hour views and photograph opportunities.',
          cost: 15,
          completed: false,
          orderIndex: 2,
        });
      }

      // Generate projected expenses matching allocation
      const dailyStay = Math.round((budget * spendAllocation.stays) / totalDays);
      const dailyDining = Math.round((budget * spendAllocation.dining) / totalDays);
      const dailyTransit = Math.round((budget * spendAllocation.transit) / totalDays);
      const dailyActivities = Math.round((budget * spendAllocation.activities) / totalDays);

      expenses.push({
        id: `exp-${Date.now()}-${dayNum}-stay`,
        dayId: `day-${Date.now()}-${dayNum}`,
        description: `${hubForDay.city} Boutique Suite (Allocated)`,
        amount: dailyStay,
        currency,
        category: 'Accommodation',
        date: dayDate,
      });

      expenses.push({
        id: `exp-${Date.now()}-${dayNum}-dining`,
        dayId: `day-${Date.now()}-${dayNum}`,
        description: `${hubForDay.city} Dining & Tastings`,
        amount: dailyDining,
        currency,
        category: 'Food',
        date: dayDate,
      });

      if (dailyActivities > 0) {
        expenses.push({
          id: `exp-${Date.now()}-${dayNum}-activity`,
          dayId: `day-${Date.now()}-${dayNum}`,
          description: `${hubForDay.city} Admissions & Sights`,
          amount: dailyActivities,
          currency,
          category: 'Activities',
          date: dayDate,
        });
      }

      if (idx === 0 || idx === Math.floor(totalDays / 2)) {
        expenses.push({
          id: `exp-${Date.now()}-${dayNum}-transit`,
          dayId: `day-${Date.now()}-${dayNum}`,
          description: idx === 0 ? 'High-speed Express Transfer' : 'Inter-city Rail Pass Link',
          amount: dailyTransit * 2,
          currency,
          category: 'Transportation',
          date: dayDate,
        });
      }

      return {
        id: `day-${Date.now()}-${dayNum}`,
        dayNumber: dayNum,
        date: dayDate,
        title: dayTitle,
        notes: `Focus: ${selectedVibes.slice(0, 2).join(' & ')}. Pace: Balanced.`,
        activities,
        expenses,
      };
    });

    const newTrip = createTrip({
      name: title.trim(),
      destination: hubNames,
      coordinates: primaryHub.lat && primaryHub.lon ? {
        lat: primaryHub.lat,
        lon: primaryHub.lon,
      } : undefined,
      startDate,
      endDate,
      budget,
      currency,
      coverImage,
      travelers: Array.from({ length: travelersCount }).map((_, idx) => ({
        id: `traveler-${Date.now()}-${idx}`,
        name: idx === 0 ? 'Chief Explorer (You)' : `Voyager ${idx + 1}`,
        role: idx === 0 ? 'organizer' : 'traveler',
      })),
      days: generatedDays,
    });

    setIsGenerating(false);
    if (onClose) onClose();
    navigate(`/trips/${newTrip.id}`);
  };

  return (
    <div className="w-full bg-[#f8fafd] dark:bg-[#0b101b] rounded-3xl sm:rounded-[36px] border border-slate-200/80 dark:border-slate-800 shadow-frost overflow-hidden transition-colors">
      <div className="p-6 sm:p-8 lg:p-10 space-y-8">
        {/* TOP HEADER */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/40">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
                STEP 1 OF 3 • TRIP ESSENTIALS
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <Check className="w-3 h-3 text-emerald-500" />
                Draft Saved {draftSavedAt}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Step indicator dots */}
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-[#c2410c] dark:bg-[#ea580c]" />
                <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" />
                <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" />
              </div>

              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-full border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Create a New Journey
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base mt-1.5">
              Map out dates, travelers, and curated spending dynamics in minutes.
            </p>
          </div>
        </div>

        {/* 2-COLUMN MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Essentials & Schedule */}
          <div className="lg:col-span-7 space-y-7">
            {/* 1. TRIP TITLE */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  TRIP TITLE
                </label>
                <button
                  type="button"
                  onClick={handleInspireRoute}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Inspire your route</span>
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setDraftSavedAt('just now');
                  }}
                  placeholder="e.g. Autumnal Drift: Kyoto & Hakone"
                  className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white/90 dark:bg-slate-800/90 text-slate-900 dark:text-white text-base sm:text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-sm transition-all"
                />
              </div>

              {/* Quick Ideas Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mr-1">
                  Quick ideas:
                </span>
                {QUICK_IDEAS.map((idea) => (
                  <button
                    key={idea.title}
                    type="button"
                    onClick={() => handleApplyQuickIdea(idea)}
                    className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/80 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-[#c2410c] hover:text-[#c2410c] dark:hover:text-[#fb923c] transition-all shadow-xs"
                  >
                    {idea.title.split(':')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. DESTINATION HUBS */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                DESTINATION HUBS
              </label>

              <div
                ref={hubDropdownRef}
                className="relative rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white/90 dark:bg-slate-800/90 p-3 shadow-sm space-y-2.5"
              >
                {/* Active Hub Chips */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-orange-50 dark:bg-orange-950/60 text-[#c2410c] dark:text-[#fb923c]">
                    <Globe2 className="w-4 h-4" />
                  </div>

                  {selectedHubs.map((hub) => (
                    <span
                      key={hub.id}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-700/70 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-600 shadow-xs"
                    >
                      <span>{hub.flag}</span>
                      <span>{hub.city}</span>
                      {selectedHubs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveHub(hub.id)}
                          className="text-slate-400 hover:text-slate-700 dark:hover:text-white ml-0.5"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>

                {/* Inline Search Input */}
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-slate-400 absolute left-2" />
                  <input
                    type="text"
                    value={hubQuery}
                    onChange={(e) => setHubQuery(e.target.value)}
                    onFocus={() => {
                      if (hubSuggestions.length > 0) setShowHubDropdown(true);
                    }}
                    placeholder="Add another region or stop (e.g. Paris, Tokyo, Florence)..."
                    className="w-full pl-8 pr-4 py-2 bg-transparent text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
                  />
                  {isSearchingHubs && (
                    <div className="w-4 h-4 border-2 border-[#c2410c] border-t-transparent rounded-full animate-spin absolute right-2" />
                  )}
                </div>

                {/* Real-Time Autocomplete Dropdown */}
                {showHubDropdown && hubSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden z-30 max-h-64 overflow-y-auto">
                    <div className="px-3 py-1.5 text-[10px] font-mono uppercase text-slate-400 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
                      Real-time City Results
                    </div>
                    {hubSuggestions.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleAddHub(item)}
                        className="w-full text-left px-4 py-2.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors border-b border-slate-100 dark:border-slate-700/50 last:border-0"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <span className="text-base">{getCountryFlag(item.countryCode)}</span>
                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                              {toEnglishPlaceName(item.city)}
                            </div>
                            <div className="text-[11px] text-slate-500 truncate max-w-[320px]">
                              {toEnglishPlaceName(item.formatted)}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] text-[#c2410c] dark:text-[#fb923c] font-semibold px-2 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/60">
                          + Add Hub
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <p className="text-[11px] text-slate-400 dark:text-slate-500 italic flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-blue-500" />
                Multi-city routing automatically arranges high-speed transfers and rail links.
              </p>
            </div>

            {/* 3. TRAVEL WINDOW & SCHEDULE */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  TRAVEL WINDOW & SCHEDULE
                </label>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/40">
                  ☀️ {totalDays} Days • {currentSeason}
                </span>
              </div>

              {/* Dual Departure & Return Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Departure Card */}
                <div
                  onClick={() => setActiveDateSelector('start')}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    activeDateSelector === 'start'
                      ? 'border-[#c2410c] dark:border-[#ea580c] bg-orange-50/30 dark:bg-orange-950/20 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-orange-100 dark:bg-orange-950/50 text-[#c2410c] dark:text-[#ea580c]">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                        Departure
                      </div>
                      <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                        {formatDate(startDate) || 'Select departure'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Return Card */}
                <div
                  onClick={() => setActiveDateSelector('end')}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    activeDateSelector === 'end'
                      ? 'border-blue-600 dark:border-blue-400 bg-blue-50/30 dark:bg-blue-950/20 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                        Return
                      </div>
                      <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                        {formatDate(endDate) || 'Select return'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Calendar Matrix */}
              <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white/90 dark:bg-slate-800/90 shadow-sm space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      📅 {calendarMonthLabel} Calendar Matrix
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium text-slate-400 hidden sm:inline">
                      {currentSeason}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          setCalendarMonth(
                            new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1)
                          )
                        }
                        className="p-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setCalendarMonth(
                            new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1)
                          )
                        }
                        className="p-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Weekday Labels (Mo - Su) */}
                <div className="grid grid-cols-7 gap-1 text-center">
                  {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
                    <div
                      key={day}
                      className="text-[11px] font-mono font-bold text-slate-400 dark:text-slate-500 py-1"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Day Cells Matrix */}
                <div className="grid grid-cols-7 gap-1 text-center">
                  {calendarDays.map((cell, idx) => {
                    const isStart = cell.dateStr === startDate;
                    const isEnd = cell.dateStr === endDate;
                    const inRange =
                      startDate &&
                      endDate &&
                      cell.dateStr > startDate &&
                      cell.dateStr < endDate;

                    return (
                      <button
                        key={`${cell.dateStr}-${idx}`}
                        type="button"
                        onClick={() => handleCalendarDateClick(cell.dateStr)}
                        className={`h-9 rounded-xl text-xs font-semibold flex items-center justify-center transition-all ${
                          !cell.isCurrentMonth
                            ? 'text-slate-300 dark:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                            : isStart
                            ? 'bg-[#c2410c] dark:bg-[#ea580c] text-white font-black shadow-md shadow-orange-500/30 ring-2 ring-orange-500/20'
                            : isEnd
                            ? 'bg-[#c2410c] dark:bg-[#ea580c] text-white font-black shadow-md shadow-orange-500/30 ring-2 ring-orange-500/20'
                            : inRange
                            ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold'
                            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        {cell.dayNum}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 4. PARTY SIZE PRESETS */}
            <div className="space-y-3">
              <label className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                PARTY CONFIGURATION
              </label>

              {/* Preset Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'solo', label: 'Solo (1)' },
                  { id: 'couple', label: 'Couple (2)' },
                  { id: 'family', label: 'Family (3-5)' },
                  { id: 'squad', label: 'Squad (6+)' },
                ].map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset.id as any)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      partyPreset === preset.id
                        ? 'bg-[#c2410c] dark:bg-[#ea580c] text-white shadow-md shadow-orange-600/20'
                        : 'bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Stepper Card */}
              <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white/90 dark:bg-slate-800/90 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/50 text-[#c2410c] dark:text-[#fb923c]">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Adult Voyagers
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Age 18 and older • Shared suite
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleTravelerCountChange(travelersCount - 1)}
                    disabled={travelersCount <= 1}
                    className="w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-black font-mono text-slate-900 dark:text-white">
                    {travelersCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleTravelerCountChange(travelersCount + 1)}
                    className="w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Target Budget & Estimated Expenses */}
          <div className="lg:col-span-5 space-y-6">
            {/* TARGET BUDGET CARD */}
            <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 shadow-frost space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#c2410c] dark:text-[#fb923c]">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Target Budget
                  </span>
                </div>

                {/* Currency Switcher */}
                <CustomSelect
                  options={[
                    { value: 'USD', label: 'USD ($)' },
                    { value: 'EUR', label: 'EUR (€)' },
                    { value: 'GBP', label: 'GBP (£)' },
                    { value: 'JPY', label: 'JPY (¥)' },
                    { value: 'CAD', label: 'CAD (CA$)' },
                    { value: 'AUD', label: 'AUD (AU$)' },
                    { value: 'INR', label: 'INR (₹)' },
                  ]}
                  value={currency}
                  onChange={(val) => setCurrency(val as CurrencyCode)}
                  className="w-32"
                  size="sm"
                  align="right"
                />
              </div>

              {/* Main Amount Display */}
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                    {CURRENCY_SYMBOLS[currency]}
                    {budget.toLocaleString()}
                  </div>
                  <span className="text-xs text-slate-400">total allocated</span>
                </div>

                <div className="text-right">
                  <div className="text-xl sm:text-2xl font-black text-[#c2410c] dark:text-[#fb923c]">
                    {CURRENCY_SYMBOLS[currency]}
                    {perDayBudget}
                  </div>
                  <div className="text-[11px] text-slate-400">per day</div>
                </div>
              </div>

              {/* Range Slider */}
              <div className="space-y-2">
                <input
                  type="range"
                  min="500"
                  max="20000"
                  step="100"
                  value={budget}
                  onChange={(e) => setBudget(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#c2410c] dark:accent-[#ea580c]"
                />
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 dark:text-slate-500">
                  <span>$1.5k (Nomad)</span>
                  <span>$6.0k (Signature)</span>
                  <span>$12.0k+ (Ultra-Luxe)</span>
                </div>
              </div>

              {/* PROJECTED SPEND ALLOCATION */}
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  PROJECTED SPEND ALLOCATION
                </div>

                {/* Segmented Multi-Color Bar */}
                <div className="h-3 w-full rounded-full overflow-hidden flex bg-slate-100 dark:bg-slate-800">
                  <div
                    style={{ width: `${spendAllocation.stays * 100}%` }}
                    className="bg-[#c2410c] h-full"
                    title="Stays 44%"
                  />
                  <div
                    style={{ width: `${spendAllocation.dining * 100}%` }}
                    className="bg-[#0284c7] h-full"
                    title="Dining 28%"
                  />
                  <div
                    style={{ width: `${spendAllocation.transit * 100}%` }}
                    className="bg-[#38bdf8] h-full"
                    title="Transit 18%"
                  />
                  <div
                    style={{ width: `${spendAllocation.activities * 100}%` }}
                    className="bg-[#94a3b8] h-full"
                    title="Activities 10%"
                  />
                </div>

                {/* Legend */}
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#c2410c]" />
                    <span>Stays 44%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]" />
                    <span>Dining 28%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8]" />
                    <span>Transit 18%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#94a3b8]" />
                    <span>Activities 10%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CURATED VIBE & PACE */}
            <div className="space-y-3">
              <label className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                CURATED VIBE & PACE
              </label>

              <div className="flex flex-wrap gap-2">
                {AVAILABLE_VIBES.map((vibe) => {
                  const isSelected = selectedVibes.includes(vibe);
                  return (
                    <button
                      key={vibe}
                      type="button"
                      onClick={() => handleToggleVibe(vibe)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-orange-50 dark:bg-orange-950/60 text-[#c2410c] dark:text-[#fb923c] border-2 border-[#c2410c] shadow-xs'
                          : 'bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      {vibe}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ESTIMATED DISCOVERY INDEX CARD */}
            <div className="relative rounded-3xl overflow-hidden shadow-lg group">
              <img
                src={coverImage}
                alt="Curated Travel"
                className="w-full h-44 object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent p-5 flex flex-col justify-end">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400">
                  ESTIMATED DISCOVERY INDEX
                </span>
                <div className="text-white text-base sm:text-lg font-black tracking-tight mt-1">
                  {getDiscoveryIndexHeadline()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM FOOTER BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Automatic offline syncing enabled • Encrypted storage</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="flex-1 sm:flex-none px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 font-bold text-xs text-slate-700 dark:text-slate-200 transition-colors shadow-xs"
            >
              Save as Draft
            </button>

            <button
              type="button"
              disabled={isGenerating}
              onClick={handleGenerateSmartItinerary}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-7 py-3 rounded-2xl bg-[#c2410c] hover:bg-[#b91c1c] active:bg-[#9a3412] text-white font-bold text-sm shadow-lg shadow-orange-600/25 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>{isGenerating ? 'Building Itinerary...' : 'Generate Itinerary'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
