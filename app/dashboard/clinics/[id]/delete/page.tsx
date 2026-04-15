import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getAuthenticatedUser } from "@/lib/auth";
import { getClinicAction } from "@/modules/clinics/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { DeleteClinicConfirm } from "./DeleteClinicConfirm";

type Props = { params: Promise<{ id: string }> };

export default async function DeleteClinicPage({ params }: Props) {
  const result = await getAuthenticatedUser(["SuperAdmin"]);
  if ("error" in result) redirect("/login");
  const { id } = await params;
  const { data: clinic, error } = await getClinicAction(id);
  if (error || !clinic) notFound();

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/clinics/${id}`} aria-label="Back to clinic">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">Remove clinic</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Confirm removal of {clinic.display_name}
          </p>
        </div>
      </div>

      <Card className="max-w-xl border-destructive/30">
        <CardHeader>
          <CardTitle className="text-destructive">Are you sure?</CardTitle>
          <CardDescription>
            This will soft-delete the clinic. It will no longer appear in the list. Existing data is preserved. You can re-add it later if needed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DeleteClinicConfirm clinicId={id} />
        </CardContent>
      </Card>
    </div>
  );
}
