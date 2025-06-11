
"use client";

import type { FC } from 'react';
import { useFocusData } from '@/hooks/useFocusData';
import type { ProgressDisplayUnit } from '@/types';
import DailyFocusBar from './DailyFocusBar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Warning20Regular, ArrowTrending20Regular, ArrowCounterclockwise20Regular } from '@fluentui/react-icons';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface WeeklyProgressViewProps {
  dailyFocusGoal: number;
  progressDisplayUnit: ProgressDisplayUnit;
}

const WeeklyProgressView: FC<WeeklyProgressViewProps> = ({ dailyFocusGoal, progressDisplayUnit }) => {
  const { getWeekData, getTotalWeekFocusedMinutes, resetWeekData, isMounted } = useFocusData();

  if (!isMounted) {
    return null; 
  }

  const weekData = getWeekData();
  const totalWeekMinutes = getTotalWeekFocusedMinutes();
  const mostFocusedDayMinutes = Math.max(...weekData.map(d => d.focusedMinutes), 0);
  
  const formatTotalTime = (minutes: number) => {
    if (progressDisplayUnit === 'hours') {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}m`;
    }
    return `${minutes} minutes`;
  };

  const allDaysZeroFocus = weekData.every(day => day.focusedMinutes === 0);

  return (
    <> {/* Removed outer Card component, parent div in FocusGlowApp will provide card styling */}
      {/* Mimics CardHeader */}
      <div className="flex items-center text-lg font-semibold mb-4"> 
        <ArrowTrending20Regular className="mr-2 h-5 w-5 text-primary" />
        Weekly Focus Summary
      </div>
      
      {/* Mimics CardContent */}
      <div className="flex justify-around items-end min-h-[220px] relative mb-4">
        {allDaysZeroFocus ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-muted-foreground py-4">
            <Warning20Regular className="mx-auto h-8 w-8 mb-2" />
            No focus data recorded for this week yet.
          </div>
        ) : (
          weekData.map((day) => (
            <DailyFocusBar
              key={day.date}
              dayLabel={day.dayLabel}
              focusedMinutes={day.focusedMinutes}
              goalMinutes={dailyFocusGoal}
              displayUnit={progressDisplayUnit}
              isMostFocused={day.focusedMinutes > 0 && day.focusedMinutes === mostFocusedDayMinutes && weekData.filter(d => d.focusedMinutes > 0).length > 1}
            />
          ))
        )}
      </div>
      
      {/* Mimics CardFooter */}
      {(totalWeekMinutes > 0 || !allDaysZeroFocus) && ( 
        <div className="flex-col items-start space-y-2 border-t pt-4">
          <p className="text-sm font-semibold text-foreground">
            Total this week: {formatTotalTime(totalWeekMinutes)}
          </p>
          <p className="text-xs text-muted-foreground">
            Daily goal: {dailyFocusGoal > 0 ? formatTotalTime(dailyFocusGoal) : 'Not set'}
          </p>
           <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="mt-2">
                <ArrowCounterclockwise20Regular className="mr-2 h-3 w-3" /> Reset Current Week Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will reset all focus data for the current week. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={resetWeekData} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Reset Data
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </>
  );
};

export default WeeklyProgressView;
