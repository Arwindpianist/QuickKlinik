import { createClient } from "@/lib/supabase/server";

export async function createAuditLog(params: {
  clinicId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  actorId?: string | null;
  payload?: Record<string, unknown> | null;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from("audit_logs").insert({
    clinic_id: params.clinicId ?? null,
    action: params.action,
    entity_type: params.entityType,
    entity_id: params.entityId ?? null,
    actor_id: params.actorId ?? null,
    payload: params.payload ?? null,
  });
  return { error };
}
