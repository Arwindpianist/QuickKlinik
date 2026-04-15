import { z } from "zod";

export const createOtcProductSchema = z.object({
  clinicId: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  maxQuantityPerOrder: z.number().int().positive().optional().nullable(),
  requiresDisclaimer: z.boolean().optional(),
});

export type CreateOtcProductInput = z.infer<typeof createOtcProductSchema>;
