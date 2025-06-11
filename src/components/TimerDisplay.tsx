
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
    <div className="relative flex flex-col items-center justify-center my-4 w-full max-w-[192px] h-48 mx-auto">
      <div className="absolute inset-0 flex items-center justify-center">
        {renderVisualGraphic()}
      </div>
      <div
        className="relative text-5xl font-mono font-bold text-foreground z-10"
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
