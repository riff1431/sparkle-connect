import ChatLayout from "@/components/chat/ChatLayout";

const CleanerMessages = () => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Messages</h1>
        <p className="text-sm text-muted-foreground">Chat with your customers</p>
      </div>
      <ChatLayout />
    </div>
  );
};

export default CleanerMessages;
