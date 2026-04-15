import { createClient } from "@/lib/supabase/server";

export async function getProfileByAuthUserId(authUserId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*, roles(name)")
    .eq("auth_user_id", authUserId)
    .is("deleted_at", null)
    .single();
  if (error) return { data: null, error };
  return { data, error: null };
}

export async function getRoleIdByName(roleName: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("roles")
    .select("id")
    .eq("name", roleName)
    .is("deleted_at", null)
    .single();
  if (error || !data) return { roleId: null, error };
  return { roleId: data.id, error: null };
}

export async function createProfile(params: {
  authUserId: string;
  roleId: string;
  clinicId: string | null;
  fullName: string | null;
  email: string | null;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .insert({
      auth_user_id: params.authUserId,
      role_id: params.roleId,
      clinic_id: params.clinicId,
      full_name: params.fullName,
      email: params.email,
    })
    .select("id")
    .single();
  if (error) return { data: null, error };
  return { data, error: null };
}
