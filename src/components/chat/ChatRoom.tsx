import { useState, useRef, useEffect } from "react";
import { useChatMessages, ChatMessage } from "@/hooks/useChatMessages";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Send, MessageSquare, Check, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isToday, isYesterday } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

interface ChatRoomProps {
  conversationId: string | null;
  onBack?: () => void;
  isAdmin?: boolean;
}

const ChatRoom = ({ conversationId, onBack, isAdmin }: ChatRoomProps) => {
  const { user } = useAuth();
  const { data: messages = [], isLoading, sendMessage } = useChatMessages(conversationId);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch conversation partner info
  const { data: partner } = useQuery({
    queryKey: ["chat-partner", conversationId],
    enabled: !!conversationId,
    queryFn: async () => {
      const { data: conv } = await supabase
        .from("conversations")
        .select("customer_id, provider_id")
        .eq("id", conversationId!)
        .single();

      if (!conv) return null;
      const partnerId = conv.customer_id === user?.id ? conv.provider_id : conv.customer_id;

      const { data: profile } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .eq("id", partnerId)
        .single();

      return profile;
    },
  });

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || sending || isAdmin) return;
    setSending(true);
    try {
      await sendMessage(inputText);
      setInputText("");
      inputRef.current?.focus();
    } catch {
      // Error handled by hook
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!conversationId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/20">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
          <p className="text-lg font-medium text-foreground">Select a Conversation</p>
          <p className="text-sm text-muted-foreground mt-1">Choose from your inbox to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border bg-background">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <Avatar className="h-9 w-9">
          <AvatarImage src={partner?.avatar_url || undefined} />
          <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
            {(partner?.full_name || "U").charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-foreground truncate">
            {partner?.full_name || "Loading..."}
          </p>
          {isAdmin && (
            <p className="text-[11px] text-muted-foreground">Admin view (read-only)</p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className={cn("flex", i % 2 === 0 ? "justify-end" : "")}>
                <Skeleton className="h-10 w-48 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">No messages yet. Say hello!</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => {
              const isOwn = msg.sender_id === user?.id;
              const showDate = i === 0 || !isSameDay(msg.created_at, messages[i - 1].created_at);

              return (
                <div key={msg.id}>
                  {showDate && (
                    <div className="flex justify-center my-4">
                      <span className="text-[11px] text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                        {formatDateLabel(msg.created_at)}
                      </span>
                    </div>
                  )}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    className={cn("flex mb-1", isOwn ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm",
                        isOwn
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-muted text-foreground rounded-bl-md"
                      )}
                    >
                      <p className="break-words whitespace-pre-wrap">{msg.text}</p>
                      <div
                        className={cn(
                          "flex items-center gap-1 mt-1",
                          isOwn ? "justify-end" : "justify-start"
                        )}
                      >
                        <span
                          className={cn(
                            "text-[10px]",
                            isOwn ? "text-primary-foreground/60" : "text-muted-foreground"
                          )}
                        >
                          {format(new Date(msg.created_at), "h:mm a")}
                        </span>
                        {isOwn && (
                          msg.read_at ? (
                            <CheckCheck className="h-3 w-3 text-primary-foreground/60" />
                          ) : (
                            <Check className="h-3 w-3 text-primary-foreground/40" />
                          )
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {!isAdmin && (
        <div className="p-3 border-t border-border bg-background">
          <div className="flex items-center gap-2">
            <Input
              ref={inputRef}
              placeholder="Type a message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 h-10"
              maxLength={2000}
              disabled={sending}
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!inputText.trim() || sending}
              className="shrink-0 h-10 w-10"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

function isSameDay(a: string, b: string) {
  return new Date(a).toDateString() === new Date(b).toDateString();
}

function formatDateLabel(dateStr: string) {
  const d = new Date(dateStr);
  if (isToday(d)) return "Today";
  if (isYesterday(d)) return "Yesterday";
  return format(d, "MMM d, yyyy");
}

export default ChatRoom;
