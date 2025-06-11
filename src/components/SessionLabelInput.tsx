
"use client";

import type { FC, ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SessionLabelInputProps {
  label: string;
  onLabelChange: (newLabel: string) => void;
}

const SessionLabelInput: FC<SessionLabelInputProps> = ({ label, onLabelChange }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onLabelChange(e.target.value);
  };

  return (
    <div className="my-3 px-4 flex flex-col items-center">
      <Label htmlFor="session-label" className="mb-1 text-sm sr-only">Session Label</Label>
      <Input
        id="session-label"
        type="text"
        value={label}
        onChange={handleChange}
        placeholder="Session Label (e.g., Focus, Break)"
        className="w-full max-w-xs text-center"
        aria-label="Session Label"
      />
    </div>
  );
};

export default SessionLabelInput;
