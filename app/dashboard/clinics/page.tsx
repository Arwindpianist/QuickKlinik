import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth";
import { listClinics } from "@/modules/clinics/actions";
import { getPerTenantAnalytics } from "@/modules/analytics/actions";
import { ClinicsList } from "./ClinicsList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageAnalyticsCard } from "@/components/analytics/PageAnalyticsCard";

export default async function ClinicsPage() {
  const result = await getAuthenticatedUser(["SuperAdmin"]);
  if ("error" in result) redirect("/login");
  const [clinicsRes, analyticsRes] = await Promise.all([
    listClinics(),
    getPerTenantAnalytics(),
  ]);
  const { data: clinics, error } = clinicsRes;
  const analytics = analyticsRes.data ?? [];
  if (error) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
        <h1 className="text-xl font-bold sm:text-2xl">Clinics</h1>
        <p className="text-destructive">{typeof error === "string" ? error : (error as { message?: string })?.message ?? String(error)}</p>
      </div>
    );
  }
  const totalAppointmentsMonth = analytics.reduce((s, r) => s + r.appointmentsThisMonth, 0);
  const totalOtcOrders = analytics.reduce((s, r) => s + r.otcOrdersCount, 0);
  const chartData = analytics.map((row) => ({
    name: row.displayName.length > 10 ? row.displayName.slice(0, 10) + "…" : row.displayName,
    value: row.appointmentsThisMonth,
  }));

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        <h1 className="text-xl font-bold sm:text-2xl">Clinics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage all tenant clinics. Add, edit, or remove clinics.
        </p>
      </div>

      {analytics.length > 0 && (
        <PageAnalyticsCard
          title="Platform analytics"
          stats={[
            { label: "Clinics", value: analytics.length },
            { label: "Appointments this month", value: totalAppointmentsMonth },
            { label: "OTC orders (all)", value: totalOtcOrders },
          ]}
          chartData={chartData}
          chartType="bar"
          chartDataKey="value"
        />
      )}

      {analytics.length > 0 && (
        <Card className="animate-in fade-in slide-in-from-bottom-2 duration-300 delay-75 fill-mode-backwards">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Per-tenant analytics</CardTitle>
            <p className="text-sm text-muted-foreground">Appointments and OTC/inventory summary by clinic</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 pr-4 font-medium">Clinic</th>
                    <th className="pb-2 pr-4 font-medium">Appointments today</th>
                    <th className="pb-2 pr-4 font-medium">Appointments this month</th>
                    <th className="pb-2 pr-4 font-medium">OTC orders</th>
                    <th className="pb-2 pr-4 font-medium">OTC products</th>
                    <th className="pb-2 font-medium">Low stock batches</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.map((row) => (
                    <tr key={row.clinicId} className="border-b last:border-0">
                      <td className="py-2 pr-4 font-medium">{row.displayName}</td>
                      <td className="py-2 pr-4">{row.appointmentsToday}</td>
                      <td className="py-2 pr-4">{row.appointmentsThisMonth}</td>
                      <td className="py-2 pr-4">{row.otcOrdersCount}</td>
                      <td className="py-2 pr-4">{row.otcProductsCount}</td>
                      <td className={`py-2 ${row.lowStockBatchCount > 0 ? "text-amber-600 dark:text-amber-400" : ""}`}>
                        {row.lowStockBatchCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <ClinicsList clinics={clinics ?? []} />
    </div>
  );
}
