"use server";

import { parseCreateClinic, parseUpdateClinic } from "@/modules/clinics/schema";
import * as clinicsService from "@/modules/clinics/service";
import * as tenantsService from "@/modules/tenants/service";
import { getAuthenticatedUser } from "@/lib/auth";
import * as auditService from "@/modules/audit/service";

export async function listClinics() {
  const result = await getAuthenticatedUser(["SuperAdmin"]);
  if ("error" in result) return { data: null, error: result.error };
  return clinicsService.getClinics();
}

export async function getClinicAction(id: string) {
  const result = await getAuthenticatedUser(["SuperAdmin"]);
  if ("error" in result) return { data: null, error: result.error };
  return clinicsService.getClinicById(id);
}

export async function createClinicAction(formData: FormData) {
  const result = await getAuthenticatedUser(["SuperAdmin"]);
  if ("error" in result) return { data: null, error: result.error };
  try {
    const input = parseCreateClinic(formData);
    const { data: tenantData, error: tenantError } = await tenantsService.createTenant({
      display_name: input.displayName,
      logo_url: input.logoUrl ?? null,
      primary_color: input.primaryColor ?? null,
      support_email: input.supportEmail ?? null,
      custom_domain: input.customDomain ?? null,
      tenant_type: "clinic",
      subscription_package: "starter",
      size: "medium",
      features: ["appointments", "otc", "inventory"],
      status: "active",
    });
    if (tenantError || !tenantData) {
      const err = tenantError as { message?: string } | null;
      return { data: null, error: err?.message ?? "Failed to create tenant" };
    }
    const { data: clinicData } = await clinicsService.getClinicByTenantId(tenantData.id);
    await auditService.createAuditLog({
      clinicId: clinicData?.id ?? null,
      action: "clinic.create",
      entityType: "clinic",
      entityId: clinicData?.id ?? tenantData.id,
      actorId: result.user.profile.id,
      payload: { displayName: input.displayName },
    });
    return { data: clinicData ? { id: clinicData.id } : tenantData, error: null };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid input";
    return { data: null, error: message };
  }
}

export async function updateClinicAction(clinicId: string, formData: FormData) {
  const result = await getAuthenticatedUser(["SuperAdmin"]);
  if ("error" in result) return { data: null, error: result.error };
  try {
    const input = parseUpdateClinic(formData);
    if (Object.keys(input).length === 0) return { data: { id: clinicId }, error: null };
    const { data, error } = await clinicsService.updateClinic(clinicId, {
      display_name: input.displayName,
      logo_url: input.logoUrl,
      primary_color: input.primaryColor,
      support_email: input.supportEmail,
      custom_domain: input.customDomain,
    });
    if (error) return { data: null, error: error.message };
    await auditService.createAuditLog({
      clinicId,
      action: "clinic.update",
      entityType: "clinic",
      entityId: clinicId,
      actorId: result.user.profile.id,
      payload: input,
    });
    return { data, error: null };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid input";
    return { data: null, error: message };
  }
}

export async function deleteClinicAction(clinicId: string) {
  const result = await getAuthenticatedUser(["SuperAdmin"]);
  if ("error" in result) return { data: null, error: result.error };
  const { data, error } = await clinicsService.softDeleteClinic(clinicId);
  if (error) return { data: null, error: error.message };
  await auditService.createAuditLog({
    clinicId: null,
    action: "clinic.delete",
    entityType: "clinic",
    entityId: clinicId,
    actorId: result.user.profile.id,
    payload: { softDelete: true },
  });
  return { data, error: null };
}
