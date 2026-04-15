import { redirect } from "next/navigation";
import Link from "next/link";
import { getAuthenticatedUser } from "@/lib/auth";
import { listOtcProducts } from "@/modules/otc/actions";
import { getOtcPageAnalytics } from "@/modules/analytics/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageAnalyticsCard } from "@/components/analytics/PageAnalyticsCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function OtcCatalogPage() {
  const result = await listOtcProducts();
  if ("error" in result) {
    if (result.error === "No clinic context") redirect("/dashboard");
    return (
      <div className="p-4 sm:p-6">
        <p className="text-destructive">{result.error}</p>
      </div>
    );
  }
  const products = result.data;
  const authResult = await getAuthenticatedUser();
  const clinicId = "error" in authResult ? null : authResult.user.clinicId;
  const analyticsRes = clinicId ? await getOtcPageAnalytics(clinicId) : { data: null };
  const analytics = analyticsRes.data;

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">OTC Catalog</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {products.length} product{products.length !== 1 ? "s" : ""} · View and manage stock in Inventory
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/inventory">Manage inventory</Link>
        </Button>
      </div>

      {analytics && (
        <PageAnalyticsCard
          title="OTC analytics"
          stats={[
            { label: "Products", value: analytics.stats.products },
            { label: "Total orders", value: analytics.stats.orders },
            { label: "Orders this week", value: analytics.stats.ordersThisWeek },
          ]}
          chartData={analytics.chartData}
          chartType="line"
          chartDataKey="count"
        />
      )}

      <Card className="animate-in fade-in slide-in-from-bottom-2 duration-300 delay-75 fill-mode-backwards">
        <CardHeader className="pb-2">
          <CardTitle className="text-base sm:text-lg">Products</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto">
            <Table className="min-w-[500px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Max per order</TableHead>
                  <TableHead>Disclaimer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-8 text-center text-card-foreground/70">
                      No OTC products yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium py-3">{p.name}</TableCell>
                      <TableCell className="py-3 text-card-foreground/70">{p.description ?? "—"}</TableCell>
                      <TableCell className="py-3">{p.max_quantity_per_order ?? "—"}</TableCell>
                      <TableCell className="py-3">{p.requires_disclaimer ? "Yes" : "No"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
