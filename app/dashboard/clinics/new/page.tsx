import { redirect } from "next/navigation";
import Link from "next/link";
import { getAuthenticatedUser } from "@/lib/auth";
import { createClinicAction } from "@/modules/clinics/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { CreateClinicForm } from "../CreateClinicForm";

export default async function NewClinicPage() {
  const result = await getAuthenticatedUser(["SuperAdmin"]);
  if ("error" in result) redirect("/login");

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/clinics" aria-label="Back to clinics">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">Add clinic</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create a new tenant clinic. Display name is required.
          </p>
        </div>
      </div>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Clinic details</CardTitle>
          <CardDescription>Enter the clinic information below.</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateClinicForm createAction={createClinicAction} />
        </CardContent>
      </Card>
    </div>
  );
}
