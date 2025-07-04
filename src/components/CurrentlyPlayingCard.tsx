
"use client";

import type { FC } from 'react';
import BreathingCircle from './BreathingCircle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  MusicNote220Regular,
  Play20Filled,
  Pause20Filled,
  Next20Regular,
  Previous20Regular
} from '@fluentui/react-icons';
import { cn } from '@/lib/utils';

const CurrentlyPlayingCard: FC = () => {
  const songTitle = "Rainy Mood Lo-fi";
  const artistName = "Chill Beats Collective";
  const isPlaying = false;

  const playPauseButtonGradient = "bg-gradient-to-b from-[hsl(203,100%,80%)] via-[hsl(var(--primary))] to-[hsl(203,100%,40%)]";

  return (
    <Card className="my-6 mx-auto max-w-sm shadow-lg w-full">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <MusicNote220Regular className="mr-2 h-5 w-5 text-primary" />
          Currently Playing
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center space-x-4 p-4">
        <div className="rounded-md overflow-hidden flex-shrink-0 w-20 h-20 flex items-center justify-center">
          <BreathingCircle isPlaying={isPlaying} />
        </div>
        <div className="flex flex-col flex-grow space-y-2">
          <div className="text-left">
            <h3 className="text-md font-semibold text-foreground truncate" title={songTitle}>{songTitle}</h3>
            <p className="text-xs text-muted-foreground truncate" title={artistName}>{artistName}</p>
          </div>
          <div className="flex items-center space-x-2 justify-start">
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:scale-110 transform transition-transform duration-150 ease-in-out" aria-label="Previous track">
              <Previous20Regular className="h-4 w-4" />
            </Button>
            <Button
              variant="default"
              size="icon"
              className={cn(
                "w-10 h-10 rounded-full",
                playPauseButtonGradient,
                "hover:brightness-105 transition-all duration-150 ease-in-out"
              )}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause20Filled className="h-5 w-5" /> : <Play20Filled className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:scale-110 transform transition-transform duration-150 ease-in-out" aria-label="Next track">
              <Next20Regular className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentlyPlayingCard;
