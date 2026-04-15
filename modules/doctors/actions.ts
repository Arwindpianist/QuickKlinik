"use server";

import { getAuthenticatedUser } from "@/lib/auth";
import * as doctorsService from "@/modules/doctors/service";

export async function listDoctors() {
  const result = await getAuthenticatedUser();
  if ("error" in result) return { data: null, error: result.error };
  const clinicId = result.user.clinicId;
  if (!clinicId) return { data: null, error: "No clinic context" };
  return doctorsService.getDoctorsByClinic(clinicId);
}
