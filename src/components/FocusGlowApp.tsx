
"use client";

import { useState, useEffect, useCallback } from 'react';
import TimerDisplay from '@/components/TimerDisplay';
import TimerControls from '@/components/TimerControls';
import PresetSelector from '@/components/PresetSelector';
import SettingsPanel from '@/components/SettingsPanel';
import CurrentlyPlayingCard from '@/components/CurrentlyPlayingCard';
import WeeklyProgressView from '@/components/WeeklyProgressView';
import FocusTypeSelector, { type FocusType } from '@/components/FocusTypeSelector'; // Added import
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

const FocusGlowApp = () => {
  const { settings, updateSetting, isMounted: settingsMounted, resetSettings } = useSettings();
  const { toast } = useToast();
  const { addFocusSession, isMounted: focusDataMounted } = useFocusData();

  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const [currentTimerDuration, setCurrentTimerDuration] = useState(settings.defaultFocusDuration * 60);
  const [currentView, setCurrentView] = useState<AppView>('timer');
  const [currentFocusType, setCurrentFocusType] = useState<FocusType>('Work'); // Added state for focus type
  
  const [alarmSynth, setAlarmSynth] = useState<Tone.Synth | null>(null);
  const [bellSynth, setBellSynth] = useState<Tone.MetalSynth | null>(null);

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
      addFocusSession(focusedMinutes); // In a future step, 'currentFocusType' could be passed here
    }
  }, [addFocusSession, focusDataMounted]);

  const handleTimerEnd = useCallback(() => {
    if (settings.notifyOnCompletion) {
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
    }
    if (settings.enableSoundAlert) {
      playNotificationSound();
    }
  }, [settings.notifyOnCompletion, settings.enableSoundAlert, toast, playNotificationSound]);

  const { timeLeft, isRunning, isPaused, startTimer, pauseTimer, resumeTimer, resetTimer, setTimeLeft } = useTimer({
    initialDurationInSeconds: currentTimerDuration,
    settings,
    onTimerEnd: handleTimerEnd,
    onSessionComplete: handleSessionComplete,
  });
  
  useEffect(() => {
     if (settingsMounted) {
      setCurrentTimerDuration(settings.defaultFocusDuration * 60);
      resetTimer(settings.defaultFocusDuration * 60);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.defaultFocusDuration, settingsMounted]);

  const handleSelectPreset = useCallback((minutes: number) => {
    const newDurationSeconds = minutes * 60;
    setCurrentTimerDuration(newDurationSeconds);
    resetTimer(newDurationSeconds);
    if (settings.autoStartTimer) {
      startTimer();
    }
  }, [resetTimer, settings.autoStartTimer, startTimer]);

  const handleSelectFocusType = useCallback((type: FocusType) => { // Added handler
    setCurrentFocusType(type);
    // Potentially reset timer or log change here in the future
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
  
  const getBorderRadiusClass = useCallback(() => {
    switch (settings.roundedCorners) {
      case 'none': return 'rounded-none';
      case 'small': return 'rounded-sm';
      case 'medium': return 'rounded-md';
      case 'large': return 'rounded-lg';
      default: return 'rounded-md';
    }
  }, [settings.roundedCorners]);
  
  const mainAppContainerClasses = cn(
    "flex flex-col min-h-screen bg-background text-foreground transition-all duration-300 ease-in-out",
    settings.compactUiMode ? "p-1" : "p-2 sm:p-4",
  );

  const timerCardClasses = cn(
    "bg-card border shadow-lg w-full max-w-sm mx-auto relative",
     getBorderRadiusClass(),
    settings.compactUiMode ? "p-3" : "p-4 md:p-6" // Removed explicit pt-12/pt-14
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
            <div className={timerCardClasses}>
              <div className="absolute top-3 right-3 flex items-center space-x-1 z-10">
                {mounted && (
                  <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
                    {theme === 'dark' ? <WeatherSunny20Regular className="h-5 w-5" /> : <WeatherMoon20Regular className="h-5 w-5" />}
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={() => setIsSettingsPanelOpen(true)} aria-label="Open settings">
                  <Settings20Regular className="h-5 w-5" />
                </Button>
                {mounted && (
                  <Button variant="ghost" size="icon" onClick={() => setCurrentView('progress')} aria-label="View progress">
                    <ArrowRight20Regular className="h-5 w-5" />
                  </Button>
                )}
              </div>
              <div className="pt-8 sm:pt-10"> {/* Wrapper for content flow below icons */}
                <FocusTypeSelector currentFocusType={currentFocusType} onSelectFocusType={handleSelectFocusType} />
                <TimerDisplay timeLeft={timeLeft} totalDuration={currentTimerDuration} settings={settings} />
                <PresetSelector onSelectPreset={handleSelectPreset} currentDurationMinutes={Math.floor(currentTimerDuration / 60)} />
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
            <CurrentlyPlayingCard />
          </>
        )}
        {currentView === 'progress' && (
           <div className="w-full max-w-sm mx-auto relative">
             <div className="absolute top-3 right-3 flex items-center space-x-1 z-10">
                {mounted && (
                  <Button variant="ghost" size="icon" onClick={() => setCurrentView('timer')} aria-label="Back to timer">
                    <ArrowLeft20Regular className="h-5 w-5" />
                  </Button>
                )}
                {mounted && (
                  <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
                    {theme === 'dark' ? <WeatherSunny20Regular className="h-5 w-5" /> : <WeatherMoon20Regular className="h-5 w-5" />}
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={() => setIsSettingsPanelOpen(true)} aria-label="Open settings">
                  <Settings20Regular className="h-5 w-5" />
                </Button>
              </div>
            <WeeklyProgressView settings={settings} getBorderRadiusClass={getBorderRadiusClass} />
          </div>
        )}
      </main>
      <SettingsPanel
        isOpen={isSettingsPanelOpen}
        onClose={() => setIsSettingsPanelOpen(false)}
        settings={settings}
        updateSetting={updateSetting}
        onResetSettings={resetSettings}
      />
    </div>
  );
};

export default FocusGlowApp;
    
