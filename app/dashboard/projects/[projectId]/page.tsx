import React from "react";
import { getTasks, getCategories } from "@/app/actions/task.actions";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic';

interface ProjectPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = await params;
  
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  // Verify project exists and belongs to user (as owner or member)
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [
        { userId: session.user.id },
        { members: { some: { userId: session.user.id } } }
      ]
    },
  });

  if (!project) {
    notFound();
  }

  const tasks = await getTasks(projectId);
  const categories = await getCategories(projectId);

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Kanban Board Area */}
      <KanbanBoard 
        initialTasks={tasks as any} 
        initialCategories={categories} 
        user={session.user as any} 
        projectId={projectId}
        inviteCode={project.inviteCode || ""}
        isShared={project.isShared}
      />
    </div>
  );
}
