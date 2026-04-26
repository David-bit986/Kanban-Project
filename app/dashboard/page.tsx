import { getProjects } from "@/app/actions/project.actions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Briefcase, Plus } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  const { owned, joined } = await getProjects();

  if (owned.length > 0) {
    redirect(`/dashboard/projects/${owned[0].id}`);
  }

  if (joined.length > 0) {
    redirect(`/dashboard/projects/${joined[0].id}`);
  }

  return (
    <div className="flex flex-col items-center justify-center h-full bg-transparent text-center p-6">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-rose-500/20 to-orange-500/20 flex items-center justify-center mb-6 border border-rose-500/20">
        <Briefcase className="w-10 h-10 text-rose-500" />
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">Welcome to TaskSync</h1>
      <p className="text-zinc-400 max-w-sm mb-8">
        You don't have any projects yet. Create your first project in the sidebar to start managing your tasks.
      </p>
      <div className="flex items-center text-rose-500 font-medium animate-bounce">
        <Plus className="w-4 h-4 mr-2" />
        Use the sidebar to create a project
      </div>
    </div>
  );
}
