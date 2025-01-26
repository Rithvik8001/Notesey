"use client";
import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";
import { useAuth } from "@/lib/context/auth-context";

interface ActivitySectionProps {
  stats: {
    totalNotes: number;
    recentNotes: number;
    focusTime: {
      today: number;
      week: number;
    };
  };
}

export default function ActivitySection({ stats }: ActivitySectionProps) {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200"
    >
      {/* Weekly Activity Section */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-medium text-gray-900">Weekly Activity</h3>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-primary-600">
              {stats.totalNotes}
            </div>
            <div className="text-sm text-gray-600">Total Notes</div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-primary-600">
              {stats.recentNotes}
            </div>
            <div className="text-sm text-gray-600">Notes This Week</div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-primary-600">
            {Math.round((stats.recentNotes / stats.totalNotes) * 100 || 0)}%
          </div>
          <div className="text-sm text-gray-600">Weekly Activity</div>
        </div>
      </div>

      {/* Focus Time Section */}
      <div className="border-t border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5 text-primary-600" />
          <h4 className="text-lg font-medium text-gray-900">Focus Time</h4>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-primary-600">
              {stats.focusTime.today}m
            </div>
            <div className="text-sm text-gray-600">Today's Focus Time</div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-primary-600">
              {stats.focusTime.week}m
            </div>
            <div className="text-sm text-gray-600">This Week's Focus Time</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
