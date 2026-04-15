import { createClient } from "@/lib/supabase/server";

export type SurveyDirectoryEntry = {
  id: string;
  card_uuid: string;
  name: string | null;
  email: string | null;
  respondent_type: string;
  created_at: string;
};

export async function createSurvey(params: {
  respondent_type: string;
  name?: string | null;
  email?: string | null;
  would_use: string;
  early_access: boolean;
  pain_intensity?: number | null;
  pricing_preference?: string | null;
  monthly_price_band?: string | null;
  must_have_feature: string;
  main_concern: string;
  responses: Record<string, string | number | boolean | string[]>;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("surveys")
    .insert({
      respondent_type: params.respondent_type,
      name: params.name ?? null,
      email: params.email ?? null,
      would_use: params.would_use,
      early_access: params.early_access,
      pain_intensity: params.pain_intensity ?? null,
      pricing_preference: params.pricing_preference ?? null,
      monthly_price_band: params.monthly_price_band ?? null,
      must_have_feature: params.must_have_feature,
      main_concern: params.main_concern,
      responses: params.responses,
    })
    .select("id, card_uuid")
    .single();

  return { data, error };
}

export async function listSurveyDirectory(limit = 500) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("surveys")
    .select("id, card_uuid, name, email, respondent_type, created_at")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(Math.max(1, Math.min(limit, 1000)));

  return { data: (data ?? []) as SurveyDirectoryEntry[], error };
}

export async function findSurveyByNameAndEmail(params: { name: string; email: string }) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("surveys")
    .select("id, card_uuid")
    .ilike("name", params.name)
    .ilike("email", params.email)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(1);

  return { data: data?.[0] ?? null, error };
}

export async function getSurveyCardByUuid(cardUuid: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("surveys")
    .select("id, card_uuid, name, created_at")
    .eq("card_uuid", cardUuid)
    .is("deleted_at", null)
    .maybeSingle();

  return { data, error };
}
