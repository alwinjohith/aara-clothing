import { getDashboardStats } from "@/features/dashboard/dashboard-service";
import { DashboardWidgets } from "@/features/dashboard/dashboard-widgets";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
<<<<<<< HEAD
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight">Dashboard Overview</h2>
        <p className="text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening with your store today
=======
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          Welcome back, {session.user.username}
>>>>>>> f2172a4 (added settings)
        </p>
      </div>
      <DashboardWidgets stats={stats} />
    </div>
  );
}
