import type { Metadata } from "next";
import { Package2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Login - Aara Clothing",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
      <div className="pin-stripe absolute inset-0 opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--primary)_0%,_transparent_50%)] opacity-20" />
      <div className="relative w-full max-w-sm px-6">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex size-14 items-center justify-center rounded-2xl gradient-accent shadow-glow">
            <Package2 className="size-8 text-white" />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
