"use server";

import { getAuthenticatedUser } from "@/lib/auth";
import * as otcService from "@/modules/otc/service";
import type { OtcProduct } from "@/modules/otc/types";

export async function listOtcProducts(): Promise<
  { data: OtcProduct[] } | { data: null; error: string }
> {
  const result = await getAuthenticatedUser();
  if ("error" in result) return { data: null, error: result.error };
  const clinicId = result.user.clinicId;
  if (!clinicId) return { data: null, error: "No clinic context" };
  const out = await otcService.getOtcProductsByClinic(clinicId);
  if (out.error) return { data: null, error: out.error.message };
  return { data: out.data ?? [] };
}
