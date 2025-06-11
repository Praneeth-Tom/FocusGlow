'use server';

/**
 * @fileOverview An AI agent that suggests a playlist based on the current time of day.
 *
 * - suggestPlaylist - A function that suggests a playlist.
 * - SuggestPlaylistInput - The input type for the suggestPlaylist function.
 * - SuggestPlaylistOutput - The return type for the suggestPlaylist function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPlaylistInputSchema = z.object({
  currentTime: z
    .string()
    .describe('The current time of day in 24-hour format (e.g., 14:30).'),
});
export type SuggestPlaylistInput = z.infer<typeof SuggestPlaylistInputSchema>;

const SuggestPlaylistOutputSchema = z.object({
  playlistType: z
    .enum(['focus', 'break'])
    .describe('The suggested playlist type: focus or break.'),
  reason: z.string().describe('The reason for the playlist suggestion.'),
});
export type SuggestPlaylistOutput = z.infer<typeof SuggestPlaylistOutputSchema>;

export async function suggestPlaylist(input: SuggestPlaylistInput): Promise<SuggestPlaylistOutput> {
  return suggestPlaylistFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPlaylistPrompt',
  input: {schema: SuggestPlaylistInputSchema},
  output: {schema: SuggestPlaylistOutputSchema},
  prompt: `You are a helpful assistant that suggests a playlist type (focus or break) based on the current time of day.

Current time: {{{currentTime}}}

Consider the following:
- Suggest 'focus' playlist for typical work hours (9:00 - 17:00).
- Suggest 'break' playlist for outside of work hours, or if it's the weekend.

Respond with a JSON object that contains the 'playlistType' and 'reason' fields.
`,
});

const suggestPlaylistFlow = ai.defineFlow(
  {
    name: 'suggestPlaylistFlow',
    inputSchema: SuggestPlaylistInputSchema,
    outputSchema: SuggestPlaylistOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
