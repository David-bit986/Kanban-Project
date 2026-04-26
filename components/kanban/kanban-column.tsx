"use client";

import React, { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Task, User } from "@prisma/client";
import { Circle, MoreHorizontal, Clock } from "lucide-react";
import { KanbanCard } from "./kanban-card";
import { updateCategoryTitle, deleteCategory } from "@/app/actions/task.actions";
import { motion, AnimatePresence } from "framer-motion";

interface ColumnProps {
  column: { id: string; title: string; color: string };
  tasks: (Task & { user: User })[];
  user: User;
}

export function KanbanColumn({ column, tasks, user }: ColumnProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);
  const [showMenu, setShowMenu] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const { setNodeRef } = useDroppable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  const handleSaveTitle = async () => {
    setIsEditing(false);
    if (editTitle.trim() && editTitle.trim() !== column.title) {
      setIsPending(true);
      try {
        await updateCategoryTitle(column.id, editTitle.trim());
      } catch (e) {
        console.error(e);
      } finally {
        setIsPending(false);
      }
    } else {
      setEditTitle(column.title);
    }
  };

  return (
    <div className={`w-[280px] md:w-[320px] flex flex-col h-full flex-shrink-0 transition-opacity ${isPending ? "opacity-50" : "opacity-100"}`}>
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center space-x-2 flex-1">
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white/[0.03] border border-white/[0.05]">
            {column.id === 'done' ? (
              <Circle className="w-3 h-3 fill-current" style={{ color: column.color }} />
            ) : column.id === 'in-progress' ? (
              <Clock className="w-3 h-3" style={{ color: column.color }} />
            ) : (
              <Circle className="w-3 h-3" style={{ color: column.color }} />
            )}
          </div>
          
          {isEditing ? (
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveTitle();
              }}
              autoFocus
              className="font-medium text-sm text-white bg-white/10 border border-white/20 rounded px-2 py-0.5 w-[150px] outline-none focus:border-rose-500/50"
            />
          ) : (
            <span 
              className="font-medium text-sm text-white cursor-pointer hover:text-white/80 transition-colors truncate max-w-[180px]"
              onDoubleClick={() => setIsEditing(true)}
            >
              {column.title}
            </span>
          )}
          
          <span className="text-xs font-medium text-zinc-400 ml-1">{tasks.length}</span>
        </div>

        <div className="flex items-center space-x-1 relative z-50">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded text-zinc-500 hover:bg-white/[0.05] hover:text-white transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

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
                  Edit Name
                </button>
                <div className="h-px bg-white/10 my-1" />
                <button 
                  onClick={async () => {
                    setShowMenu(false);
                    setIsPending(true);
                    await deleteCategory(column.id);
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-rose-500 hover:bg-white/10 transition-colors"
                >
                  Delete Section
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Droppable Area */}
      <div 
        ref={setNodeRef}
        className="flex-1 overflow-y-auto space-y-2 pb-4 flex flex-col min-h-[150px]"
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <KanbanCard key={task.id} task={task} user={user} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
