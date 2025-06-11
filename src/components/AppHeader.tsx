
"use client";

import { type FC, useState, useEffect } from 'react';
import { 
  Settings20Regular, 
  WeatherMoon20Regular, 
  WeatherSunny20Regular, 
  ArrowLeft20Regular, 
  ArrowRight20Regular 
} from '@fluentui/react-icons';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import type { FocusGlowSettings } from '@/types';

interface AppHeaderProps {
  onToggleSettings: () => void;
  settings: FocusGlowSettings;
  currentView: 'timer' | 'progress';
  onNavigate: (view: 'timer' | 'progress') => void;
}

const AppHeader: FC<AppHeaderProps> = ({ onToggleSettings, settings, currentView, onNavigate }) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const toggleTheme = () => {
    if (settings.themeMode === 'light') setTheme('dark');
    else if (settings.themeMode === 'dark') setTheme('light');
    else { 
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }
  };
  
  return (
    <header className="flex items-center justify-between p-3 border-b">
      {currentView === 'progress' && mounted ? (
         <Button variant="ghost" size="icon" onClick={() => onNavigate('timer')} aria-label="Back to timer">
            <ArrowLeft20Regular className="h-5 w-5" />
          </Button>
      ) : <div className="w-10"></div> } {/* Placeholder for alignment */}

      <h1 className="text-xl font-headline font-semibold text-primary">FocusGlow</h1>
      
      <div className="flex items-center space-x-2">
        {mounted && (
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <WeatherSunny20Regular className="h-5 w-5" /> : <WeatherMoon20Regular className="h-5 w-5" />}
          </Button>
        )}
        <Button variant="ghost" size="icon" onClick={onToggleSettings} aria-label="Open settings">
          <Settings20Regular className="h-5 w-5" />
        </Button>
        {currentView === 'timer' && mounted && (
          <Button variant="ghost" size="icon" onClick={() => onNavigate('progress')} aria-label="View progress">
            <ArrowRight20Regular className="h-5 w-5" />
          </Button>
        )}
         {currentView === 'progress' && <div className="w-10"></div>} {/* Placeholder for alignment if only one side nav arrow */}
      </div>
    </header>
  );
};

export default AppHeader;
