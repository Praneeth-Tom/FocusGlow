
"use client";

import { cn } from '@/lib/utils';

const BreathingCircle = () => {
  // Keyframes for 'breathing' are defined in globals.css
  // This component's root div will now fill the parent container from CurrentlyPlayingCard.
  return (
    <div className="relative flex items-center justify-center w-full h-full">
      {/* Circle 1 (visually back, longest delay, appears to be "behind") */}
      <div
        className={cn(
          "absolute w-full h-full rounded-full bg-primary animate-[breathing_2s_ease-out_infinite_normal]"
        )}
        style={{ animationDelay: '0.4s' }}
      />
      {/* Circle 2 (visually middle) */}
      <div
        className={cn(
          "absolute w-full h-full rounded-full bg-primary animate-[breathing_2s_ease-out_infinite_normal]"
        )}
        style={{ animationDelay: '0.2s' }}
      />
      {/* Circle 3 (visually front, no delay, appears to be "on top") */}
      <div
        className={cn(
          "absolute w-full h-full rounded-full bg-primary animate-[breathing_2s_ease-out_infinite_normal]"
        )}
      />
    </div>
  );
};

export default BreathingCircle;
