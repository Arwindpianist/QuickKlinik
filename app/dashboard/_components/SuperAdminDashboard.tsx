import Link from "next/link";
import { listTenants } from "@/modules/tenants/actions";
import { listAuditLogs } from "@/modules/audit/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, FileText, Users } from "lucide-react";

export async function SuperAdminDashboard() {
  const [tenantsRes, auditRes] = await Promise.all([
    listTenants(),
    listAuditLogs(null, 5),
  ]);
  const tenants = tenantsRes.data ?? [];
  const tenantCount = tenants.length;
  const byType = tenants.reduce<Record<string, number>>((acc, t) => {
    acc[t.tenant_type] = (acc[t.tenant_type] ?? 0) + 1;
    return acc;
  }, {});
  const recentAudit = auditRes.data?.length ?? 0;

  return (
    <>
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        <h1 className="text-xl font-bold sm:text-2xl">Platform dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage tenants and platform activity
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-l-4 border-l-[hsl(var(--chart-1))] animate-in fade-in slide-in-from-bottom-2 duration-300 delay-75 fill-mode-backwards">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tenants</CardTitle>
            <Building2 className="h-4 w-4 text-[hsl(var(--chart-1))]" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{tenantCount}</p>
            {Object.keys(byType).length > 0 && (
              <p className="mt-1 text-xs text-muted-foreground">
                {Object.entries(byType)
                  .map(([type, n]) => `${type}: ${n}`)
                  .join(", ")}
              </p>
            )}
            <Button variant="link" className="h-auto p-0 mt-1 text-sm" asChild>
              <Link href="/dashboard/tenants">Manage tenants</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-[hsl(var(--chart-2))] animate-in fade-in slide-in-from-bottom-2 duration-300 delay-100 fill-mode-backwards">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent audit entries</CardTitle>
            <FileText className="h-4 w-4 text-[hsl(var(--chart-2))]" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{recentAudit}</p>
            <Button variant="link" className="h-auto p-0 mt-1 text-sm" asChild>
              <Link href="/dashboard/audit">View audit log</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-[hsl(var(--chart-3))] animate-in fade-in slide-in-from-bottom-2 duration-300 delay-150 fill-mode-backwards">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff</CardTitle>
            <Users className="h-4 w-4 text-[hsl(var(--chart-3))]" />
          </CardHeader>
          <CardContent>
            <Button variant="link" className="h-auto p-0 text-sm" asChild>
              <Link href="/dashboard/staff">View all staff</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      <Card className="border-t border-[hsl(var(--chart-5)/0.25)] animate-in fade-in slide-in-from-bottom-2 duration-300 delay-200 fill-mode-backwards">
        <CardHeader className="pb-2">
          <CardTitle className="text-base sm:text-lg">Quick actions</CardTitle>
          <CardDescription>Platform administration</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button asChild variant="outline" size="lg" className="min-h-11 flex-1 sm:flex-initial">
            <Link href="/dashboard/tenants">
              <Building2 className="mr-2 h-4 w-4" />
              Tenants
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
