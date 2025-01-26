"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/context/auth-context";
import { getUserNotes } from "@/lib/firebase/notes";
import { getSessions } from "@/lib/firebase/timer";
import { MessageSquare, Edit3, Clock } from "lucide-react";
import ActionCard from "@/components/dashboard/action-card";
import ActivitySection from "@/components/dashboard/activity-section";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalNotes: 0,
    recentNotes: 0,
    focusTime: {
      today: 0,
      week: 0,
    },
  });

  useEffect(() => {
    const loadStats = async () => {
      if (!user) return;

      try {
        const notes = await getUserNotes(user.uid);
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);

        const recentNotes = notes.filter(
          (note) => note.createdAt.toDate() >= startDate
        );

        const sessions = await getSessions(user.uid, "week");
        const today = new Date().setHours(0, 0, 0, 0);

        const focusTime = sessions.reduce(
          (acc, session) => {
            if (session.type === "work") {
              const sessionDate = session.startTime.setHours(0, 0, 0, 0);
              if (sessionDate === today) {
                acc.today += session.duration;
              }
              acc.week += session.duration;
            }
            return acc;
          },
          { today: 0, week: 0 }
        );

        setStats({
          totalNotes: notes.length,
          recentNotes: recentNotes.length,
          focusTime,
        });
      } catch (error) {
        console.error("Failed to load activity stats:", error);
      }
    };

    loadStats();
  }, [user]);

  const actions = [
    {
      title: "Q&A Assistant",
      description: "Get instant answers to your study questions with AI",
      icon: MessageSquare,
      href: "/dashboard/chat",
    },
    {
      title: "Study Notes",
      description: "Create and organize your study materials",
      icon: Edit3,
      href: "/dashboard/notes",
    },
    {
      title: "Focus Timer",
      description: "Stay productive with Pomodoro technique",
      icon: Clock,
      href: "/dashboard/timer",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Welcome back
        </h1>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {actions.map((action) => (
            <ActionCard key={action.title} {...action} />
          ))}
        </div>

        {/* Activity Section */}
        <ActivitySection stats={stats} />
      </div>
    </div>
  );
}
