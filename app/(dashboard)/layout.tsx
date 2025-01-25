"use client";
import { useAuth } from "@/lib/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DashboardSidebar from "@/components/dashboard/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-h-screen md:pl-64">
        <main className="flex-1 overflow-y-auto pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
