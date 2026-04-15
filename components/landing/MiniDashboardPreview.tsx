"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  ClipboardList,
  LogOut,
  Package,
  LayoutDashboard,
  FileText,
  Bell,
  Search,
} from "lucide-react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { QuickKlinikLogo } from "@/components/branding/QuickKlinikLogo";
import { cn } from "@/lib/utils";

type View = "dashboard" | "appointments" | "otc" | "queue";

const easeOut = [0.22, 1, 0.36, 1] as const;

function viewPanelMotion(reduce: boolean) {
  if (reduce) {
    return {};
  }
  return {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.22, ease: easeOut },
  };
}

function listContainerVariants(reduce: boolean) {
  return {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduce ? 0 : 0.05,
        delayChildren: reduce ? 0 : 0.03,
      },
    },
  };
}

function listItemVariants(reduce: boolean) {
  return {
    hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.18, ease: easeOut },
    },
  };
}

const MOCK_APPOINTMENTS = [
  { id: 1, patient: "John Doe", time: "9:00 AM" },
  { id: 2, patient: "Mei Ling", time: "9:30 AM" },
  { id: 3, patient: "Raj Kumar", time: "10:00 AM" },
];

const MOCK_OTC = [
  { name: "Paracetamol 500mg", qty: 45 },
  { name: "Vitamin C 1000mg", qty: 12 },
  { name: "Antihistamine", qty: 8 },
];

const MOCK_QUEUE = [
  { token: "A01", patient: "John Doe" },
  { token: "A02", patient: "Mei Ling" },
  { token: "A03", patient: "—" },
];

const STAT_METRICS = [
  { label: "Today", value: 8, icon: Calendar, chart: "chart-1" as const, go: "appointments" as const },
  { label: "Week", value: 42, icon: ClipboardList, chart: "chart-2" as const, go: "appointments" as const },
  { label: "OTC", value: 12, icon: Package, chart: "chart-3" as const, go: "otc" as const },
  { label: "Low", value: 2, icon: FileText, chart: "chart-4" as const, go: "otc" as const },
];

type MiniDashboardPreviewProps = {
  size: "phone" | "laptop" | "compact";
  interactive?: boolean;
  defaultView?: View;
  showTryCta?: boolean;
  forcedView?: View;
  ctaHref?: string;
  className?: string;
};

export function MiniDashboardPreview({
  size,
  interactive = true,
  defaultView = "dashboard",
  showTryCta = true,
  forcedView,
  ctaHref = "/survey",
  className,
}: MiniDashboardPreviewProps) {
  const [view, setView] = useState<View>(() => forcedView ?? defaultView);
  const [selectedToken, setSelectedToken] = useState<number | null>(null);

  useEffect(() => {
    setView(forcedView ?? defaultView);
  }, [defaultView, forcedView]);

  const isPhone = size === "phone";
  const isCompact = size === "compact";
  const reduceMotion = useReducedMotion();

  const appointments = isCompact ? MOCK_APPOINTMENTS.slice(0, 2) : MOCK_APPOINTMENTS;
  const otc = isCompact ? MOCK_OTC.slice(0, 2) : MOCK_OTC;
  const queue = isCompact ? MOCK_QUEUE.slice(0, 2) : MOCK_QUEUE;

  const navTabs: { id: View; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "appointments", label: "Appts", icon: Calendar },
    { id: "otc", label: "OTC", icon: Package },
    { id: "queue", label: "Queue", icon: ClipboardList },
  ];

  const chartBorder = (c: (typeof STAT_METRICS)[number]["chart"]) =>
    c === "chart-1"
      ? "border-l-[hsl(var(--chart-1))]"
      : c === "chart-2"
        ? "border-l-[hsl(var(--chart-2))]"
        : c === "chart-3"
          ? "border-l-[hsl(var(--chart-3))]"
          : "border-l-[hsl(var(--chart-4))]";

  const chartIcon = (c: (typeof STAT_METRICS)[number]["chart"]) =>
    c === "chart-1"
      ? "text-[hsl(var(--chart-1))]"
      : c === "chart-2"
        ? "text-[hsl(var(--chart-2))]"
        : c === "chart-3"
          ? "text-[hsl(var(--chart-3))]"
          : "text-[hsl(var(--chart-4))]";

  return (
    <div
      className={cn(
        "relative flex h-full min-h-0 flex-col bg-background text-foreground",
        isPhone && "overflow-hidden",
        isCompact && "overflow-hidden rounded-lg border shadow-sm",
        className
      )}
    >
      {/* Laptop */}
      {size === "laptop" && (
        <div className="flex h-full min-h-0">
          <aside className="flex h-full w-[7.25rem] shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
            <div className="flex shrink-0 flex-col gap-0.5 px-2.5 py-2.5">
              <div className="flex items-center gap-1.5">
                <QuickKlinikLogo size="xs" tone="sidebar" className="truncate" />
              </div>
              <span className="px-0.5 text-[9px] leading-tight text-sidebar-foreground/60">Clinic</span>
            </div>
            <div className="flex flex-1 flex-col gap-0.5 px-1.5 py-1">
              <span className="px-1 text-[9px] uppercase tracking-wide text-sidebar-foreground/55">Nav</span>
              <LayoutGroup id="kk-preview-laptop-nav">
                {navTabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={interactive ? () => setView(id) : undefined}
                    className={cn(
                      "relative flex w-full items-center gap-1.5 overflow-hidden rounded-md px-1.5 py-1 text-left text-[10px] transition-colors",
                      view === id
                        ? reduceMotion
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/78 hover:bg-sidebar-accent/45"
                    )}
                  >
                    {view === id && !reduceMotion && (
                      <motion.div
                        layoutId="kk-preview-laptop-nav-pill"
                        className="absolute inset-0 rounded-md bg-sidebar-accent"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    <Icon className="relative z-10 h-3 w-3 shrink-0 opacity-90" />
                    <span className="relative z-10 truncate">{label}</span>
                  </button>
                ))}
              </LayoutGroup>
            </div>
            <div className="shrink-0 border-t border-sidebar-border px-1.5 py-1.5">
              <button
                type="button"
                className="flex w-full items-center gap-1.5 rounded-md px-1.5 py-1 text-[9px] text-sidebar-foreground/75 hover:bg-sidebar-accent/45"
              >
                <LogOut className="h-2.5 w-2.5" />
                Out
              </button>
            </div>
          </aside>

          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-muted/25">
            {/* Top app bar */}
            <header className="flex shrink-0 items-center justify-between gap-2 border-b border-border/80 bg-background/95 px-3 py-2">
              <div className="min-w-0">
                <p className="truncate text-[10px] font-semibold text-foreground">Sunway Demo Clinic</p>
                <p className="text-[9px] text-muted-foreground">Today · Reception view</p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <span className="hidden rounded-full bg-accent/15 px-2 py-0.5 text-[9px] font-medium text-accent sm:inline">
                  Live
                </span>
                <div className="flex h-7 w-7 items-center justify-center rounded-md border border-border/80 bg-card text-muted-foreground">
                  <Bell className="h-3.5 w-3.5" />
                </div>
                <div className="flex h-7 max-w-[7rem] items-center gap-1 rounded-md border border-border/80 bg-card px-2 text-[9px] text-muted-foreground">
                  <Search className="h-3 w-3 shrink-0 opacity-70" />
                  <span className="truncate">Search…</span>
                </div>
              </div>
            </header>

            <div className="min-h-0 flex-1 overflow-hidden p-3">
              <AnimatePresence mode="wait" initial={false}>
                {view === "dashboard" && (
                  <motion.div
                    key="dashboard"
                    className="flex h-full min-h-0 flex-col gap-3"
                    {...viewPanelMotion(!!reduceMotion)}
                  >
                    <div className="grid shrink-0 grid-cols-4 gap-2">
                      {STAT_METRICS.map(({ label, value, icon: Icon, chart, go }) => (
                        <button
                          key={label}
                          type="button"
                          onClick={interactive ? () => setView(go) : undefined}
                          className={cn(
                            "rounded-lg border border-border/70 bg-card p-2 text-left shadow-sm",
                            "border-l-2",
                            chartBorder(chart),
                            interactive && "cursor-pointer transition hover:bg-muted/40"
                          )}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[9px] font-medium text-muted-foreground">{label}</span>
                            <Icon className={cn("h-3 w-3 shrink-0 opacity-90", chartIcon(chart))} />
                          </div>
                          <p className="mt-1 text-lg font-bold tabular-nums leading-none">{value}</p>
                        </button>
                      ))}
                    </div>

                    <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 md:grid-cols-5">
                      <div className="flex min-h-0 flex-col rounded-lg border border-border/70 bg-card/90 shadow-sm md:col-span-3">
                        <div className="flex shrink-0 items-center justify-between border-b border-border/60 px-3 py-2">
                          <span className="text-[10px] font-semibold">Next in schedule</span>
                          <span className="text-[9px] text-accent">View all</span>
                        </div>
                        <motion.ul
                          className="min-h-0 flex-1 space-y-1 overflow-hidden px-2 py-2"
                          variants={listContainerVariants(!!reduceMotion)}
                          initial="hidden"
                          animate="show"
                        >
                          {MOCK_APPOINTMENTS.map((apt) => (
                            <motion.li
                              key={apt.id}
                              variants={listItemVariants(!!reduceMotion)}
                              className="flex items-center justify-between rounded-md bg-muted/40 px-2 py-1.5 text-[10px]"
                            >
                              <span className="truncate font-medium">{apt.patient}</span>
                              <span className="shrink-0 text-muted-foreground">{apt.time}</span>
                            </motion.li>
                          ))}
                        </motion.ul>
                      </div>

                      <div className="flex min-h-0 flex-col rounded-lg border border-border/70 bg-gradient-to-b from-accent/8 to-card shadow-sm md:col-span-2">
                        <div className="flex shrink-0 items-center justify-between border-b border-border/60 px-3 py-2">
                          <span className="text-[10px] font-semibold">Queue</span>
                          <span className="rounded bg-primary/12 px-1.5 py-0.5 text-[9px] font-medium text-primary">3</span>
                        </div>
                        <motion.div
                          className="space-y-1 px-2 py-2"
                          variants={listContainerVariants(!!reduceMotion)}
                          initial="hidden"
                          animate="show"
                        >
                          {MOCK_QUEUE.map((q, i) => (
                            <motion.div
                              key={q.token}
                              variants={listItemVariants(!!reduceMotion)}
                              className={cn(
                                "flex items-center justify-between rounded-md border px-2 py-1.5 text-[10px]",
                                i === 0 ? "border-primary/35 bg-primary/8" : "border-transparent bg-muted/35"
                              )}
                            >
                              <span className="font-mono font-semibold">{q.token}</span>
                              <span className="truncate text-muted-foreground">{q.patient}</span>
                            </motion.div>
                          ))}
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {view === "appointments" && (
                  <motion.div key="appointments" className="space-y-2" {...viewPanelMotion(!!reduceMotion)}>
                    <h3 className="text-[11px] font-semibold">Appointments</h3>
                    <motion.ul
                      className="space-y-1"
                      variants={listContainerVariants(!!reduceMotion)}
                      initial="hidden"
                      animate="show"
                    >
                      {MOCK_APPOINTMENTS.map((apt) => (
                        <motion.li
                          key={apt.id}
                          variants={listItemVariants(!!reduceMotion)}
                          className="flex items-center justify-between rounded-md border border-border/70 bg-card px-2.5 py-2 text-[10px]"
                        >
                          <span>{apt.patient}</span>
                          <span className="text-muted-foreground">{apt.time}</span>
                        </motion.li>
                      ))}
                    </motion.ul>
                    {interactive && <p className="text-[10px] font-medium text-accent">View all →</p>}
                  </motion.div>
                )}

                {view === "otc" && (
                  <motion.div key="otc" className="space-y-2" {...viewPanelMotion(!!reduceMotion)}>
                    <h3 className="text-[11px] font-semibold">OTC products</h3>
                    <motion.ul
                      className="space-y-1"
                      variants={listContainerVariants(!!reduceMotion)}
                      initial="hidden"
                      animate="show"
                    >
                      {MOCK_OTC.map((p) => (
                        <motion.li
                          key={p.name}
                          variants={listItemVariants(!!reduceMotion)}
                          className="flex items-center justify-between rounded-md border border-border/70 bg-card px-2.5 py-2 text-[10px]"
                        >
                          <span className="truncate">{p.name}</span>
                          <span className={p.qty < 10 ? "font-medium text-amber-700" : ""}>{p.qty}</span>
                        </motion.li>
                      ))}
                    </motion.ul>
                    {interactive && <p className="text-[10px] font-medium text-accent">Browse catalog →</p>}
                  </motion.div>
                )}

                {view === "queue" && (
                  <motion.div key="queue" className="space-y-2" {...viewPanelMotion(!!reduceMotion)}>
                    <h3 className="text-[11px] font-semibold">Queue</h3>
                    <motion.div
                      className="space-y-1"
                      variants={listContainerVariants(!!reduceMotion)}
                      initial="hidden"
                      animate="show"
                    >
                      {MOCK_QUEUE.map((q, i) => (
                        <motion.button
                          key={q.token}
                          type="button"
                          variants={listItemVariants(!!reduceMotion)}
                          onClick={interactive ? () => setSelectedToken(selectedToken === i ? null : i) : undefined}
                          className={cn(
                            "w-full rounded-md border px-2.5 py-2 text-left text-[10px] transition-colors",
                            selectedToken === i ? "border-primary bg-primary/10" : "border-border/70 bg-card hover:bg-muted/50"
                          )}
                        >
                          <span className="font-mono font-semibold">{q.token}</span> {q.patient}
                        </motion.button>
                      ))}
                    </motion.div>
                    {interactive && <p className="text-[9px] text-muted-foreground">Tap a token</p>}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}

      {/* Phone: bottom tab bar */}
      {isPhone && interactive && (
        <div className="absolute bottom-0 left-0 right-0 z-10 flex border-t border-border/80 bg-card/98 backdrop-blur-sm">
          <LayoutGroup id="kk-preview-phone-tabs">
            {navTabs.map(({ id, icon: Icon }) => (
              <motion.button
                key={id}
                type="button"
                onClick={() => setView(id)}
                {...(reduceMotion
                  ? {}
                  : {
                      whileTap: { scale: 0.94 },
                      transition: { type: "spring" as const, stiffness: 520, damping: 32 },
                    })}
                className={cn(
                  "relative flex flex-1 flex-col items-center gap-0.5 py-1.5 text-[7px] font-medium transition-colors",
                  view === id ? "text-accent" : "text-muted-foreground"
                )}
              >
                <span className="relative flex h-7 w-7 items-center justify-center">
                  {view === id && !reduceMotion && (
                    <motion.span
                      layoutId="kk-preview-phone-tab-pill"
                      className="absolute inset-0 rounded-full bg-accent/18"
                      transition={{ type: "spring", stiffness: 460, damping: 34 }}
                    />
                  )}
                  {view === id && reduceMotion && (
                    <span className="absolute inset-0 rounded-full bg-accent/18" aria-hidden />
                  )}
                  <Icon className="relative z-10 h-3.5 w-3.5" />
                </span>
                {id === "dashboard" ? "Home" : id === "appointments" ? "Appts" : id}
              </motion.button>
            ))}
          </LayoutGroup>
        </div>
      )}

      {/* Phone & compact content */}
      {size !== "laptop" && (
        <div
          className={cn(
            "flex min-h-0 flex-1 flex-col overflow-hidden",
            isPhone && "pb-12",
            isCompact ? "p-1.5" : "p-2"
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            {view === "dashboard" && (
              <motion.div
                key="dashboard"
                className="flex min-h-0 flex-1 flex-col gap-1.5"
                {...viewPanelMotion(!!reduceMotion)}
              >
                {isCompact ? (
                  <>
                    <div className="flex shrink-0 items-center justify-between gap-1">
                      <p className="truncate text-[7px] font-semibold text-foreground">Sunway · Today</p>
                      <span className="shrink-0 rounded-full bg-accent/20 px-1.5 py-0.5 text-[6px] font-medium text-accent">
                        Live
                      </span>
                    </div>
                    <div className="grid shrink-0 grid-cols-2 gap-1">
                      {STAT_METRICS.map(({ label, value, icon: Icon, chart }) => (
                        <div
                          key={label}
                          className={cn(
                            "rounded-md border border-border/80 bg-card p-1 text-left shadow-sm",
                            "border-l-2",
                            chartBorder(chart)
                          )}
                        >
                          <div className="flex items-center justify-between gap-0.5">
                            <span className="text-[6px] text-muted-foreground">{label}</span>
                            <Icon className={cn("h-2 w-2 shrink-0", chartIcon(chart))} />
                          </div>
                          <p className="text-[11px] font-bold tabular-nums leading-tight">{value}</p>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex shrink-0 items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[9px] font-semibold leading-tight text-foreground">Sunway Demo</p>
                        <p className="text-[8px] text-muted-foreground">Today</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-accent/20 px-2 py-0.5 text-[7px] font-medium text-accent">
                        Live
                      </span>
                    </div>

                    <div className="grid shrink-0 grid-cols-2 gap-1">
                      <button
                        type="button"
                        onClick={interactive ? () => setView("appointments") : undefined}
                        className={cn(
                          "col-span-2 rounded-lg border border-border/80 bg-gradient-to-br from-accent/12 to-card p-2 text-left shadow-sm",
                          interactive && "active:scale-[0.99]"
                        )}
                      >
                        <p className="text-[8px] text-muted-foreground">Visits today</p>
                        <p className="text-xl font-bold tabular-nums text-foreground">8</p>
                        <p className="text-[8px] text-accent">+2 vs avg</p>
                      </button>
                      {STAT_METRICS.slice(1).map(({ label, value, icon: Icon, chart, go }) => (
                        <button
                          key={label}
                          type="button"
                          onClick={interactive ? () => setView(go) : undefined}
                          className={cn(
                            "rounded-md border border-border/80 bg-card p-1.5 text-left shadow-sm",
                            "border-l-2",
                            chartBorder(chart),
                            interactive && "active:scale-[0.99]"
                          )}
                        >
                          <div className="flex items-center justify-between gap-0.5">
                            <span className="text-[7px] text-muted-foreground">{label}</span>
                            <Icon className={cn("h-2.5 w-2.5 shrink-0", chartIcon(chart))} />
                          </div>
                          <p className="text-sm font-bold tabular-nums">{value}</p>
                        </button>
                      ))}
                    </div>

                    <div className="mt-0.5 min-h-0 flex-1 rounded-md border border-border/60 bg-muted/30 p-1.5">
                      <p className="mb-1 text-[7px] font-semibold uppercase tracking-wide text-muted-foreground">Up next</p>
                      <motion.div
                        className="space-y-1"
                        variants={listContainerVariants(!!reduceMotion)}
                        initial="hidden"
                        animate="show"
                      >
                        {MOCK_APPOINTMENTS.slice(0, 2).map((apt) => (
                          <motion.div
                            key={apt.id}
                            variants={listItemVariants(!!reduceMotion)}
                            className="flex items-center justify-between rounded bg-card px-1.5 py-1 text-[8px]"
                          >
                            <span className="truncate font-medium">{apt.patient}</span>
                            <span className="shrink-0 text-muted-foreground">{apt.time}</span>
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {view === "appointments" && (
              <motion.div key="appointments" className="space-y-1" {...viewPanelMotion(!!reduceMotion)}>
                <h3 className={cn("font-semibold", isCompact ? "text-[8px]" : "text-[9px]")}>Appointments</h3>
                <motion.ul
                  className="space-y-0.5"
                  variants={listContainerVariants(!!reduceMotion)}
                  initial="hidden"
                  animate="show"
                >
                  {appointments.map((apt) => (
                    <motion.li
                      key={apt.id}
                      variants={listItemVariants(!!reduceMotion)}
                      className={cn(
                        "flex items-center justify-between rounded border border-border/70 bg-card",
                        isCompact ? "px-1.5 py-1 text-[7px]" : "px-2 py-1 text-[8px]"
                      )}
                    >
                      <span className="truncate">{apt.patient}</span>
                      <span className="shrink-0 text-muted-foreground">{apt.time}</span>
                    </motion.li>
                  ))}
                </motion.ul>
                {interactive && !isCompact && <p className="text-[8px] font-medium text-accent">View all →</p>}
              </motion.div>
            )}

            {view === "otc" && (
              <motion.div key="otc" className="space-y-1" {...viewPanelMotion(!!reduceMotion)}>
                <h3 className={cn("font-semibold", isCompact ? "text-[8px]" : "text-[9px]")}>OTC</h3>
                <motion.ul
                  className="space-y-0.5"
                  variants={listContainerVariants(!!reduceMotion)}
                  initial="hidden"
                  animate="show"
                >
                  {otc.map((p) => (
                    <motion.li
                      key={p.name}
                      variants={listItemVariants(!!reduceMotion)}
                      className={cn(
                        "flex items-center justify-between rounded border border-border/70 bg-card",
                        isCompact ? "px-1.5 py-1 text-[7px]" : "px-2 py-1 text-[8px]"
                      )}
                    >
                      <span className="min-w-0 truncate">{p.name}</span>
                      <span className={cn(p.qty < 10 ? "text-amber-700" : "")}>{p.qty}</span>
                    </motion.li>
                  ))}
                </motion.ul>
                {interactive && !isCompact && <p className="text-[8px] font-medium text-accent">Catalog →</p>}
              </motion.div>
            )}

            {view === "queue" && (
              <motion.div key="queue" className="space-y-1" {...viewPanelMotion(!!reduceMotion)}>
                <h3 className={cn("font-semibold", isCompact ? "text-[8px]" : "text-[9px]")}>Queue</h3>
                <motion.div
                  className="space-y-0.5"
                  variants={listContainerVariants(!!reduceMotion)}
                  initial="hidden"
                  animate="show"
                >
                  {queue.map((q, i) => (
                    <motion.button
                      key={q.token}
                      type="button"
                      variants={listItemVariants(!!reduceMotion)}
                      onClick={interactive ? () => setSelectedToken(selectedToken === i ? null : i) : undefined}
                      className={cn(
                        "w-full rounded border text-left transition-colors",
                        isCompact ? "px-1.5 py-1 text-[7px]" : "px-2 py-1 text-[8px]",
                        selectedToken === i ? "border-primary bg-primary/10" : "border-border/70 bg-card"
                      )}
                    >
                      <span className="font-mono font-semibold">{q.token}</span> {q.patient}
                    </motion.button>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {interactive && showTryCta && !isPhone && (
        <Link
          href={ctaHref}
          className="absolute bottom-2 right-2 z-10 rounded-md bg-accent px-2 py-1 text-[8px] font-semibold text-accent-foreground shadow-md ring-1 ring-accent/30 hover:bg-accent/90"
          onClick={(e) => e.stopPropagation()}
        >
          Try it →
        </Link>
      )}
    </div>
  );
}
