"use client";

import React from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { useSidebarContext } from "@/components/dashboard/SidebarContext";
import { cn } from "@/lib/utils";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebarContext();

  return (
    <>
      <Sidebar />
      <div
        className={cn(
          "flex-1 flex flex-col relative min-h-screen transition-all duration-300 ease-in-out",
          isCollapsed ? "md:ml-20" : "md:ml-64"
        )}
      >
        <main className="flex-1">{children}</main>
      </div>
    </>
  );
}
