
"use client";

import type { FC } from 'react';
import { X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { FocusGlowSettings, ThemeMode, FontStyle, RoundedCornerSize, NotificationSound } from '@/types';
import { useTheme } from 'next-themes';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: FocusGlowSettings;
  updateSetting: <K extends keyof FocusGlowSettings>(key: K, value: FocusGlowSettings[K]) => void;
  onResetSettings: () => void;
}

const SettingsPanel: FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  settings,
  updateSetting,
  onResetSettings,
}) => {
  const { setTheme } = useTheme();

  if (!isOpen) return null;

  const handleThemeChange = (value: string) => {
    const themeValue = value as ThemeMode;
    updateSetting('themeMode', themeValue);
    setTheme(themeValue);
  };
  
  const handleRoundedCornersChange = (value: string) => {
    updateSetting('roundedCorners', value as RoundedCornerSize);
  };

  const handleNotificationSoundChange = (value: string) => {
    updateSetting('notificationSound', value as NotificationSound);
  };
  
  const handleDefaultFocusDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      updateSetting('defaultFocusDuration', value);
    }
  };


  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-panel-title"
    >
      <div
        className="bg-card text-card-foreground rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b">
          <h2 id="settings-panel-title" className="text-lg font-semibold">Settings</h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close settings">
            <X className="h-5 w-5" />
          </Button>
        </header>

        <ScrollArea className="flex-grow p-4">
          <div className="space-y-6">
            {/* Appearance Section */}
            <section>
              <h3 className="text-md font-medium mb-3 text-primary">Appearance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="theme-mode">Theme Mode</Label>
                  <Select value={settings.themeMode} onValueChange={handleThemeChange}>
                    <SelectTrigger id="theme-mode" className="w-[180px]">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="compact-ui">Compact UI Mode</Label>
                  <Switch
                    id="compact-ui"
                    checked={settings.compactUiMode}
                    onCheckedChange={checked => updateSetting('compactUiMode', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="rounded-corners">Rounded Corners</Label>
                  <Select value={settings.roundedCorners} onValueChange={handleRoundedCornersChange}>
                    <SelectTrigger id="rounded-corners" className="w-[180px]">
                      <SelectValue placeholder="Select corner style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                 {/* Font Style - Keeping Inter as per instruction, this could be expanded later */}
                 {/* Accent Color Override - Could be complex, deferring for simplicity */}
              </div>
            </section>

            {/* Timer Behavior Section */}
            <section>
              <h3 className="text-md font-medium mb-3 text-primary">Timer Behavior</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="default-duration">Default Focus Duration (min)</Label>
                  <Input
                    id="default-duration"
                    type="number"
                    value={settings.defaultFocusDuration}
                    onChange={handleDefaultFocusDurationChange}
                    className="w-20 h-9 text-center"
                    min="1"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-start">Auto Start Timer after reset</Label>
                  <Switch
                    id="auto-start"
                    checked={settings.autoStartTimer}
                    onCheckedChange={checked => updateSetting('autoStartTimer', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-restart">Auto Restart Timer when finished</Label>
                  <Switch
                    id="auto-restart"
                    checked={settings.autoRestartTimer}
                    onCheckedChange={checked => updateSetting('autoRestartTimer', checked)}
                  />
                </div>
                 <div className="flex items-center justify-between">
                  <Label htmlFor="loop-timer">Loop Timer endlessly</Label>
                  <Switch
                    id="loop-timer"
                    checked={settings.loopTimer}
                    onCheckedChange={checked => updateSetting('loopTimer', checked)}
                  />
                </div>
              </div>
            </section>

            {/* Notifications Section */}
            <section>
              <h3 className="text-md font-medium mb-3 text-primary">Notifications</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notify-completion">Notify on Completion (Browser)</Label>
                  <Switch
                    id="notify-completion"
                    checked={settings.notifyOnCompletion}
                    onCheckedChange={checked => updateSetting('notifyOnCompletion', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="enable-sound">Enable Sound Alert</Label>
                  <Switch
                    id="enable-sound"
                    checked={settings.enableSoundAlert}
                    onCheckedChange={checked => updateSetting('enableSoundAlert', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="notification-sound">Notification Sound</Label>
                   <Select value={settings.notificationSound} onValueChange={handleNotificationSoundChange} disabled={!settings.enableSoundAlert}>
                    <SelectTrigger id="notification-sound" className="w-[180px]">
                      <SelectValue placeholder="Select sound" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alarm">Alarm</SelectItem>
                      <SelectItem value="bell">Bell</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                      {/* Custom sound file upload is complex, deferring */}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>
             {/* Always On Top - Visual toggle only */}
            <section>
              <h3 className="text-md font-medium mb-3 text-primary">Window Behavior</h3>
               <div className="flex items-center justify-between">
                <Label htmlFor="always-on-top" className="text-muted-foreground">
                  Always on Top <span className="text-xs">(Visual Only)</span>
                </Label>
                <Switch
                  id="always-on-top"
                  checked={settings.alwaysOnTop}
                  onCheckedChange={checked => updateSetting('alwaysOnTop', checked)}
                />
              </div>
            </section>
          </div>
        </ScrollArea>

        <footer className="p-4 border-t flex justify-end">
           <Button variant="destructive" onClick={onResetSettings} className="mr-2">
            <Trash2 className="mr-2 h-4 w-4" /> Reset to Defaults
          </Button>
          <Button onClick={onClose}>Done</Button>
        </footer>
      </div>
    </div>
  );
};

export default SettingsPanel;
