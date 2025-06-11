
export type ThemeMode = 'light' | 'dark' | 'system';
export type FontStyle = 'Segoe UI' | 'Monospace' | 'Inter'; // Segoe UI might not be available, Inter is used
export type RoundedCornerSize = 'none' | 'small' | 'medium' | 'large';
export type NotificationSound = 'alarm' | 'bell' | 'none' | 'custom';
export type ProgressDisplayUnit = 'minutes' | 'hours';
export type TimerVisualStyle = 'circular' | 'dotMatrix' | 'pills';

export interface FocusGlowSettings {
  themeMode: ThemeMode;
  accentColorOverride?: string;
  fontStyle: FontStyle;
  // compactUiMode: boolean; // Removed
  // roundedCorners: RoundedCornerSize; // Removed
  alwaysOnTop: boolean; // UI toggle, not actual OS feature
  // notifyOnCompletion: boolean; // Removed
  notificationSound: NotificationSound;
  enableSoundAlert: boolean;
  // New settings for Weekly Focus Progress
  dailyFocusGoal: number; // in minutes
  progressDisplayUnit: ProgressDisplayUnit;
  timerVisualStyle: TimerVisualStyle;
}

export const DEFAULT_SETTINGS: FocusGlowSettings = {
  themeMode: 'system',
  fontStyle: 'Inter',
  // compactUiMode: false, // Removed
  // roundedCorners: 'medium', // Removed
  alwaysOnTop: false,
  // notifyOnCompletion: true, // Removed
  notificationSound: 'alarm',
  enableSoundAlert: true,
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
