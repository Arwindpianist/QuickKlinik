import { createClient } from "@/lib/supabase/server";

export async function getOtcProductsByClinic(clinicId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("otc_products")
    .select("*")
    .eq("clinic_id", clinicId)
    .is("deleted_at", null)
    .order("name");
  return { data, error };
}

export async function getOtcProductWithBatches(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("otc_products")
    .select("*, otc_batches(*)")
    .eq("id", id)
    .is("deleted_at", null)
    .single();
  return { data, error };
}
