
"use client";

import type { FC } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  return (
    <div className="flex justify-center space-x-3 my-4">
      {!isRunning ? (
        <Button onClick={onStart} aria-label="Start timer" size="lg">
          <Play className="mr-2 h-5 w-5" /> Start
        </Button>
      ) : isPaused ? (
        <Button onClick={onResume} aria-label="Resume timer" size="lg">
          <Play className="mr-2 h-5 w-5" /> Resume
        </Button>
      ) : (
        <Button onClick={onPause} aria-label="Pause timer" size="lg">
          <Pause className="mr-2 h-5 w-5" /> Pause
        </Button>
      )}
      <Button onClick={onReset} variant="outline" aria-label="Reset timer" size="lg">
        <RotateCcw className="mr-2 h-5 w-5" /> Reset
      </Button>
    </div>
  );
};

export default TimerControls;
