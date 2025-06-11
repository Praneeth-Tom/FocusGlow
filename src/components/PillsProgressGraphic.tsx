
"use client";

import type { FC } from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface PillsProgressGraphicProps {
  timeLeft: number; // in seconds, current time remaining or selected time if not running
  maxPillDuration: number; // in seconds, e.g., 120 minutes * 60
  onSetTimerDuration: (newDurationInSeconds: number) => void;
  isRunning: boolean;
}

const NUM_SEGMENTS = 10; // Number of pill segments to display visually

const PillsProgressGraphic: FC<PillsProgressGraphicProps> = ({
  timeLeft,
  maxPillDuration,
  onSetTimerDuration,
  isRunning,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const pillsContainerRef = useRef<HTMLDivElement>(null);

  // Calculate how many pills should be lit based on timeLeft relative to maxPillDuration
  const activeSegmentsCount = maxPillDuration > 0
    ? Math.max(0, Math.min(NUM_SEGMENTS, Math.round((timeLeft / maxPillDuration) * NUM_SEGMENTS)))
    : 0;

  const handleInteraction = useCallback((
    event: MouseEvent | TouchEvent 
  ) => {
    if (isRunning || !pillsContainerRef.current) return;

    const container = pillsContainerRef.current;
    const rect = container.getBoundingClientRect();
    
    let clientX: number;
    if (event instanceof TouchEvent) {
        // Use touches for touchstart/touchmove, changedTouches for touchend
        const touch = event.touches[0] || event.changedTouches[0];
        clientX = touch.clientX;
    } else { // MouseEvent
        clientX = event.clientX;
    }

    const x = clientX - rect.left; // x position within the container
    const containerWidth = container.offsetWidth;
    
    // Calculate the proportion of the container width that was clicked/dragged over
    let proportion = x / containerWidth;
    proportion = Math.max(0, Math.min(1, proportion)); // Clamp between 0 and 1
    
    // Calculate the duration in minutes based on this proportion
    const maxPillMinutes = maxPillDuration / 60;
    let selectedMinutes = Math.round(proportion * maxPillMinutes);
    
    // Enforce 1 to maxPillMinutes (e.g., 120 minutes) range
    selectedMinutes = Math.max(1, Math.min(selectedMinutes, maxPillMinutes));
        
    const newDurationInSeconds = selectedMinutes * 60;
    
    // Call onSetTimerDuration to update the app's state, providing live feedback
    onSetTimerDuration(newDurationInSeconds);

  }, [isRunning, maxPillDuration, onSetTimerDuration]);


  const handleDragStart = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (isRunning) return;
    
    // Prevent text selection during mouse drag
    if (event.nativeEvent instanceof MouseEvent) {
        event.preventDefault();
    }
    // For touch events, preventDefault on touchmove might be needed for scroll prevention,
    // handled via passive:false on the event listener if required.

    setIsDragging(true);
    handleInteraction(event.nativeEvent as MouseEvent | TouchEvent); 
  };

  useEffect(() => {
    const handleMove = (event: MouseEvent | TouchEvent) => {
      if (isDragging && !isRunning) {
         // For touchmove, prevent scrolling if drag is primarily horizontal
        if (event instanceof TouchEvent) {
          // A more sophisticated check might be needed here if default scroll behavior is an issue
          // event.preventDefault(); // Uncomment if scrolling needs to be disabled during drag
        }
        handleInteraction(event);
      }
    };

    const handleEnd = (event: MouseEvent | TouchEvent) => {
      if (isDragging && !isRunning) {
        setIsDragging(false);
        handleInteraction(event); // Final update on release
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('touchmove', handleMove, { passive: true }); // Set passive: true if not calling preventDefault
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchend', handleEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, isRunning, handleInteraction]);


  return (
    <div
      ref={pillsContainerRef}
      className={cn(
        "flex w-full h-40 items-center space-x-2.5 p-2.5 select-none", // Added select-none
        { 'cursor-pointer': !isRunning, 'cursor-default': isRunning }
      )}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
    >
      {Array.from({ length: NUM_SEGMENTS }).map((_, index) => (
        <div
          key={`segment-${index}`}
          className={cn(
            "h-24 flex-grow rounded-md transition-colors duration-100 ease-in-out shadow-sm pointer-events-none", // Added pointer-events-none
            index < activeSegmentsCount ? 'bg-primary' : 'bg-muted'
          )}
          aria-hidden="true"
        />
      ))}
    </div>
  );
};

export default PillsProgressGraphic;

