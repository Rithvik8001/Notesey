"use client";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useTimer } from "@/lib/context/timer-context";

export default function TimerControls() {
  const { isRunning, startTimer, pauseTimer, resetTimer } = useTimer();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg shadow p-6"
    >
      <div className="flex justify-center gap-4">
        <button
          onClick={isRunning ? pauseTimer : startTimer}
          className="p-4 rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-colors"
          aria-label={isRunning ? "Pause Timer" : "Start Timer"}
        >
          {isRunning ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6" />
          )}
        </button>
        <button
          onClick={resetTimer}
          className="p-4 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors"
          aria-label="Reset Timer"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>
    </motion.div>
  );
}
