import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SavedPlace } from '../types/trip';

interface SavedPlacesState {
  savedPlaces: SavedPlace[];
  toggleSavePlace: (place: Omit<SavedPlace, 'savedAt'>) => boolean;
  isPlaceSaved: (id: string) => boolean;
  removeSavedPlace: (id: string) => void;
  clearAllSavedPlaces: () => void;
}

export const useSavedPlacesStore = create<SavedPlacesState>()(
  persist(
    (set, get) => ({
      savedPlaces: [
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
      ],

      toggleSavePlace: (place) => {
        const isSaved = get().savedPlaces.some((p) => p.id === place.id);

        if (isSaved) {
          set((state) => ({
            savedPlaces: state.savedPlaces.filter((p) => p.id !== place.id),
          }));
          return false;
        } else {
          const newSaved: SavedPlace = {
            ...place,
            savedAt: new Date().toISOString(),
          };
          set((state) => ({
            savedPlaces: [newSaved, ...state.savedPlaces],
          }));
          return true;
        }
      },

      isPlaceSaved: (id) => {
        return get().savedPlaces.some((p) => p.id === id);
      },

      removeSavedPlace: (id) => {
        set((state) => ({
          savedPlaces: state.savedPlaces.filter((p) => p.id !== id),
        }));
      },

      clearAllSavedPlaces: () => {
        set({ savedPlaces: [] });
      },
    }),
    {
      name: 'trip-planner-saved-places',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
