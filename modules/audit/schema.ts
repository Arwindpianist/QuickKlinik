import { z } from "zod";

export const createAuditLogSchema = z.object({
  clinicId: z.string().uuid().optional().nullable(),
  action: z.string().min(1),
  entityType: z.string().min(1),
  entityId: z.string().uuid().optional().nullable(),
  actorId: z.string().uuid().optional().nullable(),
  payload: z.record(z.unknown()).optional().nullable(),
});

export type CreateAuditLogInput = z.infer<typeof createAuditLogSchema>;
