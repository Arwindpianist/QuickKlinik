import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth";
import { listAuditLogs } from "@/modules/audit/actions";
import { getAuditPageAnalytics } from "@/modules/analytics/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageAnalyticsCard } from "@/components/analytics/PageAnalyticsCard";

export default async function AuditPage() {
  const result = await getAuthenticatedUser(["SuperAdmin", "ClinicAdmin"]);
  if ("error" in result) redirect("/login");
  const clinicId = result.user.roleName === "SuperAdmin" ? null : result.user.clinicId;
  const [logsRes, analyticsRes] = await Promise.all([
    listAuditLogs(clinicId, 100),
    getAuditPageAnalytics(clinicId),
  ]);
  const { data: logs, error } = logsRes;
  const analytics = analyticsRes.data;
  if (error) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
        <h1 className="text-xl font-bold sm:text-2xl">Audit log</h1>
        <p className="text-destructive">{typeof error === "string" ? error : error?.message ?? String(error)}</p>
      </div>
    );
  }
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        <h1 className="text-xl font-bold sm:text-2xl">Audit log</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {result.user.roleName === "SuperAdmin"
            ? "Platform-wide audit trail."
            : "Clinic audit trail."}
        </p>
      </div>

      {analytics && (
        <PageAnalyticsCard
          title="Audit analytics"
          stats={[
            { label: "Shown", value: analytics.stats.total },
            { label: "Today", value: analytics.stats.today },
            ...Object.entries(analytics.stats.byAction).slice(0, 4).map(([k, v]) => ({ label: k, value: v })),
          ]}
          chartData={analytics.chartData}
          chartType="line"
          chartDataKey="count"
        />
      )}

      <Card className="animate-in fade-in slide-in-from-bottom-2 duration-300 delay-75 fill-mode-backwards">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Recent activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y rounded-md border">
            {(logs ?? []).map((log) => (
              <li key={log.id} className="flex flex-wrap items-start justify-between gap-2 px-4 py-3 text-sm">
                <div>
                  <span className="font-medium">{log.action}</span>
                  <span className="ml-2 text-muted-foreground">{log.entity_type}</span>
                  {log.entity_id && (
                    <span className="ml-1 font-mono text-xs text-muted-foreground">
                      {log.entity_id.slice(0, 8)}…
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(log.created_at).toLocaleString()}
                  {log.actor_id && ` · ${log.actor_id.slice(0, 8)}…`}
                </div>
              </li>
            ))}
          </ul>
          {(!logs || logs.length === 0) && (
            <p className="py-6 text-center text-muted-foreground">No audit entries yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
