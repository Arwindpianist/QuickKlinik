import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

export async function DoctorDashboard({
  clinicId,
  authUserId,
}: {
  clinicId: string;
  authUserId: string;
}) {
  const supabase = await createClient();
  const { data: doctor } = await supabase
    .from("doctors")
    .select("id")
    .eq("clinic_id", clinicId)
    .eq("user_id", authUserId)
    .is("deleted_at", null)
    .single();

  let todayCount = 0;
  let weekCount = 0;
  if (doctor) {
    const startToday = new Date();
    startToday.setHours(0, 0, 0, 0);
    const endToday = new Date(startToday);
    endToday.setDate(endToday.getDate() + 1);
    const startWeek = new Date(startToday);
    startWeek.setDate(startWeek.getDate() - startWeek.getDay());
    const endWeek = new Date(startWeek);
    endWeek.setDate(endWeek.getDate() + 7);
    const [todayRes, weekRes] = await Promise.all([
      supabase
        .from("appointments")
        .select("id", { count: "exact", head: true })
        .eq("doctor_id", doctor.id)
        .is("deleted_at", null)
        .gte("scheduled_at", startToday.toISOString())
        .lt("scheduled_at", endToday.toISOString()),
      supabase
        .from("appointments")
        .select("id", { count: "exact", head: true })
        .eq("doctor_id", doctor.id)
        .is("deleted_at", null)
        .gte("scheduled_at", startWeek.toISOString())
        .lt("scheduled_at", endWeek.toISOString()),
    ]);
    todayCount = todayRes.count ?? 0;
    weekCount = weekRes.count ?? 0;
  }

  return (
    <>
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        <h1 className="text-xl font-bold sm:text-2xl">My schedule</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your appointments today and this week
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-l-4 border-l-[hsl(var(--chart-1))] animate-in fade-in slide-in-from-bottom-2 duration-300 delay-75 fill-mode-backwards">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <Calendar className="h-4 w-4 text-[hsl(var(--chart-1))]" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{todayCount}</p>
            <Button variant="link" className="h-auto p-0 mt-1 text-sm" asChild>
              <Link href="/dashboard/appointments">View my appointments</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-[hsl(var(--chart-2))] animate-in fade-in slide-in-from-bottom-2 duration-300 delay-100 fill-mode-backwards">
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
      </div>
      <Card className="border-t border-[hsl(var(--chart-5)/0.25)] animate-in fade-in slide-in-from-bottom-2 duration-300 delay-150 fill-mode-backwards">
        <CardHeader className="pb-2">
          <CardTitle className="text-base sm:text-lg">Quick actions</CardTitle>
          <CardDescription>Consultation workflow</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button asChild variant="outline" size="lg" className="min-h-11 flex-1 sm:flex-initial">
            <Link href="/dashboard/appointments">
              <Calendar className="mr-2 h-4 w-4" />
              Appointments
            </Link>
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
