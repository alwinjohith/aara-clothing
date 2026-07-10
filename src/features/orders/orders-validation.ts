import { z } from "zod";
import { ORDER_STATUSES } from "@/lib/constants";

export const orderItemSchema = z.object({
  variantId: z.string().min(1, "Variant is required"),
  quantity: z.number().int().positive("Quantity must be greater than 0"),
});

export const createOrderSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  notes: z.string().max(1000).optional().nullable(),
  items: z
    .array(orderItemSchema)
    .min(1, "At least one item is required")
    .refine(
      (items) => {
        const variantIds = items.map((i) => i.variantId);
        return new Set(variantIds).size === variantIds.length;
      },
      { message: "Duplicate variants are not allowed" }
    ),
});

export const updateOrderSchema = z.object({
  customerId: z.string().min(1, "Customer is required").optional(),
  notes: z.string().max(1000).optional().nullable(),
  items: z
    .array(orderItemSchema)
    .min(1, "At least one item is required")
    .refine(
      (items) => {
        const variantIds = items.map((i) => i.variantId);
        return new Set(variantIds).size === variantIds.length;
      },
      { message: "Duplicate variants are not allowed" }
    )
    .optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    ORDER_STATUSES.PENDING,
    ORDER_STATUSES.PROCESSING,
    ORDER_STATUSES.COMPLETED,
    ORDER_STATUSES.CANCELLED,
  ]),
});

export const orderQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  status: z
    .enum([
      ORDER_STATUSES.PENDING,
      ORDER_STATUSES.PROCESSING,
      ORDER_STATUSES.COMPLETED,
      ORDER_STATUSES.CANCELLED,
    ])
    .optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type OrderQuery = z.infer<typeof orderQuerySchema>;
