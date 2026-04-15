import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getAuthenticatedUser } from "@/lib/auth";
import { getTenantAction } from "@/modules/tenants/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { DeleteTenantConfirm } from "./DeleteTenantConfirm";

type Props = { params: Promise<{ id: string }> };

export default async function DeleteTenantPage({ params }: Props) {
  const result = await getAuthenticatedUser(["SuperAdmin"]);
  if ("error" in result) redirect("/login");
  const { id } = await params;
  const { data: tenant, error } = await getTenantAction(id);
  if (error || !tenant) notFound();

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/tenants/${id}`} aria-label="Back to tenant">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">Remove tenant</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Confirm removal of {tenant.display_name}
          </p>
        </div>
      </div>

      <Card className="max-w-xl border-destructive/30">
        <CardHeader>
          <CardTitle className="text-destructive">Are you sure?</CardTitle>
          <CardDescription>
            This will soft-delete the tenant. If type is clinic, the linked clinic will also be soft-deleted. They will no longer appear in lists. Data is preserved.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DeleteTenantConfirm tenantId={id} />
        </CardContent>
      </Card>
    </div>
  );
}
