
"use client";

import type { FC, ChangeEvent, KeyboardEvent } from 'react';
import { useState, useEffect, useRef } from 'react';
import PillsProgressGraphic from './PillsProgressGraphic';
import { Input } from '@/components/ui/input'; // For editable time
import { cn } from '@/lib/utils';


interface TimerDisplayProps {
  timeLeft: number; // in seconds
  maxPillDuration: number; 
  onSetDuration: (newDurationInSeconds: number) => void; 
  isRunning: boolean; 
}

const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const TimerDisplay: FC<TimerDisplayProps> = ({ 
  timeLeft, 
  maxPillDuration,
  onSetDuration,
  isRunning 
}) => {
  const [inputValue, setInputValue] = useState(formatTime(timeLeft));
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditing) {
      setInputValue(formatTime(timeLeft));
    }
  }, [timeLeft, isEditing]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleTimeClick = () => {
    if (!isRunning) {
      setIsEditing(true);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const parseAndSetTime = () => {
    const parts = inputValue.split(':');
    let newTotalSeconds = timeLeft; // Default to current if parse fails

    if (parts.length === 2) {
      const minutes = parseInt(parts[0], 10);
      const seconds = parseInt(parts[1], 10);
      if (!isNaN(minutes) && !isNaN(seconds) && minutes >= 0 && seconds >= 0 && seconds < 60) {
        newTotalSeconds = minutes * 60 + seconds;
      }
    }
    
    // Clamp newTotalSeconds (min 1 sec, max maxPillDuration or a hardcoded max like 120 min)
    // For now, using maxPillDuration as the practical upper limit from pills.
    // A very small duration (e.g., 0 seconds) might not be desirable for starting.
    const minAllowedSeconds = 1; 
    const clampedSeconds = Math.max(minAllowedSeconds, Math.min(newTotalSeconds, maxPillDuration));
    
    onSetDuration(clampedSeconds);
    setInputValue(formatTime(clampedSeconds)); // Reflect clamped value
    setIsEditing(false);
  };

  const handleInputBlur = () => {
    parseAndSetTime();
  };

  const handleInputKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      parseAndSetTime();
    } else if (e.key === 'Escape') {
      setInputValue(formatTime(timeLeft)); // Revert on escape
      setIsEditing(false);
    }
  };

  return (
    <div className="flex flex-col items-center my-4 w-full mx-auto">
      <div className="flex items-center justify-center w-full">
        <PillsProgressGraphic 
          timeLeft={timeLeft} 
          maxPillDuration={maxPillDuration}
          onSetTimerDuration={onSetDuration} // Pills also use the same callback
          isRunning={isRunning}
        />
      </div>
      <div
        className="text-5xl font-mono font-bold text-foreground mt-4 h-14 flex items-center justify-center" // Added h-14 for consistent height
        role="timer"
        aria-live="polite"
        aria-atomic="true"
        onClick={handleTimeClick}
      >
        {isEditing && !isRunning ? (
          <Input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyPress} // Changed from onKeyPress to onKeyDown for Escape
            className="w-40 h-full text-5xl font-mono font-bold text-center bg-transparent border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
            maxLength={5} // MM:SS
          />
        ) : (
          <span>{formatTime(timeLeft)}</span>
        )}
      </div>
    </div>
  );
};

export default TimerDisplay;

