import { createClient } from "@/lib/supabase/server";

export async function getAppointmentsByClinic(clinicId: string, options?: { from?: string; to?: string }) {
  const supabase = await createClient();
  let q = supabase
    .from("appointments")
    .select("*, patients(full_name), doctors(full_name), rooms(name)")
    .eq("clinic_id", clinicId)
    .is("deleted_at", null)
    .order("scheduled_at", { ascending: true });
  if (options?.from) {
    q = q.gte("scheduled_at", options.from);
  }
  if (options?.to) {
    q = q.lte("scheduled_at", options.to);
  }
  const { data, error } = await q;
  return { data, error };
}

export async function getAppointmentById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("appointments")
    .select("*, patients(*), doctors(*), rooms(*)")
    .eq("id", id)
    .is("deleted_at", null)
    .single();
  return { data, error };
}

export async function createAppointment(params: {
  clinic_id: string;
  patient_id: string;
  doctor_id: string;
  room_id: string | null;
  scheduled_at: string;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("appointments")
    .insert(params)
    .select("id")
    .single();
  return { data, error };
}

export async function updateAppointmentStatus(id: string, status: "booked" | "arrived" | "waiting" | "in_consultation" | "completed") {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("appointments")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id")
    .single();
  return { data, error };
}

export async function getConflictingAppointments(
  doctorId: string,
  scheduledAt: string,
  excludeAppointmentId?: string
) {
  const supabase = await createClient();
  const start = new Date(scheduledAt);
  const end = new Date(start.getTime() + 30 * 60 * 1000);
  let q = supabase
    .from("appointments")
    .select("id")
    .eq("doctor_id", doctorId)
    .is("deleted_at", null)
    .gte("scheduled_at", start.toISOString())
    .lt("scheduled_at", end.toISOString());
  if (excludeAppointmentId) {
    q = q.neq("id", excludeAppointmentId);
  }
  const { data, error } = await q;
  return { data, error };
}
