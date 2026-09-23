import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  tier: string;
  isLoggedIn: boolean;
  password?: string;
  bio?: string;
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
  setUser: (user: UserProfile) => void;
  login: () => void;
  logout: () => void;
  updateProfile: (updates: Partial<Pick<UserProfile, 'name' | 'email' | 'avatar' | 'bio'>>) => void;
  updatePassword: (
    currentPassword: string,
    newPassword: string
  ) => { success: boolean; error?: string };
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr-admin',
  name: 'Trip Planner Admin',
  email: 'admin@tripplanner.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  tier: 'Administrator & Lead Explorer',
  isLoggedIn: true,
  password: 'Admin@321',
  bio: 'Platform Administrator & Lead Explorer at Trip Planner.',
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
    (set, get) => ({
      user: DEFAULT_USER,
      notifications: DEFAULT_NOTIFICATIONS,

      setUser: (user) => set({ user }),

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

      updateProfile: (updates) => {
        set((state) => ({
          user: {
            ...state.user,
            ...updates,
          },
        }));
      },

      updatePassword: (currentPassword: string, newPassword: string) => {
        const state = get();
        // If a password already exists, require it to match
        if (state.user.password && state.user.password.trim() !== '') {
          if (state.user.password !== currentPassword) {
            return {
              success: false,
              error: 'Current password does not match. Please verify and try again.',
            };
          }
        }

        if (newPassword.length < 6) {
          return {
            success: false,
            error: 'New password must contain at least 6 characters.',
          };
        }

        set({
          user: {
            ...state.user,
            password: newPassword,
          },
        });

        return { success: true };
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
