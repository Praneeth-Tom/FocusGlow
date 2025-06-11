
"use client";

import type { FC } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Lightbulb } from 'lucide-react';
import { suggestPlaylist, type SuggestPlaylistInput, type SuggestPlaylistOutput } from '@/ai/flows/suggest-playlist';

const PlaylistSuggestion: FC = () => {
  const [suggestion, setSuggestion] = useState<SuggestPlaylistOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSuggestPlaylist = async () => {
    setIsLoading(true);
    setError(null);
    setSuggestion(null);

    try {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const input: SuggestPlaylistInput = { currentTime };
      const result = await suggestPlaylist(input);
      setSuggestion(result);
    } catch (e) {
      console.error("Error suggesting playlist:", e);
      setError("Could not fetch playlist suggestion. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="my-6 mx-auto max-w-md shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lightbulb className="mr-2 h-5 w-5 text-primary" />
          Playlist Idea
        </CardTitle>
        <CardDescription>Let AI suggest a playlist type based on the current time.</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Button onClick={handleSuggestPlaylist} disabled={isLoading} className="mb-4">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Thinking...
            </>
          ) : (
            "Suggest Playlist Type"
          )}
        </Button>

        {suggestion && (
          <div className="p-3 bg-secondary rounded-md text-left space-y-1 fade-in">
            <p>
              <strong>Type:</strong> <span className="capitalize text-primary">{suggestion.playlistType}</span>
            </p>
            <p>
              <strong>Reason:</strong> {suggestion.reason}
            </p>
          </div>
        )}
        {error && <p className="text-destructive mt-2">{error}</p>}
      </CardContent>
    </Card>
  );
};

export default PlaylistSuggestion;
