
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
  // alwaysOnTop: boolean; // UI toggle, not actual OS feature - REMOVED
  notificationSound: NotificationSound;
  enableSoundAlert: boolean;
  timerVisualStyle: TimerVisualStyle;
}

export const DEFAULT_SETTINGS: FocusGlowSettings = {
  themeMode: 'system',
  fontStyle: 'Inter',
  // alwaysOnTop: false, // REMOVED
  notificationSound: 'alarm',
  enableSoundAlert: true,
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
