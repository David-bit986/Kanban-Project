import React from "react";
import Link from "next/link";
import {
  Settings
} from "lucide-react";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getProjects } from "@/app/actions/project.actions";
import { SidebarProjects } from "@/components/sidebar/sidebar-projects";
import { DashboardSidebar } from "@/components/sidebar/dashboard-sidebar";
import { cn } from "@/lib/utils";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user) return null;

  const { owned, joined } = await getProjects();

  return (
    <div className="flex h-screen bg-[#000000] text-white font-sans overflow-hidden relative">
      {/* Global Red Fade Background - Subtle */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-30 md:opacity-50"
        style={{
          background: "radial-gradient(130% 130% at 50% 100%, #1a0101 0%, #000000 80%)",
        }}
      />

      <div className="relative z-10 flex w-full h-full">
        <DashboardSidebar 
          user={user as any} 
          ownedProjects={owned} 
          joinedProjects={joined} 
          session={session} 
        />

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-full bg-transparent overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
