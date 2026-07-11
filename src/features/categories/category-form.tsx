"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { createCategorySchema, updateCategorySchema, type CreateCategoryInput, type UpdateCategoryInput } from "./categories-validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import type { Category } from "@/types";

interface CategoryFormProps {
  mode: "create" | "edit";
  categories: { id: string; name: string; parentId: string | null }[];
  initialData?: Category;
  disabledCategoryIds?: string[];
}

export function CategoryForm({
  mode,
  categories,
  initialData,
  disabledCategoryIds = [],
}: CategoryFormProps) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const schema = isEdit ? updateCategorySchema : createCategorySchema;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateCategoryInput | UpdateCategoryInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData?.name ?? "",
      parentId: initialData?.parentId ?? null,
    },
  });

  const parentId = watch("parentId");

  const parentOptions = categories
    .filter((c) => !disabledCategoryIds.includes(c.id))
    .map((c) => ({
      value: c.id,
      label: c.name,
    }));

  async function onSubmit(data: CreateCategoryInput | UpdateCategoryInput) {
    try {
      const url = isEdit ? `/api/categories/${initialData!.id}` : "/api/categories";
      const method = isEdit ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error ?? "Failed to save category");
      }

      router.push("/dashboard/categories");
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  }

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="size-4" />
          </Button>
          <CardTitle>{isEdit ? "Edit Category" : "Create Category"}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} placeholder="Enter category name" />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="parentId">Parent Category</Label>
            <select
              id="parentId"
              value={parentId ?? ""}
              onChange={(e) =>
                setValue("parentId", e.target.value || null)
              }
              className="flex h-10 w-full appearance-none rounded-lg border border-input bg-muted/30 px-3 py-2 pr-8 text-sm shadow-sm transition-all duration-150 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">None (top-level)</option>
              {parentOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.parentId && (
              <p className="text-sm text-destructive">{errors.parentId.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                "Saving..."
              ) : (
                <>
                  <Save className="size-4" />
                  {isEdit ? "Update" : "Create"}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
