import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth";
import { listStaff, listRoles } from "@/modules/staff/actions";
import { listClinics } from "@/modules/clinics/actions";
import { getStaffPageAnalytics } from "@/modules/analytics/actions";
import { StaffList } from "./StaffList";
import { PageAnalyticsCard } from "@/components/analytics/PageAnalyticsCard";

export default async function StaffPage() {
  const result = await getAuthenticatedUser(["SuperAdmin", "ClinicAdmin"]);
  if ("error" in result) redirect("/login");
  const [staffRes, rolesRes, clinicsRes, analyticsRes] = await Promise.all([
    listStaff(),
    result.user.roleName === "SuperAdmin" ? listRoles() : Promise.resolve({ data: [], error: null }),
    result.user.roleName === "SuperAdmin" ? listClinics() : Promise.resolve({ data: [], error: null }),
    getStaffPageAnalytics(),
  ]);
  if (staffRes.error) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
        <h1 className="text-xl font-bold sm:text-2xl">Staff</h1>
        <p className="text-destructive">{staffRes.error}</p>
      </div>
    );
  }
  const roles = rolesRes.data ?? [];
  const clinics = clinicsRes.data ?? [];
  const analytics = analyticsRes.data;
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        <h1 className="text-xl font-bold sm:text-2xl">Staff</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {result.user.roleName === "SuperAdmin"
            ? "All users across clinics. Add, edit, or remove staff."
            : "Users in your clinic."}
        </p>
      </div>
      {analytics && (
        <PageAnalyticsCard
          title="Staff analytics"
          stats={[
            { label: "Total staff", value: analytics.stats.total },
            ...Object.entries(analytics.stats.byRole).map(([k, v]) => ({ label: k, value: v })),
          ]}
          chartData={analytics.chartData}
          chartType="bar"
          chartDataKey="value"
        />
      )}
      <StaffList
        staff={staffRes.data ?? []}
        roles={roles}
        clinics={clinics}
        canManage={result.user.roleName === "SuperAdmin"}
      />
    </div>
  );
}
