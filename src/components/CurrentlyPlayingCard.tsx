
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
  const albumArtUrl = "https://placehold.co/200x200.png"; // Placeholder image
  const isPlaying = false; // Placeholder state

  return (
    <Card className="my-6 mx-auto max-w-md shadow-lg w-full">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Music2 className="mr-2 h-5 w-5 text-primary" />
          Currently Playing
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="rounded-md overflow-hidden shadow-md">
          <Image
            src={albumArtUrl}
            alt={`Album art for ${songTitle}`}
            width={160}
            height={160}
            className="object-cover"
            data-ai-hint="album music"
          />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold text-foreground">{songTitle}</h3>
          <p className="text-sm text-muted-foreground">{artistName}</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" aria-label="Previous track">
            <SkipBack className="h-5 w-5" />
          </Button>
          <Button variant="default" size="icon" className="w-12 h-12 rounded-full" aria-label={isPlaying ? "Pause" : "Play"}>
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </Button>
          <Button variant="ghost" size="icon" aria-label="Next track">
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentlyPlayingCard;
