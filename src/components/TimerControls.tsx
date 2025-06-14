
"use client";

import type { FC } from 'react';
import { Play20Filled, Pause20Filled, ArrowCounterclockwise20Regular } from '@fluentui/react-icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TimerControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
}

const TimerControls: FC<TimerControlsProps> = ({
  isRunning,
  isPaused,
  onStart,
  onPause,
  onResume,
  onReset,
}) => {
  const primaryButtonGradient = "bg-gradient-to-b from-[hsl(203,100%,80%)] via-[hsl(var(--primary))] to-[hsl(203,100%,40%)]";

  return (
    <div className="flex justify-center space-x-3 mt-4">
      {!isRunning ? (
        <Button
          onClick={onStart}
          aria-label="Start timer"
          size="lg"
          className={cn(primaryButtonGradient, "hover:brightness-105 transition-all duration-150 ease-in-out")}
        >
          <Play20Filled className="mr-2 h-5 w-5" /> Start
        </Button>
      ) : isPaused ? (
        <Button
          onClick={onResume}
          aria-label="Resume timer"
          size="lg"
          className={cn(primaryButtonGradient, "hover:brightness-105 transition-all duration-150 ease-in-out")}
        >
          <Play20Filled className="mr-2 h-5 w-5" /> Resume
        </Button>
      ) : (
        <Button
          onClick={onPause}
          aria-label="Pause timer"
          size="lg"
          className={cn(primaryButtonGradient, "hover:brightness-105 transition-all duration-150 ease-in-out")}
        >
          <Pause20Filled className="mr-2 h-5 w-5" /> Pause
        </Button>
      )}
      <Button onClick={onReset} variant="outline" aria-label="Reset timer" size="lg" className="">
        <ArrowCounterclockwise20Regular className="mr-2 h-5 w-5" /> Reset
      </Button>
    </div>
  );
};

export default TimerControls;
