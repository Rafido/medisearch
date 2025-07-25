import { useEffect, useCallback } from 'react';
import { AUTH_STORAGE } from '../utils/auth';

interface UseSessionOptions {
  onSessionExpired: () => void;
  warningTime?: number; // Show warning before expiration (in minutes)
  enabled?: boolean; // Control whether hook is active
}

export const useSession = ({ onSessionExpired, warningTime = 5, enabled = true }: UseSessionOptions) => {
  // Check session validity
  const checkSession = useCallback(() => {
    if (!enabled) return true;
    
    const authData = AUTH_STORAGE.getAuthData();
    
    if (!authData) {
      onSessionExpired();
      return false;
    }

    // Check if session is about to expire
    const now = Date.now();
    const timeLeft = (authData.timestamp + authData.expiresIn) - now;
    const warningTimeMs = warningTime * 60 * 1000;

    if (timeLeft <= 0) {
      onSessionExpired();
      return false;
    }

    if (timeLeft <= warningTimeMs && timeLeft > 0) {
      // Show warning (you can implement a toast notification here)
      console.warn(`Session will expire in ${Math.ceil(timeLeft / (60 * 1000))} minutes`);
    }

    return true;
  }, [onSessionExpired, warningTime, enabled]);

  // Check session on mount and set up interval
  useEffect(() => {
    if (!enabled) return;

    // Initial check
    checkSession();

    // Check every minute
    const interval = setInterval(checkSession, 60 * 1000);

    return () => clearInterval(interval);
  }, [checkSession, enabled]);

  // Extend session on user activity
  const extendSession = useCallback(() => {
    if (!enabled) return;
    
    const authData = AUTH_STORAGE.getAuthData();
    if (authData && authData.isAuthenticated) {
      AUTH_STORAGE.setAuthData(true, authData.user);
    }
  }, [enabled]);

  // Set up activity listeners
  useEffect(() => {
    if (!enabled) return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    let lastActivity = Date.now();
    
    const handleActivity = () => {
      const now = Date.now();
      // Only extend session if more than 5 minutes have passed since last extension
      if (now - lastActivity > 5 * 60 * 1000) {
        lastActivity = now;
        extendSession();
      }
    };

    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [extendSession, enabled]);

  return { checkSession, extendSession };
};
