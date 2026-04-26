"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Settings, Menu, X } from "lucide-react";
import { SidebarProjects } from "./sidebar-projects";
import { cn } from "@/lib/utils";
import { Project } from "@prisma/client";

interface DashboardSidebarProps {
  user: {
    id: string;
    name: string | null;
    avatarColor: string | null;
    tier: string;
  };
  ownedProjects: Project[];
  joinedProjects: Project[];
  session: any;
}

export function DashboardSidebar({
  user,
  ownedProjects,
  joinedProjects,
  session,
}: DashboardSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-3 left-4 z-50 p-2 rounded-md bg-[#0a0a0a] border border-white/10 text-zinc-400 hover:text-white transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        suppressHydrationWarning
        className={cn(
          "fixed inset-y-0 left-0 z-[70] w-64 transform bg-[#000000]/40 backdrop-blur-xl border-r border-white/10 flex flex-col h-full transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Workspace Selector & Close Button */}
        <div className="h-14 flex items-center px-4 border-b border-white/10 hover:bg-white/[0.02] cursor-pointer transition-colors duration-200">
          <div className="flex items-center flex-1">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center text-[10px] font-bold text-white mr-3 shadow-[0_0_8px_rgba(244,63,94,0.4)]">
              T
            </div>
            <span className="font-medium text-sm truncate">TaskSync Workspace</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Projects */}
        <SidebarProjects
          initialOwnedProjects={ownedProjects}
          initialJoinedProjects={joinedProjects}
          tier={user.tier}
        />

        {/* User Profile */}
        <div className="p-3 border-t border-white/10">
          <Link
            href="/dashboard/settings"
            onClick={() => setIsOpen(false)}
            className="w-full flex items-center px-2 h-9 rounded-full hover:bg-white/[0.04] text-zinc-400 hover:text-white transition-colors cursor-pointer group"
          >
            <div
              className={cn(
                "w-5 h-5 rounded-full overflow-hidden mr-2 flex items-center justify-center text-[10px] text-white border border-white/10 bg-gradient-to-r",
                user.avatarColor || "from-rose-500 to-orange-500"
              )}
            >
              {session?.user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex flex-col flex-1 truncate">
              <span className="text-[13px] font-medium truncate">
                {session?.user?.name || "User"}
              </span>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-widest",
                user.tier === "PRO" ? "text-rose-500" : "text-zinc-500"
              )}>
                {user.tier}
              </span>
            </div>
            <Settings className="w-4 h-4" />
          </Link>
        </div>
      </aside>
    </>
  );
}
