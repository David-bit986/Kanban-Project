"use client";

import React, { useState } from "react";
import { createTask } from "@/app/actions/task.actions";
import { Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function NewTaskDialog({ projectId }: { projectId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsPending(true);
    try {
      await createTask(projectId, title.trim(), "no-priority", "todo");
      setTitle("");
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to create task", error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center bg-rose-600 hover:bg-rose-500 text-white text-[13px] font-bold h-8 px-4 rounded-full transition-all shadow-lg shadow-rose-950/20 hover:scale-105 active:scale-95"
      >
        <Plus className="w-4 h-4 mr-1.5" />
        New Issue
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 w-full max-w-md rounded-[20px] shadow-2xl shadow-rose-950/20 overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-rose-500 via-orange-500 to-rose-500 opacity-60" />
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <h3 className="text-white font-bold text-lg">Create New Issue</h3>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-zinc-400 hover:text-rose-400 transition-colors p-1 rounded-full hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-5">
                <input
                  type="text"
                  placeholder="Issue title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isPending}
                  autoFocus
                  className="w-full bg-white/5 border border-white/10 focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/20 rounded-xl text-white placeholder:text-zinc-400 px-4 py-3 outline-none text-base transition-all"
                />
                
                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    disabled={isPending || !title.trim()}
                    className="bg-white text-black font-semibold text-[13px] px-6 py-2 rounded-full hover:bg-zinc-200 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isPending ? "Creating..." : "Save Issue"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
