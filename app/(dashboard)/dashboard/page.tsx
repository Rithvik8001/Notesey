"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  AlertCircle,
  Clock,
  BookOpen,
  CheckSquare,
} from "lucide-react";
import { useAuth } from "@/lib/context/auth-context";
import { getSessions } from "@/lib/firebase/timer";
import { getUserNotes } from "@/lib/firebase/notes";
import PageHeader from "@/components/dashboard/page-header";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"day" | "week" | "month">("week");
  const [stats, setStats] = useState({
    totalFocusTime: 0,
    completedTasks: 0,
    notesCreated: 0,
  });

  const hasActivity =
    stats.totalFocusTime > 0 ||
    stats.completedTasks > 0 ||
    stats.notesCreated > 0;

  useEffect(() => {
    const loadStats = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const sessions = await getSessions(user.uid, timeRange);
        const totalMinutes = sessions.reduce(
          (total, session) => total + session.duration,
          0
        );

        const notes = await getUserNotes(user.uid);
        const startDate = new Date();
        switch (timeRange) {
          case "day":
            startDate.setHours(0, 0, 0, 0);
            break;
          case "week":
            startDate.setDate(startDate.getDate() - 7);
            break;
          case "month":
            startDate.setMonth(startDate.getMonth() - 1);
            break;
        }

        const recentNotes = notes.filter(
          (note) => note.createdAt.toDate() >= startDate
        );

        setStats({
          totalFocusTime: Math.round(totalMinutes / 60),
          completedTasks: sessions.length,
          notesCreated: recentNotes.length,
        });
      } catch (error) {
        console.error("Failed to load activity stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user, timeRange]);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's an overview of your activity."
      />

      <div className="mt-8 space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/timer"
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <Clock className="w-5 h-5 text-primary-600 mb-4" />
            <h3 className="font-semibold mb-2">Focus Timer</h3>
            <p className="text-sm text-gray-600">
              Start a focused work session with the Pomodoro technique
            </p>
          </Link>

          <Link
            href="/dashboard/notes"
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <BookOpen className="w-5 h-5 text-primary-600 mb-4" />
            <h3 className="font-semibold mb-2">Notes</h3>
            <p className="text-sm text-gray-600">
              Create and manage your notes and ideas
            </p>
          </Link>

          <Link
            href="/dashboard/timer"
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <CheckSquare className="w-5 h-5 text-primary-600 mb-4" />
            <h3 className="font-semibold mb-2">Focus Tasks</h3>
            <p className="text-sm text-gray-600">
              Manage your tasks for focus sessions
            </p>
          </Link>
        </div>

        {/* Activity Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-semibold">Activity</h3>
            </div>
            <select
              value={timeRange}
              onChange={(e) =>
                setTimeRange(e.target.value as "day" | "week" | "month")
              }
              className="rounded-md border-gray-300 text-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="day">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="p-4 bg-gray-50 rounded-lg animate-pulse"
                >
                  <div className="h-8 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : !hasActivity ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-2">No activity</p>
              <p className="text-sm text-gray-500">
                Start a focus session or create notes to see your activity here
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-primary-600">
                  {stats.totalFocusTime}h
                </div>
                <div className="text-sm text-gray-600">Focus Time</div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-primary-600">
                  {stats.completedTasks}
                </div>
                <div className="text-sm text-gray-600">Focus Sessions</div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-primary-600">
                  {stats.notesCreated}
                </div>
                <div className="text-sm text-gray-600">Notes Created</div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
