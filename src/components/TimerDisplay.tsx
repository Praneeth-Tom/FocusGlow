
"use client";

import type { FC } from 'react';

interface TimerDisplayProps {
  timeLeft: number; // in seconds
}

const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const TimerDisplay: FC<TimerDisplayProps> = ({ timeLeft }) => {
  return (
    <div className="flex flex-col items-center justify-center my-4">
      <div 
        className="text-7xl font-mono font-bold text-foreground"
        aria-live="polite" 
        aria-atomic="true"
        role="timer"
      >
        {formatTime(timeLeft)}
      </div>
    </div>
  );
};

export default TimerDisplay;
