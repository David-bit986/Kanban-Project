"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

function generateInviteCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function getProjects() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const owned = await prisma.project.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const joined = await prisma.project.findMany({
    where: {
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return { owned, joined };
}

export async function createProject(name: string, isShared: boolean = false) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const count = await prisma.project.count({
    where: { userId: session.user.id },
  });

  if (count >= 3) {
    throw new Error("Maximum of 3 projects allowed.");
  }

  const project = await prisma.project.create({
    data: {
      name,
      userId: session.user.id,
      isShared,
      inviteCode: isShared ? generateInviteCode() : null,
    },
  });

  revalidatePath("/dashboard", "layout");
  return project;
}

export async function joinProject(inviteCode: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const project = await prisma.project.findUnique({
    where: { inviteCode: inviteCode.toUpperCase() },
  });

  if (!project) {
    throw new Error("Invalid invite code.");
  }

  if (project.userId === session.user.id) {
    throw new Error("You are already the owner of this project.");
  }

  try {
    const membership = await prisma.projectMember.create({
      data: {
        userId: session.user.id,
        projectId: project.id,
      },
    });
    
    revalidatePath("/dashboard", "layout");
    return project;
  } catch (error) {
    throw new Error("You have already joined this project.");
  }
}

export async function deleteProject(projectId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await prisma.project.delete({
    where: {
      id: projectId,
      userId: session.user.id,
    },
  });

  revalidatePath("/dashboard", "layout");
}

export async function leaveProject(projectId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await prisma.projectMember.deleteMany({
    where: {
      projectId,
      userId: session.user.id,
    },
  });

  revalidatePath("/dashboard", "layout");
}

