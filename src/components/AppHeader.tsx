
"use client";

import { type FC, useState, useEffect } from 'react';
import { Settings, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import type { FocusGlowSettings } from '@/types';

interface AppHeaderProps {
  onToggleSettings: () => void;
  settings: FocusGlowSettings;
}

const AppHeader: FC<AppHeaderProps> = ({ onToggleSettings, settings }) => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (settings.themeMode === 'light') setTheme('dark');
    else if (settings.themeMode === 'dark') setTheme('light');
    else { // system
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }
  };
  
  // This component might cause hydration issues if theme is accessed too early.
  // Ensure it's only rendered client-side or use useEffect for theme-dependent rendering.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);


  return (
    <header className="flex items-center justify-between p-3 border-b">
      <h1 className="text-xl font-headline font-semibold text-primary">FocusGlow</h1>
      <div className="flex items-center space-x-2">
        {mounted && (
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        )}
        <Button variant="ghost" size="icon" onClick={onToggleSettings} aria-label="Open settings">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default AppHeader;
