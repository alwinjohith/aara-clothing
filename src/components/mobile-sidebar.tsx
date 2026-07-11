"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import { SignOutButton } from "@/features/auth/sign-out-button";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  Users,
  Settings,
  Menu,
  X,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { name: "Inventory", href: ROUTES.INVENTORY, icon: Package },
  { name: "Customers", href: ROUTES.CUSTOMERS, icon: Users },
  { name: "Settings", href: ROUTES.SETTINGS, icon: Settings },
];

export function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);
  const shouldCloseRef = useRef(false);

  const closeSidebar = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsAnimating(false);
    }, 200);
  }, []);

  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      shouldCloseRef.current = true;
    }
  }, [pathname]);

  useEffect(() => {
    if (shouldCloseRef.current && isOpen) {
      shouldCloseRef.current = false;
      closeSidebar();
    }
  }, [isOpen, closeSidebar]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-4 z-50 flex size-10 items-center justify-center rounded-xl border border-border bg-card shadow-sm transition-all duration-200 hover:bg-muted"
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </button>

      {isOpen && (
        <div
          className={cn(
            "fixed inset-0 z-50 bg-black/50",
            isAnimating ? "overlay-close" : "overlay-open"
          )}
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {isOpen && (
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-card shadow-xl",
            isAnimating ? "sidebar-close" : "sidebar-open"
          )}
        >
          <div className="flex items-center justify-between px-4 py-6">
            <Link href={ROUTES.DASHBOARD} onClick={closeSidebar}>
              <Image
                src="/aara-logo-white.png"
                alt="Aara Clothing"
                height={32}
                width={64}
                className="h-8 w-auto"
                priority
              />
            </Link>
            <button
              onClick={closeSidebar}
              className="flex size-8 items-center justify-center rounded-lg transition-colors duration-200 hover:bg-muted"
              aria-label="Close menu"
            >
              <X className="size-5" />
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-1 px-3">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== ROUTES.DASHBOARD &&
                  pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeSidebar}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-[var(--aara-secondary)] to-[var(--aara-accent)] text-white shadow-md"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon
                    className={cn(
                      "size-5 shrink-0 transition-colors duration-200",
                      isActive
                        ? "text-white"
                        : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-border px-3 py-4">
            <SignOutButton />
          </div>
        </div>
      )}
    </div>
  );
}
