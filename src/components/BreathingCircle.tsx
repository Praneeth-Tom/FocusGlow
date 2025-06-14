
"use client";

import { cn } from '@/lib/utils';

interface BreathingCircleProps {
  isPlaying: boolean;
}

const BreathingCircle = ({ isPlaying }: BreathingCircleProps) => {
  const animationClass = isPlaying ? "animate-[breathing_2s_ease-out_infinite_normal]" : "";

  return (
    <div className="relative flex items-center justify-center w-full h-full">
      {/* Outer Circles (Largest, Bottom Layer) */}
      {/* Circle 1 (visually back, longest delay, appears to be "behind") */}
      <div
        className={cn(
          "absolute w-full h-full rounded-full",
          animationClass
        )}
        style={{ backgroundColor: 'hsl(203, 100%, 45%)', animationDelay: isPlaying ? '0.4s' : undefined }}
      />
      {/* Circle 2 (visually middle) */}
      <div
        className={cn(
          "absolute w-full h-full rounded-full bg-primary",
          animationClass
        )}
        style={{ animationDelay: isPlaying ? '0.2s' : undefined }}
      />
      {/* Circle 3 (visually front, no delay, appears to be "on top") */}
      <div
        className={cn(
          "absolute w-full h-full rounded-full",
          animationClass
        )}
        style={{ backgroundColor: 'hsl(203, 100%, 60%)', animationDelay: isPlaying ? '0s' : undefined }}
      />

      {/* Middle Circles (Intermediate Layer) */}
      <div className="absolute w-[70%] h-[70%] flex items-center justify-center">
        {/* Middle Circle 1 (visually back, longest delay) */}
        <div
          className={cn(
            "absolute w-full h-full rounded-full",
            animationClass
          )}
          style={{ backgroundColor: 'hsl(203, 100%, 60%)', animationDelay: isPlaying ? '0.4s' : undefined }}
        />
        {/* Middle Circle 2 (visually middle) */}
        <div
          className={cn(
            "absolute w-full h-full rounded-full",
            animationClass
          )}
          style={{ backgroundColor: 'hsl(203, 100%, 65%)', animationDelay: isPlaying ? '0.2s' : undefined }}
        />
        {/* Middle Circle 3 (visually front, no delay) */}
        <div
          className={cn(
            "absolute w-full h-full rounded-full",
            animationClass
          )}
          style={{ backgroundColor: 'hsl(203, 100%, 70%)', animationDelay: isPlaying ? '0s' : undefined }}
        />
      </div>

      {/* Inner Smaller Circles (Smallest, Top Layer) */}
      <div className="absolute w-[40%] h-[40%] flex items-center justify-center">
        {/* Inner Circle 1 (visually back, longest delay) */}
        <div
          className={cn(
            "absolute w-full h-full rounded-full",
            animationClass
          )}
          style={{ backgroundColor: 'hsl(203, 100%, 70%)', animationDelay: isPlaying ? '0.4s' : undefined }}
        />
        {/* Inner Circle 2 (visually middle) */}
        <div
          className={cn(
            "absolute w-full h-full rounded-full",
            animationClass
          )}
          style={{ backgroundColor: 'hsl(203, 100%, 75%)', animationDelay: isPlaying ? '0.2s' : undefined }}
        />
        {/* Inner Circle 3 (visually front, no delay) */}
        <div
          className={cn(
            "absolute w-full h-full rounded-full",
            animationClass
          )}
          style={{ backgroundColor: 'hsl(203, 100%, 80%)', animationDelay: isPlaying ? '0s' : undefined }}
        />
      </div>
    </div>
  );
};

export default BreathingCircle;
