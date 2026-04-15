"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateStaffAction } from "@/modules/staff/actions";

type StaffRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  role_name: string;
  role_id: string;
  clinic_id: string | null;
  clinic_name: string | null;
};

export function EditStaffForm({
  staff,
  roles,
  clinics,
}: {
  staff: StaffRow;
  roles: { id: string; name: string }[];
  clinics: { id: string; display_name: string }[];
}) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    setPending(true);
    const formData = new FormData(e.currentTarget);
    const { error } = await updateStaffAction(staff.id, formData);
    setPending(false);
    if (error) {
      setFormError(error);
      return;
    }
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border-t pt-4">
      <h3 className="font-medium">Edit staff</h3>
      {formError && <p className="text-sm text-destructive">{formError}</p>}
      <div className="space-y-2">
        <Label htmlFor="fullName">Full name *</Label>
        <Input id="fullName" name="fullName" required defaultValue={staff.full_name ?? ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="roleId">Role *</Label>
        <select
          id="roleId"
          name="roleId"
          required
          defaultValue={staff.role_id}
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          {roles.map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="clinicId">Clinic</Label>
        <select
          id="clinicId"
          name="clinicId"
          defaultValue={staff.clinic_id ?? ""}
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">None</option>
          {clinics.map((c) => (
            <option key={c.id} value={c.id}>{c.display_name}</option>
          ))}
        </select>
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
