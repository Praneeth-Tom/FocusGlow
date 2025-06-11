
"use client";

import type { FC } from 'react';
import type { FocusGlowSettings } from '@/types';
import CircularProgressGraphic from './CircularProgressGraphic';
import DotMatrixClockGraphic from './DotMatrixClockGraphic';
import PillsProgressGraphic from './PillsProgressGraphic';


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
  const renderVisualGraphic = () => {
    switch (settings.timerVisualStyle) {
      case 'circular':
        return <CircularProgressGraphic timeLeft={timeLeft} totalDuration={totalDuration} />;
      case 'dotMatrix':
        return <DotMatrixClockGraphic />;
      case 'pills':
        return <PillsProgressGraphic timeLeft={timeLeft} totalDuration={totalDuration} />;
      default:
        return <CircularProgressGraphic timeLeft={timeLeft} totalDuration={totalDuration} />;
    }
  };

  return (
    <div className="flex flex-col items-center my-4 w-full mx-auto">
      <div className="flex items-center justify-center w-full">
        {renderVisualGraphic()}
      </div>
      <div
        className="text-5xl font-mono font-bold text-foreground mt-4"
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
