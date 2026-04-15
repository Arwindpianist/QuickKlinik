import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

export type StaffRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  role_name: string;
  role_id: string;
  clinic_id: string | null;
  clinic_name: string | null;
};

type ClinicRow = { id: string; display_name: string };

export function StaffList({
  staff,
  roles,
  clinics,
  canManage,
}: {
  staff: StaffRow[];
  roles: { id: string; name: string }[];
  clinics: ClinicRow[];
  canManage: boolean;
}) {
  return (
    <div className="flex flex-col gap-6">
      {canManage && (
        <div className="flex justify-end">
          <Button asChild>
            <Link href="/dashboard/staff/new">Add staff</Link>
          </Button>
        </div>
      )}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Team members</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y rounded-md border">
            {staff.map((row) => (
              <li key={row.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
                <Link href={`/dashboard/staff/${row.id}`} className="block hover:opacity-90">
                  <span className="font-medium">{row.full_name ?? row.email ?? row.id.slice(0, 8)}</span>
                  {row.email && (
                    <span className="ml-2 text-muted-foreground">{row.email}</span>
                  )}
                </Link>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                    {row.role_name}
                  </span>
                  {row.clinic_name && (
                    <span className="text-muted-foreground">{row.clinic_name}</span>
                  )}
                  {canManage && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        aria-label="View and edit"
                        asChild
                      >
                        <Link href={`/dashboard/staff/${row.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        aria-label="Remove"
                        asChild
                      >
                        <Link href={`/dashboard/staff/${row.id}/delete`}>
                          <Trash2 className="h-4 w-4" />
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
          {staff.length === 0 && (
            <p className="py-6 text-center text-muted-foreground">No staff found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
