"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { updateUserAvatarColor, upgradeUserTier } from "@/app/actions/user.actions";
import { Check, LogOut, Crown } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const COLORS = [
  { name: "Sunset", value: "from-rose-500 to-orange-500" },
  { name: "Ocean", value: "from-blue-500 to-cyan-400" },
  { name: "Emerald", value: "from-emerald-500 to-teal-400" },
  { name: "Purple Rain", value: "from-indigo-500 to-purple-500" },
  { name: "Lavender", value: "from-fuchsia-500 to-pink-500" },
  { name: "Golden", value: "from-yellow-400 to-orange-500" },
  { name: "Slate", value: "from-zinc-400 to-zinc-600" },
  { name: "Midnight", value: "from-slate-700 to-slate-900" },
];

export function SettingsContent({ initialColor, tier }: { initialColor: string, tier: string }) {
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleColorChange = async (color: string) => {
    setSelectedColor(color);
    setIsPending(true);
    try {
      await updateUserAvatarColor(color);
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
      <div className="flex items-center space-x-6 mb-8">
        <div className={cn(
          "w-16 h-16 rounded-full border-2 border-white/20 shadow-2xl bg-gradient-to-r transition-all duration-500",
          selectedColor
        )} />
        <div>
          <h3 className="text-white font-bold text-lg">Avatar Style</h3>
          <p className="text-zinc-500 text-sm mt-0.5">This color will represent you on board cards.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {COLORS.map((color) => (
          <button
            key={color.value}
            onClick={() => handleColorChange(color.value)}
            disabled={isPending}
            className={cn(
              "group relative flex flex-col items-center p-3 rounded-xl border transition-all duration-200",
              selectedColor === color.value 
                ? "bg-white/10 border-white/30" 
                : "bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.05]"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full mb-2 bg-gradient-to-r shadow-lg transition-transform group-hover:scale-110",
              color.value
            )} />
            <span className="text-[10px] font-medium text-zinc-400 group-hover:text-white uppercase tracking-tighter transition-colors">
              {color.name}
            </span>
            {selectedColor === color.value && (
              <div className="absolute top-1 right-1">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-white/10 space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Account Actions</h3>
          
          {tier !== "PRO" ? (
            <button
              onClick={async () => {
                setIsPending(true);
                try {
                  await upgradeUserTier();
                  router.refresh();
                } catch (e) {
                  console.error(e);
                } finally {
                  setIsPending(false);
                }
              }}
              disabled={isPending}
              className="flex items-center space-x-2 px-6 py-4 bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 text-white rounded-xl transition-all font-bold text-sm w-full justify-center shadow-lg shadow-rose-950/20 mb-4"
            >
              <Crown className="w-4 h-4" />
              <span>Upgrade to Pro (Limited Time: $0)</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2 px-6 py-4 bg-white/5 border border-rose-500/30 text-rose-500 rounded-xl font-bold text-sm w-full justify-center mb-4">
              <Crown className="w-4 h-4" />
              <span>You are a Pro Member</span>
            </div>
          )}

          <button
            onClick={async () => {
              if (confirm("Are you sure you want to sign out?")) {
                await authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      router.push("/login");
                    },
                  },
                });
              }
            }}
            className="flex items-center space-x-2 px-6 py-3 bg-white/5 border border-white/10 hover:bg-rose-500/10 hover:border-rose-500/30 text-rose-500 rounded-xl transition-all font-bold text-sm w-full justify-center"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
