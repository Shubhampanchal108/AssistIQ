"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Clock, BookOpen, CheckCircle2, TrendingUp, AlertTriangle } from "lucide-react";

interface DashboardKpiCardsProps {
  stats: {
    totalConversations: number;
    activeConversations: number;
    escalatedConversations: number;
    resolvedConversations: number;
    knowledgeSourcesCount: number;
    sectionsCount: number;
    resolutionRate: number;
  };
}

export default function DashboardKpiCards({ stats }: DashboardKpiCardsProps) {
  const cards = [
    {
      title: "Total Conversations",
      value: stats.totalConversations,
      subtext: "Total customer chat threads",
      badge: "+12% this week",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      icon: MessageSquare,
      iconBg: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    },
    {
      title: "Active & Escalated",
      value: stats.activeConversations + stats.escalatedConversations,
      subtext: `${stats.escalatedConversations} escalated to team`,
      badge: stats.escalatedConversations > 0 ? "Requires Attention" : "All Normal",
      badgeColor: stats.escalatedConversations > 0 ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      icon: Clock,
      iconBg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
    {
      title: "Knowledge Sources",
      value: stats.knowledgeSourcesCount,
      subtext: `${stats.sectionsCount} active topic sections`,
      badge: "Knowledge Ready",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      icon: BookOpen,
      iconBg: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },
    {
      title: "Resolution CSAT Rate",
      value: `${stats.resolutionRate}%`,
      subtext: `${stats.resolvedConversations} threads resolved`,
      badge: "High Accuracy",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      icon: CheckCircle2,
      iconBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card
            key={idx}
            className="p-5 border border-zinc-800/80 bg-gradient-to-b from-zinc-900/70 via-zinc-950/80 to-[#09090d] rounded-2xl shadow-lg hover:border-zinc-700/80 hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300 space-y-3 relative overflow-hidden group"
          >
            {/* Ambient hover light */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all pointer-events-none" />

            <div className="flex items-center justify-between relative z-10">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{card.title}</span>
              <div className={`p-2 rounded-xl border ${card.iconBg} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline justify-between pt-1 relative z-10">
              <span className="text-3xl font-extrabold text-white tracking-tight font-mono">{card.value}</span>
              <Badge variant="outline" className={`text-[10px] px-2.5 py-0.5 rounded-full border font-medium ${card.badgeColor}`}>
                {card.badge}
              </Badge>
            </div>

            <p className="text-[11px] text-zinc-400 font-medium relative z-10">{card.subtext}</p>
          </Card>
        );
      })}
    </div>
  );
}
