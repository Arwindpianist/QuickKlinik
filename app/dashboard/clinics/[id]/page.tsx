import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getAuthenticatedUser } from "@/lib/auth";
import { getClinicAction } from "@/modules/clinics/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { EditClinicForm } from "../EditClinicForm";

type Props = { params: Promise<{ id: string }> };

export default async function ClinicDetailPage({ params }: Props) {
  const result = await getAuthenticatedUser(["SuperAdmin"]);
  if ("error" in result) redirect("/login");
  const { id } = await params;
  const { data: clinic, error } = await getClinicAction(id);
  if (error || !clinic) notFound();

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/clinics" aria-label="Back to clinics">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">{clinic.display_name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Clinic details and settings</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
          <CardDescription>View and edit clinic information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-medium text-muted-foreground">Display name</dt>
              <dd>{clinic.display_name}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">Support email</dt>
              <dd>{clinic.support_email ?? "—"}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">Primary color</dt>
              <dd>{clinic.primary_color ?? "—"}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">Logo URL</dt>
              <dd className="truncate">{clinic.logo_url ?? "—"}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">Custom domain</dt>
              <dd>{clinic.custom_domain ?? "—"}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">ID</dt>
              <dd className="font-mono text-xs">{clinic.id}</dd>
            </div>
          </dl>

          <EditClinicForm clinic={clinic} />
        </CardContent>
      </Card>

      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-destructive">Danger zone</CardTitle>
          <CardDescription>Remove this clinic. It will be soft-deleted and no longer shown in the list.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" asChild>
            <Link href={`/dashboard/clinics/${id}/delete`}>Remove clinic</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
