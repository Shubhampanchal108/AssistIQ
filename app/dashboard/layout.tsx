import DashboardShell from "@/components/dashboard/DashboardShell";
import { SidebarProvider } from "@/components/dashboard/SidebarContext";
import type { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Assist IQ - Dashboard",
  description:
    "Instantly resolve customer questions with an assistant that reads your docs and speaks with empathy.",
};

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const metadataCookie = cookieStore.get("metadata");

  return (
    <div className="bg-[#07070b] min-h-screen font-sans antialiased text-zinc-100 selection:bg-indigo-500/30 flex">
      {metadataCookie?.value ? (
        <SidebarProvider>
          <DashboardShell>{children}</DashboardShell>
        </SidebarProvider>
      ) : (
        children
      )}
    </div>
  );
}
