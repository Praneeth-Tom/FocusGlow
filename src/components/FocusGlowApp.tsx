
"use client";

import { useState, useEffect, useCallback } from 'react';
import TimerDisplay from '@/components/TimerDisplay';
import TimerControls from '@/components/TimerControls';
// PresetSelector import removed
import SettingsPanel from '@/components/SettingsPanel';
import CurrentlyPlayingCard from '@/components/CurrentlyPlayingCard';
import WeeklyProgressView from '@/components/WeeklyProgressView';
import FocusTypeSelector, { type FocusType } from '@/components/FocusTypeSelector';
import { useSettings } from '@/hooks/useSettings';
import { useTimer } from '@/hooks/useTimer';
import { useFocusData } from '@/hooks/useFocusData';
import { useToast } from "@/hooks/use-toast";
import * as Tone from 'tone';
import { cn } from '@/lib/utils';
import { 
  SpinnerIosRegular,
  Settings20Regular,
  WeatherMoon20Regular,
  WeatherSunny20Regular,
  ArrowLeft20Regular,
  ArrowRight20Regular
} from '@fluentui/react-icons';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

type AppView = 'timer' | 'progress';

const FIXED_DEFAULT_DURATION_SECONDS = 25 * 60; // 25 minutes
const DEFAULT_DAILY_FOCUS_GOAL_MINUTES = 120;
const DEFAULT_PROGRESS_DISPLAY_UNIT = 'minutes';
const MAX_PILL_DURATION_SECONDS = 120 * 60; // Max duration pills can represent (120 minutes)

const FocusGlowApp = () => {
  const { settings, updateSetting, isMounted: settingsMounted } = useSettings();
  const { toast } = useToast();
  const { addFocusSession, isMounted: focusDataMounted } = useFocusData();

  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const [currentTimerDuration, setCurrentTimerDuration] = useState(FIXED_DEFAULT_DURATION_SECONDS);
  const [currentView, setCurrentView] = useState<AppView>('timer');
  const [currentFocusType, setCurrentFocusType] = useState<FocusType>('Work');
  
  const [alarmSynth, setAlarmSynth] = useState<Tone.Synth | null>(null);
  const [bellSynth, setBellSynth] = useState<Tone.MetalSynth | null>(null);

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
       setAlarmSynth(new Tone.Synth().toDestination());
       setBellSynth(new Tone.MetalSynth({
          frequency: 200,
          envelope: { attack: 0.001, decay: 0.1, release: 0.01 },
          harmonicity: 3.1,
          modulationIndex: 16,
          resonance: 4000,
          octaves: 0.5
       }).toDestination());
    }
  }, []);

  const playNotificationSound = useCallback(() => {
    if (!settings.enableSoundAlert || !Tone.context || Tone.context.state !== 'running') return;
    try {
      if (settings.notificationSound === 'alarm' && alarmSynth) {
        alarmSynth.triggerAttackRelease("C5", "8n", Tone.now());
        alarmSynth.triggerAttackRelease("G4", "8n", Tone.now() + 0.2);
      } else if (settings.notificationSound === 'bell' && bellSynth) {
         bellSynth.triggerAttackRelease("16n", Tone.now(), 0.8);
      }
    } catch(e) {
        console.error("Error playing sound:", e);
    }
  }, [settings.enableSoundAlert, settings.notificationSound, alarmSynth, bellSynth]);

  const handleSessionComplete = useCallback((focusedMinutes: number) => {
    if (focusedMinutes > 0 && focusDataMounted) { 
      addFocusSession(focusedMinutes);
    }
  }, [addFocusSession, focusDataMounted]);

  const handleTimerEnd = useCallback(() => {
    toast({
      title: "Timer Finished!",
      description: "Your session has ended.", 
    });
    if (Notification.permission === "granted") {
      new Notification("FocusGlow: Timer Finished!", {
        body: "Your session has ended.", 
        icon: '/logo.png', 
      });
    }
    if (settings.enableSoundAlert) {
      playNotificationSound();
    }
  }, [settings.enableSoundAlert, toast, playNotificationSound]);

  const { timeLeft, isRunning, isPaused, startTimer, pauseTimer, resumeTimer, resetTimer, setTimeLeft } = useTimer({
    initialDurationInSeconds: currentTimerDuration,
    settings, 
    onTimerEnd: handleTimerEnd,
    onSessionComplete: handleSessionComplete,
  });
  
  const handleDurationChange = useCallback((newDurationSeconds: number) => {
    const validDuration = Math.max(1, newDurationSeconds);
    setCurrentTimerDuration(validDuration);
    resetTimer(validDuration);
  }, [resetTimer]);

  const handleSelectFocusType = useCallback((type: FocusType) => {
    setCurrentFocusType(type);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission();
      }
    }
    const startAudioContext = async () => {
      if (Tone.context.state !== 'running') {
        await Tone.start();
      }
    };
    document.body.addEventListener('click', startAudioContext, { once: true });
    document.body.addEventListener('keydown', startAudioContext, { once: true });
    
    return () => {
      document.body.removeEventListener('click', startAudioContext);
      document.body.removeEventListener('keydown', startAudioContext);
    }
  }, []);
  
  const mainAppContainerClasses = cn(
    "flex flex-col min-h-screen bg-background text-foreground transition-all duration-300 ease-in-out",
    "p-2 sm:p-4",
  );

  const timerCardClasses = cn(
    "bg-card border shadow-lg w-full max-w-sm mx-auto relative", 
     "rounded-md",
    "p-4 md:p-6"
  );

  if (!settingsMounted || !focusDataMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <SpinnerIosRegular className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className={mainAppContainerClasses}>
      <main className="flex-grow flex flex-col items-center justify-center pt-4">
        {currentView === 'timer' && (
          <>
            <div className={cn(timerCardClasses, 'fade-in')}>
              <div className="absolute top-3 right-3 flex items-center space-x-1 z-10">
                {mounted && (
                  <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme" className="transform transition-transform duration-150 ease-in-out hover:scale-110">
                    {theme === 'dark' ? <WeatherSunny20Regular className="h-5 w-5" /> : <WeatherMoon20Regular className="h-5 w-5" />}
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={() => setIsSettingsPanelOpen(true)} aria-label="Open settings" className="transform transition-transform duration-150 ease-in-out hover:scale-110">
                  <Settings20Regular className="h-5 w-5" />
                </Button>
                {mounted && (
                  <Button variant="ghost" size="icon" onClick={() => setCurrentView('progress')} aria-label="View progress" className="transform transition-transform duration-150 ease-in-out hover:scale-110">
                    <ArrowRight20Regular className="h-5 w-5" />
                  </Button>
                )}
              </div>
              <div className="pt-8 sm:pt-10">
                <FocusTypeSelector currentFocusType={currentFocusType} onSelectFocusType={handleSelectFocusType} />
                <TimerDisplay 
                  timeLeft={timeLeft} 
                  maxPillDuration={MAX_PILL_DURATION_SECONDS}
                  onSetDuration={handleDurationChange} 
                  isRunning={isRunning}
                />
                <TimerControls
                  isRunning={isRunning}
                  isPaused={isPaused}
                  onStart={startTimer}
                  onPause={pauseTimer}
                  onResume={resumeTimer}
                  onReset={() => resetTimer(currentTimerDuration)}
                />
              </div>
            </div>
            {settings.showMusicCard && <CurrentlyPlayingCard />}
          </>
        )}
        {currentView === 'progress' && (
           <div className={cn(timerCardClasses, 'fade-in')}> 
             <div className="absolute top-3 right-3 flex items-center space-x-1 z-10">
                {mounted && (
                  <Button variant="ghost" size="icon" onClick={() => setCurrentView('timer')} aria-label="Back to timer" className="transform transition-transform duration-150 ease-in-out hover:scale-110">
                    <ArrowLeft20Regular className="h-5 w-5" />
                  </Button>
                )}
                {mounted && (
                  <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme" className="transform transition-transform duration-150 ease-in-out hover:scale-110">
                    {theme === 'dark' ? <WeatherSunny20Regular className="h-5 w-5" /> : <WeatherMoon20Regular className="h-5 w-5" />}
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={() => setIsSettingsPanelOpen(true)} aria-label="Open settings" className="transform transition-transform duration-150 ease-in-out hover:scale-110">
                  <Settings20Regular className="h-5 w-5" />
                </Button>
              </div>
            <div className="pt-8 sm:pt-10"> 
              <WeeklyProgressView 
                dailyFocusGoal={DEFAULT_DAILY_FOCUS_GOAL_MINUTES}
                progressDisplayUnit={DEFAULT_PROGRESS_DISPLAY_UNIT}
              />
            </div>
          </div>
        )}
      </main>
      <SettingsPanel
        isOpen={isSettingsPanelOpen}
        onClose={() => setIsSettingsPanelOpen(false)}
        settings={settings}
        updateSetting={updateSetting}
      />
    </div>
  );
};

export default FocusGlowApp;
