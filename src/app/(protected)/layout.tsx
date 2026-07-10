import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import { Sidebar } from "@/components/sidebar";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { Header } from "@/components/header";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect(ROUTES.LOGIN);
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      {/* Mobile Sidebar (hamburger) */}
      <MobileSidebar />

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 pb-6 pt-16 sm:px-6 lg:px-8 lg:pb-6 lg:pt-6">
          {/* Header with Greeting + Actions */}
          <Header />

          {/* Page Content */}
          <main>
            <div className="overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
