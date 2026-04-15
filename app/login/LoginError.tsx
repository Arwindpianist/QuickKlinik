"use client";

import { useSearchParams } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function LoginError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  if (!error) return null;
  return (
    <Alert variant="destructive">
      <AlertDescription>{decodeURIComponent(error)}</AlertDescription>
    </Alert>
  );
}
