/**
 * Helper to identify the active user ID for scoped localStorage keys.
 * Ensures stores can initialize with the correct user data synchronously on page load.
 */
export function getInitialActiveUserId(): string {
  try {
    const raw =
      localStorage.getItem('trip-planner-user-profile') ||
      localStorage.getItem('trip-planner-user');
    if (raw) {
      const parsed = JSON.parse(raw);
      const user = parsed.state?.user || parsed.user;
      if (user && user.isLoggedIn && user.id) {
        return user.id;
      }
      if (user && !user.isLoggedIn) {
        return 'guest';
      }
    }
  } catch (err) {
    console.warn('Error reading active user ID from localStorage:', err);
  }
  return 'guest';
}
