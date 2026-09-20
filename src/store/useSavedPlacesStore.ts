import { create } from 'zustand';
import { SavedPlace } from '../types/trip';
import { getInitialActiveUserId } from './userStorageHelper';

export interface SavedPlacesState {
  savedPlaces: SavedPlace[];
  activeUserId: string;
  loadUserSavedPlaces: (userId: string) => void;
  toggleSavePlace: (place: Omit<SavedPlace, 'savedAt'>) => boolean;
  isPlaceSaved: (id: string) => boolean;
  removeSavedPlace: (id: string) => void;
  clearAllSavedPlaces: () => void;
}

const INITIAL_ADMIN_SAVED_PLACES: SavedPlace[] = [
  {
    id: 'paris-eiffel',
    name: 'Eiffel Tower',
    category: 'attraction',
    cityName: 'Paris',
    country: 'France',
    description: 'Iconic wrought-iron lattice tower on the Champ de Mars.',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 48.8584, lon: 2.2945 },
    savedAt: new Date().toISOString(),
  },
  {
    id: 'ist-hagiasophia',
    name: 'Hagia Sophia',
    category: 'attraction',
    cityName: 'Istanbul',
    country: 'Turkey',
    description: 'Majestic former Byzantine church and mosque with towering dome.',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 41.0086, lon: 28.9802 },
    savedAt: new Date().toISOString(),
  },
];

const getSavedKey = (userId: string) => `tp_saved_${userId || 'guest'}`;

export function loadStoredSavedPlaces(userId: string): SavedPlace[] {
  // Guest / unauthenticated session has no saved places
  if (!userId || userId === 'guest') {
    return [];
  }

  const key = getSavedKey(userId);
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
    // Legacy migration for admin
    if (userId === 'usr-admin') {
      const legacy = localStorage.getItem('trip-planner-saved-places');
      if (legacy) {
        const parsed = JSON.parse(legacy);
        const places = parsed.state?.savedPlaces || parsed;
        if (Array.isArray(places) && places.length > 0) {
          localStorage.setItem(key, JSON.stringify(places));
          return places;
        }
      }
      // If admin has nothing yet, seed with demo places
      localStorage.setItem(key, JSON.stringify(INITIAL_ADMIN_SAVED_PLACES));
      return INITIAL_ADMIN_SAVED_PLACES;
    }
  } catch (err) {
    console.warn('Failed to parse saved places for user:', userId, err);
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

const initialUserId = getInitialActiveUserId();
const initialSavedPlaces = loadStoredSavedPlaces(initialUserId);

export const useSavedPlacesStore = create<SavedPlacesState>((set, get) => ({
  savedPlaces: initialSavedPlaces,
  activeUserId: initialUserId,

  loadUserSavedPlaces: (userId: string) => {
    const places = loadStoredSavedPlaces(userId);
    set({ activeUserId: userId, savedPlaces: places });
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
