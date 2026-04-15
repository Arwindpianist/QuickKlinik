"use server";

import { addStockSchema, createBatchSchema } from "@/modules/inventory/schema";
import * as inventoryService from "@/modules/inventory/service";
import { getAuthenticatedUser } from "@/lib/auth";
import { createAuditLog } from "@/modules/audit/service";

export async function addStockAction(formData: FormData) {
  const result = await getAuthenticatedUser(["SuperAdmin", "ClinicAdmin", "InventoryStaff"]);
  if ("error" in result) return { error: result.error };
  const clinicId = result.user.clinicId;
  if (!clinicId) return { error: "No clinic context" };
  const parsed = addStockSchema.safeParse({
    otcBatchId: formData.get("otcBatchId"),
    quantity: Number(formData.get("quantity")),
    reason: formData.get("reason") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };
  const { error } = await inventoryService.addStock({
    clinicId,
    otcBatchId: parsed.data.otcBatchId,
    movementType: "in",
    quantityDelta: parsed.data.quantity,
    reason: parsed.data.reason ?? null,
    actorId: result.user.profile.id,
  });
  if (error) return { error: error.message };
  await createAuditLog({
    clinicId,
    action: "inventory.add_stock",
    entityType: "otc_batch",
    entityId: parsed.data.otcBatchId,
    actorId: result.user.profile.id,
    payload: { quantity: parsed.data.quantity, reason: parsed.data.reason },
  });
  return { success: true };
}

export async function createBatchAction(formData: FormData) {
  const result = await getAuthenticatedUser(["SuperAdmin", "ClinicAdmin", "InventoryStaff"]);
  if ("error" in result) return { error: result.error };
  const parsed = createBatchSchema.safeParse({
    otcProductId: formData.get("otcProductId"),
    quantity: Number(formData.get("quantity")),
    expiryDate: formData.get("expiryDate") || undefined,
    batchRef: formData.get("batchRef") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };
  const { data, error } = await inventoryService.createBatch({
    otc_product_id: parsed.data.otcProductId,
    quantity: parsed.data.quantity,
    expiry_date: parsed.data.expiryDate ?? null,
    batch_ref: parsed.data.batchRef ?? null,
  });
  if (error) return { error: error.message };
  return { data };
}
