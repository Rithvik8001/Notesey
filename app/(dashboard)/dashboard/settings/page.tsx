"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Bell, Moon, Sun } from "lucide-react";
import PageHeader from "@/components/dashboard/page-header";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Customize your app preferences"
      />

      <div className="mt-8 space-y-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Settings className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold">General Settings</h3>
          </div>

          <div className="space-y-6">
            {/* Theme Preference */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium mb-1">Theme</h4>
                <p className="text-sm text-gray-600">
                  Choose your preferred theme
                </p>
              </div>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            {/* Timer Settings */}
            <div>
              <h4 className="font-medium mb-4">Timer Preferences</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Default Work Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    defaultValue="25"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div>
              <h4 className="font-medium mb-4">Notifications</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Timer Notifications</p>
                    <p className="text-sm text-gray-600">
                      Get notified when your timer ends
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications}
                      onChange={(e) => setNotifications(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div>
              <h4 className="font-medium mb-4">Account</h4>
              <div className="space-y-4">
                <button
                  onClick={() => {
                    /* Add sign out logic */
                  }}
                  className="w-full bg-red-50 text-red-600 rounded-md py-2 hover:bg-red-100 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
