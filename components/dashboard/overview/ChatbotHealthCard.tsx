"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, ShieldCheck, ArrowRight, BookOpen, Layers, Bot } from "lucide-react";

interface ChatbotHealthCardProps {
  hasMetadata: boolean;
  knowledgeSourcesCount: number;
  sectionsCount: number;
}

export default function ChatbotHealthCard({
  hasMetadata,
  knowledgeSourcesCount,
  sectionsCount,
}: ChatbotHealthCardProps) {
  const steps = [
    { label: "Business Metadata Configured", done: hasMetadata, href: "/dashboard/settings" },
    { label: "Knowledge Sources Uploaded", done: knowledgeSourcesCount > 0, href: "/dashboard/knowledge" },
    { label: "Topic Sections Configured", done: sectionsCount > 0, href: "/dashboard/sections" },
    { label: "Chatbot Playground Tested", done: true, href: "/dashboard/chatbot" },
  ];

  const completedCount = steps.filter((s) => s.done).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="p-5 border border-zinc-800/80 bg-gradient-to-b from-zinc-900/70 via-zinc-950/80 to-[#09090d] rounded-2xl shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
            <Bot className="w-4 h-4 text-emerald-400" />
            AI Assistant Readiness Score
          </h3>
          <p className="text-xs text-zinc-400">Setup checklist for optimal performance.</p>
        </div>

        <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-mono">
          {progressPercent}% Ready
        </Badge>
      </div>

      <Progress value={progressPercent} className="h-2 bg-zinc-900 border border-zinc-800" />

      <div className="space-y-2 pt-1">
        {steps.map((step, idx) => (
          <Link key={idx} href={step.href}>
            <div className="p-2.5 rounded-xl border border-zinc-800/60 bg-zinc-950/60 hover:bg-zinc-900/60 hover:border-zinc-700/80 transition-all flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-2.5">
                <CheckCircle2
                  className={`w-4 h-4 ${step.done ? "text-emerald-400" : "text-zinc-600"}`}
                />
                <span className={`text-xs ${step.done ? "text-zinc-200 group-hover:text-white" : "text-zinc-500"}`}>
                  {step.label}
                </span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-white transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
