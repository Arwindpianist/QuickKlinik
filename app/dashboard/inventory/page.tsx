import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth";
import { listOtcProducts } from "@/modules/otc/actions";
import { addStockAction, createBatchAction } from "@/modules/inventory/actions";
import { getInventoryPageAnalytics } from "@/modules/analytics/actions";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageAnalyticsCard } from "@/components/analytics/PageAnalyticsCard";

export default async function InventoryPage() {
  async function addStockVoid(formData: FormData): Promise<void> {
    "use server";
    await addStockAction(formData);
  }

  async function createBatchVoid(formData: FormData): Promise<void> {
    "use server";
    await createBatchAction(formData);
  }

  const result = await getAuthenticatedUser(["SuperAdmin", "ClinicAdmin", "InventoryStaff"]);
  if ("error" in result) redirect("/login");
  const clinicId = result.user.clinicId;
  if (!clinicId) {
    return (
      <div className="p-4 sm:p-6">
        <p className="text-destructive">No clinic context.</p>
      </div>
    );
  }
  const productsResult = await listOtcProducts();
  const products: { id: string; name: string }[] =
    "data" in productsResult && productsResult.data ? productsResult.data : [];
  const supabase = await createClient();
  const { data: batchesData } = await supabase
    .from("otc_batches")
    .select("id, otc_product_id, quantity, expiry_date, batch_ref")
    .is("deleted_at", null);
  const productIds = products.map((p) => p.id);
  type BatchRow = { id: string; otc_product_id: string; quantity: number; expiry_date: string | null; batch_ref: string | null };
  const batchesForProducts: BatchRow[] = ((batchesData ?? []) as BatchRow[]).filter((b) =>
    productIds.includes(b.otc_product_id)
  );

  const totalUnits = batchesForProducts.reduce((s, b) => s + b.quantity, 0);
  const LOW = 10;
  const lowStockBatches = batchesForProducts.filter((b) => b.quantity < LOW);
  const stockByProduct = products.map((p) => ({
    name: p.name,
    total: batchesForProducts.filter((b) => b.otc_product_id === p.id).reduce((s, b) => s + b.quantity, 0),
    batches: batchesForProducts.filter((b) => b.otc_product_id === p.id).length,
  }));

  const analyticsRes = await getInventoryPageAnalytics(clinicId);
  const analytics = analyticsRes.data;

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        <h1 className="text-xl font-bold sm:text-2xl">Inventory</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add stock to batches and create new batches. View OTC catalog for product list.
        </p>
      </div>

      {analytics && (
        <PageAnalyticsCard
          title="Inventory analytics"
          stats={[
            { label: "Batches", value: analytics.stats.batches },
            { label: "Total units", value: analytics.stats.totalUnits },
            { label: "Low stock items", value: analytics.stats.lowStock },
          ]}
          chartData={analytics.chartData}
          chartType="bar"
          chartDataKey="value"
        />
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="animate-in fade-in slide-in-from-bottom-2 duration-300 delay-75 fill-mode-backwards">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total batches</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{batchesForProducts.length}</p>
          </CardContent>
        </Card>
        <Card className="animate-in fade-in slide-in-from-bottom-2 duration-300 delay-100 fill-mode-backwards">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total units</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalUnits}</p>
          </CardContent>
        </Card>
        <Card className={`animate-in fade-in slide-in-from-bottom-2 duration-300 delay-150 fill-mode-backwards ${lowStockBatches.length > 0 ? "border-amber-200 dark:border-amber-900" : ""}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Low stock (&lt;{LOW} units)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{lowStockBatches.length}</p>
            <p className="text-xs text-card-foreground/70">batches</p>
          </CardContent>
        </Card>
      </div>

      {stockByProduct.length > 0 && (
        <Card className="animate-in fade-in slide-in-from-bottom-2 duration-300 delay-200 fill-mode-backwards">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg">Stock by product</CardTitle>
            <p className="text-sm text-card-foreground/70">Total units per product across all batches</p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {stockByProduct.map((row) => (
                <li key={row.name} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                  <span className="font-medium">{row.name}</span>
                  <span className="text-card-foreground/70">
                    {row.total} units · {row.batches} batch{row.batches !== 1 ? "es" : ""}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base sm:text-lg">Add stock</CardTitle>
          <p className="text-sm text-card-foreground/70">Increase quantity for an existing batch</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            action={addStockVoid}
            className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end"
          >
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="otcBatchId">Batch</Label>
              <select
                id="otcBatchId"
                name="otcBatchId"
                required
                className="min-h-11 rounded-md border border-input bg-background px-3 py-2 text-foreground"
              >
                <option value="">Select batch</option>
                {batchesForProducts.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.batch_ref ?? b.id.slice(0, 8)} — qty: {b.quantity}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="quantity">Quantity to add</Label>
              <Input id="quantity" name="quantity" type="number" min={1} required className="min-h-11" />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="reason">Reason (optional)</Label>
              <Input id="reason" name="reason" type="text" className="min-h-11" />
            </div>
            <Button type="submit" className="min-h-11 w-full sm:w-auto">Add stock</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base sm:text-lg">Create new batch</CardTitle>
          <p className="text-sm text-card-foreground/70">Add a new batch for an OTC product</p>
        </CardHeader>
        <CardContent>
          <form
            action={createBatchVoid}
            className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end"
          >
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="otcProductId">Product</Label>
              <select
                id="otcProductId"
                name="otcProductId"
                required
                className="min-h-11 rounded-md border border-input bg-background px-3 py-2 text-foreground"
              >
                <option value="">Select product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="batchQuantity">Initial quantity</Label>
              <Input id="batchQuantity" name="quantity" type="number" min={0} required className="min-h-11" />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="expiryDate">Expiry date (optional)</Label>
              <Input id="expiryDate" name="expiryDate" type="date" className="min-h-11" />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="batchRef">Batch ref (optional)</Label>
              <Input id="batchRef" name="batchRef" type="text" className="min-h-11" />
            </div>
            <Button type="submit" className="min-h-11 w-full sm:w-auto">Create batch</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
