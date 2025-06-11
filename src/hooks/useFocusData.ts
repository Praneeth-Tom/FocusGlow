
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { DailyFocusEntry } from '@/types';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, parseISO, isWithinInterval, getISODay } from 'date-fns';

const FOCUS_DATA_STORAGE_KEY = 'focusGlowFocusData';
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function useFocusData() {
  const [focusData, setFocusData] = useState<DailyFocusEntry[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedData = localStorage.getItem(FOCUS_DATA_STORAGE_KEY);
      if (storedData) {
        setFocusData(JSON.parse(storedData));
      }
    } catch (error) {
      console.error("Failed to load focus data from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (isMounted && focusData.length > 0) { // Only save if there's actual data
      try {
        localStorage.setItem(FOCUS_DATA_STORAGE_KEY, JSON.stringify(focusData));
      } catch (error) {
        console.error("Failed to save focus data to localStorage", error);
      }
    }
  }, [focusData, isMounted]);

  const addFocusSession = useCallback((minutes: number) => {
    if (!isMounted) return; // Prevent updates before hydration
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    setFocusData(prevData => {
      const existingEntryIndex = prevData.findIndex(entry => entry.date === todayStr);
      if (existingEntryIndex > -1) {
        const updatedData = [...prevData];
        updatedData[existingEntryIndex] = {
          ...updatedData[existingEntryIndex],
          focusedMinutes: updatedData[existingEntryIndex].focusedMinutes + minutes,
        };
        return updatedData;
      } else {
        return [...prevData, { date: todayStr, focusedMinutes: minutes }];
      }
    });
  }, [isMounted]);

  const getWeekData = useCallback(() => {
    if (!isMounted) return [];
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });     // Sunday
    
    const currentWeekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return currentWeekDays.map((dayDate, index) => {
      const dateStr = format(dayDate, 'yyyy-MM-dd');
      const entry = focusData.find(e => e.date === dateStr);
      return {
        date: dateStr,
        dayLabel: DAY_LABELS[index], // Relies on eachDayOfInterval returning Mon-Sun in order
        focusedMinutes: entry ? entry.focusedMinutes : 0,
      };
    });
  }, [focusData, isMounted]);

  const getTotalWeekFocusedMinutes = useCallback(() => {
    return getWeekData().reduce((total, day) => total + day.focusedMinutes, 0);
  }, [getWeekData]);
  
  const resetWeekData = useCallback(() => {
    // For now, this removes all data for the current week.
    // A more sophisticated version might archive it or only clear visible week.
    if (!isMounted) return;
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

    setFocusData(prevData => prevData.filter(entry => {
      const entryDate = parseISO(entry.date);
      return !isWithinInterval(entryDate, { start: weekStart, end: weekEnd });
    }));
  }, [isMounted]);


  return { addFocusSession, getWeekData, getTotalWeekFocusedMinutes, resetWeekData, isMounted };
}
