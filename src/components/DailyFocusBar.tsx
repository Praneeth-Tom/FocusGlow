
"use client";

import type { FC } from 'react';
import { cn } from '@/lib/utils';
import type { ProgressDisplayUnit } from '@/types';

interface DailyFocusBarProps {
  dayLabel: string;
  focusedMinutes: number;
  goalMinutes: number;
  displayUnit: ProgressDisplayUnit;
  isMostFocused?: boolean;
}

const DailyFocusBar: FC<DailyFocusBarProps> = ({
  dayLabel,
  focusedMinutes,
  goalMinutes,
  displayUnit,
  isMostFocused = false,
}) => {
  const displayTime = displayUnit === 'hours' 
    ? `${(focusedMinutes / 60).toFixed(1)}h` 
    : `${focusedMinutes}m`;

  const progressPercentage = goalMinutes > 0 ? Math.min(100, (focusedMinutes / goalMinutes) * 100) : 0;

  const barColor = () => {
    if (focusedMinutes === 0) return 'bg-muted';
    if (focusedMinutes >= goalMinutes) return 'bg-green-500'; // Success color
    return 'bg-orange-400'; // Under target color
  };

  return (
    <div className={cn("flex items-center space-x-3 py-1.5 px-2 rounded-md", isMostFocused ? "bg-primary/10" : "")}>
      <span className="w-8 text-sm font-medium text-muted-foreground">{dayLabel}</span>
      <div className="flex-grow h-6 bg-secondary rounded overflow-hidden relative">
        <div
          className={cn("h-full transition-all duration-500 ease-out", barColor())}
          style={{ width: `${progressPercentage}%` }}
        />
        {focusedMinutes > 0 && progressPercentage < 25 && ( // Show text inside if bar is too short
             <span className="absolute left-1 top-1/2 -translate-y-1/2 text-xs font-medium text-foreground pl-1">
                {displayTime}
             </span>
        )}
      </div>
      <span className="w-20 text-sm text-right text-foreground">
        {displayTime}
        {displayUnit === 'minutes' && focusedMinutes >= goalMinutes && focusedMinutes > 0 && <span className="text-green-500 ml-1">✓</span>}
        {displayUnit === 'hours' && focusedMinutes >= goalMinutes && focusedMinutes > 0 && <span className="text-green-500 ml-1">✓</span>}
      </span>
    </div>
  );
};

export default DailyFocusBar;
