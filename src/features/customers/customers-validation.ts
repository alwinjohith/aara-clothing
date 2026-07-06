import { z } from "zod";

export const createCustomerSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(200, "Name must be 200 characters or less"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .max(20, "Phone number must be 20 characters or less"),
  address: z
    .string()
    .max(500, "Address must be 500 characters or less")
    .optional()
    .nullable(),
});

export const updateCustomerSchema = createCustomerSchema.partial();

export const customerQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
export type CustomerQuery = z.infer<typeof customerQuerySchema>;
