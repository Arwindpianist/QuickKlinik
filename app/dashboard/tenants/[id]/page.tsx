import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getAuthenticatedUser } from "@/lib/auth";
import { getTenantAction } from "@/modules/tenants/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { EditTenantForm } from "../EditTenantForm";

type Props = { params: Promise<{ id: string }> };

export default async function TenantDetailPage({ params }: Props) {
  const result = await getAuthenticatedUser(["SuperAdmin"]);
  if ("error" in result) redirect("/login");
  const { id } = await params;
  const { data: tenant, error } = await getTenantAction(id);
  if (error || !tenant) notFound();

  const featuresList = Array.isArray(tenant.features) ? (tenant.features as string[]) : [];

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/tenants" aria-label="Back to tenants">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">{tenant.display_name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Type: {tenant.tenant_type} · {tenant.subscription_package ?? "—"} · {tenant.status}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
          <CardDescription>View and edit tenant information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-medium text-muted-foreground">Display name</dt>
              <dd>{tenant.display_name}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">Type</dt>
              <dd>{tenant.tenant_type}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">Subscription package</dt>
              <dd>{tenant.subscription_package ?? "—"}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">Size</dt>
              <dd>{tenant.size ?? "—"}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">Status</dt>
              <dd>{tenant.status}</dd>
            </div>
            {featuresList.length > 0 && (
              <div>
                <dt className="font-medium text-muted-foreground">Features</dt>
                <dd>{featuresList.join(", ")}</dd>
              </div>
            )}
            <div>
              <dt className="font-medium text-muted-foreground">Support email</dt>
              <dd>{tenant.support_email ?? "—"}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">Primary color</dt>
              <dd>{tenant.primary_color ?? "—"}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">Logo URL</dt>
              <dd className="truncate">{tenant.logo_url ?? "—"}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">Custom domain</dt>
              <dd>{tenant.custom_domain ?? "—"}</dd>
            </div>
            {tenant.tenant_type === "clinic" && tenant.clinic && (
              <div className="sm:col-span-2">
                <dt className="font-medium text-muted-foreground">Linked clinic</dt>
                <dd>
                  <Button variant="link" className="h-auto p-0 text-sm" asChild>
                    <Link href={`/dashboard/clinics/${tenant.clinic.id}`}>
                      {tenant.clinic.display_name} (edit clinic)
                    </Link>
                  </Button>
                </dd>
              </div>
            )}
            <div>
              <dt className="font-medium text-muted-foreground">ID</dt>
              <dd className="font-mono text-xs">{tenant.id}</dd>
            </div>
          </dl>

          <EditTenantForm tenant={tenant} />
        </CardContent>
      </Card>

      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-destructive">Danger zone</CardTitle>
          <CardDescription>
            Remove this tenant. It will be soft-deleted. If type is clinic, the linked clinic will also be soft-deleted.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" asChild>
            <Link href={`/dashboard/tenants/${id}/delete`}>Remove tenant</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
