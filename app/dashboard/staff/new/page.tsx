import { redirect } from "next/navigation";
import Link from "next/link";
import { getAuthenticatedUser } from "@/lib/auth";
import { listRoles, createStaffAction } from "@/modules/staff/actions";
import { listClinics } from "@/modules/clinics/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { AddStaffForm } from "../AddStaffForm";

export default async function NewStaffPage() {
  const result = await getAuthenticatedUser(["SuperAdmin"]);
  if ("error" in result) redirect("/login");

  const [rolesRes, clinicsRes] = await Promise.all([listRoles(), listClinics()]);
  const roles = rolesRes.data ?? [];
  const clinics = clinicsRes.data ?? [];

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/staff" aria-label="Back to staff">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">Add staff</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create a new user. They can sign in with the email and password you set.
          </p>
        </div>
      </div>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Staff details</CardTitle>
          <CardDescription>Enter email, password, name, role, and optional clinic.</CardDescription>
        </CardHeader>
        <CardContent>
          <AddStaffForm createAction={createStaffAction} roles={roles} clinics={clinics} />
        </CardContent>
      </Card>
    </div>
  );
}
