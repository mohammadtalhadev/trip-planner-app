import { UserProfile } from '../store/useUserStore';

export interface TravelPreferencesData {
  pace: 'relaxed' | 'balanced' | 'packed';
  vibes: string[];
  currency: string;
  distanceMetric: 'km' | 'mi';
}

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  avatar: string;
  tier: string;
  createdAt: string;
  preferences?: TravelPreferencesData;
}

const USERS_STORAGE_KEY = 'tp_users_db';

/**
 * Computes a secure SHA-256 hash using the native browser Web Crypto API.
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Initializes and retrieves the registered user database from localStorage.
 * Automatically seeds the requested admin account (admin@tripplanner.com / Admin@321) if absent.
 */
export async function getStoredUsers(): Promise<StoredUser[]> {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (raw) {
      const users: StoredUser[] = JSON.parse(raw);
      if (Array.isArray(users) && users.length > 0) {
        return users;
      }
    }
  } catch (err) {
    console.warn('Failed to parse users database from localStorage, reinitializing seed:', err);
  }

  // Pre-seed default Admin user
  const adminPasswordHash = await hashPassword('Admin@321');
  const defaultAdmin: StoredUser = {
    id: 'usr-admin',
    name: 'Trip Planner Admin',
    email: 'admin@tripplanner.com',
    passwordHash: adminPasswordHash,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    tier: 'Administrator & Lead Explorer',
    createdAt: new Date().toISOString(),
    preferences: {
      pace: 'balanced',
      vibes: ['Michelin & Street Food', 'Historic Temples', 'Design & Architecture'],
      currency: 'USD',
      distanceMetric: 'km',
    },
  };

  const initialList = [defaultAdmin];
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialList));
  return initialList;
}

/**
 * Saves the user list back to localStorage.
 */
function saveStoredUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

/**
 * Registers a new user with hashed password and saves into localStorage.
 */
export async function registerUser(params: {
  name: string;
  email: string;
  password: string;
  preferences?: TravelPreferencesData;
  avatar?: string;
}): Promise<UserProfile> {
  const users = await getStoredUsers();
  const cleanEmail = params.email.trim().toLowerCase();

  // Check uniqueness
  const exists = users.some((u) => u.email.toLowerCase() === cleanEmail);
  if (exists) {
    throw new Error('An account with this email address already exists. Please sign in instead.');
  }

  const passwordHash = await hashPassword(params.password);
  const newUser: StoredUser = {
    id: `usr-${Date.now()}`,
    name: params.name.trim(),
    email: cleanEmail,
    passwordHash,
    avatar:
      params.avatar ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    tier: 'Curator & Explorer',
    createdAt: new Date().toISOString(),
    preferences: params.preferences,
  };

  users.push(newUser);
  saveStoredUsers(users);

  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    avatar: newUser.avatar,
    tier: newUser.tier,
    isLoggedIn: true,
  };
}

/**
 * Authenticates user against localStorage database using SHA-256.
 */
export async function authenticateUser(
  email: string,
  password: string
): Promise<{ user: UserProfile; preferences?: TravelPreferencesData }> {
  const users = await getStoredUsers();
  const cleanEmail = email.trim().toLowerCase();
  const passwordHash = await hashPassword(password);

  const matchedUser = users.find(
    (u) => u.email.toLowerCase() === cleanEmail && u.passwordHash === passwordHash
  );

  if (!matchedUser) {
    throw new Error('Invalid email or password. Please verify your credentials and try again.');
  }

  return {
    user: {
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email,
      avatar: matchedUser.avatar,
      tier: matchedUser.tier,
      isLoggedIn: true,
    },
    preferences: matchedUser.preferences,
  };
}
