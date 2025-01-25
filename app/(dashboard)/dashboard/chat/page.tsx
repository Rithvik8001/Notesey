import PageHeader from "@/components/dashboard/page-header";
import ChatContainer from "@/components/chat/chat-container";

export default function ChatPage() {
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
