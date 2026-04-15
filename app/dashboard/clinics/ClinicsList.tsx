import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Pencil, Trash2 } from "lucide-react";

type ClinicRow = {
  id: string;
  display_name: string;
  logo_url: string | null;
  primary_color: string | null;
  support_email: string | null;
  custom_domain: string | null;
};

export function ClinicsList({ clinics }: { clinics: ClinicRow[] }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Manage all tenant clinics. Add, edit, or remove clinics.
        </p>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/dashboard/clinics/new">Add clinic</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(clinics ?? []).map((clinic) => (
          <Card key={clinic.id} className="flex flex-col">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  aria-label="View and edit clinic"
                  asChild
                >
                  <Link href={`/dashboard/clinics/${clinic.id}`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  aria-label="Remove clinic"
                  asChild
                >
                  <Link href={`/dashboard/clinics/${clinic.id}/delete`}>
                    <Trash2 className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Link href={`/dashboard/clinics/${clinic.id}`} className="block hover:opacity-90">
                <CardTitle className="text-base">{clinic.display_name}</CardTitle>
                <CardDescription className="mt-1 text-xs">
                  {clinic.support_email ?? "No support email"}
                </CardDescription>
                <p className="mt-2 text-xs text-muted-foreground">ID: {clinic.id.slice(0, 8)}…</p>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!clinics || clinics.length === 0) && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No clinics yet. <Link href="/dashboard/clinics/new" className="underline">Add clinic</Link> to create one.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
