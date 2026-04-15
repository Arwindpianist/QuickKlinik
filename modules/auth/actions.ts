"use server";

import { redirect } from "next/navigation";
import { signInSchema, signUpSchema } from "@/modules/auth/schema";
import * as authService from "@/modules/auth/service";
import { createClient } from "@/lib/supabase/server";

/** Dev-only: one-click login as a seeded role. Use NEXT_PUBLIC_DEV_LOGIN=true and DEV_LOGIN_PASSWORD in .env.local */
const DEV_ROLE_EMAILS: Record<string, string> = {
  superadmin: "arwin@arwindpianist.com",
  clinicadmin: "clinic-admin@demo.quickklinik.demo",
  doctor: "doctor@demo.quickklinik.demo",
  staff: "staff@demo.quickklinik.demo",
};

export async function signInAsDevUser(roleKey: string): Promise<void> {
  if (process.env.NODE_ENV !== "development") {
    redirect("/login?error=" + encodeURIComponent("Dev login is only available in development"));
    return;
  }
  const email = DEV_ROLE_EMAILS[roleKey.toLowerCase()];
  const password = process.env.DEV_LOGIN_PASSWORD ?? "demo1234";
  if (!email) {
    redirect("/login?error=" + encodeURIComponent("Unknown dev role"));
    return;
  }
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect("/login?error=" + encodeURIComponent(error.message));
    return;
  }
  redirect("/dashboard");
}

export async function signIn(formData: FormData): Promise<void> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    redirect("/login?error=" + encodeURIComponent("Invalid email or password"));
    return;
  }
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    redirect("/login?error=" + encodeURIComponent(error.message));
    return;
  }
  redirect("/dashboard");
}

export async function signUp(formData: FormData) {
  const parsed = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    fullName: formData.get("fullName") || undefined,
    roleName: formData.get("roleName") || undefined,
    clinicId: formData.get("clinicId") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { full_name: parsed.data.fullName } },
  });
  if (authError) {
    return { error: { form: [authError.message] } };
  }
  if (!authData.user) {
    return { error: { form: ["Sign up failed"] } };
  }
  const roleName = parsed.data.roleName ?? "ClinicAdmin";
  const { roleId, error: roleError } = await authService.getRoleIdByName(roleName);
  if (roleError || !roleId) {
    return { error: { form: ["Invalid role"] } };
  }
  const clinicId = parsed.data.clinicId ?? null;
  const { error: profileError } = await authService.createProfile({
    authUserId: authData.user.id,
    roleId,
    clinicId,
    fullName: parsed.data.fullName ?? null,
    email: parsed.data.email,
  });
  if (profileError) {
    return { error: { form: [profileError.message] } };
  }
  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
