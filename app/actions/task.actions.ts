"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function getTasks(projectId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // Verify project access
  const hasAccess = await prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [
        { userId: session.user.id },
        { members: { some: { userId: session.user.id } } }
      ]
    }
  });

  if (!hasAccess) {
    throw new Error("Unauthorized");
  }

  const tasks = await prisma.task.findMany({
    where: {
      projectId,
    },
    include: { user: true },
    orderBy: {
      order: "asc",
    },
  });

  return tasks;
}

export async function createTask(projectId: string, title: string, priority: string = "no-priority", status: string = "todo") {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // Verify project access
  const hasAccess = await prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [
        { userId: session.user.id },
        { members: { some: { userId: session.user.id } } }
      ]
    }
  });

  if (!hasAccess) {
    throw new Error("Unauthorized");
  }

  const finalStatus = status === "todo" ? `${projectId}-todo` : status;

  // Generate a display ID (e.g., KAN-[count]) - count all tasks in project
  const count = await prisma.task.count({
    where: { projectId },
  });
  const displayId = `KAN-${count + 1}`;

  // Find the highest order in the current status to append to the bottom
  const lastTask = await prisma.task.findFirst({
    where: { status, projectId },
    orderBy: { order: "desc" },
  });
  const newOrder = lastTask ? lastTask.order + 1024 : 1024;

  const task = await prisma.task.create({
    data: {
      displayId,
      title,
      priority,
      status: finalStatus,
      order: newOrder,
      userId: session.user.id,
      projectId,
    },
    include: { user: true }
  });

  revalidatePath("/dashboard", "layout");
  return task;
}

export async function updateTaskStatusAndOrder(
  taskId: string,
  newStatus: string,
  newOrder: number
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // Ensure the task belongs to a project the user has access to
  const existingTask = await prisma.task.findUnique({
    where: { id: taskId },
    include: { project: { include: { members: true } } }
  });

  if (!existingTask) {
    throw new Error("Task Not Found");
  }

  const isOwner = existingTask.project?.userId === session.user.id;
  const isMember = existingTask.project?.members.some(m => m.userId === session.user.id);

  if (!isOwner && !isMember && existingTask.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: {
      status: newStatus,
      order: newOrder,
    },
  });

  revalidatePath("/dashboard", "layout");
  return updatedTask;
}

export async function deleteTask(taskId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const existingTask = await prisma.task.findUnique({
    where: { id: taskId },
    include: { project: { include: { members: true } } }
  });

  if (!existingTask) {
    throw new Error("Task Not Found");
  }

  const isOwner = existingTask.project?.userId === session.user.id;
  const isMember = existingTask.project?.members.some(m => m.userId === session.user.id);

  if (!isOwner && !isMember && existingTask.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  await prisma.task.delete({
    where: { id: taskId },
  });

  revalidatePath("/dashboard", "layout");
  return { success: true };
}

export async function updateTaskTitle(taskId: string, newTitle: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const existingTask = await prisma.task.findUnique({
    where: { id: taskId },
    include: { project: { include: { members: true } } }
  });

  if (!existingTask) {
    throw new Error("Task Not Found");
  }

  const isOwner = existingTask.project?.userId === session.user.id;
  const isMember = existingTask.project?.members.some(m => m.userId === session.user.id);

  if (!isOwner && !isMember && existingTask.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: { title: newTitle },
  });

  revalidatePath("/dashboard", "layout");
  return updatedTask;
}

export async function getCategories(projectId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // Verify project access
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [
        { userId: session.user.id },
        { members: { some: { userId: session.user.id } } }
      ]
    },
    include: { categories: { orderBy: { order: "asc" } } }
  });

  if (!project) {
    throw new Error("Unauthorized");
  }

  let categories = project.categories;

  if (categories.length === 0) {
    const defaults = [
      { id: `${projectId}-todo`, title: "To Do", color: "#8A8F98", order: 1024 },
      { id: `${projectId}-in-progress`, title: "In Progress", color: "#F5B041", order: 2048 },
      { id: `${projectId}-done`, title: "Done", color: "#5E6AD2", order: 3072 },
    ];

    await Promise.all(defaults.map(c => 
      prisma.category.create({
        data: {
          id: c.id,
          title: c.title,
          color: c.color,
          order: c.order,
          userId: project.userId, // Default categories belong to the owner
          projectId
        }
      })
    ));

    categories = await prisma.category.findMany({
      where: { projectId },
      orderBy: { order: "asc" },
    });
  }

  return categories;
}

export async function createCategory(projectId: string, title: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // Verify project access
  const hasAccess = await prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [
        { userId: session.user.id },
        { members: { some: { userId: session.user.id } } }
      ]
    }
  });

  if (!hasAccess) {
    throw new Error("Unauthorized");
  }

  const lastCategory = await prisma.category.findFirst({
    where: { projectId },
    orderBy: { order: "desc" },
  });

  const newOrder = lastCategory ? lastCategory.order + 1024 : 1024;
  const colors = ["#8A8F98", "#F5B041", "#5E6AD2", "#E35454", "#10B981", "#A855F7", "#EC4899"];
  const color = colors[Math.floor(Math.random() * colors.length)];

  const category = await prisma.category.create({
    data: {
      title,
      color,
      order: newOrder,
      userId: session.user.id,
      projectId,
    },
  });

  revalidatePath("/dashboard", "layout");
  return category;
}

export async function updateCategoryTitle(categoryId: string, title: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const existing = await prisma.category.findUnique({ 
    where: { id: categoryId },
    include: { project: { include: { members: true } } }
  });

  if (!existing) {
    throw new Error("Category Not Found");
  }

  const isOwner = existing.project?.userId === session.user.id;
  const isMember = existing.project?.members.some(m => m.userId === session.user.id);

  if (!isOwner && !isMember && existing.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  const category = await prisma.category.update({
    where: { id: categoryId },
    data: { title },
  });

  revalidatePath("/dashboard", "layout");
  return category;
}

export async function deleteCategory(categoryId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const existing = await prisma.category.findUnique({ 
    where: { id: categoryId },
    include: { project: { include: { members: true } } }
  });

  if (!existing) {
    throw new Error("Category Not Found");
  }

  const isOwner = existing.project?.userId === session.user.id;
  const isMember = existing.project?.members.some(m => m.userId === session.user.id);

  if (!isOwner && !isMember && existing.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  await prisma.category.delete({
    where: { id: categoryId },
  });

  await prisma.task.deleteMany({
    where: { 
      projectId: existing.projectId,
      status: categoryId
    }
  });

  revalidatePath("/dashboard");
  return { success: true };
}
