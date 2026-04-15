import Link from "next/link";
import {
  Calendar,
  ClipboardList,
  Package,
  Shield,
  Stethoscope,
  ArrowRight,
  Building2,
  Landmark,
  HeartPulse,
  BriefcaseMedical,
  Network,
  Gift,
  Link2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LandingMockupReveal,
  LandingReveal,
  LandingStagger,
  LandingStaggerItem,
} from "@/components/landing/LandingMotion";
import { LandingFlowPipeline } from "@/components/landing/LandingFlowPipeline";
import {
  LandingProductDemos,
  LandingProductHeroMobilePreview,
  LandingProductHeroPreview,
} from "@/components/landing/LandingProductDemos";
import { QuickKlinikLogo } from "@/components/branding/QuickKlinikLogo";
import { LandingFooter } from "@/components/landing/LandingFooter";

const AUDIENCES = [
  {
    icon: Building2,
    title: "Community & GP clinics",
    text: "High-volume daily visits with a small front-of-house team.",
  },
  {
    icon: Network,
    title: "Group practices & polyclinics",
    text: "Multiple rooms and providers sharing one live queue and schedule.",
  },
  {
    icon: Landmark,
    title: "Hospital OPD & day units",
    text: "Outpatient departments and day procedure centres needing clear flow.",
  },
  {
    icon: HeartPulse,
    title: "Specialist outpatient centres",
    text: "Physio, ENT, dermatology, and similar repeat-visit environments.",
  },
  {
    icon: BriefcaseMedical,
    title: "Workplace & occupational health",
    text: "Corporate clinics balancing screenings, consults, and dispensary steps.",
  },
  {
    icon: Stethoscope,
    title: "Pharmacy-linked dispensing",
    text: "Counters where OTC, stock, and patient flow must stay in sync.",
  },
] as const;

const FEATURES = [
  {
    icon: Calendar,
    title: "Appointments",
    text: "Slots and arrivals stay visible so the day does not drift for staff or patients.",
  },
  {
    icon: ClipboardList,
    title: "Live queue",
    text: "Everyone sees who is waiting and who is next, with fewer interruptions at the desk.",
  },
  {
    icon: Package,
    title: "OTC & inventory",
    text: "Stock moves with the visit so dispensing is not a surprise at the end.",
  },
  {
    icon: Shield,
    title: "Audit-ready",
    text: "Important actions leave a trail your organisation can stand behind.",
  },
] as const;

const CHALLENGES = [
  {
    title: "Opaque queues",
    body: "Patients do not know when they will be seen, so the front desk answers the same status question all day.",
  },
  {
    title: "Fragmented tools",
    body: "Scheduling, queue updates, and stock tracking live in separate tools and force constant context switching.",
  },
  {
    title: "Slow medicine handoff",
    body: "Dispensing and OTC checks happen too late in the flow and create avoidable delays at the end of the visit.",
  },
] as const;

const SELLING_POINTS = [
  "One operating picture from booking to medicine handoff.",
  "Tenant-safe architecture with role-based access controls.",
  "Queue and stock visibility that scales from one site to many.",
] as const;

const HERO_HOOKS = [
  {
    title: "One journey, not four tools",
    line: "Schedule, queue, consult, and dispensary share the same live picture.",
    detail:
      "Staff stop jumping between spreadsheets, chat threads, and separate stock lists when every step runs in one place.",
  },
  {
    title: "Calmer waiting rooms",
    line: "Patients see where they are in line and what happens next.",
    detail:
      "Fewer “how much longer?” questions at the desk, and clearer handoffs between reception, nurses, and doctors.",
  },
  {
    title: "Built to scale with you",
    line: "From one clinic to many sites under one tenant-safe setup.",
    detail:
      "Role-based access and audit-friendly actions so operations stay controlled as you add rooms, teams, or locations.",
  },
] as const;

export function HomeLanding() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden kk-landing-hero">
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_-15%,hsl(var(--primary)/0.32),transparent_68%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 md:py-16 lg:py-20">
          <div className="grid items-center gap-8 md:grid-cols-[1.05fr_0.95fr] md:gap-10 lg:gap-14">
            <LandingReveal>
              <div>
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                  Outpatient operations platform
                </p>
                <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3.7rem]">
                  Run outpatient care with one calm, connected flow.
                </h1>
                <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-foreground/80 sm:text-xl">
                  QuickKlinik unifies appointments, queueing, OTC dispensing, and inventory for clinics, group practices,
                  hospital outpatient teams, and specialist centres. Teams spend less time coordinating and more time with
                  patients.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg" className="kk-cta min-h-11 w-full min-w-[200px] sm:w-auto">
                    <Link href="/survey">
                      Get early access
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="kk-cta-outline min-h-11 w-full sm:w-auto">
                    <Link href="/survey">Share feedback</Link>
                  </Button>
                </div>
              </div>
            </LandingReveal>
            <LandingReveal delay={0.12} className="flex flex-col items-center text-center">
              <p className="mb-3 w-full text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
                Live product preview
              </p>
              <LandingMockupReveal className="w-full">
                <LandingProductHeroMobilePreview />
              </LandingMockupReveal>
            </LandingReveal>
          </div>

          <LandingStagger className="mt-10 flex flex-col gap-8 border-t border-border/55 pt-10 sm:mt-14 sm:flex-row sm:gap-0 sm:pt-12">
            {HERO_HOOKS.map((item, i) => (
              <LandingStaggerItem
                key={item.title}
                className={cn(
                  "flex-1 sm:border-l sm:border-border/45 sm:pl-8",
                  i === 0 && "sm:border-l-0 sm:pl-0"
                )}
              >
                <article className="text-left">
                  <p className="text-base font-semibold leading-snug tracking-tight text-foreground">{item.title}</p>
                  <p className="mt-2 text-sm font-medium leading-snug text-primary">{item.line}</p>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/75">{item.detail}</p>
                </article>
              </LandingStaggerItem>
            ))}
          </LandingStagger>
        </div>
      </section>

      {/* Audiences */}
      <section id="audiences" className="kk-landing-surface-dark scroll-mt-20 px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <LandingReveal className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-background sm:text-4xl">
              Who QuickKlinik is built for
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-background/78">
              Outpatient teams that run face-to-face care under one roof: from single clinics to networked sites. If
              patients book, wait, consult, and collect care or medicine in one visit, the workflow fits.
            </p>
          </LandingReveal>

          <LandingStagger className="mt-14 grid gap-10 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-12 lg:gap-x-14">
            {AUDIENCES.map(({ icon: Icon, title, text }) => (
              <LandingStaggerItem key={title}>
                <div className="flex gap-3.5 sm:gap-4">
                  <Icon className="mt-1 h-[1.125rem] w-[1.125rem] shrink-0 text-primary" strokeWidth={1.75} aria-hidden />
                  <div className="min-w-0">
                    <h3 className="text-[0.95rem] font-semibold leading-snug tracking-tight text-background sm:text-base">
                      {title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-background/75">{text}</p>
                  </div>
                </div>
              </LandingStaggerItem>
            ))}
          </LandingStagger>
        </div>
      </section>

      {/* Challenges */}
      <section id="problem" className="kk-landing-surface-light scroll-mt-20 px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <LandingReveal className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Where outpatient teams lose time today
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-foreground/76">
              These problems appear in busy practices everywhere. QuickKlinik is designed to remove them at the source.
            </p>
          </LandingReveal>
          <LandingStagger className="mx-auto mt-12 max-w-3xl space-y-12">
            {CHALLENGES.map((item, i) => (
              <LandingStaggerItem key={item.title}>
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-10">
                  <span className="shrink-0 font-mono text-sm tabular-nums text-primary/85">0{i + 1}</span>
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight text-foreground">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/74">{item.body}</p>
                  </div>
                </div>
              </LandingStaggerItem>
            ))}
          </LandingStagger>
        </div>
      </section>

      {/* Product preview */}
      <section id="preview" className="kk-landing-surface-dark scroll-mt-20 px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <LandingReveal className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Inside the product</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-background sm:text-4xl">
              One dashboard, then the workflow in order
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-background/80">
              Start from the live overview your team would use every day. Then follow queue, schedule, and stock as they
              connect in a single patient journey.
            </p>
          </LandingReveal>

          <div className="mt-12">
            <LandingMockupReveal>
              <LandingProductHeroPreview />
            </LandingMockupReveal>
            <p className="mt-5 text-center text-xs text-background/55">
              Interactive: use the sidebar to switch views, same as the real app.
            </p>
          </div>

          <div className="mt-16 border-t border-background/12 pt-14">
            <LandingReveal className="text-center">
              <h3 className="text-xl font-semibold text-background sm:text-2xl">From queue to counter in three beats</h3>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-background/72">
                Shorter waits, fewer desk interruptions, and stock that matches the visit, whether you run one site or many.
              </p>
            </LandingReveal>
            <div className="mt-12">
              <LandingProductDemos />
            </div>
          </div>

          <div className="mt-16 border-t border-background/12 pt-14">
            <LandingReveal>
              <h3 className="text-center text-lg font-semibold text-background sm:text-xl">Outcomes that matter on the floor</h3>
              <div className="mt-10 grid gap-10 sm:grid-cols-3 sm:gap-8">
                {SELLING_POINTS.map((line, i) => (
                  <div key={line} className="text-center sm:text-left">
                    <p className="font-mono text-xs tabular-nums text-background/45">{String(i + 1).padStart(2, "0")}</p>
                    <p className="mt-2 text-sm leading-relaxed text-background/82">{line}</p>
                  </div>
                ))}
              </div>
            </LandingReveal>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="kk-landing-surface-light scroll-mt-20 px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <LandingReveal>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Product</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Modules that work as one system
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground/76">
                  Reception, nurses, doctors, and dispensary teams see the same live status. No duplicate updates, no
                  isolated spreadsheets, and no guessing the next step.
                </p>
                <div className="mt-8 space-y-3 border-l-2 border-primary/35 pl-5">
                  {[
                    "See queue status and appointments in one view.",
                    "Cut repeated status questions at the front desk.",
                    "Keep dispensing and stock aligned with patient flow.",
                  ].map((line) => (
                    <p key={line} className="text-sm leading-relaxed text-foreground/80">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </LandingReveal>

            <LandingReveal delay={0.08}>
              <div className="space-y-6 border-l-2 border-primary/30 pl-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground/65">Key operating outcomes</h3>
                <div className="space-y-6">
                  {[
                    { title: "Faster triage at reception", text: "Shared visibility helps staff move people to the right queue quickly." },
                    { title: "Cleaner clinical handoffs", text: "Doctors and nurses see upstream updates without asking around." },
                    { title: "Stronger dispensing control", text: "OTC and low-stock signals surface before the patient reaches the counter." },
                  ].map((item) => (
                    <div key={item.title}>
                      <p className="font-semibold text-foreground">{item.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-foreground/74">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </LandingReveal>
          </div>

          <LandingStagger className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <LandingStaggerItem key={title}>
                <div className="transition-transform duration-300 hover:-translate-y-0.5">
                  <Icon className="h-6 w-6 text-primary" strokeWidth={1.75} />
                  <h3 className="mt-4 text-lg font-semibold tracking-tight text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/74">{text}</p>
                </div>
              </LandingStaggerItem>
            ))}
          </LandingStagger>
        </div>
      </section>

      {/* Flow */}
      <section id="flow" className="kk-landing-surface-dark scroll-mt-20 border-t border-background/12 px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <LandingReveal className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-background sm:text-4xl">From visit to exit</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-background/80">
              A simple path staff can explain and patients can follow, in any outpatient setting we support.
            </p>
          </LandingReveal>
          <LandingFlowPipeline />
        </div>
      </section>

      {/* Token + CTA */}
      <section id="pricing" className="kk-landing-surface-light scroll-mt-20 px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <LandingReveal>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Community invite</p>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Complete the survey and unlock your dedicated QuickKlinik page
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-foreground/76">
                  Tell us how your clinic operates today, then receive a unique UUID hosted on the QuickKlinik domain.
                  Your response unlocks a dedicated appreciation page that you can revisit anytime.
                </p>
                <div className="mt-7 space-y-3 border-l-2 border-primary/35 pl-5">
                  <p className="flex items-center gap-2 text-sm text-foreground/80">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                    Complete the QuickKlinik survey.
                  </p>
                  <p className="flex items-center gap-2 text-sm text-foreground/80">
                    <Link2 className="h-4 w-4 shrink-0 text-primary" />
                    Get a unique UUID and URL on the QuickKlinik domain.
                  </p>
                  <p className="flex items-center gap-2 text-sm text-foreground/80">
                    <Gift className="h-4 w-4 shrink-0 text-primary" />
                    View your personal token of appreciation page.
                  </p>
                </div>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Button asChild size="lg" className="kk-cta min-h-11 w-full sm:w-auto">
                    <Link href="/survey">Complete the survey</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="kk-cta-outline min-h-11 w-full sm:w-auto">
                    <Link href="/survey">See UUID page preview</Link>
                  </Button>
                </div>
              </div>
            </LandingReveal>

            <LandingMockupReveal>
              <div className="mx-auto w-full max-w-[22rem] rounded-2xl border border-border/70 bg-card p-4 shadow-lg">
                <div className="rounded-xl border border-primary/25 bg-gradient-to-br from-primary/20 via-background to-accent/12 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/65">
                      Early Supporter
                    </p>
                    <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                      Sneak peek
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <QuickKlinikLogo size="sm" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-foreground">Token of Appreciation</p>
                  <p className="mt-1 text-xs leading-relaxed text-foreground/72">
                    A compact digital keepsake unlocked immediately after survey completion.
                  </p>
                  <div className="mt-4 rounded-md border border-border/70 bg-background/75 px-2.5 py-2">
                    <p className="font-mono text-[11px] text-muted-foreground">PREVIEW • /cards/uuid</p>
                  </div>
                </div>
              </div>
            </LandingMockupReveal>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
