import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Pencil, Trash2 } from "lucide-react";
import type { TenantRow } from "@/modules/tenants/types";

type TenantWithMeta = TenantRow & { featuresDisplay?: string };

export function TenantsList({ tenants }: { tenants: TenantWithMeta[] }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Create and manage tenants by type, package, size, and features.
        </p>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/dashboard/tenants/new">Create tenant</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(tenants ?? []).map((tenant) => (
          <Card key={tenant.id} className="flex flex-col">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  aria-label="View and edit tenant"
                  asChild
                >
                  <Link href={`/dashboard/tenants/${tenant.id}`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  aria-label="Remove tenant"
                  asChild
                >
                  <Link href={`/dashboard/tenants/${tenant.id}/delete`}>
                    <Trash2 className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Link href={`/dashboard/tenants/${tenant.id}`} className="block hover:opacity-90">
                <CardTitle className="text-base">{tenant.display_name}</CardTitle>
                <CardDescription className="mt-1 text-xs">
                  Type: {tenant.tenant_type} · {tenant.subscription_package ?? "—"} · {tenant.status}
                </CardDescription>
                {Array.isArray(tenant.features) && (tenant.features as string[]).length > 0 && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Features: {(tenant.features as string[]).join(", ")}
                  </p>
                )}
                <p className="mt-2 text-xs text-muted-foreground">ID: {tenant.id.slice(0, 8)}…</p>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!tenants || tenants.length === 0) && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No tenants yet. <Link href="/dashboard/tenants/new" className="underline">Create tenant</Link> to add one.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
