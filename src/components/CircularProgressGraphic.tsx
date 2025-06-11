
"use client";

import type { FC } from 'react';

interface CircularProgressGraphicProps {
  timeLeft: number; // in seconds
  totalDuration: number; // in seconds, the initial duration for the current timer session
}

const CircularProgressGraphic: FC<CircularProgressGraphicProps> = ({ timeLeft, totalDuration }) => {
  // Define radii and dimensions
  const progressCircleActualRadius = 66; // Radius of the progress circle path itself
  const progressStrokeWidth = 8;
  const tickLength = 4;
  const gapAfterProgress = 2;

  // Calculate outer extents for SVG canvas sizing
  const tickOuterR = progressCircleActualRadius + progressStrokeWidth / 2 + gapAfterProgress + tickLength;
  const canvasSize = tickOuterR * 2;
  const center = tickOuterR; // Center coordinate for all drawing within the SVG

  // Progress circle calculations
  const circumference = progressCircleActualRadius * 2 * Math.PI;
  const progress = totalDuration > 0 ? (totalDuration - timeLeft) / totalDuration : 0;
  const strokeDashoffset = circumference - progress * circumference;

  // Define gradient colors
  const darkBlueColor = "hsl(216, 89%, 40%)"; // A fixed darker blue
  const lightBlueColor = "hsl(var(--primary))"; // Use primary theme color for the lighter end

  // Calculate Ticks
  const numTicks = 60;
  const tickInnerR = progressCircleActualRadius + progressStrokeWidth / 2 + gapAfterProgress;

  const ticks = [];
  for (let i = 0; i < numTicks; i++) {
    const angle = (i / numTicks) * 2 * Math.PI; // Angle for each tick, 0 is to the right
    const x1 = center + tickInnerR * Math.cos(angle);
    const y1 = center + tickInnerR * Math.sin(angle);
    const x2 = center + tickOuterR * Math.cos(angle);
    const y2 = center + tickOuterR * Math.sin(angle);
    ticks.push(
      <line
        key={`tick-${i}`}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="hsl(var(--muted))"
        strokeWidth="1"
      />
    );
  }

  return (
    <svg
      height={canvasSize}
      width={canvasSize}
      className="transform -rotate-90" // Rotates the coordinate system, so 0 angle is at 12 o'clock
      viewBox={`0 0 ${canvasSize} ${canvasSize}`} // Ensure viewBox is set
    >
      <defs>
        <linearGradient id="timerStrokeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={darkBlueColor} />
          <stop offset="100%" stopColor={lightBlueColor} />
        </linearGradient>
      </defs>
      
      <g>{ticks}</g>

      <circle
        stroke="hsl(var(--muted))"
        fill="transparent"
        strokeWidth={progressStrokeWidth}
        r={progressCircleActualRadius}
        cx={center}
        cy={center}
      />
      <circle
        stroke="url(#timerStrokeGradient)"
        fill="transparent"
        strokeWidth={progressStrokeWidth}
        strokeDasharray={circumference + ' ' + circumference}
        style={{ strokeDashoffset }}
        strokeLinecap="round"
        r={progressCircleActualRadius}
        cx={center}
        cy={center}
        className="transition-all duration-300 ease-linear"
      />
    </svg>
  );
};

export default CircularProgressGraphic;
