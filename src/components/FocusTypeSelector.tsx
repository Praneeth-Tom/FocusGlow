
"use client";

import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type FocusType = 'Work' | 'Study' | 'Read';

const FOCUS_TYPES: FocusType[] = ['Work', 'Study', 'Read'];

interface FocusTypeSelectorProps {
  currentFocusType: FocusType;
  onSelectFocusType: (type: FocusType) => void;
}

const FocusTypeSelector: FC<FocusTypeSelectorProps> = ({ currentFocusType, onSelectFocusType }) => {
  return (
    <div className="flex justify-center space-x-2 mb-4"> {/* Changed my-3 to mb-4 */}
      {FOCUS_TYPES.map(type => (
        <Button
          key={type}
          variant={currentFocusType === type ? 'default' : 'secondary'}
          size="sm"
          onClick={() => onSelectFocusType(type)}
          aria-pressed={currentFocusType === type}
          className={cn(
            "px-4 py-1.5 h-auto",
            currentFocusType === type && "bg-gradient-to-b from-[hsl(203,100%,80%)] via-[hsl(var(--primary))] to-[hsl(203,100%,40%)] text-primary-foreground"
          )}
        >
          {type}
        </Button>
      ))}
    </div>
  );
};

export default FocusTypeSelector;

