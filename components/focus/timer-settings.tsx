"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings } from "lucide-react";
import { useTimer } from "@/lib/context/timer-context";

export default function TimerSettings() {
  const { minutes, setWorkDuration } = useTimer();
  const [inputValue, setInputValue] = useState(minutes.toString());

  useEffect(() => {
    setInputValue(minutes.toString());
  }, [minutes]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    const duration = parseInt(value);
    if (!isNaN(duration) && duration > 0) {
      setWorkDuration(duration);
    }
  };

  const handleBlur = () => {
    if (!inputValue || parseInt(inputValue) <= 0) {
      setInputValue(minutes.toString());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg shadow p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-5 h-5 text-primary-600" />
        <h3 className="text-lg font-semibold">Timer Settings</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Work Duration (minutes)
          </label>
          <input
            type="number"
            min="1"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
      </div>
    </motion.div>
  );
}
