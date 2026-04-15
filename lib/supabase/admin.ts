/**
 * Service-role Supabase client for server-only admin operations (e.g. create user, bypass RLS).
 * Use only in server actions or API routes. Never expose to the client.
 */
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  return createClient<Database>(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
