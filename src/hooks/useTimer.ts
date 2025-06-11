
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import type { FocusGlowSettings } from '@/types'; // Settings type will be smaller

interface UseTimerProps {
  initialDurationInSeconds: number;
  settings: FocusGlowSettings; // Still pass settings for other potential uses like notificationSound etc.
  onTimerEnd?: () => void;
  onSessionComplete?: (focusedMinutes: number) => void; // For recording focus time
}

export function useTimer({ initialDurationInSeconds, settings, onTimerEnd, onSessionComplete }: UseTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialDurationInSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimerInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    setTimeLeft(initialDurationInSeconds);
    // Timer no longer auto-starts based on a setting
    setIsRunning(false);
    setIsPaused(false);
  }, [initialDurationInSeconds]);


  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearTimerInterval();
            setIsRunning(false);
            
            if (onSessionComplete) {
                onSessionComplete(Math.floor(initialDurationInSeconds / 60));
            }
            
            if (onTimerEnd) {
              setTimeout(onTimerEnd, 0); 
            }

            // Auto-restart and loop logic removed
            // if (settings.autoRestartTimer) { ... }
            // else if (settings.loopTimer) { ... }
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearTimerInterval();
    }
    return clearTimerInterval;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, isPaused, initialDurationInSeconds, onTimerEnd, clearTimerInterval, onSessionComplete, settings.notifyOnCompletion, settings.enableSoundAlert]);
  // settings.autoRestartTimer and settings.loopTimer removed from dependencies

  const startTimer = useCallback(() => {
    if (timeLeft > 0) {
      setIsRunning(true);
      setIsPaused(false);
    }
  }, [timeLeft]);

  const pauseTimer = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resumeTimer = useCallback(() => {
    if (timeLeft > 0) {
      setIsPaused(false);
    }
  }, [timeLeft]);

  const resetTimer = useCallback((newDurationInSeconds?: number) => {
    clearTimerInterval();
    const durationToSet = newDurationInSeconds ?? initialDurationInSeconds;
    setTimeLeft(durationToSet);
    setIsPaused(false);
    // Timer no longer auto-starts on reset
    setIsRunning(false);
  }, [clearTimerInterval, initialDurationInSeconds]);

  return {
    timeLeft,
    isRunning,
    isPaused,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    setTimeLeft, 
  };
}
