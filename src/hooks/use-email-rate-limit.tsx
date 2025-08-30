import { useState, useEffect, useCallback } from 'react';

interface EmailRateLimitConfig {
  cooldownSeconds?: number;
  storageKey: string;
}

interface EmailRateLimitReturn {
  canSend: boolean;
  timeRemaining: number;
  isOnCooldown: boolean;
  startCooldown: () => void;
  resetCooldown: () => void;
  formatTime: (seconds: number) => string;
}

/**
 * Custom hook for email rate limiting with persistent storage
 * Prevents spam by enforcing a cooldown period between email sends
 */
export const useEmailRateLimit = ({ 
  cooldownSeconds = 60, 
  storageKey 
}: EmailRateLimitConfig): EmailRateLimitReturn => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isOnCooldown, setIsOnCooldown] = useState(false);

  // Check if we're on cooldown when component mounts
  useEffect(() => {
    checkCooldownStatus();
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            setIsOnCooldown(false);
            localStorage.removeItem(storageKey);
            return 0;
          }
          return newTime;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining, storageKey]);

  const checkCooldownStatus = useCallback(() => {
    const lastSentTime = localStorage.getItem(storageKey);
    if (lastSentTime) {
      const timeDiff = Math.floor((Date.now() - parseInt(lastSentTime)) / 1000);
      const remaining = cooldownSeconds - timeDiff;
      
      if (remaining > 0) {
        setTimeRemaining(remaining);
        setIsOnCooldown(true);
      } else {
        // Cooldown expired, clean up
        localStorage.removeItem(storageKey);
        setTimeRemaining(0);
        setIsOnCooldown(false);
      }
    }
  }, [cooldownSeconds, storageKey]);

  const startCooldown = useCallback(() => {
    const currentTime = Date.now().toString();
    localStorage.setItem(storageKey, currentTime);
    setTimeRemaining(cooldownSeconds);
    setIsOnCooldown(true);
  }, [cooldownSeconds, storageKey]);

  const resetCooldown = useCallback(() => {
    localStorage.removeItem(storageKey);
    setTimeRemaining(0);
    setIsOnCooldown(false);
  }, [storageKey]);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const canSend = !isOnCooldown && timeRemaining === 0;

  return {
    canSend,
    timeRemaining,
    isOnCooldown,
    startCooldown,
    resetCooldown,
    formatTime,
  };
}; 