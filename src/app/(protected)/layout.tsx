import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants";
<<<<<<< HEAD
import { Sidebar } from "@/components/sidebar";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { Header } from "@/components/header";
=======
import { SignOutButton } from "@/features/auth/sign-out-button";
import {
  LayoutDashboard,
  Package2,
  Boxes,
  Users,
  Settings,
} from "lucide-react";

const navItems = [
  { href: ROUTES.DASHBOARD, label: "Dashboard", icon: LayoutDashboard },
  { href: ROUTES.PRODUCTS, label: "Products", icon: Package2 },
  { href: ROUTES.INVENTORY, label: "Inventory", icon: Boxes },
  { href: ROUTES.CUSTOMERS, label: "Customers", icon: Users },
  { href: ROUTES.SETTINGS, label: "Settings", icon: Settings },
];
>>>>>>> f2172a4 (added settings)

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect(ROUTES.LOGIN);
  }

  const username = (session.user as { username?: string }).username ?? session.user.name ?? "User";

  return (
<<<<<<< HEAD
    <div className="min-h-screen overflow-x-hidden bg-background">
      {/* Mobile Sidebar (hamburger) */}
      <MobileSidebar />

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 pb-6 pt-16 sm:px-6 lg:px-8 lg:pb-6 lg:pt-6">
          {/* Header with Greeting + Actions */}
          <Header username={username} />

          {/* Page Content */}
          <main>
            <div className="overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6 lg:p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
=======
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="pin-stripe absolute inset-0 opacity-30 pointer-events-none" />
        <div className="relative flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link href={ROUTES.DASHBOARD} className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg gradient-accent">
                <Package2 className="size-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                Aara Clothing
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-150 hover:bg-accent/10 hover:text-foreground"
                  >
                    <Icon className="size-4 transition-colors duration-150 group-hover:text-primary" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-1.5">
              <div className="size-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs text-muted-foreground">
                {session.user.username}
              </span>
            </div>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="pin-stripe-vertical absolute top-16 left-0 h-[calc(100%-4rem)] w-4 opacity-20 pointer-events-none" />
        {children}
      </main>
>>>>>>> f2172a4 (added settings)
    </div>
  );
}
