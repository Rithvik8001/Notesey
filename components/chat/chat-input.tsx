import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { motion } from "framer-motion";

interface ChatInputProps {
  message: string;
  onMessageChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  disabled?: boolean;
}

export default function ChatInput({
  message,
  onMessageChange,
  onSubmit,
  disabled,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e as any);
    }
  };

  return (
    <div className="border-t border-gray-200 bg-gray-50 p-4">
      <form onSubmit={onSubmit}>
        <div className="flex items-end space-x-2 bg-white rounded-lg border border-gray-200 shadow-sm">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={onMessageChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            rows={1}
            className="flex-1 p-3 bg-transparent border-0 resize-none focus:ring-0 focus:outline-none max-h-32"
            disabled={disabled}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!message.trim() || disabled}
            className="p-3 text-primary-600 hover:text-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </motion.button>
        </div>
      </form>
    </div>
  );
}
