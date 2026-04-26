"use client";

import React, { useState } from "react";
import { upgradeUserTier } from "@/app/actions/user.actions";
import { useRouter } from "next/navigation";
import { Crown } from "lucide-react";

export function UpgradeButton({ tier }: { tier: string }) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  if (tier === "PRO") {
    return (
      <div className="flex items-center space-x-1 text-rose-500 font-bold text-xs bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
        <Crown className="w-3 h-3" />
        <span>PRO Member</span>
      </div>
    );
  }

  return (
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
      className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-full transition-all shadow-lg shadow-rose-950/20 hover:scale-105 active:scale-95 disabled:opacity-50"
    >
      {isPending ? "Upgrading..." : "Upgrade to Pro"}
    </button>
  );
}
