
"use client";

import type { FC } from 'react';
import type { FocusGlowSettings } from '@/types';
import CircularProgressGraphic from './CircularProgressGraphic';
import DotMatrixClockGraphic from './DotMatrixClockGraphic';


interface TimerDisplayProps {
  timeLeft: number; // in seconds
  totalDuration: number; // in seconds, the initial duration for the current timer session
  settings: FocusGlowSettings;
}

const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const TimerDisplay: FC<TimerDisplayProps> = ({ timeLeft, totalDuration, settings }) => {
  return (
    <div className="relative flex flex-col items-center justify-center my-4 w-48 h-48 mx-auto">
      {settings.timerVisualStyle === 'circular' ? (
        <CircularProgressGraphic timeLeft={timeLeft} totalDuration={totalDuration} />
      ) : (
        <DotMatrixClockGraphic />
      )}
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
