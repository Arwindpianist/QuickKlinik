import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { listDoctors } from "@/modules/doctors/actions";
import { listPatients } from "@/modules/patients/actions";
import { getAppointmentsPageAnalytics } from "@/modules/analytics/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageAnalyticsCard } from "@/components/analytics/PageAnalyticsCard";
import { AppointmentsTable } from "./AppointmentsTable";
import { CreateAppointmentForm } from "./CreateAppointmentForm";
import { AppointmentsDateFilter } from "./AppointmentsDateFilter";
import { ToastFromSearchParams } from "@/components/ToastFromSearchParams";

type View = "today" | "week" | "all";

function getDateRange(view: View): { from: Date; to: Date } | null {
  const now = new Date();
  const from = new Date(now);
  from.setHours(0, 0, 0, 0);
  const to = new Date(from);
  if (view === "today") {
    to.setDate(to.getDate() + 1);
    return { from, to };
  }
  if (view === "week") {
    from.setDate(from.getDate() - from.getDay());
    to.setDate(from.getDate() + 7);
    return { from, to };
  }
  return null;
}

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const result = await getAuthenticatedUser();
  if ("error" in result) redirect("/login");
  const clinicId = result.user.clinicId;
  if (!clinicId) {
    return (
      <div className="p-4 sm:p-6">
        <p className="text-destructive">No clinic context. SuperAdmin must select a clinic.</p>
      </div>
    );
  }

  const params = await searchParams;
  const view: View = params.view === "today" || params.view === "week" ? params.view : "all";
  const range = getDateRange(view);

  const supabase = await createClient();
  let query = supabase
    .from("appointments")
    .select("id, status, scheduled_at, patients(full_name), doctors(full_name)")
    .eq("clinic_id", clinicId)
    .is("deleted_at", null)
    .order("scheduled_at", { ascending: false });

  if (range) {
    query = query
      .gte("scheduled_at", range.from.toISOString())
      .lt("scheduled_at", range.to.toISOString());
  } else {
    query = query.limit(100);
  }

  const { data: appointments } = await query;

  const [doctorsResult, patientsResult, analyticsRes] = await Promise.all([
    listDoctors(),
    listPatients(),
    getAppointmentsPageAnalytics(clinicId),
  ]);
  const doctors = "data" in doctorsResult ? doctorsResult.data : [];
  const patients = "data" in patientsResult ? patientsResult.data : [];
  const analytics = analyticsRes.data;

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
      <ToastFromSearchParams />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">Appointments</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create and manage appointments
          </p>
        </div>
        <AppointmentsDateFilter />
      </div>

      {analytics && (
        <PageAnalyticsCard
          title="Appointments analytics"
          stats={[
            { label: "Today", value: analytics.stats.today },
            { label: "This week", value: analytics.stats.thisWeek },
            ...Object.entries(analytics.stats.byStatus).map(([k, v]) => ({ label: k, value: v })),
          ]}
          chartData={analytics.chartData}
          chartType="line"
          chartDataKey="count"
        />
      )}

      <Card className="animate-in fade-in slide-in-from-bottom-2 duration-300 delay-75 fill-mode-backwards">
        <CardHeader className="pb-2">
          <CardTitle className="text-base sm:text-lg">New appointment</CardTitle>
          <CardDescription>Book a patient with a doctor</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateAppointmentForm
            doctors={doctors ?? []}
            patients={patients ?? []}
            clinicId={clinicId}
          />
        </CardContent>
      </Card>

      <Card className="animate-in fade-in slide-in-from-bottom-2 duration-300 delay-150 fill-mode-backwards">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-base sm:text-lg">
              {view === "today" ? "Today's" : view === "week" ? "This week's" : "Recent"} appointments
            </CardTitle>
            <CardDescription>
              {(appointments ?? []).length} result(s)
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto">
            <AppointmentsTable appointments={appointments ?? []} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
