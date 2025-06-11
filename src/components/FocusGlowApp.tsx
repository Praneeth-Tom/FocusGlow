
"use client";

import { useState, useEffect, useCallback } from 'react';
import AppHeader from '@/components/AppHeader';
import TimerDisplay from '@/components/TimerDisplay';
import TimerControls from '@/components/TimerControls';
import PresetSelector from '@/components/PresetSelector';
import SessionLabelInput from '@/components/SessionLabelInput';
import SettingsPanel from '@/components/SettingsPanel';
import CurrentlyPlayingCard from '@/components/CurrentlyPlayingCard';
import { useSettings } from '@/hooks/useSettings';
import { useTimer } from '@/hooks/useTimer';
import { useToast } from "@/hooks/use-toast";
import * as Tone from 'tone';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const FocusGlowApp = () => {
  const { settings, updateSetting, isMounted: settingsMounted, resetSettings } = useSettings();
  const { toast } = useToast();
  const [sessionLabel, setSessionLabel] = useState<string>('');
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const [currentTimerDuration, setCurrentTimerDuration] = useState(settings.defaultFocusDuration * 60);
  
  // Sound synthesisers
  const [alarmSynth, setAlarmSynth] = useState<Tone.Synth | null>(null);
  const [bellSynth, setBellSynth] = useState<Tone.MetalSynth | null>(null);

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

  const handleTimerEnd = useCallback(() => {
    if (settings.notifyOnCompletion) {
      toast({
        title: "Timer Finished!",
        description: sessionLabel ? `Your "${sessionLabel}" session has ended.` : "Your session has ended.",
      });
      if (Notification.permission === "granted") {
        new Notification("FocusGlow: Timer Finished!", {
          body: sessionLabel ? `Your "${sessionLabel}" session has ended.` : "Your session has ended.",
          icon: '/logo.png', // Assuming you'll add a logo later
        });
      }
    }
    if (settings.enableSoundAlert) {
      playNotificationSound();
    }
  }, [settings.notifyOnCompletion, settings.enableSoundAlert, sessionLabel, toast, playNotificationSound]);

  const { timeLeft, isRunning, isPaused, startTimer, pauseTimer, resumeTimer, resetTimer, setTimeLeft } = useTimer({
    initialDurationInSeconds: currentTimerDuration,
    settings,
    onTimerEnd: handleTimerEnd,
  });
  
  useEffect(() => {
     if (settingsMounted) {
      setCurrentTimerDuration(settings.defaultFocusDuration * 60);
      resetTimer(settings.defaultFocusDuration * 60); // Reset timer when default duration changes in settings
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

  // Request notification permission on mount if not already granted/denied
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission();
      }
    }
    // Ensure Tone.js context is started on user interaction
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
  
  const getBorderRadiusClass = () => {
    switch (settings.roundedCorners) {
      case 'none': return 'rounded-none';
      case 'small': return 'rounded-sm';
      case 'medium': return 'rounded-md';
      case 'large': return 'rounded-lg';
      default: return 'rounded-md';
    }
  };
  
  const mainAppContainerClasses = cn(
    "flex flex-col min-h-screen bg-background text-foreground transition-all duration-300 ease-in-out",
    settings.compactUiMode ? "p-1" : "p-2 sm:p-4",
  );

  const timerCardClasses = cn(
    "bg-card shadow-xl w-full max-w-sm mx-auto",
     getBorderRadiusClass(),
    settings.compactUiMode ? "p-3" : "p-4 md:p-6"
  );


  if (!settingsMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className={mainAppContainerClasses}>
      <AppHeader onToggleSettings={() => setIsSettingsPanelOpen(true)} settings={settings} />
      <main className="flex-grow flex flex-col items-center justify-center">
        <div className={timerCardClasses}>
          <SessionLabelInput label={sessionLabel} onLabelChange={setSessionLabel} />
          <TimerDisplay timeLeft={timeLeft} totalDuration={currentTimerDuration} />
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
        <CurrentlyPlayingCard />
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
