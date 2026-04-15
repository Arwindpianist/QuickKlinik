export const RESPONDENT_TYPES = [
  "clinic_owner",
  "doctor",
  "nurse_staff",
  "patient",
  "customer",
  "general_public",
] as const;

export const WOULD_USE_OPTIONS = ["yes", "maybe", "no"] as const;

export const PRICING_PREFERENCES = [
  "monthly_subscription",
  "one_time_purchase",
  "pay_per_use",
  "not_sure",
] as const;

export const MONTHLY_PRICE_BANDS = [
  "lt_rm50",
  "rm50_100",
  "rm100_300",
  "rm300_500",
  "gt_rm500",
] as const;

export type RespondentType = (typeof RESPONDENT_TYPES)[number];
