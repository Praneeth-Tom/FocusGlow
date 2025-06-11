
export type ThemeMode = 'light' | 'dark' | 'system';
export type FontStyle = 'Segoe UI' | 'Monospace' | 'Inter'; // Segoe UI might not be available, Inter is used
export type RoundedCornerSize = 'none' | 'small' | 'medium' | 'large';
export type NotificationSound = 'alarm' | 'bell' | 'none' | 'custom';
export type ProgressDisplayUnit = 'minutes' | 'hours';
export type TimerVisualStyle = 'circular' | 'dotMatrix';

export interface FocusGlowSettings {
  themeMode: ThemeMode;
  accentColorOverride?: string;
  fontStyle: FontStyle;
  compactUiMode: boolean;
  roundedCorners: RoundedCornerSize;
  alwaysOnTop: boolean; // UI toggle, not actual OS feature
  defaultFocusDuration: number; // in minutes
  autoStartTimer: boolean;
  autoRestartTimer: boolean;
  notifyOnCompletion: boolean;
  notificationSound: NotificationSound;
  enableSoundAlert: boolean;
  loopTimer: boolean;
  // New settings for Weekly Focus Progress
  dailyFocusGoal: number; // in minutes
  progressDisplayUnit: ProgressDisplayUnit;
  timerVisualStyle: TimerVisualStyle;
}

export const DEFAULT_SETTINGS: FocusGlowSettings = {
  themeMode: 'system',
  fontStyle: 'Inter',
  compactUiMode: false,
  roundedCorners: 'medium',
  alwaysOnTop: false,
  defaultFocusDuration: 25, // minutes
  autoStartTimer: false,
  autoRestartTimer: false,
  notifyOnCompletion: true,
  notificationSound: 'alarm',
  enableSoundAlert: true,
  loopTimer: false,
  dailyFocusGoal: 120, // Default 2 hours
  progressDisplayUnit: 'minutes',
  timerVisualStyle: 'circular',
};

export interface CustomPreset {
  id: string;
  name: string;
  duration: number; // in minutes
}

export interface DailyFocusEntry {
  date: string; // YYYY-MM-DD
  focusedMinutes: number;
}
