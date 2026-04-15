import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getAuthenticatedUser } from "@/lib/auth";
import { getStaffAction } from "@/modules/staff/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { DeleteStaffConfirm } from "./DeleteStaffConfirm";

type Props = { params: Promise<{ id: string }> };

export default async function DeleteStaffPage({ params }: Props) {
  const result = await getAuthenticatedUser(["SuperAdmin"]);
  if ("error" in result) redirect("/login");
  const { id } = await params;
  const { data: staff, error } = await getStaffAction(id);
  if (error || !staff) notFound();

  const displayName = staff.full_name ?? staff.email ?? staff.id.slice(0, 8);

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/staff/${id}`} aria-label="Back to staff">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">Remove staff</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Confirm deactivation of {displayName}
          </p>
        </div>
      </div>

      <Card className="max-w-xl border-destructive/30">
        <CardHeader>
          <CardTitle className="text-destructive">Are you sure?</CardTitle>
          <CardDescription>
            This will deactivate the user. They will no longer appear in the list and cannot sign in. Data is preserved.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DeleteStaffConfirm profileId={id} />
        </CardContent>
      </Card>
    </div>
  );
}
