"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TENANT_TYPES, TENANT_STATUSES, FEATURE_KEYS } from "@/modules/tenants/types";
import type { createTenantAction } from "@/modules/tenants/actions";

type CreateTenantActionType = typeof createTenantAction;

export function CreateTenantForm({ createAction }: { createAction: CreateTenantActionType }) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [features, setFeatures] = useState<string[]>([]);

  function toggleFeature(key: string) {
    setFeatures((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("features", JSON.stringify(features));
    const { error } = await createAction(formData);
    if (error) {
      setFormError(error);
      return;
    }
    router.push("/dashboard/tenants");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && <p className="text-sm text-destructive">{formError}</p>}
      <div className="space-y-2">
        <Label htmlFor="tenantType">Tenant type *</Label>
        <select
          id="tenantType"
          name="tenantType"
          required
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
        >
          {TENANT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="subscriptionPackage">Subscription package</Label>
        <Input
          id="subscriptionPackage"
          name="subscriptionPackage"
          placeholder="e.g. starter, professional, enterprise"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="size">Size</Label>
        <Input id="size" name="size" placeholder="e.g. small, medium, large" />
      </div>
      <div className="space-y-2">
        <Label>Features</Label>
        <div className="flex flex-wrap gap-3">
          {FEATURE_KEYS.map((key) => (
            <label key={key} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={features.includes(key)}
                onChange={() => toggleFeature(key)}
                className="rounded border-input"
              />
              {key}
            </label>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          name="status"
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
        >
          {TENANT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div className="border-t pt-4 space-y-4">
        <h3 className="font-medium">Branding</h3>
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
      </div>
      <div className="flex gap-2 pt-2">
        <Button type="submit">Create tenant</Button>
        <Button type="button" variant="outline" onClick={() => router.push("/dashboard/tenants")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
