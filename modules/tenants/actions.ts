"use server";

import { parseCreateTenant, parseUpdateTenant } from "@/modules/tenants/schema";
import * as tenantsService from "@/modules/tenants/service";
import { getAuthenticatedUser } from "@/lib/auth";
import * as auditService from "@/modules/audit/service";

export async function listTenants(filters?: { tenantType?: string; status?: string }) {
  const result = await getAuthenticatedUser(["SuperAdmin"]);
  if ("error" in result) return { data: null, error: result.error };
  return tenantsService.getTenants(filters);
}

export async function getTenantAction(id: string) {
  const result = await getAuthenticatedUser(["SuperAdmin"]);
  if ("error" in result) return { data: null, error: result.error };
  return tenantsService.getTenantWithClinic(id);
}

export async function createTenantAction(formData: FormData) {
  const result = await getAuthenticatedUser(["SuperAdmin"]);
  if ("error" in result) return { data: null, error: result.error };
  try {
    const input = parseCreateTenant(formData);
    const { data, error } = await tenantsService.createTenant({
      display_name: input.displayName,
      logo_url: input.logoUrl ?? null,
      primary_color: input.primaryColor ?? null,
      support_email: input.supportEmail ?? null,
      custom_domain: input.customDomain ?? null,
      tenant_type: input.tenantType,
      subscription_package: input.subscriptionPackage ?? null,
      size: input.size ?? null,
      features: Array.isArray(input.features) ? input.features : [],
      status: input.status ?? "active",
    });
    if (error) return { data: null, error: typeof error === "object" && error !== null && "message" in error ? (error as { message: string }).message : String(error) };
    await auditService.createAuditLog({
      clinicId: null,
      action: "tenant.create",
      entityType: "tenant",
      entityId: data?.id ?? null,
      actorId: result.user.profile.id,
      payload: { displayName: input.displayName, tenantType: input.tenantType },
    });
    return { data, error: null };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid input";
    return { data: null, error: message };
  }
}

export async function updateTenantAction(tenantId: string, formData: FormData) {
  const result = await getAuthenticatedUser(["SuperAdmin"]);
  if ("error" in result) return { data: null, error: result.error };
  try {
    const input = parseUpdateTenant(formData);
    if (Object.keys(input).length === 0) return { data: { id: tenantId }, error: null };
    const { data, error } = await tenantsService.updateTenant(tenantId, {
      display_name: input.displayName,
      logo_url: input.logoUrl,
      primary_color: input.primaryColor,
      support_email: input.supportEmail,
      custom_domain: input.customDomain,
      tenant_type: input.tenantType,
      subscription_package: input.subscriptionPackage,
      size: input.size,
      features: input.features,
      status: input.status,
    });
    if (error) return { data: null, error: typeof error === "object" && error !== null && "message" in error ? (error as { message: string }).message : String(error) };
    await auditService.createAuditLog({
      clinicId: null,
      action: "tenant.update",
      entityType: "tenant",
      entityId: tenantId,
      actorId: result.user.profile.id,
      payload: input,
    });
    return { data, error: null };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid input";
    return { data: null, error: message };
  }
}

export async function deleteTenantAction(tenantId: string) {
  const result = await getAuthenticatedUser(["SuperAdmin"]);
  if ("error" in result) return { data: null, error: result.error };
  const { data, error } = await tenantsService.softDeleteTenant(tenantId);
  if (error) return { data: null, error: typeof error === "object" && error !== null && "message" in error ? (error as { message: string }).message : String(error) };
  await auditService.createAuditLog({
    clinicId: null,
    action: "tenant.delete",
    entityType: "tenant",
    entityId: tenantId,
    actorId: result.user.profile.id,
    payload: { softDelete: true },
  });
  return { data, error: null };
}
