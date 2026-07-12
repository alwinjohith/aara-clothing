"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ActionSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function ActionSheet({ open, onClose, title, children }: ActionSheetProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 sm:hidden">
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/40 animate-[fadeIn_150ms_ease-out]"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        className={cn(
          "absolute bottom-0 left-0 right-0",
          "bg-card rounded-t-2xl shadow-elevated",
          "pb-[env(safe-area-inset-bottom)]",
          "animate-[slideUp_200ms_ease-out]"
        )}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-muted-foreground/30" />
        </div>
        {title && (
          <div className="px-4 pb-3 border-b border-border/50">
            <p className="text-sm font-semibold text-foreground">{title}</p>
          </div>
        )}
        <div className="p-2">{children}</div>
      </div>
    </div>
  );
}

interface ActionSheetItemProps {
  icon?: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: "default" | "destructive";
}

export function ActionSheetItem({
  icon,
  label,
  onClick,
  variant = "default",
}: ActionSheetItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium",
        "transition-colors active:bg-muted/50",
        "min-h-[44px]",
        variant === "destructive"
          ? "text-destructive"
          : "text-foreground"
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {label}
    </button>
  );
}
