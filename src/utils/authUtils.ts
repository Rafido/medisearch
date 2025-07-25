// Authentication utilities for secure session management

export interface AuthUser {
  username: string;
  role: string;
  loginTime: string;
}

export const checkAuthStatus = (): boolean => {
  try {
    const authToken = localStorage.getItem('authToken');
    const authExpiry = localStorage.getItem('authExpiry');
    const authUser = localStorage.getItem('authUser');

    // Check if all required auth data exists
    if (!authToken || !authExpiry || !authUser) {
      clearAuthData();
      return false;
    }

    // Check if session has expired
    const expiryTime = parseInt(authExpiry, 10);
    const currentTime = Date.now();
    
    if (currentTime > expiryTime) {
      clearAuthData();
      return false;
    }

    // Validate token structure (basic check)
    try {
      const decodedToken = atob(authToken);
      if (!decodedToken.includes('-') || decodedToken.length < 20) {
        clearAuthData();
        return false;
      }
    } catch (error) {
      clearAuthData();
      return false;
    }

    return true;
  } catch (error) {
    console.error('Auth check failed:', error);
    clearAuthData();
    return false;
  }
};

export const getAuthUser = (): AuthUser | null => {
  try {
    if (!checkAuthStatus()) {
      return null;
    }

    const authUserData = localStorage.getItem('authUser');
    if (!authUserData) {
      return null;
    }

    return JSON.parse(authUserData);
  } catch (error) {
    console.error('Failed to get auth user:', error);
    clearAuthData();
    return null;
  }
};

export const clearAuthData = (): void => {
  try {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    localStorage.removeItem('authExpiry');
  } catch (error) {
    console.error('Failed to clear auth data:', error);
  }
};

export const logout = (): void => {
  clearAuthData();
  // Force page reload to ensure clean state
  window.location.href = '/';
};

export const refreshAuthSession = (): boolean => {
  try {
    if (!checkAuthStatus()) {
      return false;
    }

    // Extend session by another 24 hours
    const newExpiry = Date.now() + (24 * 60 * 60 * 1000);
    localStorage.setItem('authExpiry', newExpiry.toString());
    
    return true;
  } catch (error) {
    console.error('Failed to refresh auth session:', error);
    clearAuthData();
    return false;
  }
};

// Check if user is admin
export const isAdmin = (): boolean => {
  const user = getAuthUser();
  return user?.role === 'administrator';
};

// Get remaining session time in minutes
export const getRemainingSessionTime = (): number => {
  try {
    const authExpiry = localStorage.getItem('authExpiry');
    if (!authExpiry) return 0;

    const expiryTime = parseInt(authExpiry, 10);
    const currentTime = Date.now();
    const remainingTime = expiryTime - currentTime;

    return Math.max(0, Math.floor(remainingTime / (1000 * 60))); // Convert to minutes
  } catch (error) {
    return 0;
  }
};
