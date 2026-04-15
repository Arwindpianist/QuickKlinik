import { createClient } from "@/lib/supabase/server";

export async function getDoctorsByClinic(clinicId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("doctors")
    .select("id, full_name")
    .eq("clinic_id", clinicId)
    .is("deleted_at", null)
    .order("full_name");
  return { data, error };
}
