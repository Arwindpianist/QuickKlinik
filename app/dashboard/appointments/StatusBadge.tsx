import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  booked: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300",
  arrived: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  waiting: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  in_consultation: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
  completed: "bg-muted text-muted-foreground",
};

function formatStatus(s: string): string {
  if (s === "in_consultation") return "In consultation";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? "bg-muted text-muted-foreground";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        style
      )}
    >
      {formatStatus(status)}
    </span>
  );
}
