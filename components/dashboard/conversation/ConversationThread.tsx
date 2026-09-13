"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  User,
  Bot,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Flame,
  Clock,
  Sparkles,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ConversationThreadProps {
  conversation: Conversation | null;
  onStatusChange: (convId: string, status: ConversationStatus) => Promise<void>;
  onSendReply: (convId: string, message: string) => Promise<void>;
  onGenerateSummary?: (convId: string) => Promise<void>;
}

export default function ConversationThread({
  conversation,
  onStatusChange,
  onSendReply,
}: ConversationThreadProps) {
  const [replyInput, setReplyInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation?.messages]);

  if (!conversation) {
    return (
      <div className="flex flex-col items-center justify-center h-full border border-zinc-800/80 bg-gradient-to-b from-zinc-900/70 via-zinc-950/80 to-[#09090d] rounded-2xl p-8 text-center shadow-xl space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center text-indigo-400 shadow-inner">
          <Bot className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-zinc-200">Select a Conversation</h3>
          <p className="text-xs text-zinc-500 max-w-xs">
            Choose a customer thread from the left panel to review message history, switch status, or reply directly.
          </p>
        </div>
      </div>
    );
  }

  const handleSend = async () => {
    if (!replyInput.trim() || isSending) return;
    const convId = conversation._id || conversation.id;
    setIsSending(true);
    try {
      await onSendReply(convId, replyInput.trim());
      setReplyInput("");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleStatusSelect = async (newStatus: ConversationStatus) => {
    const convId = conversation._id || conversation.id;
    setIsUpdatingStatus(true);
    try {
      await onStatusChange(convId, newStatus);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const formatTime = (dateInput: string | Date) => {
    if (!dateInput) return "";
    return new Date(dateInput).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const customerName = conversation.customer_name || "Customer";

  const statusButtonStyles: Record<ConversationStatus, { activeClass: string; icon: any }> = {
    active: { activeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30", icon: Clock },
    resolved: { activeClass: "bg-blue-500/20 text-blue-300 border-blue-500/30", icon: CheckCircle2 },
    escalated: { activeClass: "bg-rose-500/20 text-rose-300 border-rose-500/30", icon: Flame },
    pending: { activeClass: "bg-amber-500/20 text-amber-300 border-amber-500/30", icon: AlertCircle },
  };

  return (
    <div className="flex flex-col h-full border border-zinc-800/80 bg-gradient-to-b from-zinc-900/70 via-zinc-950/80 to-[#09090d] rounded-2xl overflow-hidden shadow-xl relative">
      {/* Header Bar */}
      <div className="h-16 border-b border-zinc-800/80 px-5 bg-zinc-900/40 backdrop-blur-md flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-semibold text-xs shadow-md border border-white/10 shrink-0">
            {conversation.customer_avatar ? (
              <img
                src={conversation.customer_avatar}
                alt={customerName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              customerName.slice(0, 2).toUpperCase()
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white truncate">{customerName}</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" title="Live Customer" />
            </div>
            <p className="text-[11px] text-zinc-400 truncate">{conversation.customer_email || "visitor@web.com"}</p>
          </div>
        </div>

        {/* Action Controls: Status Switcher */}
        <div className="flex items-center gap-1.5 bg-black/50 p-1 rounded-xl border border-zinc-800">
          {(["active", "resolved", "escalated", "pending"] as ConversationStatus[]).map((st) => {
            const isCurrent = conversation.status === st;
            const style = statusButtonStyles[st];
            const Icon = style.icon;
            return (
              <button
                key={st}
                onClick={() => handleStatusSelect(st)}
                disabled={isUpdatingStatus}
                className={cn(
                  "px-2.5 py-1 text-xs font-medium rounded-lg capitalize transition-all flex items-center gap-1 cursor-pointer",
                  isCurrent
                    ? `${style.activeClass} border shadow-sm font-semibold`
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 border border-transparent"
                )}
              >
                <Icon className="w-3 h-3" />
                {st}
              </button>
            );
          })}
        </div>
      </div>

      {/* Messages Scroll Thread */}
      <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-5 relative bg-transparent no-scrollbar">
        {conversation.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-500 text-xs">
            No messages recorded in this conversation yet.
          </div>
        ) : (
          conversation.messages.map((msg, index) => {
            const isUser = msg.role === "user";
            const isAgent = msg.role === "agent";

            return (
              <div
                key={index}
                className={cn(
                  "flex w-full flex-col animate-in fade-in slide-in-from-bottom-2 duration-300",
                  isUser ? "items-start" : "items-end"
                )}
              >
                <div
                  className={cn(
                    "flex max-w-[85%] gap-2.5",
                    isUser ? "flex-row" : "flex-row-reverse"
                  )}
                >
                  {/* Avatar Icon */}
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-md border border-white/10 text-white font-semibold text-xs mt-1",
                      isUser
                        ? "bg-zinc-800 text-zinc-300 border-zinc-700"
                        : isAgent
                        ? "bg-gradient-to-br from-indigo-600 to-indigo-700"
                        : "bg-gradient-to-br from-indigo-500 to-purple-600"
                    )}
                  >
                    {isUser ? (
                      <User className="w-3.5 h-3.5" />
                    ) : isAgent ? (
                      <UserCheck className="w-3.5 h-3.5" />
                    ) : (
                      <Bot className="w-3.5 h-3.5" />
                    )}
                  </div>

                  {/* Content Bubble */}
                  <div className={cn("space-y-1 flex flex-col w-full", isUser ? "items-start" : "items-end")}>
                    <div className="flex items-center gap-2 px-1">
                      <span className="text-[11px] font-semibold text-zinc-400 capitalize">
                        {isUser ? customerName : isAgent ? "Human Agent" : "AI Assistant"}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>

                    <div
                      className={cn(
                        "px-4 py-2.5 rounded-2xl text-[13.5px] leading-relaxed whitespace-pre-wrap shadow-sm",
                        isUser
                          ? "bg-zinc-800/90 text-zinc-100 border border-zinc-700/60 rounded-tl-xs"
                          : isAgent
                          ? "bg-indigo-600 text-white rounded-tr-xs shadow-indigo-500/20"
                          : "bg-gradient-to-br from-indigo-950/40 via-purple-950/30 to-zinc-900 border border-indigo-500/30 text-zinc-100 rounded-tr-xs"
                      )}
                    >
                      {msg.content}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={scrollRef} />
      </div>

      {/* Reply Input Bar */}
      <div className="p-3.5 bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-800/80 shrink-0">
        <div className="relative group">
          <Textarea
            value={replyInput}
            onChange={(e) => setReplyInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSending}
            placeholder="Type a manual support response to customer... (Press Enter to send)"
            className="min-h-[50px] max-h-[140px] w-full py-3 pl-4 pr-14 outline-none text-zinc-100 bg-black/60 border border-zinc-800 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all resize-none rounded-xl placeholder:text-zinc-500 text-xs shadow-inner leading-relaxed"
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!replyInput.trim() || isSending}
            className={cn(
              "absolute right-2 bottom-2 h-8 w-8 rounded-lg transition-all shadow-md bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer",
              !replyInput.trim() || isSending ? "opacity-50 cursor-not-allowed" : "hover:scale-105 active:scale-95"
            )}
          >
            {isSending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
