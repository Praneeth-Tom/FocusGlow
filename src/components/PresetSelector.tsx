
"use client";

import type { FC, ChangeEvent } from 'react';
import { useState } from 'react';
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

const PresetSelector: FC<PresetSelectorProps> = ({ onSelectPreset, currentDurationMinutes }) => {
  const [customMinutes, setCustomMinutes] = useState<string>(String(currentDurationMinutes));

  const handleCustomInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCustomMinutes(e.target.value);
  };

  const handleCustomInputBlur = () => {
    const val = parseInt(customMinutes, 10);
    if (!isNaN(val) && val > 0) {
      onSelectPreset(val);
    } else {
      // Reset to current duration if input is invalid
      setCustomMinutes(String(currentDurationMinutes));
    }
  };
  
  const handleCustomInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        handleCustomInputBlur();
        (e.target as HTMLInputElement).blur();
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
        />
      </div>
    </div>
  );
};

export default PresetSelector;
