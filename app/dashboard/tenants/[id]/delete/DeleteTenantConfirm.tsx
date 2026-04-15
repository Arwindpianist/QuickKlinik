"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { deleteTenantAction } from "@/modules/tenants/actions";
import { useState } from "react";

export function DeleteTenantConfirm({ tenantId }: { tenantId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    setPending(true);
    const { error } = await deleteTenantAction(tenantId);
    setPending(false);
    if (error) return;
    router.push("/dashboard/tenants");
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="destructive" disabled={pending} onClick={handleDelete}>
        {pending ? "Removing…" : "Yes, remove tenant"}
      </Button>
      <Button variant="outline" asChild>
        <Link href={`/dashboard/tenants/${tenantId}`}>Cancel</Link>
      </Button>
    </div>
  );
}
