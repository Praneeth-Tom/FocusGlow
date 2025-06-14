
"use client";

import { cn } from '@/lib/utils';

const BreathingCircle = () => {
  // Keyframes for 'breathing' are defined in globals.css
  // This component's root div will now fill the parent container from CurrentlyPlayingCard.
  return (
    <div className="relative flex items-center justify-center w-full h-full">
      {/* Outer Circles (Largest, Bottom Layer) */}
      {/* Circle 1 (visually back, longest delay, appears to be "behind") */}
      <div
        className={cn(
          "absolute w-full h-full rounded-full animate-[breathing_2s_ease-out_infinite_normal]"
        )}
        style={{ backgroundColor: 'hsl(203, 100%, 45%)', animationDelay: '0.4s' }}
      />
      {/* Circle 2 (visually middle) */}
      <div
        className={cn(
          "absolute w-full h-full rounded-full bg-primary animate-[breathing_2s_ease-out_infinite_normal]" // bg-primary is hsl(203, 100%, 53%)
        )}
        style={{ animationDelay: '0.2s' }}
      />
      {/* Circle 3 (visually front, no delay, appears to be "on top") */}
      <div
        className={cn(
          "absolute w-full h-full rounded-full animate-[breathing_2s_ease-out_infinite_normal]"
        )}
        style={{ backgroundColor: 'hsl(203, 100%, 60%)' }}
      />

      {/* Middle Circles (Intermediate Layer) */}
      <div className="absolute w-[70%] h-[70%] flex items-center justify-center">
        {/* Middle Circle 1 (visually back, longest delay) */}
        <div
          className={cn(
            "absolute w-full h-full rounded-full animate-[breathing_2s_ease-out_infinite_normal]"
          )}
          style={{ backgroundColor: 'hsl(203, 100%, 60%)', animationDelay: '0.4s' }}
        />
        {/* Middle Circle 2 (visually middle) */}
        <div
          className={cn(
            "absolute w-full h-full rounded-full animate-[breathing_2s_ease-out_infinite_normal]"
          )}
          style={{ backgroundColor: 'hsl(203, 100%, 65%)', animationDelay: '0.2s' }}
        />
        {/* Middle Circle 3 (visually front, no delay) */}
        <div
          className={cn(
            "absolute w-full h-full rounded-full animate-[breathing_2s_ease-out_infinite_normal]"
          )}
          style={{ backgroundColor: 'hsl(203, 100%, 70%)' }}
        />
      </div>

      {/* Inner Smaller Circles (Smallest, Top Layer) */}
      <div className="absolute w-[40%] h-[40%] flex items-center justify-center">
        {/* Inner Circle 1 (visually back, longest delay) */}
        <div
          className={cn(
            "absolute w-full h-full rounded-full animate-[breathing_2s_ease-out_infinite_normal]"
          )}
          style={{ backgroundColor: 'hsl(203, 100%, 70%)', animationDelay: '0.4s' }}
        />
        {/* Inner Circle 2 (visually middle) */}
        <div
          className={cn(
            "absolute w-full h-full rounded-full animate-[breathing_2s_ease-out_infinite_normal]"
          )}
          style={{ backgroundColor: 'hsl(203, 100%, 75%)', animationDelay: '0.2s' }}
        />
        {/* Inner Circle 3 (visually front, no delay) */}
        <div
          className={cn(
            "absolute w-full h-full rounded-full animate-[breathing_2s_ease-out_infinite_normal]"
          )}
          style={{ backgroundColor: 'hsl(203, 100%, 80%)' }}
        />
      </div>
    </div>
  );
};

export default BreathingCircle;

