export type ExpenseCategory =
  | 'Accommodation'
  | 'Food'
  | 'Transportation'
  | 'Activities'
  | 'Shopping'
  | 'Miscellaneous';

export type ActivityCategory =
  | 'sightseeing'
  | 'food'
  | 'transport'
  | 'lodging'
  | 'activity'
  | 'shopping'
  | 'other';

export interface Traveler {
  id: string;
  name: string;
  email?: string;
  role?: 'organizer' | 'traveler';
  avatar?: string;
}

export interface Activity {
  id: string;
  dayId: string;
  title: string;
  time: string; // e.g. "09:00"
  category: ActivityCategory;
  location?: string;
  coordinates?: {
    lat: number;
    lon: number;
  };
  cost?: number;
  notes?: string;
  completed: boolean;
  orderIndex: number;
}

export interface Expense {
  id: string;
  dayId?: string; // Optional: can be associated with a specific day or general trip expense
  description: string;
  amount: number;
  currency: string;
  category: ExpenseCategory;
  date: string;
  notes?: string;
}

export interface ItineraryDay {
  id: string;
  dayNumber: number;
  date: string; // YYYY-MM-DD
  title?: string;
  notes?: string;
  activities: Activity[];
  expenses: Expense[];
}

export interface Trip {
  id: string;
  name: string;
  destination: string;
  destinationId?: string;
  coordinates?: {
    lat: number;
    lon: number;
  };
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  travelers: Traveler[];
  budget: number;
  currency: string;
  coverImage?: string;
  days: ItineraryDay[];
  createdAt: string;
  updatedAt: string;
}

export type PlaceCategory = 'destination' | 'attraction' | 'restaurant' | 'hotel' | 'cafe';

export interface SavedBoard {
  id: string;
  name: string;
  color?: string;
  icon?: string;
  description?: string;
}

export interface SavedPlace {
  id: string;
  name: string;
  category: PlaceCategory;
  cityName: string;
  country?: string;
  description?: string;
  rating?: number;
  reviewCount?: string;
  tag?: string;
  highlight?: string;
  boardId?: string;
  imageUrl?: string;
  coordinates?: {
    lat: number;
    lon: number;
  };
  savedAt: string;
}

