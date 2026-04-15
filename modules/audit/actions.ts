"use server";

import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/auth";

export async function listAuditLogs(clinicId: string | null, limit = 50) {
  const result = await getAuthenticatedUser(["SuperAdmin", "ClinicAdmin"]);
  if ("error" in result) return { data: null, error: result.error };
  const supabase = await createClient();
  let q = supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (clinicId) {
    q = q.eq("clinic_id", clinicId);
  }
  const { data, error } = await q;
  return { data, error };
}
