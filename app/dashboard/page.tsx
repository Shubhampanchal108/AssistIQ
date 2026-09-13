"use client";

import React, { useEffect, useState } from "react";
import InitialForm from "@/components/dashboard/InitialForm";
import DashboardKpiCards from "@/components/dashboard/overview/DashboardKpiCards";
import RecentActivityFeed from "@/components/dashboard/overview/RecentActivityFeed";
import ChatbotHealthCard from "@/components/dashboard/overview/ChatbotHealthCard";
import EmbedQuickCard from "@/components/dashboard/overview/EmbedQuickCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Bot,
  Plus,
  BookOpen,
  Layers,
  MessageSquare,
  Settings as SettingsIcon,
  RefreshCw,
  Loader2,
  Sparkles,
} from "lucide-react";

const OverviewPage = () => {
  const [isMetaDataAvailable, setIsMetadataAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [statsData, setStatsData] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      // 1. Check Metadata Existence
      const metaRes = await fetch("/api/metadata/fetch");
      const metaJson = await metaRes.json();
      setIsMetadataAvailable(metaJson.exists);

      // 2. Fetch Live Dashboard Stats if metadata exists
      if (metaJson.exists) {
        const statsRes = await fetch("/api/dashboard/stats");
        if (statsRes.ok) {
          const statsJson = await statsRes.json();
          setStatsData(statsJson);
        }
      }
    } catch (error) {
      console.error("Error fetching overview data:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchDashboardData();
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex w-full h-[calc(100vh-64px)] items-center justify-center p-4">
        <div className="flex items-center gap-3 text-sm text-zinc-400">
          <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
          Loading dashboard overview...
        </div>
      </div>
    );
  }

  // If user hasn't configured metadata yet, show onboarding InitialForm
  if (!isMetaDataAvailable) {
    return (
      <div className="flex-1 flex w-full min-h-[calc(100vh-64px)] items-center justify-center p-4">
        <InitialForm />
      </div>
    );
  }

  const stats = statsData?.stats || {
    totalConversations: 0,
    activeConversations: 0,
    escalatedConversations: 0,
    resolvedConversations: 0,
    knowledgeSourcesCount: 0,
    sectionsCount: 0,
    resolutionRate: 96,
  };

  const recentConversations = statsData?.recentConversations || [];
  const businessInfo = statsData?.businessInfo || {
    business_name: "My Business",
    website_url: "https://example.com",
    color: "#4f46e5",
    botId: "bot_default",
  };

  return (
    <div className="p-4 md:p-8 max-w-[1700px] mx-auto animate-in fade-in slide-in-from-top-2 duration-700 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-800/80 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
              Welcome back, {businessInfo.business_name}!
            </h1>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              AI Live
            </span>
          </div>
          <p className="text-[14px] text-zinc-400 font-medium">
            Real-time customer support overview, active threads, and chatbot intelligence status.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-9 px-3.5 text-zinc-400 hover:text-white hover:bg-zinc-800/80 border border-zinc-800/80 rounded-xl gap-1.5 text-xs font-medium cursor-pointer transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-indigo-400" : ""}`} />
            Refresh
          </Button>

          <Link href="/dashboard/knowledge">
            <Button
              size="sm"
              variant="outline"
              className="h-9 bg-zinc-900/60 border-zinc-800 hover:bg-zinc-800/80 hover:border-zinc-700 text-zinc-200 text-xs gap-1.5 rounded-xl font-medium cursor-pointer transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-400" />
              Add Knowledge
            </Button>
          </Link>

          <Link href="/dashboard/chatbot">
            <Button
              size="sm"
              style={{ backgroundColor: businessInfo.color || "#4f46e5" }}
              className="text-white hover:opacity-90 font-medium text-xs h-9 px-4 rounded-xl gap-1.5 shadow-lg shadow-indigo-500/20 cursor-pointer transition-all hover:scale-105 active:scale-95"
            >
              <Bot className="w-3.5 h-3.5" />
              Test Playground
            </Button>
          </Link>
        </div>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <DashboardKpiCards stats={stats} />

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left/Center Column: Recent Activity Feed (8 cols) */}
        <div className="lg:col-span-8 flex flex-col min-h-0">
          <RecentActivityFeed conversations={recentConversations} />
        </div>

        {/* Right Column: Health Score & Embed Quick Card (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <ChatbotHealthCard
            hasMetadata={isMetaDataAvailable}
            knowledgeSourcesCount={stats.knowledgeSourcesCount}
            sectionsCount={stats.sectionsCount}
          />

          <EmbedQuickCard
            botId={businessInfo.botId}
            primaryColor={businessInfo.color}
          />
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
