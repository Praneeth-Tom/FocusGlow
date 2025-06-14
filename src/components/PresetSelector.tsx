
"use client";

import type { FC, ChangeEvent } from 'react';
import { useState, useEffect } from 'react';
// Button import removed as it's no longer used for presets
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PresetSelectorProps {
  onSelectPreset: (minutes: number) => void;
  currentDurationMinutes: number;
}

// PRESETS array removed
// const PRESETS = [
//   { label: '5m', minutes: 5 },
//   { label: '10m', minutes: 10 },
//   { label: '25m', minutes: 25 },
// ];

const MAX_DURATION_MINUTES = 120;

const PresetSelector: FC<PresetSelectorProps> = ({ onSelectPreset, currentDurationMinutes }) => {
  const [customMinutes, setCustomMinutes] = useState<string>(String(currentDurationMinutes));

  useEffect(() => {
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
      setCustomMinutes(String(val)); 
    } else {
      setCustomMinutes(String(currentDurationMinutes));
    }
  };
  
  const handleCustomInputBlur = () => {
    applyCustomInput();
  };
  
  const handleCustomInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        applyCustomInput();
        (e.target as HTMLInputElement).blur(); 
    }
  }

  return (
    <div className="flex flex-col items-center space-y-3 my-4 px-4">
      {/* Removed preset buttons section */}
      <div className="flex items-center space-x-2 justify-center w-full"> {/* Added justify-center and w-full */}
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
          max={String(MAX_DURATION_MINUTES)}
        />
      </div>
    </div>
  );
};

export default PresetSelector;
