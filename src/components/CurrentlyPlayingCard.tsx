
"use client";

import type { FC } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipForward, SkipBack, Music2 } from 'lucide-react';

const CurrentlyPlayingCard: FC = () => {
  // Placeholder data - in a real app, this would come from state or props
  const songTitle = "Rainy Mood Lo-fi";
  const artistName = "Chill Beats Collective";
  const albumArtUrl = "https://placehold.co/80x80.png"; // Placeholder image, corrected size
  const isPlaying = false; // Placeholder state

  return (
    <Card className="my-6 mx-auto max-w-sm shadow-lg w-full">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Music2 className="mr-2 h-5 w-5 text-primary" />
          Currently Playing
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center space-x-4 p-4">
        <div className="rounded-md overflow-hidden shadow-md flex-shrink-0">
          <Image
            src={albumArtUrl}
            alt={`Album art for ${songTitle}`}
            width={80}
            height={80}
            className="object-cover"
            data-ai-hint="album music"
          />
        </div>
        <div className="flex flex-col flex-grow space-y-2">
          <div className="text-left">
            <h3 className="text-md font-semibold text-foreground truncate" title={songTitle}>{songTitle}</h3>
            <p className="text-xs text-muted-foreground truncate" title={artistName}>{artistName}</p>
          </div>
          <div className="flex items-center space-x-2 justify-start">
            <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Previous track">
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button variant="default" size="icon" className="w-10 h-10 rounded-full" aria-label={isPlaying ? "Pause" : "Play"}>
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Next track">
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentlyPlayingCard;
