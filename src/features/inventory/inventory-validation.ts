import { z } from "zod";

export const createProductSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(200, "Name must be 200 characters or less"),
  description: z.string().max(1000).optional().nullable(),
  price: z.number().min(0, "Price cannot be negative").default(0),
  isActive: z.boolean().default(true),
});

export const updateProductSchema = createProductSchema.partial();

export const productQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
});

export const updateStockSchema = z.object({
  stock: z.number().int().min(0, "Stock cannot be negative"),
});

export const adjustStockSchema = z.object({
  amount: z
    .number()
    .int()
    .refine((val) => val !== 0, "Amount cannot be zero"),
});

export const inventoryQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQuery = z.infer<typeof productQuerySchema>;
export type UpdateStockInput = z.infer<typeof updateStockSchema>;
export type AdjustStockInput = z.infer<typeof adjustStockSchema>;
export type InventoryQuery = z.infer<typeof inventoryQuerySchema>;
