"use client";

import React, { useEffect, useState } from "react";
import ConversationList from "@/components/dashboard/conversation/ConversationList";
import ConversationThread from "@/components/dashboard/conversation/ConversationThread";
import ConversationDetails from "@/components/dashboard/conversation/ConversationDetails";
import { MessageSquare, Clock, Flame, CheckCircle2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const ConversationsPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (selectedStatus !== "all") params.append("status", selectedStatus);
      if (searchQuery) params.append("query", searchQuery);

      const res = await fetch(`/api/conversations/fetch?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        const fetchedList = data.conversations || [];
        setConversations(fetchedList);
        if (fetchedList.length > 0 && !selectedId) {
          setSelectedId(fetchedList[0]._id || fetchedList[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [selectedStatus]);

  // Debounced search trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchConversations();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const selectedConversation =
    conversations.find((c) => (c._id || c.id) === selectedId) || conversations[0] || null;

  const handleStatusChange = async (convId: string, newStatus: ConversationStatus) => {
    try {
      const res = await fetch("/api/conversations/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: convId, status: newStatus }),
      });

      if (res.ok) {
        const updated = await res.json();
        setConversations((prev) =>
          prev.map((c) => ((c._id || c.id) === convId ? updated : c))
        );
      }
    } catch (e) {
      console.error("Failed to change status:", e);
    }
  };

  const handleSendReply = async (convId: string, message: string) => {
    try {
      const res = await fetch("/api/conversations/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: convId, message }),
      });

      if (res.ok) {
        const updated = await res.json();
        setConversations((prev) =>
          prev.map((c) => ((c._id || c.id) === convId ? updated : c))
        );
      }
    } catch (e) {
      console.error("Failed to send reply:", e);
    }
  };

  const handleGenerateSummary = async (convId: string) => {
    try {
      const res = await fetch("/api/conversations/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: convId }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.conversation) {
          setConversations((prev) =>
            prev.map((c) => ((c._id || c.id) === convId ? data.conversation : c))
          );
        }
      }
    } catch (e) {
      console.error("Failed to generate summary:", e);
    }
  };

  const totalCount = conversations.length;
  const activeCount = conversations.filter((c) => c.status === "active").length;
  const escalatedCount = conversations.filter((c) => c.status === "escalated").length;
  const resolvedCount = conversations.filter((c) => c.status === "resolved").length;

  return (
    <div className="p-4 md:p-6 max-w-[1800px] mx-auto animate-in fade-in slide-in-from-top-2 duration-500 min-h-screen lg:h-screen lg:max-h-screen overflow-y-auto lg:overflow-hidden flex flex-col gap-4">
      {/* Header & Metrics Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-zinc-800/80 pb-4 shrink-0">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
              Customer Conversations
            </h1>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Live Inbox
            </span>
          </div>
          <p className="text-xs md:text-sm text-zinc-400 font-medium">
            Monitor real-time chatbot threads, reply to customer inquiries, and review AI summaries.
          </p>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
          <div className="px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center gap-2 text-xs text-zinc-300 shadow-sm">
            <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
            <span>Total: <strong className="text-white font-mono">{totalCount}</strong></span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-xs text-emerald-400 shadow-sm">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Active: <strong className="text-white font-mono">{activeCount}</strong></span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2 text-xs text-rose-400 shadow-sm">
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>Escalated: <strong className="text-white font-mono">{escalatedCount}</strong></span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center gap-2 text-xs text-blue-400 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Resolved: <strong className="text-white font-mono">{resolvedCount}</strong></span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={fetchConversations}
            disabled={isLoading}
            className="h-8 px-2.5 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800/80 rounded-xl cursor-pointer transition-all"
            title="Refresh Conversations"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-indigo-400" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Main 3-Column Master-Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[650px] lg:h-full lg:min-h-0 flex-1 pb-4 lg:pb-2">
        {/* Column 1: Conversations List & Filters (3.5 Cols or 3 Cols) */}
        <div className="lg:col-span-3 flex flex-col h-[520px] lg:h-full min-h-0">
          <ConversationList
            conversations={conversations}
            selectedId={selectedId}
            onSelect={(conv) => setSelectedId(conv._id || conv.id)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            isLoading={isLoading}
          />
        </div>

        {/* Column 2: Chat Thread Viewer & Human Reply (6 Cols) */}
        <div className="lg:col-span-6 flex flex-col h-[600px] lg:h-full min-h-0">
          <ConversationThread
            conversation={selectedConversation}
            onStatusChange={handleStatusChange}
            onSendReply={handleSendReply}
          />
        </div>

        {/* Column 3: Customer Details & AI Summaries (3 Cols) */}
        <div className="lg:col-span-3 flex flex-col h-[520px] lg:h-full min-h-0">
          <ConversationDetails
            conversation={selectedConversation}
            onGenerateSummary={handleGenerateSummary}
          />
        </div>
      </div>
    </div>
  );
};

export default ConversationsPage;