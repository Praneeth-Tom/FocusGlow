
"use client";

import type { FC } from 'react';
import { Button } from '@/components/ui/button';

export type FocusType = 'Work' | 'Study' | 'Read';

const FOCUS_TYPES: FocusType[] = ['Work', 'Study', 'Read'];

interface FocusTypeSelectorProps {
  currentFocusType: FocusType;
  onSelectFocusType: (type: FocusType) => void;
}

const FocusTypeSelector: FC<FocusTypeSelectorProps> = ({ currentFocusType, onSelectFocusType }) => {
  return (
    <div className="flex justify-center space-x-2 my-3">
      {FOCUS_TYPES.map(type => (
        <Button
          key={type}
          variant={currentFocusType === type ? 'default' : 'secondary'}
          size="sm"
          onClick={() => onSelectFocusType(type)}
          aria-pressed={currentFocusType === type}
          className="px-4 py-1.5 h-auto"
        >
          {type}
        </Button>
      ))}
    </div>
  );
};

export default FocusTypeSelector;
