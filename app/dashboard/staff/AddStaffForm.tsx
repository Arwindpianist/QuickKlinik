"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CreateStaffAction = (formData: FormData) => Promise<{ data: { id: string } | null; error: string | null }>;

export function AddStaffForm({
  createAction,
  roles,
  clinics,
}: {
  createAction: CreateStaffAction;
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
    const { error } = await createAction(formData);
    setPending(false);
    if (error) {
      setFormError(error);
      return;
    }
    router.push("/dashboard/staff");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && <p className="text-sm text-destructive">{formError}</p>}
      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input id="email" name="email" type="email" required placeholder="user@clinic.com" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password *</Label>
        <Input id="password" name="password" type="password" required minLength={8} placeholder="Min 8 characters" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="fullName">Full name *</Label>
        <Input id="fullName" name="fullName" required placeholder="Dr. Jane Doe" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="roleId">Role *</Label>
        <select
          id="roleId"
          name="roleId"
          required
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">Select role</option>
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
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">None</option>
          {clinics.map((c) => (
            <option key={c.id} value={c.id}>{c.display_name}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Creating…" : "Create"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/dashboard/staff")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
