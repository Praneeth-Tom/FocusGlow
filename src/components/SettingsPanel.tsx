
"use client";

import type { FC } from 'react';
import { Dismiss20Regular } from '@fluentui/react-icons';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import type { FocusGlowSettings, NotificationSound } from '@/types';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: FocusGlowSettings;
  updateSetting: <K extends keyof FocusGlowSettings>(key: K, value: FocusGlowSettings[K]) => void;
}

const SettingsPanel: FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  settings,
  updateSetting,
}) => {
  if (!isOpen) return null;
  
  const handleNotificationSoundChange = (value: string) => {
    updateSetting('notificationSound', value as NotificationSound);
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
            <Dismiss20Regular className="h-5 w-5" />
          </Button>
        </header>

        <div className="relative flex-grow min-h-0">
          <ScrollArea className="absolute inset-0">
            <div className="space-y-6 p-4">
            <section>
              <h3 className="text-md font-medium mb-3 text-primary">Appearance</h3>
              <div className="space-y-4">
                {/* Font Style and other appearance settings would go here if any */}
              </div>
            </section>

            <section>
              <h3 className="text-md font-medium mb-3 text-primary">Notifications</h3>
              <div className="space-y-4">
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
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>
          </div>
        </ScrollArea>
        </div>

        <footer className="p-4 border-t flex justify-end">
          <Button onClick={onClose}>Done</Button>
        </footer>
      </div>
    </div>
  );
};

export default SettingsPanel;

