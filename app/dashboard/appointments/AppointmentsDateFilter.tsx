"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const VIEWS = [
  { value: "today", label: "Today" },
  { value: "week", label: "This week" },
  { value: "all", label: "All" },
] as const;

export function AppointmentsDateFilter() {
  const searchParams = useSearchParams();
  const current = searchParams.get("view") ?? "all";

  return (
    <div className="flex gap-1 rounded-lg border bg-muted/50 p-1">
      {VIEWS.map(({ value, label }) => (
        <Link
          key={value}
          href={value === "all" ? "/dashboard/appointments" : `/dashboard/appointments?view=${value}`}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            current === value
              ? "bg-background text-foreground shadow"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}
