
"use client";

import type { FC } from 'react';
import { cn } from '@/lib/utils';

interface PillsProgressGraphicProps {
  timeLeft: number; // in seconds
  totalDuration: number; // in seconds
}

const NUM_SEGMENTS = 10; // Number of pill segments to display (increased from 8)

const PillsProgressGraphic: FC<PillsProgressGraphicProps> = ({ timeLeft, totalDuration }) => {
  const progressPercentage = totalDuration > 0 ? (totalDuration - timeLeft) / totalDuration : 0;
  const activeSegments = Math.max(0, Math.min(NUM_SEGMENTS, Math.round(progressPercentage * NUM_SEGMENTS)));

  return (
    <div className="flex w-full h-40 items-center space-x-2.5 p-2.5">
      {Array.from({ length: NUM_SEGMENTS }).map((_, index) => (
        <div
          key={`segment-${index}`}
          className={cn(
            "h-24 flex-grow rounded-md transition-colors duration-300 ease-in-out shadow-sm",
            index < activeSegments ? 'bg-primary' : 'bg-muted'
          )}
          aria-hidden="true"
        />
      ))}
    </div>
  );
};

export default PillsProgressGraphic;
