import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getAuthenticatedUser } from "@/lib/auth";
import { getStaffAction } from "@/modules/staff/actions";
import { listRoles } from "@/modules/staff/actions";
import { listClinics } from "@/modules/clinics/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { EditStaffForm } from "../EditStaffForm";

type Props = { params: Promise<{ id: string }> };

export default async function StaffDetailPage({ params }: Props) {
  const result = await getAuthenticatedUser(["SuperAdmin", "ClinicAdmin"]);
  if ("error" in result) redirect("/login");
  const { id } = await params;
  const [staffRes, rolesRes, clinicsRes] = await Promise.all([
    getStaffAction(id),
    result.user.roleName === "SuperAdmin" ? listRoles() : Promise.resolve({ data: [], error: null }),
    result.user.roleName === "SuperAdmin" ? listClinics() : Promise.resolve({ data: [], error: null }),
  ]);
  if (staffRes.error || !staffRes.data) notFound();
  const staff = staffRes.data;
  const roles = rolesRes.data ?? [];
  const clinics = clinicsRes.data ?? [];
  const canManage = result.user.roleName === "SuperAdmin";

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/staff" aria-label="Back to staff">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">{staff.full_name ?? staff.email ?? staff.id.slice(0, 8)}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Staff details and settings</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
          <CardDescription>View and edit staff information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-medium text-muted-foreground">Email</dt>
              <dd>{staff.email ?? "—"}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">Full name</dt>
              <dd>{staff.full_name ?? "—"}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">Role</dt>
              <dd>{staff.role_name}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">Clinic</dt>
              <dd>{staff.clinic_name ?? "—"}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">Profile ID</dt>
              <dd className="font-mono text-xs">{staff.id}</dd>
            </div>
          </dl>

          {canManage && <EditStaffForm staff={staff} roles={roles} clinics={clinics} />}
        </CardContent>
      </Card>

      {canManage && (
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="text-destructive">Danger zone</CardTitle>
            <CardDescription>Deactivate this user. They will no longer appear in the list and cannot sign in.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" asChild>
              <Link href={`/dashboard/staff/${id}/delete`}>Remove staff</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
