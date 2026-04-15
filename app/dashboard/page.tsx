import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth";
import { getDashboardHomeChartData } from "@/modules/analytics/actions";
import { SuperAdminDashboard } from "./_components/SuperAdminDashboard";
import { ClinicAdminDashboard } from "./_components/ClinicAdminDashboard";
import { DoctorDashboard } from "./_components/DoctorDashboard";
import { NurseDashboard } from "./_components/NurseDashboard";
import { CounterStaffDashboard } from "./_components/CounterStaffDashboard";
import { InventoryStaffDashboard } from "./_components/InventoryStaffDashboard";
import { PageAnalyticsCard } from "@/components/analytics/PageAnalyticsCard";

export default async function DashboardPage() {
  const result = await getAuthenticatedUser();
  if ("error" in result) redirect("/login");
  const { user } = result;
  const role = user.roleName;
  const clinicId = user.clinicId;
  const authUserId = user.profile.auth_user_id;

  const chartRes = await getDashboardHomeChartData();
  const chartData = chartRes.data;

  if (role === "SuperAdmin") {
    return (
      <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
        <SuperAdminDashboard />
        {chartData && chartData.length > 0 && (
          <PageAnalyticsCard
            title="Appointments (last 7 days)"
            stats={[]}
            chartData={chartData}
            chartType="line"
            chartDataKey="count"
          />
        )}
      </div>
    );
  }

  if (role === "ClinicAdmin" && clinicId) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
        <ClinicAdminDashboard clinicId={clinicId} />
        {chartData && chartData.length > 0 && (
          <PageAnalyticsCard
            title="Appointments (last 7 days)"
            stats={[]}
            chartData={chartData}
            chartType="line"
            chartDataKey="count"
          />
        )}
      </div>
    );
  }

  if (role === "Doctor" && clinicId) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
        <DoctorDashboard clinicId={clinicId} authUserId={authUserId} />
        {chartData && chartData.length > 0 && (
          <PageAnalyticsCard
            title="Appointments (last 7 days)"
            stats={[]}
            chartData={chartData}
            chartType="line"
            chartDataKey="count"
          />
        )}
      </div>
    );
  }

  if (role === "Nurse" && clinicId) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
        <NurseDashboard clinicId={clinicId} />
        {chartData && chartData.length > 0 && (
          <PageAnalyticsCard
            title="Appointments (last 7 days)"
            stats={[]}
            chartData={chartData}
            chartType="line"
            chartDataKey="count"
          />
        )}
      </div>
    );
  }

  if (role === "CounterStaff") {
    return (
      <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
        <CounterStaffDashboard />
        {chartData && chartData.length > 0 && (
          <PageAnalyticsCard
            title="Appointments (last 7 days)"
            stats={[]}
            chartData={chartData}
            chartType="line"
            chartDataKey="count"
          />
        )}
      </div>
    );
  }

  if (role === "InventoryStaff" && clinicId) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
        <InventoryStaffDashboard clinicId={clinicId} />
        {chartData && chartData.length > 0 && (
          <PageAnalyticsCard
            title="Appointments (last 7 days)"
            stats={[]}
            chartData={chartData}
            chartType="line"
            chartDataKey="count"
          />
        )}
      </div>
    );
  }

  // Fallback: no clinic or unknown role
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        <h1 className="text-xl font-bold sm:text-2xl">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {!clinicId
            ? "You are not assigned to a clinic. Contact an administrator."
            : "Overview for your role."}
        </p>
      </div>
    </div>
  );
}
