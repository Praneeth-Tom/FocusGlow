
"use client";

import type { FC } from 'react';
import { cn } from '@/lib/utils';

interface PillsProgressGraphicProps {
  timeLeft: number; // in seconds
  totalDuration: number; // in seconds
}

const NUM_SEGMENTS = 30; // Number of pill segments to display

const PillsProgressGraphic: FC<PillsProgressGraphicProps> = ({ timeLeft, totalDuration }) => {
  const progressPercentage = totalDuration > 0 ? (totalDuration - timeLeft) / totalDuration : 0;
  const activeSegments = Math.max(0, Math.min(NUM_SEGMENTS, Math.round(progressPercentage * NUM_SEGMENTS)));

  return (
    <div className="flex w-full h-10 items-center space-x-1 p-1">
      {Array.from({ length: NUM_SEGMENTS }).map((_, index) => (
        <div
          key={`segment-${index}`}
          className={cn(
            "h-6 flex-grow rounded-md transition-colors duration-300 ease-in-out shadow-sm",
            index < activeSegments ? 'bg-primary' : 'bg-muted'
          )}
          aria-hidden="true"
        />
      ))}
    </div>
  );
};

export default PillsProgressGraphic;
