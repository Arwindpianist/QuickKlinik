import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Package } from "lucide-react";

export async function NurseDashboard({ clinicId }: { clinicId: string }) {
  const supabase = await createClient();
  const startToday = new Date();
  startToday.setHours(0, 0, 0, 0);
  const endToday = new Date(startToday);
  endToday.setDate(endToday.getDate() + 1);

  const todayRes = await supabase
    .from("appointments")
    .select("id", { count: "exact", head: true })
    .eq("clinic_id", clinicId)
    .is("deleted_at", null)
    .gte("scheduled_at", startToday.toISOString())
    .lt("scheduled_at", endToday.toISOString());
  const todayCount = todayRes.count ?? 0;

  return (
    <>
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        <h1 className="text-xl font-bold sm:text-2xl">Nurse dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Queue and appointments today
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-l-4 border-l-[hsl(var(--chart-1))] animate-in fade-in slide-in-from-bottom-2 duration-300 delay-75 fill-mode-backwards">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today&apos;s appointments</CardTitle>
            <Calendar className="h-4 w-4 text-[hsl(var(--chart-1))]" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{todayCount}</p>
            <Button variant="link" className="h-auto p-0 mt-1 text-sm" asChild>
              <Link href="/dashboard/appointments">View queue</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      <Card className="border-t border-[hsl(var(--chart-5)/0.25)] animate-in fade-in slide-in-from-bottom-2 duration-300 delay-100 fill-mode-backwards">
        <CardHeader className="pb-2">
          <CardTitle className="text-base sm:text-lg">Quick actions</CardTitle>
          <CardDescription>Check-in and OTC support</CardDescription>
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
        </CardContent>
      </Card>
    </>
  );
}
