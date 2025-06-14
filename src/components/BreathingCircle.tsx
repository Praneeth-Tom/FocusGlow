
"use client";

import { cn } from '@/lib/utils';

const BreathingCircle = () => {
  // Keyframes for 'breathing' are defined in globals.css
  // Tailwind's JIT compiler will pick up 'animate-[breathing_...]'
  return (
    <div className="relative flex items-center justify-center w-20 h-20">
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
        // No style={{ animationDelay: '0s' }} needed as 0s is the default behavior for the animation property
      />
    </div>
  );
};

export default BreathingCircle;
