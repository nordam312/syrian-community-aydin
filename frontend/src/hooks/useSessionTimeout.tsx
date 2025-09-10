import { useEffect, useRef, useCallback } from 'react';
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface UseSessionTimeoutOptions {
  timeoutDuration?: number; // in milliseconds
  warningDuration?: number; // warning before timeout in milliseconds
  onTimeout?: () => void;
  onWarning?: () => void;
}

export const useSessionTimeout = ({
  timeoutDuration = 30 * 60 * 1000, // 30 minutes default
  warningDuration = 5 * 60 * 1000, // 5 minutes warning
  onTimeout,
  onWarning,
}: UseSessionTimeoutOptions = {}) => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const hasShownWarning = useRef<boolean>(false);

  const handleLogout = useCallback(async () => {
    if (onTimeout) {
      onTimeout();
    } else {
      toast.error('جلستك انتهت. يرجى تسجيل الدخول مرة أخرى');
      await logout();
      navigate('/auth');
    }
  }, [logout, navigate, onTimeout]);

  const showWarning = useCallback(() => {
    if (!hasShownWarning.current) {
      hasShownWarning.current = true;
      if (onWarning) {
        onWarning();
      } else {
        toast.warning(`جلستك ستنتهي خلال ${warningDuration / 60000} دقائق`);
      }
    }
  }, [warningDuration, onWarning]);

  const resetTimeout = useCallback(() => {
    // Clear existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningRef.current) {
      clearTimeout(warningRef.current);
    }

    hasShownWarning.current = false;
    lastActivityRef.current = Date.now();

    if (!isAuthenticated) return;

    // Set warning timeout
    warningRef.current = setTimeout(() => {
      showWarning();
    }, timeoutDuration - warningDuration);

    // Set session timeout
    timeoutRef.current = setTimeout(() => {
      handleLogout();
    }, timeoutDuration);
  }, [isAuthenticated, timeoutDuration, warningDuration, showWarning, handleLogout]);

  const handleActivity = useCallback(() => {
    const now = Date.now();
    const timeSinceLastActivity = now - lastActivityRef.current;
    
    // Only reset if it's been more than 1 minute since last activity
    // This prevents excessive timer resets
    if (timeSinceLastActivity > 60000) {
      resetTimeout();
    }
  }, [resetTimeout]);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Activity events to track
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ];

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    // Initial timeout setup
    resetTimeout();

    // Cleanup
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningRef.current) {
        clearTimeout(warningRef.current);
      }
    };
  }, [isAuthenticated, handleActivity, resetTimeout]);

  return {
    resetTimeout,
    extendSession: resetTimeout,
  };
};

// Session timeout provider component
export const SessionTimeoutProvider = ({ children }: { children: React.ReactNode }) => {
  useSessionTimeout({
    timeoutDuration: 30 * 60 * 1000, // 30 minutes
    warningDuration: 5 * 60 * 1000, // 5 minutes warning
  });

  return <>{children}</>;
};