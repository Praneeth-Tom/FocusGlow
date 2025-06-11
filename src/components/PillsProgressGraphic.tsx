
"use client";

import type { FC } from 'react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface PillsProgressGraphicProps {
  timeLeft: number; // in seconds, current time remaining or selected time if not running
  maxPillDuration: number; // in seconds, e.g., 120 minutes * 60
  onSetTimerDuration: (newDurationInSeconds: number) => void;
  isRunning: boolean;
}

const NUM_SEGMENTS = 10; // Number of pill segments to display

const PillsProgressGraphic: FC<PillsProgressGraphicProps> = ({
  timeLeft,
  maxPillDuration,
  onSetTimerDuration,
  isRunning,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const pillsContainerRef = useRef<HTMLDivElement>(null);

  const secondsPerSegment = maxPillDuration > 0 ? maxPillDuration / NUM_SEGMENTS : 1; // Avoid division by zero

  // Calculate how many pills should be lit based on timeLeft
  const activeSegmentsCount = maxPillDuration > 0 
    ? Math.max(0, Math.min(NUM_SEGMENTS, Math.round(timeLeft / secondsPerSegment)))
    : 0;

  const handleInteraction = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, isClickOrDragEnd: boolean) => {
    if (isRunning || !pillsContainerRef.current) return;

    const container = pillsContainerRef.current;
    const rect = container.getBoundingClientRect();
    
    let clientX;
    if ('touches' in event) {
      clientX = event.touches[0].clientX;
    } else {
      clientX = event.clientX;
    }

    const x = clientX - rect.left;
    const containerWidth = container.offsetWidth;
    const pillWidth = containerWidth / NUM_SEGMENTS;
    
    let selectedPillIndex = Math.floor(x / pillWidth);
    selectedPillIndex = Math.max(0, Math.min(NUM_SEGMENTS - 1, selectedPillIndex));

    const newDuration = (selectedPillIndex + 1) * secondsPerSegment;
    
    if (isClickOrDragEnd) {
      onSetTimerDuration(newDuration);
    }
    // For continuous drag feedback, you could call onSetTimerDuration here too,
    // but for simplicity, we only call it on click or drag end.
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isRunning) return;
    setIsDragging(true);
    handleInteraction(event, false); // Handle initial click point for drag start
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isRunning || !isDragging) return;
    handleInteraction(event, false); 
     // To provide real-time feedback during drag, call onSetTimerDuration here.
     // For this implementation, we'll wait for mouseUp to finalize.
     // To make it update live during drag:
     // const container = pillsContainerRef.current;
     // if (!container) return;
     // const rect = container.getBoundingClientRect();
     // const x = event.clientX - rect.left;
     // const containerWidth = container.offsetWidth;
     // const pillWidth = containerWidth / NUM_SEGMENTS;
     // let selectedPillIndex = Math.floor(x / pillWidth);
     // selectedPillIndex = Math.max(0, Math.min(NUM_SEGMENTS - 1, selectedPillIndex));
     // const newDuration = (selectedPillIndex + 1) * secondsPerSegment;
     // onSetTimerDuration(newDuration);
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isRunning || !isDragging) return; // ensure isDragging is true before resetting
    setIsDragging(false);
    // Finalize selection on mouse up by re-evaluating position
    handleInteraction(event, true);
  };
  
  const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isRunning || !isDragging) return;
    // If dragging and mouse leaves, finalize with current position or reset
    // For simplicity, we'll finalize. A more complex behavior might cancel the drag.
    setIsDragging(false); 
    handleInteraction(event, true); 
  };


  const handlePillClick = (index: number) => {
    if (isRunning) return;
    const newDuration = (index + 1) * secondsPerSegment;
    onSetTimerDuration(newDuration);
  };

  // Effect to add global mouseup listener to handle cases where mouseup happens outside the component
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        // Potentially finalize based on last known position if needed, but might be complex.
        // For now, just stop dragging state. The component's mouseUp/Leave should handle most.
      }
    };

    if (isDragging) {
      window.addEventListener('mouseup', handleGlobalMouseUp);
    } else {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging]);


  return (
    <div
      ref={pillsContainerRef}
      className={cn(
        "flex w-full h-40 items-center space-x-2.5 p-2.5",
        { 'cursor-pointer': !isRunning, 'cursor-default': isRunning }
      )}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={(e) => { if(!isRunning) { setIsDragging(true); handleInteraction(e, false); } }}
      onTouchMove={(e) => { if(!isRunning && isDragging) { handleInteraction(e, false); } }}
      onTouchEnd={(e) => { if(!isRunning && isDragging) { setIsDragging(false); handleInteraction(e, true); } }}
    >
      {Array.from({ length: NUM_SEGMENTS }).map((_, index) => (
        <div
          key={`segment-${index}`}
          className={cn(
            "h-24 flex-grow rounded-md transition-colors duration-100 ease-in-out shadow-sm", // Faster transition for interactivity
            index < activeSegmentsCount ? 'bg-primary' : 'bg-muted'
          )}
          onClick={() => handlePillClick(index)} // Individual click handler
          aria-hidden="true" // These are decorative; main interaction on container for drag
        />
      ))}
    </div>
  );
};

export default PillsProgressGraphic;
