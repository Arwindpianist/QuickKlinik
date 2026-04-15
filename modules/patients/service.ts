import { createClient } from "@/lib/supabase/server";

export async function getPatientsByClinic(clinicId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("patients")
    .select("id, full_name, phone, email")
    .eq("clinic_id", clinicId)
    .is("deleted_at", null)
    .order("full_name");
  return { data, error };
}

export async function createPatient(params: {
  clinic_id: string;
  full_name: string;
  phone?: string | null;
  email?: string | null;
  date_of_birth?: string | null;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("patients").insert(params).select("id").single();
  return { data, error };
}
