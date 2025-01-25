"use client";
import { motion } from "framer-motion";
import { Timer } from "lucide-react";
import { useTimer } from "@/lib/context/timer-context";

export default function TimerDisplay() {
  const { minutes, seconds } = useTimer();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg shadow p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <Timer className="w-5 h-5 text-primary-600" />
        <h3 className="text-lg font-semibold">Focus Timer</h3>
      </div>

      <div className="text-center">
        <div className="text-6xl font-bold text-primary-600 font-mono">
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </div>
      </div>
    </motion.div>
  );
}
