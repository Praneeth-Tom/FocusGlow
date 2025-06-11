
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import type { FocusGlowSettings } from '@/types';

interface UseTimerProps {
  initialDurationInSeconds: number;
  settings: FocusGlowSettings;
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
    if (settings.autoStartTimer && initialDurationInSeconds > 0) {
      setIsRunning(true);
      setIsPaused(false);
    } else {
      setIsRunning(false);
      setIsPaused(false);
    }
  // Auto-start should only re-trigger if initialDuration or autoStartTimer setting changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialDurationInSeconds, settings.autoStartTimer]);


  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearTimerInterval();
            setIsRunning(false);
            
            if (onSessionComplete) {
                // initialDurationInSeconds is the original length of this completed session
                onSessionComplete(Math.floor(initialDurationInSeconds / 60));
            }
            
            if (onTimerEnd) {
              setTimeout(onTimerEnd, 0); // Defer the call
            }

            if (settings.autoRestartTimer) {
              setTimeLeft(initialDurationInSeconds); 
              if (settings.autoStartTimer || settings.autoRestartTimer) { 
                 setIsRunning(true);
                 setIsPaused(false);
              }
              return initialDurationInSeconds; 
            } else if (settings.loopTimer) {
                setIsRunning(true);
                setIsPaused(false);
                return initialDurationInSeconds;
            }
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
  }, [isRunning, isPaused, settings.autoRestartTimer, settings.loopTimer, initialDurationInSeconds, onTimerEnd, clearTimerInterval, onSessionComplete]);
  // Added onSessionComplete and related settings to dependency array as they influence behavior.

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
    if (settings.autoStartTimer && durationToSet > 0) {
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
  }, [clearTimerInterval, initialDurationInSeconds, settings.autoStartTimer]);

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
