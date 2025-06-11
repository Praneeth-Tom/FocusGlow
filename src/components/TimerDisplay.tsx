
"use client";

import type { FC } from 'react';

interface TimerDisplayProps {
  timeLeft: number; // in seconds
  totalDuration: number; // in seconds, the initial duration for the current timer session
}

const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const TimerDisplay: FC<TimerDisplayProps> = ({ timeLeft, totalDuration }) => {
  const radius = 70;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  // Ensure totalDuration is not zero to avoid division by zero
  const progress = totalDuration > 0 ? (totalDuration - timeLeft) / totalDuration : 0;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center my-4 w-48 h-48 mx-auto">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        <circle
          stroke="hsl(var(--muted))" // Background circle color from theme
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="hsl(var(--primary))" // Progress circle color from theme
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="transition-all duration-300 ease-linear"
        />
      </svg>
      <div 
        className="absolute text-5xl font-mono font-bold text-foreground" // Reduced text size a bit
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
