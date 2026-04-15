import { redirect } from "next/navigation";
import Link from "next/link";
import { getAuthenticatedUser } from "@/lib/auth";
import { createTenantAction } from "@/modules/tenants/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { CreateTenantForm } from "../CreateTenantForm";

export default async function NewTenantPage() {
  const result = await getAuthenticatedUser(["SuperAdmin"]);
  if ("error" in result) redirect("/login");

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/tenants" aria-label="Back to tenants">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">Create tenant</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a new tenant. Choose type, package, size, and features. For type clinic, a linked clinic is created.
          </p>
        </div>
      </div>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Tenant details</CardTitle>
          <CardDescription>Enter tenant type, subscription, and branding.</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateTenantForm createAction={createTenantAction} />
        </CardContent>
      </Card>
    </div>
  );
}
