"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/context/auth-context";
import { getSessions } from "@/lib/firebase/timer";
import { getUserNotes } from "@/lib/firebase/notes";

export default function ActivitySection() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
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
      if (!user) {
        console.log("No user found");
        return;
      }
      console.log("Loading stats for user:", user.uid);

      try {
        setLoading(true);
        // Get last 7 days of sessions
        const sessions = await getSessions(user.uid, "week");
        console.log("Sessions:", sessions);
        const totalMinutes = sessions.reduce(
          (total, session) => total + session.duration,
          0
        );

        // Get notes created in last 7 days
        const notes = await getUserNotes(user.uid);
        console.log("Notes:", notes);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        console.log("Week ago:", weekAgo);

        const recentNotes = notes.filter((note) => {
          const noteDate = note.createdAt.toDate();
          console.log("Note date:", noteDate);
          return noteDate >= weekAgo;
        });
        console.log("Recent notes:", recentNotes);

        setStats({
          totalFocusTime: Math.round(totalMinutes / 60), // Convert to hours
          completedTasks: sessions.length,
          notesCreated: recentNotes.length,
        });
        console.log("Stats set:", {
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
  }, [user]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg shadow p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-5 h-5 text-primary-600" />
        <h3 className="text-lg font-semibold">Weekly Activity</h3>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 bg-gray-50 rounded-lg animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : !hasActivity ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-2">No recent activity</p>
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
  );
}
