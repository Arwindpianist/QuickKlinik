"use client";

import { cn } from "@/lib/utils";

type DeviceFrameProps = {
  variant: "phone" | "laptop";
  children: React.ReactNode;
  className?: string;
};

export function DeviceFrame({ variant, children, className }: DeviceFrameProps) {
  if (variant === "phone") {
    return (
      <div className={cn("relative mx-auto flex justify-center", className)}>
        <div className="kk-device-phone-bezel relative rounded-[2.2rem] border p-1.5 ring-1 ring-sidebar-foreground/12">
          <div
            className="relative overflow-hidden rounded-[1.8rem] border border-sidebar-foreground/15 bg-background"
            style={{ width: 252, height: 546 }}
          >
            {/* Galaxy-style punch-hole camera */}
            <div className="pointer-events-none absolute left-1/2 top-2.5 z-20 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-foreground/85 ring-2 ring-background/80" />
            {/* Subtle top speaker line */}
            <div className="pointer-events-none absolute left-1/2 top-2 z-20 h-[1px] w-10 -translate-x-1/2 rounded-full bg-foreground/25" />
            <div className="h-full w-full pt-3">{children}</div>
          </div>
        </div>
      </div>
    );
  }

  // Laptop: wider viewport and tighter bezel to mimic desktop dashboard.
  return (
    <div
      className={cn(
        "relative mx-auto flex w-full max-w-[860px] shrink-0 flex-col items-center",
        className
      )}
    >
      {/* Screen */}
      <div
        className="relative flex w-full min-h-[460px] flex-col overflow-hidden rounded-t-xl border-[5px] border-sidebar-border bg-sidebar-background px-2 pt-2 pb-1.5"
        style={{ aspectRatio: "16/10" }}
      >
        {/* Webcam */}
        <div className="mb-1.5 flex shrink-0 justify-center">
          <div className="h-1.5 w-1.5 rounded-full bg-sidebar-foreground/40" />
        </div>
        <div className="relative min-h-0 flex-1 overflow-hidden rounded-[10px] bg-background">
          {children}
        </div>
      </div>
      {/* Base */}
      <div className="h-3 w-[calc(100%+40px)] -translate-x-[20px] rounded-b-xl border-4 border-t-0 border-sidebar-border bg-sidebar-accent shadow-lg" />
    </div>
  );
}
