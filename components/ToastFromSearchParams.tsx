"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";

type Params = { success?: string; error?: string; created?: string; updated?: string };

/**
 * Shows a toast based on URL search params (e.g. ?success=1 or ?error=message).
 * Call once per page; removes the param after showing so it doesn't repeat on refresh.
 */
export function ToastFromSearchParams({ clearParams = true }: { clearParams?: boolean }) {
  const searchParams = useSearchParams();
  const shown = useRef<string>(null as string | null);

  useEffect(() => {
    const success = searchParams.get("success") ?? searchParams.get("created") ?? searchParams.get("updated");
    const error = searchParams.get("error");
    const key = [success, error].filter(Boolean).join("|");
    if (!key || shown.current === key) return;
    shown.current = key;

    if (success) {
      const message =
        searchParams.get("created") !== null
          ? "Appointment created."
          : searchParams.get("updated") !== null
            ? "Status updated."
            : "Done.";
      toast({ title: "Success", description: message, variant: "default" });
    }
    if (error) {
      toast({ title: "Error", description: decodeURIComponent(error), variant: "destructive" });
    }

    if (clearParams && (success || error)) {
      const next = new URLSearchParams(searchParams);
      next.delete("success");
      next.delete("error");
      next.delete("created");
      next.delete("updated");
      const url = next.toString() ? `?${next.toString()}` : window.location.pathname;
      window.history.replaceState(null, "", url);
    }
  }, [searchParams, clearParams]);

  return null;
}
