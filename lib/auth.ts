import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export type RoleName =
  | "SuperAdmin"
  | "ClinicAdmin"
  | "Doctor"
  | "Nurse"
  | "CounterStaff"
  | "InventoryStaff";

export type ProfileWithRole = Database["public"]["Tables"]["profiles"]["Row"] & {
  roles: { name: RoleName } | null;
};

export interface AuthUser {
  profile: ProfileWithRole;
  roleName: RoleName;
  clinicId: string | null;
}

export async function getAuthenticatedUser(
  allowedRoles?: RoleName[]
): Promise<{ user: AuthUser } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !authUser) {
    return { error: "Unauthorized" };
  }
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*, roles(name)")
    .eq("auth_user_id", authUser.id)
    .is("deleted_at", null)
    .single();
  if (profileError || !profile) {
    return { error: "Profile not found" };
  }
  const roleName = (profile as unknown as { roles: { name: string } | null }).roles?.name as RoleName | undefined;
  if (!roleName) {
    return { error: "Invalid profile role" };
  }
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(roleName)) {
    return { error: "Forbidden" };
  }
  const authUserResult: AuthUser = {
    profile: profile as ProfileWithRole,
    roleName,
    clinicId: (profile as { clinic_id: string | null }).clinic_id,
  };
  return { user: authUserResult };
}

export function requireRole(allowedRoles: RoleName[]): (user: AuthUser) => boolean {
  return (user: AuthUser) => allowedRoles.includes(user.roleName);
}
