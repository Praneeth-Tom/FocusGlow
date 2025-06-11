
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

  // Define gradient colors. These are variations of the theme's primary blue.
  const darkBlueColor = "hsl(216, 89%, 40%)";   // A darker shade of blue
  const lightBlueColor = "hsl(216, 89%, 76%)";  // Matches --primary HSL value (e.g., #89B4FA)

  return (
    <div className="relative flex flex-col items-center justify-center my-4 w-48 h-48 mx-auto">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90" // Rotates the coordinate system, so 0 angle is at 12 o'clock
      >
        <defs>
          {/*
            A true conic/angular gradient that sweeps with the stroke path is complex in pure SVG 1.1.
            This linear gradient provides a color transition across the circle.
            Defined as top-to-bottom (y1="0%" to y2="100%"), due to the SVG's -90deg rotation,
            this gradient effectively becomes horizontal (darkBlue on the "left" side of the
            original orientation, lightBlue on the "right" side).
            This means the 9 o'clock position will be darker, and 3 o'clock lighter.
          */}
          <linearGradient id="timerStrokeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={darkBlueColor} />
            <stop offset="100%" stopColor={lightBlueColor} />
          </linearGradient>
        </defs>
        {/* Background circle (track) */}
        <circle
          stroke="hsl(var(--muted))" // Background circle color from theme
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Progress circle */}
        <circle
          stroke="url(#timerStrokeGradient)" // Apply the defined gradient
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round" // For the rounded cap at the end of the stroke
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="transition-all duration-300 ease-linear" // For smooth animation of strokeDashoffset
        />
      </svg>
      <div
        className="absolute text-5xl font-mono font-bold text-foreground"
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
