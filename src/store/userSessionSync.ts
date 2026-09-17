import { useTripStore } from './useTripStore';
import { useSavedPlacesStore } from './useSavedPlacesStore';
import { usePreferencesStore } from './usePreferencesStore';

/**
 * Synchronizes all data stores (Trips, Saved Places, Preferences) to the active user's isolated storage slice.
 * When userId is 'guest' (logged out), switches to the guest sandbox.
 */
export function syncUserAcrossStores(userId: string): void {
  const targetId = userId || 'guest';
  useTripStore.getState().loadUserTrips(targetId);
  useSavedPlacesStore.getState().loadUserSavedPlaces(targetId);
  usePreferencesStore.getState().loadUserPreferences(targetId);
}
