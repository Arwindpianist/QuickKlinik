"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { deleteStaffAction } from "@/modules/staff/actions";
import { useState } from "react";

export function DeleteStaffConfirm({ profileId }: { profileId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    setPending(true);
    const { error } = await deleteStaffAction(profileId);
    setPending(false);
    if (error) return;
    router.push("/dashboard/staff");
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="destructive" disabled={pending} onClick={handleDelete}>
        {pending ? "Removing…" : "Yes, remove staff"}
      </Button>
      <Button variant="outline" asChild>
        <Link href={`/dashboard/staff/${profileId}`}>Cancel</Link>
      </Button>
    </div>
  );
}
