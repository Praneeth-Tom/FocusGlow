
export type ThemeMode = 'light' | 'dark' | 'system';
export type FontStyle = 'Segoe UI' | 'Monospace' | 'Inter'; // Segoe UI might not be available, Inter is used
export type RoundedCornerSize = 'none' | 'small' | 'medium' | 'large';
export type NotificationSound = 'alarm' | 'bell' | 'none' | 'custom';

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
  // Add other settings as needed
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
};

export interface CustomPreset {
  id: string;
  name: string;
  duration: number; // in minutes
}
