"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { useAuth } from "@/lib/context/auth-context";
import { getSessions } from "@/lib/firebase/timer";
import type { FocusSession } from "@/lib/types/timer";

interface TimerStatsProps {
  timeRange: "day" | "week" | "month";
  onTimeRangeChange: (range: "day" | "week" | "month") => void;
}

export default function TimerStats({
  timeRange,
  onTimeRangeChange,
}: TimerStatsProps) {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSessions = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const data = await getSessions(user.uid, timeRange);
        setSessions(data);
      } catch (error) {
        console.error("Failed to load sessions:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, [user, timeRange]);

  const totalFocusTime = sessions.reduce((total, session) => {
    return session.type === "work" ? total + session.duration : total;
  }, 0);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg shadow p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5 text-primary-600" />
        <h3 className="text-lg font-semibold">Focus Statistics</h3>
      </div>

      <div className="flex gap-2 mb-6">
        {(["day", "week", "month"] as const).map((range) => (
          <button
            key={range}
            onClick={() => onTimeRangeChange(range)}
            className={`px-3 py-1 rounded-md ${
              timeRange === range
                ? "bg-primary-100 text-primary-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading stats...</div>
      ) : (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600">
              {formatTime(totalFocusTime)}
            </div>
            <div className="text-sm text-gray-500">Total Focus Time</div>
          </div>

          <div className="h-40 flex items-end gap-2">
            {sessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ height: 0 }}
                animate={{ height: `${(session.duration / 60) * 100}%` }}
                className={`flex-1 rounded-t-md ${
                  session.type === "work"
                    ? "bg-primary-200"
                    : "bg-secondary-200"
                }`}
                title={`${session.duration} minutes`}
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
