
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import type { FocusGlowSettings } from '@/types';

interface UseTimerProps {
  initialDurationInSeconds: number;
  settings: FocusGlowSettings;
  onTimerEnd?: () => void;
}

export function useTimer({ initialDurationInSeconds, settings, onTimerEnd }: UseTimerProps) {
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
            
            if (onTimerEnd) {
              setTimeout(onTimerEnd, 0); // Defer the call
            }

            if (settings.autoRestartTimer) {
              // Reset and start again
              setTimeLeft(initialDurationInSeconds); // This will be handled by returning initialDurationInSeconds
              if (settings.autoStartTimer || settings.autoRestartTimer) { // autoRestart implies autoStart for the next cycle
                 setIsRunning(true);
                 setIsPaused(false);
              }
              return initialDurationInSeconds; // for the immediate next tick
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
  }, [isRunning, isPaused, settings, initialDurationInSeconds, onTimerEnd, clearTimerInterval]);

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
    setTimeLeft, // Allow external set for presets
  };
}

