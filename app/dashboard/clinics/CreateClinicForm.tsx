"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CreateClinicAction = (formData: FormData) => Promise<{ data: { id: string } | null; error: string | null }>;

export function CreateClinicForm({ createAction }: { createAction: CreateClinicAction }) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const { error } = await createAction(formData);
    if (error) {
      setFormError(error);
      return;
    }
    router.push("/dashboard/clinics");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && <p className="text-sm text-destructive">{formError}</p>}
      <div className="space-y-2">
        <Label htmlFor="displayName">Display name *</Label>
        <Input id="displayName" name="displayName" required placeholder="e.g. Sunway Demo Clinic" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="supportEmail">Support email</Label>
        <Input id="supportEmail" name="supportEmail" type="email" placeholder="support@clinic.com" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="primaryColor">Primary color</Label>
        <Input id="primaryColor" name="primaryColor" placeholder="#0ea5e9" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="logoUrl">Logo URL</Label>
        <Input id="logoUrl" name="logoUrl" type="url" placeholder="https://..." />
      </div>
      <div className="space-y-2">
        <Label htmlFor="customDomain">Custom domain</Label>
        <Input id="customDomain" name="customDomain" placeholder="clinic.example.com" />
      </div>
      <div className="flex gap-2 pt-2">
        <Button type="submit">Create clinic</Button>
        <Button type="button" variant="outline" onClick={() => router.push("/dashboard/clinics")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
