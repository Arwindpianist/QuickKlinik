import type { Database } from "@/types/database";
export type InventoryLog = Database["public"]["Tables"]["inventory_logs"]["Row"];
export type InventoryMovementType = Database["public"]["Enums"]["inventory_movement_type"];
