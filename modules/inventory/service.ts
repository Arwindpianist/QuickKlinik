import { createClient } from "@/lib/supabase/server";

export async function addStock(params: {
  clinicId: string;
  otcBatchId: string;
  movementType: "in" | "out" | "adjust";
  quantityDelta: number;
  reason?: string | null;
  actorId?: string | null;
}) {
  const supabase = await createClient();
  const { data: batch, error: fetchError } = await supabase
    .from("otc_batches")
    .select("quantity")
    .eq("id", params.otcBatchId)
    .single();
  if (fetchError || !batch) return { error: fetchError ?? new Error("Batch not found") };
  const newQuantity = batch.quantity + params.quantityDelta;
  if (newQuantity < 0) return { error: new Error("Insufficient quantity") };
  const { error: logError } = await supabase.from("inventory_logs").insert({
    clinic_id: params.clinicId,
    otc_batch_id: params.otcBatchId,
    movement_type: params.movementType,
    quantity_delta: params.quantityDelta,
    reason: params.reason ?? null,
    actor_id: params.actorId ?? null,
  });
  if (logError) return { error: logError };
  const { error: updateError } = await supabase
    .from("otc_batches")
    .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
    .eq("id", params.otcBatchId);
  return { error: updateError ?? null };
}

export async function createBatch(params: {
  otc_product_id: string;
  quantity: number;
  expiry_date: string | null;
  batch_ref: string | null;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("otc_batches").insert(params).select("id").single();
  return { data, error };
}
