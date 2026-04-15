import { z } from "zod";

const statusEnum = z.enum(["booked", "arrived", "waiting", "in_consultation", "completed"]);

export const createAppointmentSchema = z.object({
  clinicId: z.string().uuid(),
  patientId: z.string().uuid(),
  doctorId: z.string().uuid(),
  roomId: z.string().uuid().optional().nullable(),
  scheduledAt: z.string().datetime(),
});

export const updateAppointmentStatusSchema = z.object({
  appointmentId: z.string().uuid(),
  status: statusEnum,
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentStatusInput = z.infer<typeof updateAppointmentStatusSchema>;
