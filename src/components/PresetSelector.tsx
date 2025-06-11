
"use client";

import type { FC, ChangeEvent } from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PresetSelectorProps {
  onSelectPreset: (minutes: number) => void;
  currentDurationMinutes: number;
}

const PRESETS = [
  { label: '5m', minutes: 5 },
  { label: '10m', minutes: 10 },
  { label: '25m', minutes: 25 },
];

const MAX_DURATION_MINUTES = 120;

const PresetSelector: FC<PresetSelectorProps> = ({ onSelectPreset, currentDurationMinutes }) => {
  const [customMinutes, setCustomMinutes] = useState<string>(String(currentDurationMinutes));

  useEffect(() => {
    // Sync customMinutes if currentDurationMinutes changes externally
    // and is different from what customMinutes currently represents (to avoid infinite loops on invalid input)
    if (parseInt(customMinutes, 10) !== currentDurationMinutes) {
      setCustomMinutes(String(currentDurationMinutes));
    }
  }, [currentDurationMinutes, customMinutes]);

  const handleCustomInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCustomMinutes(e.target.value);
  };

  const applyCustomInput = () => {
    let val = parseInt(customMinutes, 10);
    if (!isNaN(val) && val > 0) {
      if (val > MAX_DURATION_MINUTES) {
        val = MAX_DURATION_MINUTES;
      }
      onSelectPreset(val);
      setCustomMinutes(String(val)); // Update input field if capped
    } else {
      // Reset to current duration if input is invalid or empty
      setCustomMinutes(String(currentDurationMinutes));
      // Optionally, if you want to re-apply the current valid duration if input was bad:
      // onSelectPreset(currentDurationMinutes); 
    }
  };
  
  const handleCustomInputBlur = () => {
    applyCustomInput();
  };
  
  const handleCustomInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        applyCustomInput();
        (e.target as HTMLInputElement).blur(); // Remove focus from input
    }
  }

  return (
    <div className="flex flex-col items-center space-y-3 my-4 px-4">
      <div className="flex justify-center space-x-2">
        {PRESETS.map(preset => (
          <Button
            key={preset.label}
            variant={currentDurationMinutes === preset.minutes ? 'default' : 'secondary'}
            onClick={() => {
              onSelectPreset(preset.minutes);
              setCustomMinutes(String(preset.minutes));
            }}
            aria-pressed={currentDurationMinutes === preset.minutes}
            disabled={preset.minutes > MAX_DURATION_MINUTES} // Disable preset if it's over max (though current presets are not)
          >
            {preset.label}
          </Button>
        ))}
      </div>
      <div className="flex items-center space-x-2">
        <Label htmlFor="custom-time" className="text-sm">Custom (min):</Label>
        <Input
          id="custom-time"
          type="number"
          value={customMinutes}
          onChange={handleCustomInputChange}
          onBlur={handleCustomInputBlur}
          onKeyPress={handleCustomInputKeyPress}
          className="w-20 h-9 text-center"
          min="1"
          max={String(MAX_DURATION_MINUTES)} // Added max attribute
        />
      </div>
    </div>
  );
};

export default PresetSelector;
