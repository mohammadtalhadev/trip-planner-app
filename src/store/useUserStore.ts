import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  tier: string;
  isLoggedIn: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'alert' | 'update' | 'deal';
}

interface UserState {
  user: UserProfile;
  notifications: NotificationItem[];
  login: () => void;
  logout: () => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr-4412',
  name: 'Sophia Vance',
  email: 'sophia.vance@tripplanner.io',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  tier: 'Pro Traveler',
  isLoggedIn: true,
};

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Flight Price Drop',
    message: 'Flights to Tokyo, Japan are down 18% for your target dates.',
    time: '10m ago',
    read: false,
    type: 'deal',
  },
  {
    id: 'notif-2',
    title: 'Itinerary Updated',
    message: 'Day 2 activities for your Istanbul vacation have been synced.',
    time: '2h ago',
    read: false,
    type: 'update',
  },
  {
    id: 'notif-3',
    title: 'Weather Advisory',
    message: 'Sunny skies (24°C) forecast for Rome throughout next week.',
    time: '1d ago',
    read: true,
    type: 'alert',
  },
];

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: DEFAULT_USER,
      notifications: DEFAULT_NOTIFICATIONS,

      login: () => {
        set((state) => ({
          user: { ...state.user, isLoggedIn: true },
        }));
      },

      logout: () => {
        set((state) => ({
          user: { ...state.user, isLoggedIn: false },
        }));
      },

      markAllNotificationsAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }));
      },

      clearNotifications: () => {
        set({ notifications: [] });
      },
    }),
    {
      name: 'trip-planner-user-profile',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
