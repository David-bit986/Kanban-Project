"use client";

import React, { useState } from "react";
import type { Project } from "@prisma/client";
import { Plus, Users, Hash, LogIn, Trash2, LogOut, Share2, Crown } from "lucide-react";
import { createProject, joinProject, deleteProject, leaveProject } from "@/app/actions/project.actions";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface SidebarProjectsProps {
  initialOwnedProjects: Project[];
  initialJoinedProjects: Project[];
  tier: string;
}

export function SidebarProjects({ initialOwnedProjects, initialJoinedProjects, tier }: SidebarProjectsProps) {
  const [ownedProjects, setOwnedProjects] = useState<Project[]>(initialOwnedProjects);
  const [joinedProjects, setJoinedProjects] = useState<Project[]>(initialJoinedProjects);
  
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [isShared, setIsShared] = useState(false);
  
  const [isJoining, setIsJoining] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  
  const [isPending, setIsPending] = useState(false);
  
  const pathname = usePathname();
  const router = useRouter();
  const maxProjects = 3;

  React.useEffect(() => {
    setOwnedProjects(initialOwnedProjects);
    setJoinedProjects(initialJoinedProjects);
  }, [initialOwnedProjects, initialJoinedProjects]);

  const handleCreate = async () => {
    if (!newProjectName.trim()) return;
    
    if (isShared && tier !== "PRO") {
      alert("Shared boards are a Pro feature. Please upgrade in Settings to create team collaborations!");
      return;
    }

    setIsPending(true);
    try {
      const newProject = await createProject(newProjectName.trim(), isShared);
      setOwnedProjects([...ownedProjects, newProject]);
      setNewProjectName("");
      setIsCreating(false);
      setIsShared(false);
      router.push(`/dashboard/projects/${newProject.id}`);
    } catch (e: any) {
      alert(e.message || "Failed to create project");
    } finally {
      setIsPending(false);
    }
  };

  const handleJoin = async () => {
    if (!inviteCode.trim()) return;
    setIsPending(true);
    try {
      const project = await joinProject(inviteCode.trim());
      setJoinedProjects([...joinedProjects, project]);
      setInviteCode("");
      setIsJoining(false);
      router.push(`/dashboard/projects/${project.id}`);
    } catch (e: any) {
      alert(e.message || "Failed to join project");
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, projectId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this project? This will delete all tasks and sections.")) return;
    
    setIsPending(true);
    try {
      await deleteProject(projectId);
      setOwnedProjects(ownedProjects.filter(p => p.id !== projectId));
      if (pathname === `/dashboard/projects/${projectId}`) {
        router.push("/dashboard");
      }
    } catch (e: any) {
      alert(e.message || "Failed to delete project");
    } finally {
      setIsPending(false);
    }
  };

  const handleLeave = async (e: React.MouseEvent, projectId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure you want to leave this project?")) return;
    
    setIsPending(true);
    try {
      await leaveProject(projectId);
      setJoinedProjects(joinedProjects.filter(p => p.id !== projectId));
      if (pathname === `/dashboard/projects/${projectId}`) {
        router.push("/dashboard");
      }
    } catch (e: any) {
      alert(e.message || "Failed to leave project");
    } finally {
      setIsPending(false);
    }
  };

  const renderProjectLink = (project: Project, icon: React.ReactNode, isOwned: boolean) => {
    const isActive = pathname === `/dashboard/projects/${project.id}`;
    return (
      <Link 
        key={project.id} 
        href={`/dashboard/projects/${project.id}`}
        className={cn(
          "w-full flex items-center px-2 h-8 rounded-full transition-colors cursor-pointer group/item relative",
          isActive 
            ? "bg-white/[0.08] text-white" 
            : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"
        )}
      >
        {icon}
        <span className="text-[13px] font-medium truncate flex-1">{project.name}</span>
        
        <div className="flex items-center space-x-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
          {(project as any).isShared && isOwned && (
            <Share2 className="w-3 h-3 text-rose-500/50 mr-1" />
          )}
          <button
            onClick={(e) => isOwned ? handleDelete(e, project.id) : handleLeave(e, project.id)}
            className="p-1 hover:bg-white/10 rounded-md transition-all text-zinc-500 hover:text-rose-500"
            title={isOwned ? "Delete Project" : "Leave Project"}
          >
            {isOwned ? <Trash2 className="w-3.5 h-3.5" /> : <LogOut className="w-3.5 h-3.5" />}
          </button>
        </div>
      </Link>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto px-3 py-2">
      {/* My Projects Section */}
      <div className="flex items-center px-2 mb-1 group justify-between">
        <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider group-hover:text-white transition-colors">My Projects</span>
        <button 
          onClick={() => setIsCreating(true)}
          disabled={ownedProjects.length >= maxProjects || isPending}
          className="flex items-center text-zinc-400 hover:text-white transition-colors text-xs space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
          title={ownedProjects.length >= maxProjects ? "Max 3 projects allowed" : "Create new project"}
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="font-medium">New</span>
        </button>
      </div>
      
      <div className="space-y-0.5 mb-6">
        {ownedProjects.map((project) => renderProjectLink(project, <Hash className={cn("w-3.5 h-3.5 mr-2", pathname === `/dashboard/projects/${project.id}` ? "text-rose-500" : "text-zinc-500")} />, true))}

        {isCreating && (
          <div className="space-y-2 py-2">
            <div className="w-full flex items-center px-2 h-8 rounded-full bg-white/[0.04] text-white">
              <Hash className="w-3.5 h-3.5 mr-2 text-zinc-400" />
              <input
                autoFocus
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreate();
                  if (e.key === "Escape") setIsCreating(false);
                }}
                disabled={isPending}
                placeholder="Project name..."
                className="bg-transparent text-[13px] font-medium outline-none flex-1 placeholder:text-zinc-500 w-full"
              />
            </div>
            <div className="flex items-center justify-between px-2">
              <button 
                onClick={() => {
                  if (tier !== "PRO") {
                    alert("Shared boards are a Pro feature. Please upgrade in Settings!");
                    return;
                  }
                  setIsShared(!isShared);
                }}
                className={cn(
                  "flex items-center space-x-2 text-[11px] font-medium transition-colors relative group/share",
                  isShared ? "text-rose-500" : "text-zinc-500 hover:text-zinc-400"
                )}
              >
                <Share2 className="w-3 h-3" />
                <span>{isShared ? "Shared Board" : "Private Board"}</span>
                {tier !== "PRO" && (
                  <Crown className="w-2.5 h-2.5 ml-1 text-rose-500/50" />
                )}
              </button>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setIsCreating(false)}
                  className="text-[11px] text-zinc-500 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreate}
                  disabled={!newProjectName.trim() || isPending}
                  className="text-[11px] text-white bg-rose-600 hover:bg-rose-500 px-2 py-0.5 rounded transition-colors disabled:opacity-50"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {ownedProjects.length === 0 && !isCreating && (
          <div className="px-2 py-1 text-xs text-zinc-500 italic">No projects yet</div>
        )}
      </div>

      {/* Shared Projects Section */}
      <div className="flex items-center px-2 mb-1 group justify-between">
        <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider group-hover:text-white transition-colors">Shared Boards</span>
        <button 
          onClick={() => setIsJoining(true)}
          disabled={isPending}
          className="flex items-center text-zinc-400 hover:text-white transition-colors text-xs space-x-1"
          title="Join a shared board"
        >
          <LogIn className="w-3.5 h-3.5" />
          <span className="font-medium">Join</span>
        </button>
      </div>
      
      <div className="space-y-0.5">
        {joinedProjects.map((project) => renderProjectLink(project, <Users className={cn("w-3.5 h-3.5 mr-2", pathname === `/dashboard/projects/${project.id}` ? "text-rose-500" : "text-zinc-500")} />, false))}

        {isJoining && (
          <div className="w-full flex items-center px-2 h-8 rounded-full bg-white/[0.04] text-white">
            <LogIn className="w-3.5 h-3.5 mr-2 text-zinc-400" />
            <input
              autoFocus
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleJoin();
                if (e.key === "Escape") setIsJoining(false);
              }}
              onBlur={() => {
                if (!inviteCode.trim()) setIsJoining(false);
              }}
              disabled={isPending}
              placeholder="Invite code..."
              className="bg-transparent text-[13px] font-medium outline-none flex-1 placeholder:text-zinc-500 w-full"
            />
          </div>
        )}

        {joinedProjects.length === 0 && !isJoining && (
          <div className="px-2 py-1 text-xs text-zinc-500 italic">No shared boards yet</div>
        )}
      </div>
    </div>
  );
}
