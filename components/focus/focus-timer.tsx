"use client";
import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

const WORK_TIME = 25 * 60; // 25 minutes in seconds
const BREAK_TIME = 5 * 60; // 5 minutes in seconds

export default function FocusTimer() {
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  // Calculate progress percentage
  const totalTime = isBreak ? BREAK_TIME : WORK_TIME;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  // Calculate circle properties
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Play sound notification
      new Audio("/notification.mp3").play().catch(() => {});
      // Switch between work and break
      setIsBreak(!isBreak);
      setTimeLeft(isBreak ? WORK_TIME : BREAK_TIME);
      setIsRunning(false);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isBreak]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleReset = () => {
    setTimeLeft(WORK_TIME);
    setIsRunning(false);
    setIsBreak(false);
  };

  return (
    <div className="max-w-md mx-auto">
      <motion.div
        className="bg-white rounded-2xl shadow-lg p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-semibold mb-6">
          {isBreak ? "Break Time" : "Focus Time"}
        </h2>

        <div className="relative w-64 h-64 mx-auto mb-8">
          {/* Background circle */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              className="fill-none stroke-gray-100"
              strokeWidth="12"
            />
            {/* Progress circle */}
            <motion.circle
              cx="50%"
              cy="50%"
              r={radius}
              className="fill-none stroke-primary-600"
              strokeWidth="12"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5 }}
            />
          </svg>

          {/* Timer text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl font-bold text-primary-600">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsRunning(!isRunning)}
            className="p-4 bg-primary-100 text-primary-600 rounded-full hover:bg-primary-200 transition-colors"
          >
            {isRunning ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            className="p-4 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
          >
            <RotateCcw className="w-6 h-6" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
