
"use client";

import type { FC } from 'react';
// FocusGlowSettings import removed as settings prop is removed
// CircularProgressGraphic import removed
import PillsProgressGraphic from './PillsProgressGraphic';


interface TimerDisplayProps {
  timeLeft: number; // in seconds
  // totalDuration prop is no longer used by PillsProgressGraphic in the same way, but timeLeft covers current display
  // settings prop removed
  maxPillDuration: number; // Keep this for PillsProgressGraphic
  onSetPillDuration: (newDurationInSeconds: number) => void; // Keep this
  isRunning: boolean; // Keep this
}

const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const TimerDisplay: FC<TimerDisplayProps> = ({ 
  timeLeft, 
  // totalDuration, // This was mainly for Circular, Pills uses timeLeft/maxPillDuration
  // settings, // Removed
  maxPillDuration,
  onSetPillDuration,
  isRunning 
}) => {
  // renderVisualGraphic simplified to always return PillsProgressGraphic
  const renderVisualGraphic = () => {
    return (
      <PillsProgressGraphic 
        timeLeft={timeLeft} 
        maxPillDuration={maxPillDuration}
        onSetTimerDuration={onSetPillDuration}
        isRunning={isRunning}
      />
    );
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
