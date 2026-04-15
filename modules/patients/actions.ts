"use server";

import { getAuthenticatedUser } from "@/lib/auth";
import * as patientsService from "@/modules/patients/service";

export async function listPatients() {
  const result = await getAuthenticatedUser();
  if ("error" in result) return { data: null, error: result.error };
  const clinicId = result.user.clinicId;
  if (!clinicId) return { data: null, error: "No clinic context" };
  return patientsService.getPatientsByClinic(clinicId);
}
