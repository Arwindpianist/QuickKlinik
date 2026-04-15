"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateClinicAction } from "@/modules/clinics/actions";

type Clinic = {
  id: string;
  display_name: string;
  logo_url: string | null;
  primary_color: string | null;
  support_email: string | null;
  custom_domain: string | null;
};

export function EditClinicForm({ clinic }: { clinic: Clinic }) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    setPending(true);
    const formData = new FormData(e.currentTarget);
    const { error } = await updateClinicAction(clinic.id, formData);
    setPending(false);
    if (error) {
      setFormError(error);
      return;
    }
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border-t pt-4">
      <h3 className="font-medium">Edit clinic</h3>
      {formError && <p className="text-sm text-destructive">{formError}</p>}
      <div className="space-y-2">
        <Label htmlFor="displayName">Display name *</Label>
        <Input id="displayName" name="displayName" required defaultValue={clinic.display_name} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="supportEmail">Support email</Label>
        <Input id="supportEmail" name="supportEmail" type="email" defaultValue={clinic.support_email ?? ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="primaryColor">Primary color</Label>
        <Input id="primaryColor" name="primaryColor" defaultValue={clinic.primary_color ?? ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="logoUrl">Logo URL</Label>
        <Input id="logoUrl" name="logoUrl" type="url" defaultValue={clinic.logo_url ?? ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="customDomain">Custom domain</Label>
        <Input id="customDomain" name="customDomain" defaultValue={clinic.custom_domain ?? ""} />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
