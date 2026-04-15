"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { deleteClinicAction } from "@/modules/clinics/actions";
import { useState } from "react";

export function DeleteClinicConfirm({ clinicId }: { clinicId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    setPending(true);
    const { error } = await deleteClinicAction(clinicId);
    setPending(false);
    if (error) return;
    router.push("/dashboard/clinics");
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="destructive" disabled={pending} onClick={handleDelete}>
        {pending ? "Removing…" : "Yes, remove clinic"}
      </Button>
      <Button variant="outline" asChild>
        <Link href={`/dashboard/clinics/${clinicId}`}>Cancel</Link>
      </Button>
    </div>
  );
}
