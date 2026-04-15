"use server";

import { redirect } from "next/navigation";
import { createSurveySchema } from "@/modules/surveys/schema";
import * as surveysService from "@/modules/surveys/service";
import { createAuditLog } from "@/modules/audit/service";

const SURVEY_URL = "/survey";

function asString(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value : "";
}

function parseBoolean(value: FormDataEntryValue | null): boolean {
  return asString(value) === "on" || asString(value) === "true";
}

function parseOptionalNumber(value: FormDataEntryValue | null): number | undefined {
  const raw = asString(value).trim();
  if (!raw) return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}

function normalizeIdentityValue(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export async function checkSurveyDuplicatePair(input: { name: string; email: string }) {
  const normalizedName = normalizeIdentityValue(input.name ?? "");
  const normalizedEmail = normalizeIdentityValue((input.email ?? "").toLowerCase());

  if (!normalizedName || !normalizedEmail) {
    return { exists: false as const };
  }

  const { data, error } = await surveysService.findSurveyByNameAndEmail({
    name: normalizedName,
    email: normalizedEmail,
  });

  if (error) {
    return { exists: false as const, error: error.message ?? "Unable to validate identity pair" };
  }

  if (!data?.card_uuid) {
    return { exists: false as const };
  }

  return {
    exists: true as const,
    cardUuid: data.card_uuid,
    surveyId: data.id,
  };
}

export async function submitSurvey(formData: FormData) {
  // Simple honeypot: bots usually fill hidden text fields.
  if (asString(formData.get("website")).trim()) {
    redirect(`${SURVEY_URL}?submitted=1`);
  }

  const rawResponses = asString(formData.get("responses"));
  let responses: Record<string, string | number | boolean | string[]> = {};
  if (rawResponses) {
    try {
      const parsed = JSON.parse(rawResponses) as unknown;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        responses = parsed as Record<string, string | number | boolean | string[]>;
      }
    } catch {
      redirect(`${SURVEY_URL}?error=${encodeURIComponent("Invalid survey payload")}`);
    }
  }

  const parsedInput = createSurveySchema.safeParse({
    respondentType: asString(formData.get("respondentType")),
    name: asString(formData.get("name")),
    email: asString(formData.get("email")),
    wouldUse: asString(formData.get("wouldUse")),
    earlyAccess: parseBoolean(formData.get("earlyAccess")),
    painIntensity: parseOptionalNumber(formData.get("painIntensity")),
    pricingPreference: asString(formData.get("pricingPreference")) || undefined,
    monthlyPriceBand: asString(formData.get("monthlyPriceBand")) || undefined,
    mustHaveFeature: asString(formData.get("mustHaveFeature")),
    mainConcern: asString(formData.get("mainConcern")),
    responses,
  });

  if (!parsedInput.success) {
    const message =
      Object.values(parsedInput.error.flatten().fieldErrors).flat().join(" ") || "Invalid survey input";
    redirect(`${SURVEY_URL}?error=${encodeURIComponent(message)}`);
  }

  const normalized = parsedInput.data;
  const normalizedName = normalizeIdentityValue(normalized.name ?? "");
  const normalizedEmail = normalizeIdentityValue((normalized.email ?? "").toLowerCase());

  if (normalizedName && normalizedEmail) {
    const { data: existing, error: existingError } = await surveysService.findSurveyByNameAndEmail({
      name: normalizedName,
      email: normalizedEmail,
    });

    if (existingError) {
      redirect(`${SURVEY_URL}?error=${encodeURIComponent(existingError.message ?? "Unable to validate submission")}`);
    }

    if (existing?.card_uuid) {
      await createAuditLog({
        action: "survey.duplicate_attempt",
        entityType: "survey",
        entityId: existing.id,
        payload: {
          name: normalizedName,
          email: normalizedEmail,
          cardUuid: existing.card_uuid,
        },
      });

      redirect(`/cards/${existing.card_uuid}`);
    }
  }

  const { data, error } = await surveysService.createSurvey({
    respondent_type: normalized.respondentType,
    name: normalizedName || null,
    email: normalizedEmail || null,
    would_use: normalized.wouldUse,
    early_access: normalized.earlyAccess,
    pain_intensity: normalized.painIntensity ?? null,
    pricing_preference: normalized.pricingPreference ?? null,
    monthly_price_band: normalized.monthlyPriceBand ?? null,
    must_have_feature: normalized.mustHaveFeature,
    main_concern: normalized.mainConcern,
    responses: normalized.responses,
  });

  if (error || !data) {
    redirect(`${SURVEY_URL}?error=${encodeURIComponent(error?.message ?? "Failed to submit survey")}`);
  }

  const created = data as { id: string; card_uuid: string };

  await createAuditLog({
    action: "survey.submit",
    entityType: "survey",
    entityId: created.id,
    payload: {
      respondentType: normalized.respondentType,
      hasEmail: Boolean(normalized.email),
      wouldUse: normalized.wouldUse,
      earlyAccess: normalized.earlyAccess,
      cardUuid: created.card_uuid,
    },
  });

  if (!created.card_uuid) {
    redirect(`${SURVEY_URL}?error=${encodeURIComponent("Card identifier missing after submission")}`);
  }

  redirect(`/cards/${created.card_uuid}`);
}
