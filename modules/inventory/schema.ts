import { z } from "zod";

export const addStockSchema = z.object({
  otcBatchId: z.string().uuid(),
  quantity: z.number().int().positive(),
  reason: z.string().optional(),
});

export const createBatchSchema = z.object({
  otcProductId: z.string().uuid(),
  quantity: z.number().int().min(0),
  expiryDate: z.string().optional().nullable(),
  batchRef: z.string().optional().nullable(),
});

export type AddStockInput = z.infer<typeof addStockSchema>;
export type CreateBatchInput = z.infer<typeof createBatchSchema>;
