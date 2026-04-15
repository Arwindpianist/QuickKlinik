import { createClient } from "@/lib/supabase/server";

export async function getClinics() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clinics")
    .select("*")
    .is("deleted_at", null)
    .order("display_name");
  return { data, error };
}

export async function getClinicById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clinics")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .single();
  return { data, error };
}

export async function getClinicByTenantId(tenantId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clinics")
    .select("id")
    .eq("tenant_id", tenantId)
    .is("deleted_at", null)
    .maybeSingle();
  return { data, error };
}

export async function createClinic(params: {
  tenant_id: string;
  display_name: string;
  logo_url?: string | null;
  primary_color?: string | null;
  support_email?: string | null;
  custom_domain?: string | null;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clinics")
    .insert({
      tenant_id: params.tenant_id,
      display_name: params.display_name,
      logo_url: params.logo_url ?? null,
      primary_color: params.primary_color ?? null,
      support_email: params.support_email ?? null,
      custom_domain: params.custom_domain ?? null,
    })
    .select("id")
    .single();
  return { data, error };
}

export async function updateClinic(
  id: string,
  params: {
    display_name?: string;
    logo_url?: string | null;
    primary_color?: string | null;
    support_email?: string | null;
    custom_domain?: string | null;
  }
) {
  const supabase = await createClient();
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (params.display_name !== undefined) updates.display_name = params.display_name;
  if (params.logo_url !== undefined) updates.logo_url = params.logo_url;
  if (params.primary_color !== undefined) updates.primary_color = params.primary_color;
  if (params.support_email !== undefined) updates.support_email = params.support_email;
  if (params.custom_domain !== undefined) updates.custom_domain = params.custom_domain;
  const { data, error } = await supabase
    .from("clinics")
    .update(updates)
    .eq("id", id)
    .is("deleted_at", null)
    .select("id")
    .single();
  return { data, error };
}

export async function softDeleteClinic(id: string) {
  const supabase = await createClient();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("clinics")
    .update({ deleted_at: now, updated_at: now })
    .eq("id", id)
    .is("deleted_at", null)
    .select("id")
    .single();
  return { data, error };
}
