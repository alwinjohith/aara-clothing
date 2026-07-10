"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  createCustomerSchema,
  updateCustomerSchema,
  type CreateCustomerInput,
  type UpdateCustomerInput,
} from "./customers-validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Customer } from "@/types";

interface CustomerFormProps {
  mode: "create" | "edit";
  initialData?: Customer;
}

export function CustomerForm({ mode, initialData }: CustomerFormProps) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const schema = isEdit ? updateCustomerSchema : createCustomerSchema;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateCustomerInput | UpdateCustomerInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData?.name ?? "",
      phone: initialData?.phone ?? "",
      address: initialData?.address ?? "",
    },
  });

  async function onSubmit(data: CreateCustomerInput | UpdateCustomerInput) {
    try {
      const url = isEdit
        ? `/api/customers/${initialData!.id}`
        : "/api/customers";
      const method = isEdit ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error ?? "Failed to save customer");
      }

      toast.success(
        isEdit ? "Customer updated successfully" : "Customer created successfully"
      );
      router.push("/dashboard/customers");
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle>{isEdit ? "Edit Customer" : "Create Customer"}</CardTitle>
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
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" {...register("phone")} />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" {...register("address")} />
            {errors.address && (
              <p className="text-sm text-destructive">
                {errors.address.message}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEdit ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
