import type { Database } from "@/types/database";

export type TenantRow = Database["public"]["Tables"]["tenants"]["Row"];

export type TenantWithClinic = TenantRow & {
  clinic?: { id: string; display_name: string } | null;
};

export const TENANT_TYPES = ["clinic", "hospital", "pharmacy"] as const;
export type TenantType = (typeof TENANT_TYPES)[number];

export const TENANT_STATUSES = ["active", "suspended", "trial"] as const;
export type TenantStatus = (typeof TENANT_STATUSES)[number];

export const FEATURE_KEYS = [
  "appointments",
  "otc",
  "inventory",
  "kiosk",
  "multi_location",
] as const;
export type FeatureKey = (typeof FEATURE_KEYS)[number];
