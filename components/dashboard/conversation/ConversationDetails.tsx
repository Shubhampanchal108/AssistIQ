"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Sparkles,
  Smile,
  Meh,
  Frown,
  Download,
  Loader2,
  Calendar,
  Layers,
  MessageSquare,
  Star,
} from "lucide-react";

interface ConversationDetailsProps {
  conversation: Conversation | null;
  onGenerateSummary: (convId: string) => Promise<void>;
}

export default function ConversationDetails({
  conversation,
  onGenerateSummary,
}: ConversationDetailsProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  if (!conversation) return null;

  const handleSummaryClick = async () => {
    const convId = conversation._id || conversation.id;
    setIsGenerating(true);
    try {
      await onGenerateSummary(convId);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportTranscript = () => {
    const customerName = conversation.customer_name || "Customer";
    const transcriptText = conversation.messages
      .map(
        (m) =>
          `[${new Date(m.timestamp).toLocaleString()}] ${
            m.role.toUpperCase()
          }: ${m.content}`
      )
      .join("\n\n");

    const blob = new Blob([transcriptText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `transcript-${customerName.replace(/\s+/g, "_")}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getSentimentBadge = (sentiment?: string) => {
    switch (sentiment) {
      case "positive":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 gap-1.5 text-xs font-medium">
            <Smile className="w-3.5 h-3.5" /> Positive Sentiment
          </Badge>
        );
      case "negative":
        return (
          <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/20 gap-1.5 text-xs font-medium">
            <Frown className="w-3.5 h-3.5" /> Frustrated / Negative
          </Badge>
        );
      default:
        return (
          <Badge className="bg-zinc-500/10 text-zinc-400 border-zinc-500/20 gap-1.5 text-xs font-medium">
            <Meh className="w-3.5 h-3.5" /> Neutral Sentiment
          </Badge>
        );
    }
  };

  const customerName = conversation.customer_name || "Customer";

  return (
    <Card className="flex flex-col h-full border border-zinc-800/80 bg-gradient-to-b from-zinc-900/70 via-zinc-950/80 to-[#09090d] rounded-2xl overflow-hidden shadow-xl p-5 space-y-5">
      {/* Customer Info Header */}
      <div className="space-y-3.5 border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md border border-white/10 shrink-0">
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
            <h3 className="text-sm font-bold text-white truncate">{customerName}</h3>
            <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5 truncate">
              <Mail className="w-3 h-3 text-zinc-500 shrink-0" />
              {conversation.customer_email || "visitor@web.com"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {getSentimentBadge(conversation.sentiment)}
        </div>
      </div>

      {/* Metadata Stats */}
      <div className="grid grid-cols-2 gap-2.5 text-xs border-b border-zinc-800/80 pb-4">
        <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/80 space-y-1">
          <span className="text-zinc-500 flex items-center gap-1 text-[11px] font-medium">
            <Layers className="w-3 h-3 text-indigo-400" /> Section
          </span>
          <p className="font-semibold text-zinc-200 truncate">{conversation.section_name || "General"}</p>
        </div>
        <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/80 space-y-1">
          <span className="text-zinc-500 flex items-center gap-1 text-[11px] font-medium">
            <MessageSquare className="w-3 h-3 text-purple-400" /> Messages
          </span>
          <p className="font-semibold text-zinc-200 font-mono">{conversation.messages.length} Sent</p>
        </div>
      </div>

      {/* AI Summary Box */}
      <div className="flex-1 space-y-2.5 min-h-0 flex flex-col">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            AI Summary & Insights
          </label>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleSummaryClick}
            disabled={isGenerating}
            className="h-7 px-2 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800/80 gap-1 rounded-lg cursor-pointer transition-all"
          >
            {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" /> : <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
            {isGenerating ? "Analyzing..." : "Re-Analyze"}
          </Button>
        </div>

        <div className="p-3.5 bg-black/60 rounded-xl border border-zinc-800 flex-1 overflow-y-auto min-h-0 text-xs text-zinc-300 leading-relaxed no-scrollbar shadow-inner">
          {conversation.summary ? (
            <p className="whitespace-pre-wrap">{conversation.summary}</p>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center text-zinc-500 space-y-2.5">
              <Sparkles className="w-6 h-6 text-zinc-600" />
              <p className="text-xs text-zinc-400">No AI summary generated yet.</p>
              <Button
                size="sm"
                onClick={handleSummaryClick}
                disabled={isGenerating}
                className="bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/30 text-xs rounded-xl px-3.5 h-8 font-medium cursor-pointer transition-all"
              >
                Generate Instant AI Summary
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-2 border-t border-zinc-800/80 shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportTranscript}
          className="w-full bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs gap-1.5 rounded-xl h-9 font-medium cursor-pointer transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          Export Chat Transcript (.txt)
        </Button>
      </div>
    </Card>
  );
}
