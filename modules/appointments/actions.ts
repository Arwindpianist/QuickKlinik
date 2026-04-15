"use server";

import { redirect } from "next/navigation";
import { createAppointmentSchema, updateAppointmentStatusSchema } from "@/modules/appointments/schema";
import * as appointmentsService from "@/modules/appointments/service";
import { getAuthenticatedUser } from "@/lib/auth";
import { createAuditLog } from "@/modules/audit/service";

const APPOINTMENTS_URL = "/dashboard/appointments";

const ALLOWED_CREATE_ROLES = ["SuperAdmin", "ClinicAdmin", "Doctor", "Nurse", "CounterStaff"] as const;
const ALLOWED_UPDATE_STATUS_ROLES = ["SuperAdmin", "ClinicAdmin", "Doctor", "Nurse", "CounterStaff"] as const;

export async function createAppointment(formData: FormData) {
  const result = await getAuthenticatedUser([...ALLOWED_CREATE_ROLES]);
  if ("error" in result) {
    redirect(`${APPOINTMENTS_URL}?error=${encodeURIComponent(result.error)}`);
  }
  const { user } = result;
  const clinicId = user.clinicId ?? formData.get("clinicId");
  if (!clinicId || typeof clinicId !== "string") {
    redirect(`${APPOINTMENTS_URL}?error=${encodeURIComponent("Clinic required")}`);
  }
  const parsed = createAppointmentSchema.safeParse({
    clinicId,
    patientId: formData.get("patientId"),
    doctorId: formData.get("doctorId"),
    roomId: formData.get("roomId") || undefined,
    scheduledAt: formData.get("scheduledAt"),
  });
  if (!parsed.success) {
    const msg = Object.values(parsed.error.flatten().fieldErrors).flat().join(" ") || "Invalid input";
    redirect(`${APPOINTMENTS_URL}?error=${encodeURIComponent(msg)}`);
  }
  const { data: conflict } = await appointmentsService.getConflictingAppointments(
    parsed.data.doctorId,
    parsed.data.scheduledAt
  );
  if (conflict && conflict.length > 0) {
    redirect(`${APPOINTMENTS_URL}?error=${encodeURIComponent("Doctor is not available at this time")}`);
  }
  const { data: appointment, error } = await appointmentsService.createAppointment({
    clinic_id: parsed.data.clinicId,
    patient_id: parsed.data.patientId,
    doctor_id: parsed.data.doctorId,
    room_id: parsed.data.roomId ?? null,
    scheduled_at: parsed.data.scheduledAt,
  });
  if (error) redirect(`${APPOINTMENTS_URL}?error=${encodeURIComponent(error.message)}`);
  if (!appointment) redirect(`${APPOINTMENTS_URL}?error=${encodeURIComponent("Failed to create appointment")}`);
  await createAuditLog({
    clinicId: parsed.data.clinicId,
    action: "appointment.create",
    entityType: "appointment",
    entityId: (appointment as { id: string }).id,
    actorId: user.profile.id,
    payload: { patientId: parsed.data.patientId, doctorId: parsed.data.doctorId, scheduledAt: parsed.data.scheduledAt },
  });
  redirect(`${APPOINTMENTS_URL}?created=1`);
}

export async function updateAppointmentStatus(formData: FormData) {
  const result = await getAuthenticatedUser([...ALLOWED_UPDATE_STATUS_ROLES]);
  if ("error" in result) redirect(`${APPOINTMENTS_URL}?error=${encodeURIComponent(result.error)}`);
  const { user } = result;
  const parsed = updateAppointmentStatusSchema.safeParse({
    appointmentId: formData.get("appointmentId"),
    status: formData.get("status"),
  });
  if (!parsed.success) {
    const msg = Object.values(parsed.error.flatten().fieldErrors).flat().join(" ") || "Invalid input";
    redirect(`${APPOINTMENTS_URL}?error=${encodeURIComponent(msg)}`);
  }
  const { error } = await appointmentsService.updateAppointmentStatus(
    parsed.data.appointmentId,
    parsed.data.status
  );
  if (error) redirect(`${APPOINTMENTS_URL}?error=${encodeURIComponent(error.message)}`);
  await createAuditLog({
    clinicId: user.clinicId ?? undefined,
    action: "appointment.update_status",
    entityType: "appointment",
    entityId: parsed.data.appointmentId,
    actorId: user.profile.id,
    payload: { status: parsed.data.status },
  });
  redirect(`${APPOINTMENTS_URL}?updated=1`);
}
