import { createClient } from "@/lib/supabase/server";

export async function getTenants(filters?: {
  tenantType?: string;
  status?: string;
}) {
  const supabase = await createClient();
  let q = supabase
    .from("tenants")
    .select("*")
    .is("deleted_at", null)
    .order("display_name");
  if (filters?.tenantType) q = q.eq("tenant_type", filters.tenantType);
  if (filters?.status) q = q.eq("status", filters.status);
  const { data, error } = await q;
  return { data, error };
}

export async function getTenantById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tenants")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .single();
  return { data, error };
}

export async function getTenantWithClinic(id: string) {
  const supabase = await createClient();
  const { data: tenant, error: tenantError } = await supabase
    .from("tenants")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .single();
  if (tenantError || !tenant) return { data: null, error: tenantError?.message ?? "Not found" };
  if (tenant.tenant_type !== "clinic") {
    return { data: { ...tenant, clinic: null }, error: null };
  }
  const { data: clinic } = await supabase
    .from("clinics")
    .select("id, display_name")
    .eq("tenant_id", id)
    .is("deleted_at", null)
    .maybeSingle();
  return { data: { ...tenant, clinic }, error: null };
}

export async function createTenant(params: {
  display_name: string;
  logo_url?: string | null;
  primary_color?: string | null;
  support_email?: string | null;
  custom_domain?: string | null;
  tenant_type: string;
  subscription_package?: string | null;
  size?: string | null;
  features?: string[] | null;
  status?: string;
}) {
  const supabase = await createClient();
  const { data: tenant, error: tenantError } = await supabase
    .from("tenants")
    .insert({
      display_name: params.display_name,
      logo_url: params.logo_url ?? null,
      primary_color: params.primary_color ?? null,
      support_email: params.support_email ?? null,
      custom_domain: params.custom_domain ?? null,
      tenant_type: params.tenant_type,
      subscription_package: params.subscription_package ?? null,
      size: params.size ?? null,
      features: Array.isArray(params.features) ? params.features : [],
      status: params.status ?? "active",
    })
    .select("id")
    .single();
  if (tenantError || !tenant) return { data: null, error: tenantError };
  if (params.tenant_type === "clinic") {
    const { createClinic } = await import("@/modules/clinics/service");
    const { error: clinicError } = await createClinic({
      tenant_id: tenant.id,
      display_name: params.display_name,
      logo_url: params.logo_url ?? null,
      primary_color: params.primary_color ?? null,
      support_email: params.support_email ?? null,
      custom_domain: params.custom_domain ?? null,
    });
    if (clinicError) {
      await softDeleteTenant(tenant.id);
      return { data: null, error: clinicError };
    }
  }
  return { data: tenant, error: null };
}

export async function updateTenant(
  id: string,
  params: {
    display_name?: string;
    logo_url?: string | null;
    primary_color?: string | null;
    support_email?: string | null;
    custom_domain?: string | null;
    tenant_type?: string;
    subscription_package?: string | null;
    size?: string | null;
    features?: string[] | null;
    status?: string;
  }
) {
  const supabase = await createClient();
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (params.display_name !== undefined) updates.display_name = params.display_name;
  if (params.logo_url !== undefined) updates.logo_url = params.logo_url;
  if (params.primary_color !== undefined) updates.primary_color = params.primary_color;
  if (params.support_email !== undefined) updates.support_email = params.support_email;
  if (params.custom_domain !== undefined) updates.custom_domain = params.custom_domain;
  if (params.tenant_type !== undefined) updates.tenant_type = params.tenant_type;
  if (params.subscription_package !== undefined) updates.subscription_package = params.subscription_package;
  if (params.size !== undefined) updates.size = params.size;
  if (params.features !== undefined) updates.features = params.features;
  if (params.status !== undefined) updates.status = params.status;
  const { data, error } = await supabase
    .from("tenants")
    .update(updates)
    .eq("id", id)
    .is("deleted_at", null)
    .select("id")
    .single();
  if (error) return { data: null, error };
  if (data && params.tenant_type === undefined) {
    const { data: tenant } = await getTenantById(id);
    if (tenant?.tenant_type === "clinic" && (params.display_name !== undefined || params.logo_url !== undefined || params.primary_color !== undefined || params.support_email !== undefined || params.custom_domain !== undefined)) {
      const { data: clinic } = await supabase.from("clinics").select("id").eq("tenant_id", id).is("deleted_at", null).single();
      if (clinic) {
        const clinicUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() };
        if (params.display_name !== undefined) clinicUpdates.display_name = params.display_name;
        if (params.logo_url !== undefined) clinicUpdates.logo_url = params.logo_url;
        if (params.primary_color !== undefined) clinicUpdates.primary_color = params.primary_color;
        if (params.support_email !== undefined) clinicUpdates.support_email = params.support_email;
        if (params.custom_domain !== undefined) clinicUpdates.custom_domain = params.custom_domain;
        await supabase.from("clinics").update(clinicUpdates).eq("id", clinic.id);
      }
    }
  }
  return { data, error: null };
}

export async function softDeleteTenant(id: string) {
  const supabase = await createClient();
  const now = new Date().toISOString();
  const { data: tenant } = await getTenantById(id);
  if (tenant?.tenant_type === "clinic") {
    const { data: clinic } = await supabase.from("clinics").select("id").eq("tenant_id", id).maybeSingle();
    if (clinic) {
      await supabase.from("clinics").update({ deleted_at: now, updated_at: now }).eq("id", clinic.id);
    }
  }
  const { data, error } = await supabase
    .from("tenants")
    .update({ deleted_at: now, updated_at: now })
    .eq("id", id)
    .is("deleted_at", null)
    .select("id")
    .single();
  return { data, error };
}
