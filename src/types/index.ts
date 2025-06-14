
export type FontStyle = 'Segoe UI' | 'Monospace' | 'Inter'; // Segoe UI might not be available, Inter is used
export type RoundedCornerSize = 'none' | 'small' | 'medium' | 'large';
export type NotificationSound = 'alarm' | 'bell' | 'none' | 'custom';
export type ProgressDisplayUnit = 'minutes' | 'hours';


export interface FocusGlowSettings {
  fontStyle: FontStyle;
  notificationSound: NotificationSound;
  enableSoundAlert: boolean;
  showMusicCard: boolean;
}

export const DEFAULT_SETTINGS: FocusGlowSettings = {
  fontStyle: 'Inter',
  notificationSound: 'alarm',
  enableSoundAlert: true,
  showMusicCard: true,
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

