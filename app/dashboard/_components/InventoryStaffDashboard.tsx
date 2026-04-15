import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, AlertTriangle, Package } from "lucide-react";

const LOW_STOCK_THRESHOLD = 10;

export async function InventoryStaffDashboard({ clinicId }: { clinicId: string }) {
  const supabase = await createClient();
  const [otcRes, lowRes] = await Promise.all([
    supabase
      .from("otc_products")
      .select("id", { count: "exact", head: true })
      .eq("clinic_id", clinicId)
      .is("deleted_at", null),
    supabase
      .from("otc_batches")
      .select("id, otc_product_id, quantity")
      .lt("quantity", LOW_STOCK_THRESHOLD)
      .is("deleted_at", null),
  ]);
  const productIdsRes = await supabase
    .from("otc_products")
    .select("id")
    .eq("clinic_id", clinicId)
    .is("deleted_at", null);
  const clinicProductIds = new Set((productIdsRes.data ?? []).map((p) => p.id));
  const lowStockCount = (lowRes.data ?? []).filter((b: { otc_product_id: string }) =>
    clinicProductIds.has(b.otc_product_id)
  ).length;
  const otcProductCount = otcRes.count ?? 0;

  return (
    <>
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        <h1 className="text-xl font-bold sm:text-2xl">Inventory dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Stock overview and low-stock alerts
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-l-4 border-l-[hsl(var(--chart-3))] animate-in fade-in slide-in-from-bottom-2 duration-300 delay-75 fill-mode-backwards">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">OTC products</CardTitle>
            <Package className="h-4 w-4 text-[hsl(var(--chart-3))]" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{otcProductCount}</p>
            <Button variant="link" className="h-auto p-0 mt-1 text-sm" asChild>
              <Link href="/dashboard/otc">Browse catalog</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className={`border-l-4 animate-in fade-in slide-in-from-bottom-2 duration-300 delay-100 fill-mode-backwards ${lowStockCount > 0 ? "border-l-amber-500" : "border-l-[hsl(var(--chart-4))]"}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low stock batches (&lt;{LOW_STOCK_THRESHOLD})</CardTitle>
            {lowStockCount > 0 ? (
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            ) : (
              <ClipboardList className="h-4 w-4 text-[hsl(var(--chart-4))]" />
            )}
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{lowStockCount}</p>
            <Button variant="link" className="h-auto p-0 mt-1 text-sm" asChild>
              <Link href="/dashboard/inventory">Manage inventory</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      <Card className="border-t border-[hsl(var(--chart-5)/0.25)] animate-in fade-in slide-in-from-bottom-2 duration-300 delay-150 fill-mode-backwards">
        <CardHeader className="pb-2">
          <CardTitle className="text-base sm:text-lg">Quick actions</CardTitle>
          <CardDescription>Stock and batches</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button asChild variant="outline" size="lg" className="min-h-11 flex-1 sm:flex-initial">
            <Link href="/dashboard/inventory">
              <ClipboardList className="mr-2 h-4 w-4" />
              Inventory
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="min-h-11 flex-1 sm:flex-initial">
            <Link href="/dashboard/otc">
              <Package className="mr-2 h-4 w-4" />
              OTC Catalog
            </Link>
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
