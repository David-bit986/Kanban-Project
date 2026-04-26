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

  const tasks = await prisma.task.findMany({
    where: {
      userId: session.user.id,
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

  const finalStatus = status === "todo" ? `${projectId}-todo` : status;

  // Generate a display ID (e.g., KAN-[count])
  const count = await prisma.task.count({
    where: { userId: session.user.id, projectId },
  });
  const displayId = `KAN-${count + 1}`;

  // Find the highest order in the current status to append to the bottom
  const lastTask = await prisma.task.findFirst({
    where: { userId: session.user.id, status, projectId },
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

  // Ensure the task belongs to the user
  const existingTask = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!existingTask || existingTask.userId !== session.user.id) {
    throw new Error("Unauthorized or Task Not Found");
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
  });

  if (!existingTask || existingTask.userId !== session.user.id) {
    throw new Error("Unauthorized or Task Not Found");
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
  });

  if (!existingTask || existingTask.userId !== session.user.id) {
    throw new Error("Unauthorized or Task Not Found");
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

  let categories = await prisma.category.findMany({
    where: { userId: session.user.id, projectId },
    orderBy: { order: "asc" },
  });

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
          userId: session.user.id,
          projectId
        }
      })
    ));

    categories = await prisma.category.findMany({
      where: { userId: session.user.id, projectId },
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

  const lastCategory = await prisma.category.findFirst({
    where: { userId: session.user.id, projectId },
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

  const existing = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!existing || existing.userId !== session.user.id) {
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

  const existing = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!existing || existing.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  await prisma.category.delete({
    where: { id: categoryId },
  });

  await prisma.task.deleteMany({
    where: { 
      userId: session.user.id,
      status: categoryId
    }
  });

  revalidatePath("/dashboard");
  return { success: true };
}
