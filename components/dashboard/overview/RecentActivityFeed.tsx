"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowRight, Clock, CheckCircle2, Flame, AlertCircle } from "lucide-react";

interface RecentActivityFeedProps {
  conversations: any[];
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  active: { label: "Active", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  resolved: { label: "Resolved", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  escalated: { label: "Escalated", color: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
  pending: { label: "Pending", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
};

export default function RecentActivityFeed({ conversations }: RecentActivityFeedProps) {
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
    <div className="p-5 border border-zinc-800/80 bg-gradient-to-b from-zinc-900/70 via-zinc-950/80 to-[#09090d] rounded-2xl shadow-xl flex flex-col h-full min-h-[420px]">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 shrink-0">
        <div className="space-y-0.5">
          <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            Recent Customer Activity Feed
          </h3>
          <p className="text-xs text-zinc-400">Live chat threads created by website visitors.</p>
        </div>

        <Link href="/dashboard/conversation">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800/70 gap-1.5 rounded-xl transition-colors"
          >
            View All Threads
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 pt-3 space-y-2.5 no-scrollbar">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-zinc-300">No customer conversations yet</p>
              <p className="text-xs text-zinc-500 max-w-xs">
                When visitors chat on your website or in the test playground, conversations will stream here live.
              </p>
            </div>
            <Link href="/dashboard/chatbot">
              <Button size="sm" variant="outline" className="text-xs border-zinc-800 hover:bg-zinc-800 rounded-xl h-8 px-3 text-zinc-300">
                Launch Playground
              </Button>
            </Link>
          </div>
        ) : (
          conversations.map((conv) => {
            const statusConfig = STATUS_CONFIG[conv.status] || STATUS_CONFIG.active;
            const isActive = conv.status === "active";
            return (
              <Link
                key={conv._id || conv.id}
                href="/dashboard/conversation"
                className="block p-3.5 rounded-xl border border-zinc-800/60 bg-zinc-950/60 hover:bg-zinc-900/60 hover:border-zinc-700/80 transition-all space-y-2 group cursor-pointer"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-semibold text-xs shadow-sm shrink-0 border border-white/10">
                      {conv.customer_avatar ? (
                        <img
                          src={conv.customer_avatar}
                          alt={conv.customer_name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        (conv.customer_name || "Customer").slice(0, 2).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-zinc-100 truncate group-hover:text-indigo-300 transition-colors">
                        {conv.customer_name || "Customer User"}
                      </h4>
                      <p className="text-[10px] text-zinc-500 truncate">{conv.customer_email || "visitor@client.com"}</p>
                    </div>
                  </div>

                  <span className="text-[10px] text-zinc-500 font-mono shrink-0">
                    {getTimeAgo(conv.last_message_at)}
                  </span>
                </div>

                <p className="text-xs text-zinc-400 line-clamp-1 leading-relaxed">
                  {conv.last_message || "Chat thread initialized."}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <Badge variant="outline" className={`text-[10px] px-2 py-0.5 rounded-full border ${statusConfig.color} capitalize font-medium flex items-center gap-1.5`}>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                    {statusConfig.label}
                  </Badge>

                  {conv.section_name && (
                    <span className="text-[10px] text-zinc-400 bg-zinc-900/80 px-2 py-0.5 rounded border border-zinc-800 truncate max-w-[140px]">
                      {conv.section_name}
                    </span>
                  )}
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
