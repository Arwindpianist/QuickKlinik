import { z } from "zod";

export const createClinicSchema = z.object({
  displayName: z.string().min(1),
  logoUrl: z.union([z.string().url(), z.literal("")]).optional().nullable(),
  primaryColor: z.string().optional().nullable(),
  supportEmail: z.union([z.string().email(), z.literal("")]).optional().nullable(),
  customDomain: z.string().optional().nullable(),
});

export type CreateClinicInput = z.infer<typeof createClinicSchema>;

const updateClinicSchema = createClinicSchema.partial();
export type UpdateClinicInput = z.infer<typeof updateClinicSchema>;

function toOptionalUrl(v: string | null | undefined): string | null | undefined {
  if (v === undefined || v === null) return v;
  const t = v.trim();
  return t === "" ? null : t;
}
function toOptionalEmail(v: string | null | undefined): string | null | undefined {
  if (v === undefined || v === null) return v;
  const t = v.trim();
  return t === "" ? null : t;
}

export function parseUpdateClinic(formData: FormData): UpdateClinicInput {
  const displayName = formData.get("displayName");
  const logoUrl = formData.get("logoUrl");
  const primaryColor = formData.get("primaryColor");
  const supportEmail = formData.get("supportEmail");
  const customDomain = formData.get("customDomain");
  return updateClinicSchema.parse({
    ...(typeof displayName === "string" && displayName.trim() ? { displayName: displayName.trim() } : {}),
    ...(typeof logoUrl === "string" ? { logoUrl: toOptionalUrl(logoUrl) } : {}),
    ...(typeof primaryColor === "string" ? { primaryColor: primaryColor.trim() || null } : {}),
    ...(typeof supportEmail === "string" ? { supportEmail: toOptionalEmail(supportEmail) } : {}),
    ...(typeof customDomain === "string" ? { customDomain: customDomain.trim() || null } : {}),
  });
}

export function parseCreateClinic(formData: FormData): CreateClinicInput {
  const displayName = formData.get("displayName");
  const logoUrl = formData.get("logoUrl");
  const primaryColor = formData.get("primaryColor");
  const supportEmail = formData.get("supportEmail");
  const customDomain = formData.get("customDomain");
  return createClinicSchema.parse({
    displayName: typeof displayName === "string" && displayName.trim() ? displayName.trim() : "",
    logoUrl: toOptionalUrl(typeof logoUrl === "string" ? logoUrl : undefined),
    primaryColor: typeof primaryColor === "string" ? primaryColor.trim() || undefined : undefined,
    supportEmail: toOptionalEmail(typeof supportEmail === "string" ? supportEmail : undefined),
    customDomain: typeof customDomain === "string" ? customDomain.trim() || undefined : undefined,
  });
}
