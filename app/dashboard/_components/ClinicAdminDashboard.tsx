import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Package, ClipboardList, AlertTriangle, Users, FileText } from "lucide-react";

const LOW_STOCK_THRESHOLD = 10;

export async function ClinicAdminDashboard({ clinicId }: { clinicId: string }) {
  const supabase = await createClient();
  const startToday = new Date();
  startToday.setHours(0, 0, 0, 0);
  const endToday = new Date(startToday);
  endToday.setDate(endToday.getDate() + 1);
  const startWeek = new Date(startToday);
  startWeek.setDate(startWeek.getDate() - startWeek.getDay());
  const endWeek = new Date(startWeek);
  endWeek.setDate(endWeek.getDate() + 7);

  const [todayRes, weekRes, otcRes, lowRes] = await Promise.all([
    supabase
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .eq("clinic_id", clinicId)
      .is("deleted_at", null)
      .gte("scheduled_at", startToday.toISOString())
      .lt("scheduled_at", endToday.toISOString()),
    supabase
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .eq("clinic_id", clinicId)
      .is("deleted_at", null)
      .gte("scheduled_at", startWeek.toISOString())
      .lt("scheduled_at", endWeek.toISOString()),
    supabase
      .from("otc_products")
      .select("id", { count: "exact", head: true })
      .eq("clinic_id", clinicId)
      .is("deleted_at", null),
    supabase
      .from("otc_batches")
      .select("id, otc_product_id")
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

  const todayCount = todayRes.count ?? 0;
  const weekCount = weekRes.count ?? 0;
  const otcProductCount = otcRes.count ?? 0;

  return (
    <>
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        <h1 className="text-xl font-bold sm:text-2xl">Clinic dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your clinic at a glance
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border-l-4 border-l-[hsl(var(--chart-1))] transition-all hover:-translate-y-0.5 hover:shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300 delay-75 fill-mode-backwards">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today&apos;s appointments</CardTitle>
            <Calendar className="h-4 w-4 text-[hsl(var(--chart-1))]" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{todayCount}</p>
            <Button variant="link" className="h-auto p-0 mt-1 text-sm" asChild>
              <Link href="/dashboard/appointments">View all</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden border-l-4 border-l-[hsl(var(--chart-2))] transition-all hover:-translate-y-0.5 hover:shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300 delay-100 fill-mode-backwards">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This week</CardTitle>
            <span className="h-4 w-4 rounded-full bg-[hsl(var(--chart-2))]" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{weekCount}</p>
            <Button variant="link" className="h-auto p-0 mt-1 text-sm" asChild>
              <Link href="/dashboard/appointments">View appointments</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden border-l-4 border-l-[hsl(var(--chart-3))] transition-all hover:-translate-y-0.5 hover:shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300 delay-150 fill-mode-backwards">
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
        <Card className={`relative overflow-hidden border-l-4 transition-all hover:-translate-y-0.5 hover:shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300 delay-200 fill-mode-backwards ${lowStockCount > 0 ? "border-l-amber-500" : "border-l-[hsl(var(--chart-4))]"}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low stock batches</CardTitle>
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
      <Card className="relative overflow-hidden border-t border-[hsl(var(--chart-5)/0.25)] transition-all hover:shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300 delay-300 fill-mode-backwards">
        <CardHeader className="pb-2">
          <CardTitle className="text-base sm:text-lg">Quick actions</CardTitle>
          <CardDescription>Clinic management</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button asChild variant="outline" size="lg" className="min-h-11 flex-1 sm:flex-initial">
            <Link href="/dashboard/appointments">
              <Calendar className="mr-2 h-4 w-4" />
              Appointments
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="min-h-11 flex-1 sm:flex-initial">
            <Link href="/dashboard/otc">
              <Package className="mr-2 h-4 w-4" />
              OTC Catalog
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="min-h-11 flex-1 sm:flex-initial">
            <Link href="/dashboard/inventory">
              <ClipboardList className="mr-2 h-4 w-4" />
              Inventory
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="min-h-11 flex-1 sm:flex-initial">
            <Link href="/dashboard/staff">
              <Users className="mr-2 h-4 w-4" />
              Staff
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="min-h-11 flex-1 sm:flex-initial">
            <Link href="/dashboard/audit">
              <FileText className="mr-2 h-4 w-4" />
              Audit log
            </Link>
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
