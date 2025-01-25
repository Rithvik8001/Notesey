"use client";
import { useState } from "react";
import TimerDisplay from "@/components/focus/timer-display";
import TimerControls from "@/components/focus/timer-controls";
import TimerSettings from "@/components/focus/timer-settings";
import TimerStats from "@/components/focus/timer-stats";
import TaskList from "@/components/focus/task-list";
import { TimerProvider } from "@/lib/context/timer-context";

export default function TimerPage() {
  const [timeRange, setTimeRange] = useState<"day" | "week" | "month">("day");

  return (
    <TimerProvider>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6 max-w-xl mx-auto lg:max-w-none w-full">
            <TimerDisplay />
            <TimerControls />
            <TimerSettings />
          </div>
          <div className="space-y-6 max-w-xl mx-auto lg:max-w-none w-full">
            <TimerStats
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
            />
            <TaskList />
          </div>
        </div>
      </div>
    </TimerProvider>
  );
}
