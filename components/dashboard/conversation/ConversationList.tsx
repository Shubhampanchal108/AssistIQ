"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MessageSquare, Clock, AlertCircle, CheckCircle2, UserCheck, Flame } from "lucide-react";

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (conv: Conversation) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  isLoading: boolean;
}

const STATUS_CONFIG: Record<ConversationStatus, { label: string; color: string; icon: any }> = {
  active: { label: "Active", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", icon: Clock },
  resolved: { label: "Resolved", color: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: CheckCircle2 },
  escalated: { label: "Escalated", color: "bg-rose-500/10 text-rose-400 border-rose-500/20", icon: Flame },
  pending: { label: "Pending", color: "bg-amber-500/10 text-amber-400 border-amber-500/20", icon: AlertCircle },
};

export default function ConversationList({
  conversations,
  selectedId,
  onSelect,
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
  isLoading,
}: ConversationListProps) {
  const statusTabs = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "escalated", label: "Escalated" },
    { key: "resolved", label: "Resolved" },
    { key: "pending", label: "Pending" },
  ];

  const getTimeAgo = (dateInput: string | Date) => {
    if (!dateInput) return "";
    const date = new Date(dateInput);
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="flex flex-col h-full border border-zinc-800/80 bg-gradient-to-b from-zinc-900/70 via-zinc-950/80 to-[#09090d] rounded-2xl overflow-hidden shadow-xl">
      {/* Search & Header */}
      <div className="p-4 border-b border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            Conversations
          </h2>
          <span className="text-[11px] text-zinc-400 font-mono bg-zinc-900 px-2 py-0.5 rounded-lg border border-zinc-800">
            {conversations.length} Threads
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customer, email or message..."
            className="pl-9 h-9 bg-black/50 border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-500 rounded-xl focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-0.5">
          {statusTabs.map((tab) => {
            const isTabActive = selectedStatus === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setSelectedStatus(tab.key)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all shrink-0 capitalize cursor-pointer ${
                  isTabActive
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Conversation Thread Cards */}
      <div className="flex-1 overflow-y-auto min-h-0 p-3 space-y-2 no-scrollbar">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-2">
            <Clock className="w-6 h-6 animate-spin text-indigo-400" />
            <p className="text-xs text-zinc-400">Loading customer threads...</p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-2">
            <MessageSquare className="w-8 h-8 text-zinc-600" />
            <p className="text-xs font-medium text-zinc-400">No conversations found</p>
            <p className="text-[11px] text-zinc-600">Try selecting another filter or clear search.</p>
          </div>
        ) : (
          conversations.map((conv) => {
            const isSelected = (conv._id || conv.id) === selectedId;
            const statusConfig = STATUS_CONFIG[conv.status] || STATUS_CONFIG.active;
            const StatusIcon = statusConfig.icon;
            const customerName = conv.customer_name || "Customer";

            return (
              <div
                key={conv._id || conv.id}
                onClick={() => onSelect(conv)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 relative group overflow-hidden ${
                  isSelected
                    ? "bg-indigo-950/25 border-indigo-500/40 shadow-lg ring-1 ring-indigo-500/20 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-indigo-500 before:rounded-r"
                    : "bg-zinc-950/50 border-zinc-800/60 hover:border-zinc-700 hover:bg-zinc-900/50"
                }`}
              >
                {/* Top Row: Customer & Time */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shrink-0 text-white font-semibold text-xs shadow-md border border-white/10">
                      {conv.customer_avatar ? (
                        <img
                          src={conv.customer_avatar}
                          alt={customerName}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        customerName.slice(0, 2).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className={`text-xs font-semibold truncate transition-colors ${
                        isSelected ? "text-white font-bold" : "text-zinc-200 group-hover:text-white"
                      }`}>
                        {customerName}
                      </h4>
                      <p className="text-[11px] text-zinc-500 truncate">{conv.customer_email || "visitor@web.com"}</p>
                    </div>
                  </div>

                  <span className="text-[10px] text-zinc-500 font-mono shrink-0">
                    {getTimeAgo(conv.last_message_at)}
                  </span>
                </div>

                {/* Last Message Snippet */}
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {conv.last_message || "No messages yet."}
                </p>

                {/* Bottom Row: Status Badge & Section */}
                <div className="flex items-center justify-between pt-1">
                  <Badge variant="outline" className={`text-[10px] px-2 py-0.5 rounded-full border ${statusConfig.color} gap-1 font-medium`}>
                    <StatusIcon className="w-3 h-3" />
                    {statusConfig.label}
                  </Badge>

                  {conv.section_name && (
                    <span className="text-[10px] text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 truncate max-w-[120px]">
                      {conv.section_name}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
