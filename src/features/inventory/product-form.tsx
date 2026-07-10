"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { createProductSchema, updateProductSchema, type CreateProductInput, type UpdateProductInput } from "./inventory-validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VariantForm } from "@/features/variants/variant-form";
import { ImageUpload } from "@/features/images/image-upload";
import type { Product, ProductVariant } from "@/types";

interface ProductFormProps {
  mode: "create" | "edit";
  initialData?: Product;
}

export function ProductForm({ mode, initialData }: ProductFormProps) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const schema = isEdit ? updateProductSchema : createProductSchema;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateProductInput | UpdateProductInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      isActive: initialData?.isActive ?? true,
    },
  });

  async function onSubmit(data: CreateProductInput | UpdateProductInput) {
    try {
      const url = isEdit ? `/api/inventory/${initialData!.id}` : "/api/inventory";
      const method = isEdit ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error ?? "Failed to save product");
      }

      router.push("/dashboard/inventory");
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  }

  const variants = initialData?.variants ?? [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? "Edit Product" : "Create Product"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={3} {...register("description")} />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                defaultChecked={initialData?.isActive ?? true}
                onChange={(e) => setValue("isActive", e.target.checked)}
                className="size-4 rounded border-gray-300"
              />
              <Label htmlFor="isActive">Active</Label>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : isEdit ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {isEdit && initialData && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Variants</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <VariantForm
                productId={initialData.id}
                onVariantCreated={() => router.refresh()}
              />

              {variants.length > 0 && (
                <div className="space-y-4">
                  {variants.map((variant: ProductVariant) => (
                    <div
                      key={variant.id}
                      className="rounded-lg border p-4"
                    >
                      <div className="mb-3 grid grid-cols-4 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">Color:</span>{" "}
                          {variant.color}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Size:</span>{" "}
                          {variant.size}
                        </div>
                        <div>
                          <span className="text-muted-foreground">SKU:</span>{" "}
                          {variant.sku}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Stock:</span>{" "}
                          {variant.stock}
                        </div>
                      </div>

                      <ImageUpload
                        variantId={variant.id}
                        images={variant.images ?? []}
                        onImageChange={() => router.refresh()}
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
