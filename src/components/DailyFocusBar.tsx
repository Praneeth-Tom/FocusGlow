
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

  const progressPercentage = goalMinutes > 0 ? Math.min(100, (focusedMinutes / goalMinutes) * 100) : (focusedMinutes > 0 ? 100 : 0) ; // If no goal but has time, show full bar for 'primary' color
  const barHeightStyle = `${progressPercentage}%`;

  const barColor = () => {
    if (focusedMinutes === 0) return 'bg-muted';
    if (goalMinutes > 0) {
      if (focusedMinutes >= goalMinutes) return 'bg-green-500';
      return 'bg-orange-400'; // Under target color
    }
    return 'bg-primary'; // Has focus, but no goal is set (or goal is 0)
  };

  return (
    <div className={cn(
      "flex flex-col items-center w-12 space-y-1 text-center",
      isMostFocused ? "p-1 rounded-md bg-primary/10" : "p-1"
    )}>
      <span className="text-xs h-4 text-muted-foreground" aria-label={`Focused time for ${dayLabel}`}>
        {focusedMinutes > 0 ? displayTime : ""}
      </span>
      <div className="w-8 h-32 bg-secondary rounded-t-md flex flex-col justify-end overflow-hidden" role="progressbar" aria-valuenow={focusedMinutes} aria-valuemin={0} aria-valuemax={goalMinutes > 0 ? goalMinutes : undefined}>
        <div
          className={cn("w-full transition-all duration-500 ease-out rounded-t-md", barColor())}
          style={{ height: barHeightStyle }}
        />
      </div>
      <span className="text-sm font-medium text-foreground pt-1">{dayLabel}</span>
    </div>
  );
};

export default DailyFocusBar;
