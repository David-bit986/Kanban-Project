"use client";

import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task, User } from "@prisma/client";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  MoreHorizontal,
  ArrowUpRight,
  ArrowRight,
  ArrowDownRight,
  Minus
} from "lucide-react";
import { updateTaskTitle, deleteTask } from "@/app/actions/task.actions";

interface CardProps {
  task: Task & { user: User };
  isOverlay?: boolean;
  showDate?: boolean;
  user: User;
}

function PriorityIcon({ priority }: { priority: string }) {
  switch (priority) {
    case "high":
      return <ArrowUpRight className="w-3.5 h-3.5 text-[#E35454]" />;
    case "medium":
      return <ArrowRight className="w-3.5 h-3.5 text-[#F5B041]" />;
    case "low":
      return <ArrowDownRight className="w-3.5 h-3.5 text-zinc-400" />;
    default:
      return <Minus className="w-3.5 h-3.5 text-zinc-500" />;
  }
}

export function KanbanCard({ task, isOverlay, showDate, user }: CardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [showMenu, setShowMenu] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    opacity: isPending ? 0.5 : 1,
  };

  const handleSaveTitle = async () => {
    setIsEditing(false);
    if (editTitle.trim() && editTitle.trim() !== task.title) {
      setIsPending(true);
      try {
        await updateTaskTitle(task.id, editTitle.trim());
      } catch (e) {
        console.error(e);
      } finally {
        setIsPending(false);
      }
    } else {
      setEditTitle(task.title);
    }
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-white/5 border border-white/10 rounded-[20px] p-4 opacity-30 h-[100px]"
      />
    );
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      suppressHydrationWarning
      className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-[20px] p-4 hover:border-white/20 hover:bg-white/10 transition-all cursor-grab active:cursor-grabbing group shadow-sm hover:shadow-md relative ${isOverlay ? "rotate-2 scale-105 shadow-2xl shadow-rose-950/20 border-rose-500/30 cursor-grabbing" : ""
        } ${showMenu ? "z-50" : "z-10"}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 pr-3">
          {isEditing ? (
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveTitle();
              }}
              autoFocus
              className="text-[13px] text-white font-medium bg-white/10 border border-white/20 rounded px-2 py-1 w-full outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/20"
              onPointerDown={(e) => e.stopPropagation()} // prevent dragging when clicking input
            />
          ) : (
            <p
              className="text-[13px] text-white font-medium leading-relaxed break-words"
              onDoubleClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
            >
              {task.title}
            </p>
          )}
        </div>

        <div className="flex items-center relative z-10" onPointerDown={(e) => e.stopPropagation()}>
          <div className={cn(
            "flex-shrink-0 w-5 h-5 rounded-full border border-white/10 shadow-sm mr-1 bg-gradient-to-r",
            task.user.avatarColor || "from-rose-500 to-orange-500"
          )}></div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center space-x-2">
          {task.createdAt && (
            <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-2">
              <span className={cn(
                "font-bold bg-clip-text text-transparent bg-gradient-to-r",
                task.user.avatarColor || "from-rose-500 to-orange-500"
              )}>
                {task.user.name}
              </span>
              <span className="w-1 h-1 rounded-full bg-zinc-600"></span>
              <span>{new Date(task.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false })}</span>
            </span>
          )}
        </div>
        <div className="flex items-center space-x-1.5 relative z-20" onPointerDown={(e) => e.stopPropagation()}>
          {/* Options Menu Button */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-zinc-500 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                className="absolute top-8 right-0 w-32 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden py-1 z-[999]"
              >
                <button
                  onClick={() => { setIsEditing(true); setShowMenu(false); }}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-white hover:bg-white/10 transition-colors"
                >
                  Edit Title
                </button>
                <div className="h-px bg-white/10 my-1" />
                <button
                  onClick={async () => {
                    setShowMenu(false);
                    setIsPending(true);
                    await deleteTask(task.id);
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-rose-500 hover:bg-white/10 transition-colors"
                >
                  Delete Card
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
