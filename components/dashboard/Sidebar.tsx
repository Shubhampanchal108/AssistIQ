"use client";

import { useUser } from "@/hooks/useUser";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Bot,
  Layers,
  LayoutDashboard,
  MessageSquare,
  Settings,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSidebarContext } from "./SidebarContext";

const SIDEBAR_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Knowledge", href: "/dashboard/knowledge", icon: BookOpen },
  { label: "Sections", href: "/dashboard/sections", icon: Layers },
  { label: "Chatbot", href: "/dashboard/chatbot", icon: Bot },
  {
    label: "Conversations",
    href: "/dashboard/conversation",
    icon: MessageSquare,
  },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const Sidebar = () => {
  const pathname = usePathname();
  const { email } = useUser();
  const { isCollapsed, toggleSidebar } = useSidebarContext();
  const [metadata, setmetadata] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch("api/metadata/fetch");
        const res = await response.json();
        setmetadata(res.data);
      } catch (error) {
        console.error("Failed to fetch metadata", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetadata();
  }, []);

  return (
    <aside
      className={cn(
        "border-r border-zinc-800 bg-zinc-950 flex flex-col h-screen fixed left-0 top-0 z-40 font-sans transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Floating Toggle Button when collapsed - sleek edge button */}
      {isCollapsed && (
        <button
          onClick={toggleSidebar}
          title="Expand Sidebar"
          className="absolute -right-3 top-7 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-zinc-400 shadow-md transition-all hover:bg-indigo-600 hover:border-indigo-500 hover:text-white hover:scale-110 cursor-pointer"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )}

      {/* --- Header / Logo & Toggle --- */}
      <div
        className={cn(
          "h-20 flex items-center border-b border-zinc-800/50 transition-all duration-300",
          isCollapsed ? "justify-center px-0" : "justify-between px-5"
        )}
      >
        <Link
          href="/"
          title={isCollapsed ? "Assist IQ" : undefined}
          className={cn(
            "flex items-center group transition-all",
            isCollapsed ? "justify-center" : "gap-3"
          )}
        >
          <div className="relative w-10 h-10 flex items-center justify-center rounded-xl overflow-hidden shadow-lg shadow-indigo-500/20 border border-zinc-800 group-hover:border-indigo-500/50 group-hover:scale-105 transition-all duration-300 shrink-0 bg-zinc-900">
            <img
              src="/logo.jpeg"
              alt="Assist IQ"
              className="w-full h-full object-cover"
            />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0 transition-all duration-300">
              <span className="text-sm font-bold tracking-tight text-zinc-100 group-hover:text-white transition-colors truncate">
                Assist IQ
              </span>
              <span className="text-[10px] font-medium text-indigo-400 uppercase tracking-wider truncate">
                AI Platform
              </span>
            </div>
          )}
        </Link>

        {/* Toggle Button when expanded */}
        {!isCollapsed && (
          <button
            onClick={toggleSidebar}
            title="Collapse Sidebar"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 border border-zinc-800/60 transition-all focus:outline-none cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-zinc-400 hover:text-white" />
          </button>
        )}
      </div>

      {/* --- Navigation --- */}
      <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto scrollbar-none">
        {!isCollapsed && (
          <div className="px-3 mb-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider transition-all duration-200">
            Platform
          </div>
        )}
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              className={cn(
                "group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isCollapsed && "justify-center px-0 py-3",
                isActive
                  ? "bg-indigo-500/10 text-indigo-400"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
              )}
            >
              {/* Active Indicator Line */}
              {isActive && (
                <div
                  className={cn(
                    "absolute left-0 h-full w-1 bg-indigo-500 rounded-r-full opacity-100 top-0",
                    isCollapsed && "w-1"
                  )}
                />
              )}

              <item.icon
                className={cn(
                  "w-5 h-5 shrink-0 transition-colors",
                  isActive ? "text-indigo-400" : "text-zinc-500 group-hover:text-zinc-300"
                )}
              />
              {!isCollapsed && <span>{item.label}</span>}

              {/* Chevron visual cue on hover when expanded */}
              {!isActive && !isCollapsed && (
                <ChevronRight className="w-3 h-3 ml-auto opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all text-zinc-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* --- User Footer --- */}
      <div className="p-3 border-t border-zinc-800 bg-zinc-950/50">
        <div
          title={isCollapsed ? metadata?.business_name || email || "My Workspace" : undefined}
          className={cn(
            "flex items-center gap-3 p-2 rounded-xl border border-transparent hover:border-zinc-800 hover:bg-zinc-900/50 transition-all cursor-pointer group",
            isCollapsed && "justify-center px-0"
          )}
        >
          {isLoading ? (
            <UserSkeleton isCollapsed={isCollapsed} />
          ) : (
            <>
              {/* Avatar */}
              <div className="relative w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 overflow-hidden shrink-0">
                <span className="font-semibold text-xs text-zinc-300">
                  {metadata?.business_name?.slice(0, 1).toUpperCase() || "W"}
                </span>
              </div>

              {/* Text Info */}
              {!isCollapsed && (
                <>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs font-medium text-zinc-200 truncate group-hover:text-white transition-colors">
                      {metadata?.business_name || "My Workspace"}
                    </span>
                    <span className="text-[10px] text-zinc-500 truncate group-hover:text-zinc-400">
                      {email}
                    </span>
                  </div>

                  <Settings className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </aside>
  );
};

// Simple Skeleton Loader Component
const UserSkeleton = ({ isCollapsed }: { isCollapsed?: boolean }) => (
  <>
    <div className="w-9 h-9 rounded-full bg-zinc-800 animate-pulse shrink-0" />
    {!isCollapsed && (
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <div className="h-3 w-20 bg-zinc-800 rounded-md animate-pulse" />
        <div className="h-2 w-28 bg-zinc-800/50 rounded-md animate-pulse" />
      </div>
    )}
  </>
);

export default Sidebar;