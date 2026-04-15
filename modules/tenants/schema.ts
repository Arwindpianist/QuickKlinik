import { z } from "zod";
import { TENANT_TYPES, TENANT_STATUSES, FEATURE_KEYS } from "./types";

const featureArraySchema = z.array(z.string());

export const createTenantSchema = z.object({
  displayName: z.string().min(1),
  logoUrl: z.union([z.string().url(), z.literal("")]).optional().nullable(),
  primaryColor: z.string().optional().nullable(),
  supportEmail: z.union([z.string().email(), z.literal("")]).optional().nullable(),
  customDomain: z.string().optional().nullable(),
  tenantType: z.enum(TENANT_TYPES),
  subscriptionPackage: z.string().optional().nullable(),
  size: z.string().optional().nullable(),
  features: z.union([
    featureArraySchema,
    z.string().transform((s) => {
      try {
        const parsed = JSON.parse(s) as unknown;
        return featureArraySchema.parse(Array.isArray(parsed) ? parsed : []);
      } catch {
        return [] as z.infer<typeof featureArraySchema>;
      }
    }),
  ]).optional().default([]),
  status: z.enum(TENANT_STATUSES).optional().default("active"),
});

export type CreateTenantInput = z.infer<typeof createTenantSchema>;

const updateTenantSchema = createTenantSchema.partial();
export type UpdateTenantInput = z.infer<typeof updateTenantSchema>;

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

export function parseUpdateTenant(formData: FormData): UpdateTenantInput {
  const displayName = formData.get("displayName");
  const logoUrl = formData.get("logoUrl");
  const primaryColor = formData.get("primaryColor");
  const supportEmail = formData.get("supportEmail");
  const customDomain = formData.get("customDomain");
  const tenantType = formData.get("tenantType");
  const subscriptionPackage = formData.get("subscriptionPackage");
  const size = formData.get("size");
  const featuresRaw = formData.get("features");
  const status = formData.get("status");
  const parsed: Record<string, unknown> = {};
  if (typeof displayName === "string" && displayName.trim()) parsed.displayName = displayName.trim();
  if (typeof logoUrl === "string") parsed.logoUrl = toOptionalUrl(logoUrl);
  if (typeof primaryColor === "string") parsed.primaryColor = primaryColor.trim() || null;
  if (typeof supportEmail === "string") parsed.supportEmail = toOptionalEmail(supportEmail);
  if (typeof customDomain === "string") parsed.customDomain = customDomain.trim() || null;
  if (typeof tenantType === "string" && tenantType) parsed.tenantType = tenantType as CreateTenantInput["tenantType"];
  if (typeof subscriptionPackage === "string") parsed.subscriptionPackage = subscriptionPackage.trim() || null;
  if (typeof size === "string") parsed.size = size.trim() || null;
  if (featuresRaw != null) {
    try {
      const arr = typeof featuresRaw === "string" ? JSON.parse(featuresRaw) : featuresRaw;
      parsed.features = Array.isArray(arr) ? arr : [];
    } catch {
      parsed.features = [];
    }
  }
  if (typeof status === "string" && status) parsed.status = status as CreateTenantInput["status"];
  return updateTenantSchema.parse(parsed);
}

export function parseCreateTenant(formData: FormData): CreateTenantInput {
  const displayName = formData.get("displayName");
  const logoUrl = formData.get("logoUrl");
  const primaryColor = formData.get("primaryColor");
  const supportEmail = formData.get("supportEmail");
  const customDomain = formData.get("customDomain");
  const tenantType = formData.get("tenantType");
  const subscriptionPackage = formData.get("subscriptionPackage");
  const size = formData.get("size");
  const featuresRaw = formData.get("features");
  const status = formData.get("status");
  let features: string[] = [];
  if (featuresRaw != null) {
    try {
      const arr = typeof featuresRaw === "string" ? JSON.parse(featuresRaw) : featuresRaw;
      features = Array.isArray(arr) ? arr : [];
    } catch {
      features = [];
    }
  }
  return createTenantSchema.parse({
    displayName: typeof displayName === "string" && displayName.trim() ? displayName.trim() : "",
    logoUrl: toOptionalUrl(typeof logoUrl === "string" ? logoUrl : undefined),
    primaryColor: typeof primaryColor === "string" ? primaryColor.trim() || undefined : undefined,
    supportEmail: toOptionalEmail(typeof supportEmail === "string" ? supportEmail : undefined),
    customDomain: typeof customDomain === "string" ? customDomain.trim() || undefined : undefined,
    tenantType: (typeof tenantType === "string" && tenantType) ? tenantType : "clinic",
    subscriptionPackage: typeof subscriptionPackage === "string" ? subscriptionPackage.trim() || null : null,
    size: typeof size === "string" ? size.trim() || null : null,
    features,
    status: (typeof status === "string" && status) ? status : "active",
  });
}
