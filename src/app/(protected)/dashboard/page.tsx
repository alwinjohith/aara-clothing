import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getDashboardStats } from "@/features/dashboard/dashboard-service";
import { DashboardWidgets } from "@/features/dashboard/dashboard-widgets";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const stats = await getDashboardStats();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session.user.username}
        </p>
      </div>
      <DashboardWidgets stats={stats} />
    </div>
  );
}
