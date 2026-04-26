import React from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { SettingsContent } from "./settings-content";
import { UpgradeButton } from "./upgrade-button";

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) return null;

  // Calculate Tier
  const projectCount = await prisma.project.count({
    where: { userId: user.id }
  });
  
  const tier = user.tier === "PRO" ? "Pro Plan" : "Free Plan";

  return (
    <div className="flex-1 bg-transparent p-6 md:p-10 overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-zinc-500 mb-10 text-sm">Manage your account preferences and board appearance.</p>

        <div className="space-y-12">
          {/* Plan Section */}
          <section>
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Subscription Plan</h2>
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-white">{tier}</p>
                <p className="text-sm text-zinc-500 mt-1">You are currently using {projectCount}/3 projects.</p>
              </div>
              <UpgradeButton tier={user.tier} />
            </div>
          </section>

          {/* Profile Section */}
          <section>
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Profile Appearance</h2>
            <SettingsContent initialColor={user.avatarColor} tier={user.tier} />
          </section>
        </div>
      </div>
    </div>
  );
}
