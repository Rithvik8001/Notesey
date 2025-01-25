"use client";
import { useAuth } from "@/lib/context/auth-context";
import PageHeader from "@/components/dashboard/page-header";
import ActionCard from "@/components/dashboard/action-card";
import { MessageSquare, BookOpen, Brain } from "lucide-react";

const actions = [
  {
    title: "Ask Questions",
    description:
      "Get instant answers to your academic questions with our AI assistant",
    icon: MessageSquare,
    href: "/dashboard/chat",
  },
  {
    title: "Generate Summaries",
    description:
      "Upload your study materials and get concise, easy-to-understand summaries",
    icon: BookOpen,
    href: "/dashboard/summaries",
  },
  {
    title: "Practice with Quizzes",
    description:
      "Test your knowledge with AI-generated quizzes based on your materials",
    icon: Brain,
    href: "/dashboard/quizzes",
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const displayName =
    user?.displayName || user?.email?.split("@")[0] || "there";

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${displayName}! 👋`}
        description="What would you like to do today?"
      />

      <div className="mt-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {actions.map((action) => (
            <ActionCard
              key={action.title}
              title={action.title}
              description={action.description}
              icon={action.icon}
              href={action.href}
            />
          ))}
        </div>

        <div className="mt-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-500 text-center">
              Your recent activity will appear here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
