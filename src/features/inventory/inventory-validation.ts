import { z } from "zod";

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

export type UpdateStockInput = z.infer<typeof updateStockSchema>;
export type AdjustStockInput = z.infer<typeof adjustStockSchema>;
export type InventoryQuery = z.infer<typeof inventoryQuerySchema>;
