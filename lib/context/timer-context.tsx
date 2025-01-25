"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./auth-context";
import { saveSession } from "@/lib/firebase/timer";
import type { FocusSession } from "@/lib/types/timer";

interface TimerContextType {
  isRunning: boolean;
  minutes: number;
  seconds: number;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  setWorkDuration: (duration: number) => void;
}

const TimerContext = createContext<TimerContextType | null>(null);

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [isRunning, setIsRunning] = useState(false);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [workDuration, setWorkDuration] = useState(25);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          // Timer completed
          handleTimerComplete();
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, minutes, seconds]);

  const handleTimerComplete = async () => {
    setIsRunning(false);
    if (user && sessionStartTime) {
      const session: Omit<FocusSession, "id"> = {
        userId: user.uid,
        duration: workDuration,
        type: "work",
        startTime: sessionStartTime,
        endTime: new Date(),
      };
      try {
        await saveSession(session);
      } catch (error) {
        console.error("Failed to save session:", error);
      }
    }
  };

  const startTimer = () => {
    setIsRunning(true);
    if (!sessionStartTime) {
      setSessionStartTime(new Date());
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setMinutes(workDuration);
    setSeconds(0);
    setSessionStartTime(null);
  };

  const updateWorkDuration = (duration: number) => {
    setWorkDuration(duration);
    if (!isRunning) {
      setMinutes(duration);
      setSeconds(0);
    }
  };

  return (
    <TimerContext.Provider
      value={{
        isRunning,
        minutes,
        seconds,
        startTimer,
        pauseTimer,
        resetTimer,
        setWorkDuration: updateWorkDuration,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error("useTimer must be used within a TimerProvider");
  }
  return context;
}
