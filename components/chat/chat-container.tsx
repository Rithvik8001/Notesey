"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/context/auth-context";
import ChatMessages from "./chat-messages";
import ChatInput from "./chat-input";
import {
  saveChatMessage,
  getChatHistory,
  ChatMessage,
  deleteChatHistory,
} from "@/lib/firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { Message } from "@/lib/types/chat";

interface FirestoreMessage extends Omit<ChatMessage, "timestamp"> {
  id: string;
  timestamp: Timestamp;
}

export default function ChatContainer() {
  const RATE_LIMIT_MS = 1000;
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [lastMessageTime, setLastMessageTime] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const loadChatHistory = async () => {
    if (!user) return;
    try {
      const history = await getChatHistory(user.uid);
      const formattedHistory = (history as FirestoreMessage[]).map((msg) => ({
        id: msg.id,
        content: msg.content,
        role: msg.role,
        timestamp: msg.timestamp.toDate(),
      }));
      setMessages(formattedHistory);
    } catch (error) {
      setError("Failed to load chat history");
    }
  };

  useEffect(() => {
    loadChatHistory();
  }, [user]);

  useEffect(() => {
    if (lastMessageTime) {
      const timeSinceLastMessage = Date.now() - lastMessageTime.getTime();
      if (timeSinceLastMessage >= RATE_LIMIT_MS && error?.includes("wait")) {
        setError(null);
      }
    }
  }, [lastMessageTime, error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (lastMessageTime) {
      const timeSinceLastMessage = Date.now() - lastMessageTime.getTime();
      if (timeSinceLastMessage < RATE_LIMIT_MS) {
        const remainingTime = Math.ceil(
          (RATE_LIMIT_MS - timeSinceLastMessage) / 1000
        );
        setError(
          `Please wait ${remainingTime} second${
            remainingTime > 1 ? "s" : ""
          } before sending another message`
        );
        return;
      }
    }

    if (!user || !input.trim() || isLoading || isProcessing) return;

    const tempId = Date.now().toString();
    try {
      setIsLoading(true);
      setIsProcessing(true);
      setError(null);

      const newMessage: ChatMessage = {
        content: input.trim(),
        role: "user",
        timestamp: new Date(),
        userId: user.uid,
      };

      setInput("");
      setMessages((prev) => [...prev, { ...newMessage, id: tempId }]);
      let messageId;
      try {
        messageId = await saveChatMessage(user.uid, newMessage);
      } catch (error) {
        setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
        throw error;
      }

      setMessages((prev) =>
        prev.map((msg) => (msg.id === tempId ? { ...msg, id: messageId } : msg))
      );

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messages
            .concat({ ...newMessage, id: messageId })
            .map((msg) => ({
              content: msg.content,
              role: msg.role,
            })),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to get AI response");
      }

      const data = await response.json();

      const aiMessage: ChatMessage = {
        content: data.content,
        role: "assistant",
        timestamp: new Date(),
        userId: user.uid,
      };

      try {
        const aiMessageId = await saveChatMessage(user.uid, aiMessage);
        setMessages((prev) => [...prev, { ...aiMessage, id: aiMessageId }]);
      } catch (error) {
        throw new Error("Failed to save AI response");
      }

      setLastMessageTime(new Date());
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred while processing your message"
      );
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
    }
  };

  const handleClearChat = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setMessages([]);
      setError(null);
      setInput("");
      await deleteChatHistory(user.uid);
    } catch (error) {
      setError("Failed to clear chat history");
      await loadChatHistory();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-white rounded-lg border border-gray-200 h-full">
      <div className="flex justify-end p-2 border-b border-gray-200">
        <button
          onClick={handleClearChat}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Clear Chat
        </button>
      </div>
      {error && (
        <div className="p-4 bg-red-50 border-b border-red-200">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      <ChatMessages messages={messages} loading={isLoading} />
      <ChatInput
        message={input}
        onMessageChange={(e) => setInput(e.target.value)}
        onSubmit={handleSubmit}
        disabled={isLoading}
      />
    </div>
  );
}
