"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  updateProfileSchema,
  type UpdateProfileInput,
} from "./settings-validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, Loader2, Save } from "lucide-react";

interface ProfileSectionProps {
  name: string | null;
  username: string;
}

export function ProfileSection({ name, username }: ProfileSectionProps) {
  const [isEditingName, setIsEditingName] = useState(false);

  const nameForm = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: name ?? "" },
  });

  async function onNameSubmit(data: UpdateProfileInput) {
    try {
      const response = await fetch("/api/settings/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error ?? "Failed to update profile");
      }

      toast.success("Profile updated successfully");
      setIsEditingName(false);
      nameForm.reset({ name: data.name });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-aara-primary/10">
            <User className="size-5 text-aara-primary" />
          </div>
          <div>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Username</Label>
            <Input value={username} disabled className="opacity-60" />
            <p className="text-xs text-muted-foreground">Username cannot be changed</p>
          </div>

          {isEditingName ? (
            <form onSubmit={nameForm.handleSubmit(onNameSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  {...nameForm.register("name")}
                  placeholder="Enter your full name"
                />
                {nameForm.formState.errors.name && (
                  <p className="text-sm text-destructive">
                    {nameForm.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsEditingName(false);
                    nameForm.reset({ name: name ?? "" });
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={nameForm.formState.isSubmitting}>
                  {nameForm.formState.isSubmitting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Save className="size-4" />
                  )}
                  Save
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-2">
              <Label>Full Name</Label>
              <div className="flex items-center gap-2">
                <Input value={name ?? "Not set"} disabled className="opacity-60" />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingName(true)}
                >
                  Edit
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
