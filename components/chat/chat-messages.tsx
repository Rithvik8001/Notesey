import { Message } from "@/lib/types/chat";

interface ChatMessagesProps {
  messages: Message[];
  loading: boolean;
}

interface CodeProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export default function ChatMessages({ messages, loading }: ChatMessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 && (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 text-sm">No messages yet</p>
        </div>
      )}
      {messages.map((message) => (
        <div
          key={message.id}
          className={`transition-opacity duration-300 ease-in-out ${
            message.role === "user" ? "text-right" : "text-left"
          }`}
        >
          <div
            className={`inline-block px-4 py-2 rounded-lg ${
              message.role === "user"
                ? "bg-orange-500 text-white"
                : "bg-orange-50 text-gray-800"
            }`}
          >
            {message.content}
          </div>
        </div>
      ))}
      {loading && (
        <div className="text-left">
          <div className="inline-block px-4 py-2 rounded-lg bg-orange-50 text-gray-800">
            <span className="animate-pulse">...</span>
          </div>
        </div>
      )}
    </div>
  );
}
