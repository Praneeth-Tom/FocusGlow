
"use client";

import type { FC } from 'react';
import { useFocusData } from '@/hooks/useFocusData';
import type { FocusGlowSettings } from '@/types';
import DailyFocusBar from './DailyFocusBar';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AlertCircle, TrendingUp, RotateCcw } from 'lucide-react';
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
  settings: FocusGlowSettings;
  getBorderRadiusClass: () => string;
}

const WeeklyProgressView: FC<WeeklyProgressViewProps> = ({ settings, getBorderRadiusClass }) => {
  const { getWeekData, getTotalWeekFocusedMinutes, resetWeekData, isMounted } = useFocusData();

  if (!isMounted) {
    return null; 
  }

  const weekData = getWeekData();
  const totalWeekMinutes = getTotalWeekFocusedMinutes();
  const mostFocusedDayMinutes = Math.max(...weekData.map(d => d.focusedMinutes), 0);
  
  const formatTotalTime = (minutes: number) => {
    if (settings.progressDisplayUnit === 'hours') {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}m`;
    }
    return `${minutes} minutes`;
  };

  const allDaysZeroFocus = weekData.every(day => day.focusedMinutes === 0);

  return (
    <Card className={cn("w-full max-w-md mx-auto shadow-xl", getBorderRadiusClass())}>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <TrendingUp className="mr-2 h-5 w-5 text-primary" />
          Weekly Focus Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-around items-end p-3 sm:p-4 min-h-[220px] relative">
        {allDaysZeroFocus ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-muted-foreground py-4">
            <AlertCircle className="mx-auto h-8 w-8 mb-2" />
            No focus data recorded for this week yet.
          </div>
        ) : (
          weekData.map((day) => (
            <DailyFocusBar
              key={day.date}
              dayLabel={day.dayLabel}
              focusedMinutes={day.focusedMinutes}
              goalMinutes={settings.dailyFocusGoal}
              displayUnit={settings.progressDisplayUnit}
              isMostFocused={day.focusedMinutes > 0 && day.focusedMinutes === mostFocusedDayMinutes && weekData.filter(d => d.focusedMinutes > 0).length > 1}
            />
          ))
        )}
      </CardContent>
      {(totalWeekMinutes > 0 || !allDaysZeroFocus) && ( // Show footer if there's any data or if it's not all zero (to allow reset)
        <CardFooter className="flex-col items-start space-y-2 p-3 sm:p-4 border-t">
          <p className="text-sm font-semibold text-foreground">
            Total this week: {formatTotalTime(totalWeekMinutes)}
          </p>
          <p className="text-xs text-muted-foreground">
            Daily goal: {settings.dailyFocusGoal > 0 ? formatTotalTime(settings.dailyFocusGoal) : 'Not set'}
          </p>
           <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="mt-2">
                <RotateCcw className="mr-2 h-3 w-3" /> Reset Current Week Data
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
        </CardFooter>
      )}
    </Card>
  );
};

export default WeeklyProgressView;
