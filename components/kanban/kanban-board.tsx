"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useRouter } from "next/navigation";
import { Task } from "@prisma/client";
import { KanbanColumn } from "./kanban-column";
import { KanbanCard } from "./kanban-card";
import { updateTaskStatusAndOrder } from "@/app/actions/task.actions";

import { NewTaskDialog } from "./new-task-dialog";
import { ListFilter, ArrowDown, ArrowUp, Plus, Share2, Eye, EyeOff, Copy } from "lucide-react";
import { createCategory } from "@/app/actions/task.actions";
import { Category, User } from "@prisma/client";

type SortMode = "custom" | "newest" | "oldest";

export function KanbanBoard({
  initialTasks,
  initialCategories,
  user,
  projectId,
  inviteCode,
  isShared
}: {
  initialTasks: (Task & { user: User })[],
  initialCategories: Category[],
  user: User,
  projectId: string,
  inviteCode: string,
  isShared: boolean
}) {
  const [tasks, setTasks] = useState<(Task & { user: User })[]>(initialTasks);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>("custom");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [showInviteCode, setShowInviteCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  // Polling for real-time updates
  React.useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 5000);
    return () => clearInterval(interval);
  }, [router]);

  React.useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  React.useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";
    const isOverColumn = over.data.current?.type === "Column";

    if (!isActiveTask) return;

    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].status !== tasks[overIndex].status) {
          const newTasks = [...tasks];
          newTasks[activeIndex].status = tasks[overIndex].status;
          return arrayMove(newTasks, activeIndex, overIndex);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    if (isActiveTask && isOverColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const newTasks = [...tasks];
        newTasks[activeIndex].status = overId as string;
        return arrayMove(newTasks, activeIndex, activeIndex);
      });
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTaskIndex = tasks.findIndex((t) => t.id === activeId);
    if (activeTaskIndex === -1) return;

    const task = tasks[activeTaskIndex];
    let newOrder = task.order;

    if (activeTaskIndex === 0) {
      newOrder = tasks.length > 1 ? tasks[1].order / 2 : 1024;
    } else if (activeTaskIndex === tasks.length - 1) {
      newOrder = tasks[tasks.length - 2].order + 1024;
    } else {
      newOrder = (tasks[activeTaskIndex - 1].order + tasks[activeTaskIndex + 1].order) / 2;
    }

    try {
      await updateTaskStatusAndOrder(task.id, task.status, newOrder);
    } catch (e) {
      console.error("Failed to update task", e);
    }
  };

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.4",
        },
      },
    }),
  };

  const cycleSortMode = () => {
    if (sortMode === "custom") setSortMode("newest");
    else if (sortMode === "newest") setSortMode("oldest");
    else setSortMode("custom");
  };

  const handleAddCategory = async () => {
    setIsAddingCategory(true);
    try {
      await createCategory(projectId, "New Section");
    } catch (e) {
      console.error(e);
    } finally {
      setIsAddingCategory(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full min-h-0">
      <header className="h-14 flex items-center justify-between px-4 md:px-6 border-b border-white/10 flex-shrink-0 bg-[#0a0a0a/50] backdrop-blur-md sticky top-0 z-[100]">
        <div className="flex items-center space-x-2 md:space-x-4 overflow-hidden">
          <div className="w-10 lg:hidden flex-shrink-0" />

          {isShared && inviteCode && (
            <div className="flex items-center bg-white/[0.04] rounded-full px-2 md:px-3 py-1 border border-white/10 group/invite overflow-hidden max-w-[120px] md:max-w-none">
              <Share2 className="w-3.5 h-3.5 text-zinc-400 mr-2 flex-shrink-0" />
              <span className="hidden sm:inline text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mr-2">Invite:</span>
              <div className="flex items-center space-x-2 overflow-hidden">
                <span className={cn(
                  "text-[12px] md:text-[13px] font-mono font-bold transition-all truncate",
                  showInviteCode ? "text-rose-400 opacity-100" : "text-zinc-600 opacity-50 blur-[2px]"
                )}>
                  {showInviteCode ? inviteCode : "••••••"}
                </span>
                <button
                  onClick={() => setShowInviteCode(!showInviteCode)}
                  className="text-zinc-500 hover:text-white transition-colors flex-shrink-0"
                >
                  {showInviteCode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                {showInviteCode && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(inviteCode);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="text-zinc-500 hover:text-white transition-colors flex items-center flex-shrink-0"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copied && <span className="hidden md:inline ml-1 text-[10px] text-emerald-500 font-bold">Copied!</span>}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 md:space-x-3">
          <div
            onClick={cycleSortMode}
            className={`flex items-center text-xs md:text-sm cursor-pointer transition-colors px-2 md:px-3 py-1.5 rounded-full ${sortMode !== "custom" ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'}`}
          >
            {sortMode === "custom" && <ListFilter className="w-3.5 h-3.5 md:w-4 md:h-4 md:mr-2" />}
            {sortMode === "newest" && <ArrowDown className="w-3.5 h-3.5 md:w-4 md:h-4 md:mr-2" />}
            {sortMode === "oldest" && <ArrowUp className="w-3.5 h-3.5 md:w-4 md:h-4 md:mr-2" />}
            <span className="hidden sm:inline">Sort: {sortMode === "custom" ? "Custom" : sortMode === "newest" ? "Newest First" : "Oldest First"}</span>
            <span className="sm:hidden ml-1">{sortMode === "custom" ? "Cust" : sortMode === "newest" ? "New" : "Old"}</span>
          </div>
          <NewTaskDialog projectId={projectId} />
        </div>
      </header>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 w-full overflow-x-auto overflow-y-hidden p-6 space-x-6 flex items-start min-h-0">
          {categories.map((col) => {
            let colTasks = tasks.filter((t) => t.status === col.id);

            if (sortMode === "newest") {
              colTasks = [...colTasks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            } else if (sortMode === "oldest") {
              colTasks = [...colTasks].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            }

            return (
              <KanbanColumn key={col.id} column={col} tasks={colTasks} user={user} />
            );
          })}

          <button
            onClick={handleAddCategory}
            disabled={isAddingCategory}
            className="flex-shrink-0 flex items-center justify-center w-[280px] md:w-[300px] h-[50px] rounded-xl border border-dashed border-white/20 text-zinc-400 hover:text-white hover:border-white/40 transition-colors bg-white/[0.02] hover:bg-white/[0.05]"
          >
            <Plus className="w-4 h-4 mr-2" />
            {isAddingCategory ? "Adding..." : "Add Section"}
          </button>
        </div>

        <DragOverlay dropAnimation={dropAnimation}>
          {activeTask ? <KanbanCard task={activeTask} isOverlay user={user} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
