
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { FocusGlowSettings, ThemeMode } from '@/types';
import { DEFAULT_SETTINGS } from '@/types';

const SETTINGS_STORAGE_KEY = 'focusGlowSettings';

export function useSettings() {
  const [settings, setSettings] = useState<FocusGlowSettings>(DEFAULT_SETTINGS);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        // Ensure all keys from DEFAULT_SETTINGS are present
        const completeSettings = { ...DEFAULT_SETTINGS, ...parsedSettings };
        setSettings(completeSettings);
      } else {
        setSettings(DEFAULT_SETTINGS);
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
      }
    } catch (error) {
      console.error("Failed to load settings from localStorage", error);
      setSettings(DEFAULT_SETTINGS);
    }
  }, []);

  useEffect(() => {
    if (isMounted && settings !== DEFAULT_SETTINGS) { // Avoid writing default settings initially if nothing changed
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      } catch (error) {
        console.error("Failed to save settings to localStorage", error);
      }
    }
  }, [settings, isMounted]);

  const updateSetting = useCallback(<K extends keyof FocusGlowSettings>(key: K, value: FocusGlowSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);
  
  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
  }, []);

  return { settings, updateSetting, isMounted, resetSettings };
}
