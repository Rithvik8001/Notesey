"use client";
import { useState } from "react";
import { useAuth } from "@/lib/context/auth-context";
import { Send } from "lucide-react";
import PageHeader from "@/components/dashboard/page-header";
import ChatContainer from "@/components/chat/chat-container";

export default function ChatPage() {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          userId: user?.uid,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      // Stream the response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        // Handle the streamed response chunk
        console.log(chunk);
      }
    } catch (error) {
      setError("Failed to get response. Please try again.");
      console.error("Chat error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      <PageHeader
        title="Interactive Q&A"
        description="Ask questions and get instant, detailed explanations"
      />
      <div className="flex-1 mt-6">
        <ChatContainer />
      </div>
    </div>
  );
}
