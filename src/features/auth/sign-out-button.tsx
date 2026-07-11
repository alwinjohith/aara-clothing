"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="text-muted-foreground hover:text-destructive"
    >
      <LogOut className="size-4" />
<<<<<<< HEAD
      Sign out
=======
      <span className="hidden sm:inline">Logout</span>
>>>>>>> f2172a4 (added settings)
    </Button>
  );
}
