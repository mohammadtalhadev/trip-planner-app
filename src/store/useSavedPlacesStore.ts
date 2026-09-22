import { create } from 'zustand';
import { SavedPlace, SavedBoard } from '../types/trip';
import { getInitialActiveUserId } from './userStorageHelper';

export interface SavedPlacesState {
  savedPlaces: SavedPlace[];
  boards: SavedBoard[];
  activeBoardId: string | 'all';
  activeUserId: string;
  loadUserSavedPlaces: (userId: string) => void;
  setActiveBoard: (boardId: string | 'all') => void;
  createBoard: (name: string, description?: string) => SavedBoard;
  toggleSavePlace: (place: Omit<SavedPlace, 'savedAt'>) => boolean;
  isPlaceSaved: (id: string) => boolean;
  removeSavedPlace: (id: string) => void;
  clearAllSavedPlaces: () => void;
}

export const INITIAL_DEMO_BOARDS: SavedBoard[] = [
  { id: 'japan-autumn', name: 'Japan Autumn 2025', description: 'Temples, ryokans, and culinary gems in Kyoto & Tokyo' },
  { id: 'italian-summer', name: 'Italian Summer Dream', description: 'Cliffside coastal retreats and candlelit dining' },
  { id: 'nordic-winter', name: 'Nordic Winter Cabin', description: 'Aurora borealis and fireside retreats' },
];

export const INITIAL_DEMO_SAVED_PLACES: SavedPlace[] = [
  // 1. Fushimi Inari Shrine (Japan)
  {
    id: 'fushimi-inari',
    name: 'Fushimi Inari Shrine',
    category: 'attraction',
    cityName: 'Kyoto',
    country: 'Japan',
    boardId: 'japan-autumn',
    tag: 'Historic Shrine',
    highlight: 'Best at sunrise',
    rating: 4.9,
    reviewCount: '1.2k',
    imageUrl: 'https://images.unsplash.com/photo-1478436127897-769e00d2c715?auto=format&fit=crop&w=800&q=80',
    description: 'Thousands of vibrant vermilion shrine gates winding up sacred Mount Inari. Early dawn hike skips crowds.',
    coordinates: { lat: 34.9671, lon: 135.7727 },
    savedAt: '2026-09-18T08:00:00.000Z',
  },
  // 2. Chao Chao Gyoza (Japan)
  {
    id: 'chao-chao-gyoza',
    name: 'Chao Chao Gyoza',
    category: 'restaurant',
    cityName: 'Kyoto',
    country: 'Japan',
    boardId: 'japan-autumn',
    tag: 'Casual Dining',
    highlight: '$$ • Moderate',
    rating: 4.7,
    reviewCount: '890',
    imageUrl: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=800&q=80',
    description: 'Award-winning crispy thin-skinned dumplings paired with local craft draft beer. High-energy counter dining.',
    coordinates: { lat: 35.0053, lon: 135.7712 },
    savedAt: '2026-09-18T10:30:00.000Z',
  },
  // 3. The Shinmonzen (Japan)
  {
    id: 'the-shinmonzen',
    name: 'The Shinmonzen',
    category: 'hotel',
    cityName: 'Gion Kyoto',
    country: 'Japan',
    boardId: 'japan-autumn',
    tag: 'Luxury Ryokan',
    highlight: '$850 / night',
    rating: 4.95,
    reviewCount: '340',
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    description: 'Tadao Ando designed boutique sanctuary on tranquil Shirakawa canal. Private balconies with bespoke artworks.',
    coordinates: { lat: 35.0062, lon: 135.7749 },
    savedAt: '2026-09-19T14:15:00.000Z',
  },
  // 4. Amalfi Coast (Italy)
  {
    id: 'amalfi-coast',
    name: 'Amalfi Coast',
    category: 'destination',
    cityName: 'Amalfi',
    country: 'Italy',
    boardId: 'italian-summer',
    tag: 'Destination',
    highlight: 'Bucket list • Summer 2026',
    rating: 4.9,
    reviewCount: '3.4k',
    imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
    description: 'Vertical seaside towns, fragrant lemon groves, and breathtaking coastal drives carved into steep cliffs.',
    coordinates: { lat: 40.6340, lon: 14.6027 },
    savedAt: '2026-09-19T16:00:00.000Z',
  },
  // 5. % Arabica Arashiyama (Japan)
  {
    id: 'arabica-arashiyama',
    name: '% Arabica Arashiyama',
    category: 'cafe',
    cityName: 'Kyoto',
    country: 'Japan',
    boardId: 'japan-autumn',
    tag: 'Specialty Coffee',
    highlight: 'Riverside view',
    rating: 4.8,
    reviewCount: '2.1k',
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    description: 'World-renowned single origin espresso bar offering picture-perfect panoramas of the Togetsukyo Bridge and river.',
    coordinates: { lat: 35.0131, lon: 135.6775 },
    savedAt: '2026-09-20T09:20:00.000Z',
  },
  // 6. Kiyomizu-dera Wooden Stage (Japan)
  {
    id: 'kiyomizu-dera',
    name: 'Kiyomizu-dera Wooden Stage',
    category: 'attraction',
    cityName: 'Higashiyama',
    country: 'Japan',
    boardId: 'japan-autumn',
    tag: 'UNESCO Landmark',
    highlight: 'Sunset peak',
    rating: 4.9,
    reviewCount: '4.8k',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    description: 'Ancient cliffside temple built entirely without nails. Overhang provides breathtaking sunset views over Kyoto.',
    coordinates: { lat: 34.9949, lon: 135.7850 },
    savedAt: '2026-09-20T17:30:00.000Z',
  },
  // 7. Kinkaku-ji Golden Pavilion (Japan)
  {
    id: 'kinkaku-ji',
    name: 'Kinkaku-ji Golden Pavilion',
    category: 'attraction',
    cityName: 'Kita Ward',
    country: 'Japan',
    boardId: 'japan-autumn',
    tag: 'Zen Buddhist Temple',
    highlight: 'Morning reflection',
    rating: 4.85,
    reviewCount: '3.2k',
    imageUrl: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=800&q=80',
    description: 'Iconic Zen temple whose top two floors are covered in brilliant gold leaf, shimmering over Mirror Pond.',
    coordinates: { lat: 35.0394, lon: 135.7292 },
    savedAt: '2026-09-21T08:15:00.000Z',
  },
  // 8. Gion Corner Cultural Show (Japan)
  {
    id: 'gion-corner',
    name: 'Gion Corner Cultural Theater',
    category: 'attraction',
    cityName: 'Gion',
    country: 'Japan',
    boardId: 'japan-autumn',
    tag: 'Traditional Arts',
    highlight: 'Maiko performance',
    rating: 4.6,
    reviewCount: '620',
    imageUrl: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=800&q=80',
    description: 'Seven traditional Japanese performing arts introduced in one compact showcase, featuring authentic Kyoto kyo-mai dance.',
    coordinates: { lat: 35.0022, lon: 135.7761 },
    savedAt: '2026-09-21T18:00:00.000Z',
  },
  // 9. Nishiki Market Food Hall (Japan)
  {
    id: 'nishiki-market',
    name: 'Nishiki Market Alleyways',
    category: 'restaurant',
    cityName: 'Nakagyo',
    country: 'Japan',
    boardId: 'japan-autumn',
    tag: 'Culinary Street',
    highlight: 'Fresh seafood skewers',
    rating: 4.7,
    reviewCount: '2.4k',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    description: 'Narrow five-block shopping street known as Kyoto Kitchen, packed with over a hundred food stalls and cookware masters.',
    coordinates: { lat: 35.0050, lon: 135.7649 },
    savedAt: '2026-09-21T12:00:00.000Z',
  },
  // 10. Tenryu-ji Sogenchi Garden (Japan)
  {
    id: 'tenryu-ji',
    name: 'Tenryu-ji Sogenchi Garden',
    category: 'attraction',
    cityName: 'Arashiyama',
    country: 'Japan',
    boardId: 'japan-autumn',
    tag: 'Zen Landscape',
    highlight: 'UNESCO World Heritage',
    rating: 4.9,
    reviewCount: '1.8k',
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    description: '14th-century pond garden framed by the autumn-tinted mountains of Arashiyama, embodying Japanese wabi-sabi.',
    coordinates: { lat: 35.0158, lon: 135.6777 },
    savedAt: '2026-09-21T14:45:00.000Z',
  },
  // 11. Pontocho Alley Lantern Walk (Japan)
  {
    id: 'pontocho-alley',
    name: 'Pontocho Historic Alley',
    category: 'restaurant',
    cityName: 'Nakagyo',
    country: 'Japan',
    boardId: 'japan-autumn',
    tag: 'Historic Nightwalk',
    highlight: 'Riverfront dining',
    rating: 4.8,
    reviewCount: '950',
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
    description: 'Atmospheric cobblestone pedestrian alley running parallel to the Kamogawa River, renowned for seasonal riverside kawayuka dining.',
    coordinates: { lat: 35.0068, lon: 135.7710 },
    savedAt: '2026-09-22T20:00:00.000Z',
  },
  // 12. Bamboo Forest Path (Japan)
  {
    id: 'bamboo-forest',
    name: 'Sagano Bamboo Grove',
    category: 'attraction',
    cityName: 'Arashiyama',
    country: 'Japan',
    boardId: 'japan-autumn',
    tag: 'Nature Sanctuary',
    highlight: 'Early dawn tranquility',
    rating: 4.7,
    reviewCount: '5.1k',
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    description: 'Towering green bamboo stalks swaying with the wind, producing one of the 100 Soundscapes of Japan.',
    coordinates: { lat: 35.0169, lon: 135.6713 },
    savedAt: '2026-09-22T07:00:00.000Z',
  },
  // 13. Ryoan-ji Rock Garden (Japan)
  {
    id: 'ryoan-ji',
    name: 'Ryoan-ji Zen Rock Terrace',
    category: 'attraction',
    cityName: 'Ukyo',
    country: 'Japan',
    boardId: 'japan-autumn',
    tag: 'Karesansui Dry Garden',
    highlight: 'Meditative rock terrace',
    rating: 4.6,
    reviewCount: '880',
    imageUrl: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=800&q=80',
    description: 'Fifteen mystic moss-encircled stones arranged in white raked gravel, configured so you can never view all 15 at once.',
    coordinates: { lat: 35.0345, lon: 135.7182 },
    savedAt: '2026-09-22T11:00:00.000Z',
  },
  // 14. Daitoku-ji Zen Temple Complex (Japan)
  {
    id: 'daitoku-ji',
    name: 'Daitoku-ji Monastic Complex',
    category: 'attraction',
    cityName: 'Kita',
    country: 'Japan',
    boardId: 'japan-autumn',
    tag: 'Historic Monasteries',
    highlight: 'Quiet subtemples',
    rating: 4.7,
    reviewCount: '410',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    description: 'Vast walled temple compound of the Rinzai Zen school with sublime gravel gardens and tea master Sen no Rikyu heritage.',
    coordinates: { lat: 35.0441, lon: 135.7447 },
    savedAt: '2026-09-22T13:30:00.000Z',
  },
  // 15. Otagi Nenbutsu-ji (Japan)
  {
    id: 'otagi-nenbutsuji',
    name: 'Otagi Nenbutsu-ji Stone Temple',
    category: 'attraction',
    cityName: 'Sagano',
    country: 'Japan',
    boardId: 'japan-autumn',
    tag: '1200 Stone Rakan',
    highlight: 'Moss-covered stone statues',
    rating: 4.85,
    reviewCount: '520',
    imageUrl: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=800&q=80',
    description: 'Whimsical secluded hillside temple adorned with 1,200 unique hand-carved stone Buddhist statues each bearing distinct expressions.',
    coordinates: { lat: 35.0294, lon: 135.6591 },
    savedAt: '2026-09-22T15:20:00.000Z',
  },
  // 16. Nijo Castle Ninomaru (Japan)
  {
    id: 'nijo-castle',
    name: 'Nijo Castle Ninomaru Palace',
    category: 'attraction',
    cityName: 'Nakagyo',
    country: 'Japan',
    boardId: 'japan-autumn',
    tag: 'Samurai Palace',
    highlight: 'Nightingale floors',
    rating: 4.65,
    reviewCount: '1.6k',
    imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80',
    description: 'Edo-era stronghold of the Tokugawa Shogunate with chirping nightingale alarm floors and cypress wood carved screens.',
    coordinates: { lat: 35.0142, lon: 135.7482 },
    savedAt: '2026-09-22T16:40:00.000Z',
  },
  // 17. Ippodo Tea Kyoto Flagship (Japan)
  {
    id: 'ippodo-tea',
    name: 'Ippodo Tea Kyoto Salon',
    category: 'cafe',
    cityName: 'Teramachi',
    country: 'Japan',
    boardId: 'japan-autumn',
    tag: 'Master Green Tea',
    highlight: 'Single-estate matcha',
    rating: 4.9,
    reviewCount: '790',
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    description: 'Nearly 300-year-old tea merchant in central Kyoto offering ceremonial matcha tastings and master brewing demonstrations.',
    coordinates: { lat: 35.0135, lon: 135.7684 },
    savedAt: '2026-09-23T11:00:00.000Z',
  },
  // 18. Kodai-ji Temple Night Illumination (Japan)
  {
    id: 'kodai-ji',
    name: 'Kodai-ji Temple & Gardens',
    category: 'attraction',
    cityName: 'Higashiyama',
    country: 'Japan',
    boardId: 'japan-autumn',
    tag: 'Autumn Illumination',
    highlight: 'Lit bamboo grove',
    rating: 4.8,
    reviewCount: '830',
    imageUrl: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=800&q=80',
    description: 'Established in 1606 by Nene in memory of Toyotomi Hideyoshi, featuring splendid nighttime illumination over Garyu Pond.',
    coordinates: { lat: 35.0004, lon: 135.7816 },
    savedAt: '2026-09-23T19:30:00.000Z',
  },
  // 19. Positano Cliffside Vista (Italy)
  {
    id: 'positano-cliffside',
    name: 'Positano Cliffside Vista',
    category: 'destination',
    cityName: 'Positano',
    country: 'Italy',
    boardId: 'italian-summer',
    tag: 'Scenic Coastline',
    highlight: 'Pastel cliffside cascades',
    rating: 4.85,
    reviewCount: '2.1k',
    imageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80',
    description: 'Breathtaking pastel village clinging to dramatic sea cliffs over the turquoise waters of the Gulf of Salerno.',
    coordinates: { lat: 40.6281, lon: 14.4850 },
    savedAt: '2026-09-23T12:00:00.000Z',
  },
  // 20. Ristorante La Sponda (Italy)
  {
    id: 'la-sponda',
    name: 'Ristorante La Sponda',
    category: 'restaurant',
    cityName: 'Positano',
    country: 'Italy',
    boardId: 'italian-summer',
    tag: 'Fine Dining',
    highlight: '400 candlelit evening',
    rating: 4.8,
    reviewCount: '640',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    description: 'Michelin-starred Mediterranean dining illuminated every evening by four hundred real flickering wax candles.',
    coordinates: { lat: 40.6288, lon: 14.4862 },
    savedAt: '2026-09-23T13:40:00.000Z',
  },
  // 21. Villa Cimbrone Infinity Terrace (Italy)
  {
    id: 'villa-cimbrone',
    name: 'Villa Cimbrone Infinity Terrace',
    category: 'attraction',
    cityName: 'Ravello',
    country: 'Italy',
    boardId: 'italian-summer',
    tag: 'Historic Garden',
    highlight: 'Breathtaking Tyrrhenian views',
    rating: 4.9,
    reviewCount: '1.2k',
    imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
    description: 'Famous belvedere terrace lined with classical marble busts suspended over the infinite Mediterranean horizon.',
    coordinates: { lat: 40.6482, lon: 14.6114 },
    savedAt: '2026-09-23T15:10:00.000Z',
  },
  // 22. Yasaka Pagoda & Ninenzaka (Japan)
  {
    id: 'yasaka-pagoda',
    name: 'Yasaka Pagoda & Ninenzaka',
    category: 'attraction',
    cityName: 'Higashiyama',
    country: 'Japan',
    boardId: 'japan-autumn',
    tag: 'Historic Landmark',
    highlight: 'Twilight photography',
    rating: 4.95,
    reviewCount: '1.9k',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    description: 'Classic five-story pagoda towering over preserved cobblestone machiya alleyways of ancient Kyoto.',
    coordinates: { lat: 34.9986, lon: 135.7794 },
    savedAt: '2026-09-23T16:00:00.000Z',
  },
  // 23. Tromsø Aurora Fjord Cabin (Norway)
  {
    id: 'tromso-aurora-cabin',
    name: 'Tromsø Aurora Fjord Cabin',
    category: 'hotel',
    cityName: 'Tromsø',
    country: 'Norway',
    boardId: 'nordic-winter',
    tag: 'Arctic Retreat',
    highlight: 'Northern Lights private deck',
    rating: 4.95,
    reviewCount: '410',
    imageUrl: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=800&q=80',
    description: 'Secluded timber fjord lodge beneath the Arctic auroral oval, equipped with cedar wood-fired hot tub.',
    coordinates: { lat: 69.6492, lon: 18.9553 },
    savedAt: '2026-09-23T17:15:00.000Z',
  },
  // 24. Rovaniemi Arctic Glass Igloo (Finland)
  {
    id: 'rovaniemi-glass-igloo',
    name: 'Rovaniemi Arctic Glass Igloo',
    category: 'hotel',
    cityName: 'Lapland',
    country: 'Finland',
    boardId: 'nordic-winter',
    tag: 'Winter Stays',
    highlight: 'Stargazing thermal glass',
    rating: 4.85,
    reviewCount: '870',
    imageUrl: 'https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=800&q=80',
    description: 'Heated glass-domed bedroom in snow-covered pine forests for unhindered stargazing and midnight auroras.',
    coordinates: { lat: 66.5039, lon: 25.7294 },
    savedAt: '2026-09-23T18:45:00.000Z',
  },
];

const getSavedKey = (userId: string) => `tp_saved_${userId || 'guest'}`;
const getBoardsKey = (userId: string) => `tp_boards_${userId || 'guest'}`;

export function loadStoredSavedPlaces(userId: string): SavedPlace[] {
  // Guest / unauthenticated session has the pristine 24 reference demo collection in-memory
  if (!userId || userId === 'guest') {
    return JSON.parse(JSON.stringify(INITIAL_DEMO_SAVED_PLACES));
  }

  const key = getSavedKey(userId);
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    // Seed default admin with reference places if fresh
    if (userId === 'usr-admin') {
      localStorage.setItem(key, JSON.stringify(INITIAL_DEMO_SAVED_PLACES));
      return JSON.parse(JSON.stringify(INITIAL_DEMO_SAVED_PLACES));
    }
  } catch (err) {
    console.warn('Failed to parse saved places for user:', userId, err);
  }
  return [];
}

export function loadStoredBoards(userId: string): SavedBoard[] {
  if (!userId || userId === 'guest') {
    return JSON.parse(JSON.stringify(INITIAL_DEMO_BOARDS));
  }

  const key = getBoardsKey(userId);
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    if (userId === 'usr-admin') {
      localStorage.setItem(key, JSON.stringify(INITIAL_DEMO_BOARDS));
      return JSON.parse(JSON.stringify(INITIAL_DEMO_BOARDS));
    }
  } catch (err) {
    console.warn('Failed to parse boards for user:', userId, err);
  }
  return [];
}

function saveUserSavedPlaces(userId: string, places: SavedPlace[]) {
  if (!userId || userId === 'guest') {
    return;
  }
  try {
    localStorage.setItem(getSavedKey(userId), JSON.stringify(places));
  } catch (err) {
    console.warn('Failed to save user saved places:', err);
  }
}

function saveUserBoards(userId: string, boards: SavedBoard[]) {
  if (!userId || userId === 'guest') {
    return;
  }
  try {
    localStorage.setItem(getBoardsKey(userId), JSON.stringify(boards));
  } catch (err) {
    console.warn('Failed to save user boards:', err);
  }
}

const initialUserId = getInitialActiveUserId();
const initialSavedPlaces = loadStoredSavedPlaces(initialUserId);
const initialBoards = loadStoredBoards(initialUserId);

export const useSavedPlacesStore = create<SavedPlacesState>((set, get) => ({
  savedPlaces: initialSavedPlaces,
  boards: initialBoards,
  activeBoardId: 'all',
  activeUserId: initialUserId,

  loadUserSavedPlaces: (userId: string) => {
    const places = loadStoredSavedPlaces(userId);
    const boards = loadStoredBoards(userId);
    set({
      activeUserId: userId,
      savedPlaces: places,
      boards: boards,
      activeBoardId: 'all',
    });
  },

  setActiveBoard: (boardId) => {
    set({ activeBoardId: boardId });
  },

  createBoard: (name, description) => {
    const newBoard: SavedBoard = {
      id: `board-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      description: description?.trim(),
    };
    const updated = [...get().boards, newBoard];
    set({ boards: updated, activeBoardId: newBoard.id });
    saveUserBoards(get().activeUserId, updated);
    return newBoard;
  },

  toggleSavePlace: (place) => {
    const isSaved = get().savedPlaces.some((p) => p.id === place.id);
    let updated: SavedPlace[];

    if (isSaved) {
      updated = get().savedPlaces.filter((p) => p.id !== place.id);
      set({ savedPlaces: updated });
      saveUserSavedPlaces(get().activeUserId, updated);
      return false;
    } else {
      const newSaved: SavedPlace = {
        ...place,
        savedAt: new Date().toISOString(),
      };
      updated = [newSaved, ...get().savedPlaces];
      set({ savedPlaces: updated });
      saveUserSavedPlaces(get().activeUserId, updated);
      return true;
    }
  },

  isPlaceSaved: (id) => {
    return get().savedPlaces.some((p) => p.id === id);
  },

  removeSavedPlace: (id) => {
    const updated = get().savedPlaces.filter((p) => p.id !== id);
    set({ savedPlaces: updated });
    saveUserSavedPlaces(get().activeUserId, updated);
  },

  clearAllSavedPlaces: () => {
    set({ savedPlaces: [] });
    saveUserSavedPlaces(get().activeUserId, []);
  },
}));
