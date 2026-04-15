"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import { getAuthenticatedUser } from "@/lib/auth";
import { createStaffSchema, updateStaffSchema } from "@/modules/staff/schema";
import * as auditService from "@/modules/audit/service";

export type StaffRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  role_name: string;
  role_id: string;
  clinic_id: string | null;
  clinic_name: string | null;
};

/** List roles for dropdowns (SuperAdmin only). */
export async function listRoles(): Promise<{ data: { id: string; name: string }[] | null; error: string | null }> {
  const result = await getAuthenticatedUser(["SuperAdmin"]);
  if ("error" in result) return { data: null, error: result.error };
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("roles")
    .select("id, name")
    .is("deleted_at", null)
    .order("name");
  if (error) return { data: null, error: error.message };
  return { data: data ?? [], error: null };
}

/** List staff: all profiles for SuperAdmin, or for current clinic for ClinicAdmin. */
export async function listStaff(): Promise<{ data: StaffRow[] | null; error: string | null }> {
  const result = await getAuthenticatedUser(["SuperAdmin", "ClinicAdmin"]);
  if ("error" in result) return { data: null, error: result.error };
  const supabase = await createClient();
  let q = supabase
    .from("profiles")
    .select("id, email, full_name, clinic_id, role_id, roles(name)")
    .is("deleted_at", null);
  if (result.user.roleName === "ClinicAdmin" && result.user.clinicId) {
    q = q.eq("clinic_id", result.user.clinicId);
  }
  const { data: profiles, error } = await q.order("full_name");
  if (error) return { data: null, error: error.message };
  const clinicIds = [...new Set((profiles ?? []).map((p) => (p as { clinic_id: string | null }).clinic_id).filter(Boolean))] as string[];
  let clinicNames: Record<string, string> = {};
  if (clinicIds.length > 0) {
    const { data: clinics } = await supabase
      .from("clinics")
      .select("id, display_name")
      .in("id", clinicIds)
      .is("deleted_at", null);
    clinicNames = Object.fromEntries((clinics ?? []).map((c) => [c.id, c.display_name]));
  }
  const rows: StaffRow[] = (profiles ?? []).map((p) => {
    const r = p as { id: string; email: string | null; full_name: string | null; clinic_id: string | null; role_id: string; roles: { name: string }[] | { name: string } | null };
    const roleName = Array.isArray(r.roles) ? r.roles[0]?.name : r.roles?.name;
    return {
      id: r.id,
      email: r.email,
      full_name: r.full_name,
      role_name: roleName ?? "—",
      role_id: r.role_id,
      clinic_id: r.clinic_id,
      clinic_name: r.clinic_id ? clinicNames[r.clinic_id] ?? null : null,
    };
  });
  return { data: rows, error: null };
}

/** Get one staff member by profile id. SuperAdmin or ClinicAdmin (own clinic only). */
export async function getStaffAction(profileId: string): Promise<{ data: StaffRow | null; error: string | null }> {
  const result = await getAuthenticatedUser(["SuperAdmin", "ClinicAdmin"]);
  if ("error" in result) return { data: null, error: result.error };
  const supabase = await createClient();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, clinic_id, role_id, roles(name)")
    .eq("id", profileId)
    .is("deleted_at", null)
    .single();
  if (error || !profile) return { data: null, error: error?.message ?? "Not found" };
  const r = profile as { id: string; email: string | null; full_name: string | null; clinic_id: string | null; role_id: string; roles: { name: string }[] | { name: string } | null };
  if (result.user.roleName === "ClinicAdmin" && result.user.clinicId && r.clinic_id !== result.user.clinicId) {
    return { data: null, error: "Forbidden" };
  }
  let clinicName: string | null = null;
  if (r.clinic_id) {
    const { data: clinic } = await supabase
      .from("clinics")
      .select("display_name")
      .eq("id", r.clinic_id)
      .is("deleted_at", null)
      .single();
    clinicName = clinic?.display_name ?? null;
  }
  const roleName = Array.isArray(r.roles) ? r.roles[0]?.name : r.roles?.name;
  return {
    data: {
      id: r.id,
      email: r.email,
      full_name: r.full_name,
      role_name: roleName ?? "—",
      role_id: r.role_id,
      clinic_id: r.clinic_id,
      clinic_name: clinicName,
    },
    error: null,
  };
}

/** Create staff (auth user + profile). SuperAdmin only. Uses service role. */
export async function createStaffAction(formData: FormData): Promise<{ data: { id: string } | null; error: string | null }> {
  const result = await getAuthenticatedUser(["SuperAdmin"]);
  if ("error" in result) return { data: null, error: result.error };
  try {
    const email = formData.get("email");
    const password = formData.get("password");
    const fullName = formData.get("fullName");
    const roleId = formData.get("roleId");
    const clinicId = formData.get("clinicId");
    const input = createStaffSchema.parse({
      email: typeof email === "string" ? email.trim() : "",
      password: typeof password === "string" ? password : "",
      fullName: typeof fullName === "string" ? fullName.trim() : "",
      roleId: typeof roleId === "string" ? roleId : "",
      clinicId: typeof clinicId === "string" && clinicId.trim() ? clinicId.trim() : null,
    });
    const admin = createServiceRoleClient();
    const { data: userData, error: userError } = await admin.auth.admin.createUser({
      email: input.email,
      password: input.password,
      email_confirm: true,
    });
    if (userError) return { data: null, error: userError.message };
    const authUserId = userData.user.id;
    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .insert({
        auth_user_id: authUserId,
        role_id: input.roleId,
        clinic_id: input.clinicId ?? null,
        full_name: input.fullName,
        email: input.email,
      } as never)
      .select("id")
      .single();
    if (profileError) return { data: null, error: profileError.message };
    const profileId = (profile as { id: string } | null)?.id ?? null;
    await auditService.createAuditLog({
      clinicId: input.clinicId ?? null,
      action: "staff.create",
      entityType: "profile",
      entityId: profileId,
      actorId: result.user.profile.id,
      payload: { email: input.email, roleId: input.roleId },
    });
    return { data: profile ? { id: (profile as { id: string }).id } : null, error: null };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid input";
    return { data: null, error: message };
  }
}

/** Update staff profile. SuperAdmin only. Uses service role to bypass RLS. */
export async function updateStaffAction(profileId: string, formData: FormData): Promise<{ data: { id: string } | null; error: string | null }> {
  const result = await getAuthenticatedUser(["SuperAdmin"]);
  if ("error" in result) return { data: null, error: result.error };
  try {
    const fullName = formData.get("fullName");
    const roleId = formData.get("roleId");
    const clinicId = formData.get("clinicId");
    const input = updateStaffSchema.parse({
      fullName: typeof fullName === "string" ? fullName.trim() : undefined,
      roleId: typeof roleId === "string" && roleId.trim() ? roleId : undefined,
      clinicId: typeof clinicId === "string" ? (clinicId.trim() || null) : undefined,
    });
    const updates: { full_name?: string; role_id?: string; clinic_id?: string | null; updated_at: string } = {
      updated_at: new Date().toISOString(),
    };
    if (input.fullName !== undefined) updates.full_name = input.fullName;
    if (input.roleId !== undefined) updates.role_id = input.roleId;
    if (input.clinicId !== undefined) updates.clinic_id = input.clinicId === "" ? null : input.clinicId;
    const admin = createServiceRoleClient();
    const { data, error } = await admin
      .from("profiles")
      .update(updates as never)
      .eq("id", profileId)
      .is("deleted_at", null)
      .select("id")
      .single();
    if (error) return { data: null, error: error.message };
    await auditService.createAuditLog({
      clinicId: null,
      action: "staff.update",
      entityType: "profile",
      entityId: profileId,
      actorId: result.user.profile.id,
      payload: input,
    });
    return { data, error: null };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid input";
    return { data: null, error: message };
  }
}

/** Soft-delete staff profile. SuperAdmin only. Uses service role. */
export async function deleteStaffAction(profileId: string): Promise<{ data: { id: string } | null; error: string | null }> {
  const result = await getAuthenticatedUser(["SuperAdmin"]);
  if ("error" in result) return { data: null, error: result.error };
  const now = new Date().toISOString();
  const admin = createServiceRoleClient();
  const { data, error } = await admin
    .from("profiles")
    .update({ deleted_at: now, updated_at: now } as never)
    .eq("id", profileId)
    .is("deleted_at", null)
    .select("id")
    .single();
  if (error) return { data: null, error: error.message };
  await auditService.createAuditLog({
    clinicId: null,
    action: "staff.delete",
    entityType: "profile",
    entityId: profileId,
    actorId: result.user.profile.id,
    payload: { softDelete: true },
  });
  return { data, error: null };
}
