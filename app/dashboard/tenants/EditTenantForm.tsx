"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TENANT_TYPES, TENANT_STATUSES, FEATURE_KEYS } from "@/modules/tenants/types";
import { updateTenantAction } from "@/modules/tenants/actions";

type Tenant = {
  id: string;
  display_name: string;
  logo_url: string | null;
  primary_color: string | null;
  support_email: string | null;
  custom_domain: string | null;
  tenant_type: string;
  subscription_package: string | null;
  size: string | null;
  features: unknown;
  status: string;
};

export function EditTenantForm({ tenant }: { tenant: Tenant }) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const featuresList = Array.isArray(tenant.features) ? (tenant.features as string[]) : [];
  const [features, setFeatures] = useState<string[]>(featuresList);

  function toggleFeature(key: string) {
    setFeatures((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    setPending(true);
    const formData = new FormData(e.currentTarget);
    formData.set("features", JSON.stringify(features));
    const { error } = await updateTenantAction(tenant.id, formData);
    setPending(false);
    if (error) {
      setFormError(error);
      return;
    }
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border-t pt-4">
      <h3 className="font-medium">Edit tenant</h3>
      {formError && <p className="text-sm text-destructive">{formError}</p>}
      <div className="space-y-2">
        <Label htmlFor="tenantType">Tenant type *</Label>
        <select
          id="tenantType"
          name="tenantType"
          required
          defaultValue={tenant.tenant_type}
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
          defaultValue={tenant.subscription_package ?? ""}
          placeholder="e.g. starter, professional"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="size">Size</Label>
        <Input id="size" name="size" defaultValue={tenant.size ?? ""} placeholder="e.g. small, medium" />
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
          defaultValue={tenant.status}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
        >
          {TENANT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="displayName">Display name *</Label>
        <Input id="displayName" name="displayName" required defaultValue={tenant.display_name} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="supportEmail">Support email</Label>
        <Input id="supportEmail" name="supportEmail" type="email" defaultValue={tenant.support_email ?? ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="primaryColor">Primary color</Label>
        <Input id="primaryColor" name="primaryColor" defaultValue={tenant.primary_color ?? ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="logoUrl">Logo URL</Label>
        <Input id="logoUrl" name="logoUrl" type="url" defaultValue={tenant.logo_url ?? ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="customDomain">Custom domain</Label>
        <Input id="customDomain" name="customDomain" defaultValue={tenant.custom_domain ?? ""} />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
