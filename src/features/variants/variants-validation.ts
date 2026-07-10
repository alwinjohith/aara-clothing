import { z } from "zod";

export const createVariantSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  color: z.string().min(1, "Color is required").max(50),
  size: z.string().min(1, "Size is required").max(20),
  sku: z.string().min(1, "SKU is required").max(50),
  stock: z.number().int().min(0),
});

export type CreateVariantInput = z.infer<typeof createVariantSchema>;
