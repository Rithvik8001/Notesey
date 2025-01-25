import HeroSection from "@/components/landing/hero-section";
import { MessageSquare, Edit3, Clock } from "lucide-react";

const features = [
  {
    title: "Interactive Q&A",
    description:
      "Get instant answers to your academic questions with our AI assistant",
    icon: MessageSquare,
    href: "/dashboard/chat",
  },
  {
    title: "Smart Notes Editor",
    description:
      "Take and organize your study notes with our powerful rich text editor",
    icon: Edit3,
    href: "/dashboard/notes",
  },
  {
    title: "Focus Timer",
    description:
      "Stay productive with our customizable Pomodoro timer and session tracking",
    icon: Clock,
    href: "/dashboard/timer",
  },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />

      {/* Features Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-gray-900 mb-16">
            Everything you need to ace your studies
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl bg-secondary-50"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-secondary-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
