import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CircleDollarSign,
  HeartHandshake,
  Shield,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingReveal, LandingStagger, LandingStaggerItem } from "@/components/landing/LandingMotion";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Button } from "@/components/ui/button";

const INITIATIVE_URL = "https://arwindpianist.com";

export const metadata: Metadata = {
  title: "About | QuickKlinik",
  description:
    "QuickKlinik is an initiative by Arwindpianist Multimedia & Consulting, offering simple, subscription-based healthcare operations software for clinics and outpatient teams.",
};

const PILLARS = [
  {
    icon: Users,
    title: "Patients & flow",
    text: "Clear visibility from booking and arrival through waiting and handoff, so teams spend less time on status updates.",
  },
  {
    icon: Building2,
    title: "Multi-site ready",
    text: "Architecture that respects separate clinics or organisations, with access controls suited to reception, clinical, and admin roles.",
  },
  {
    icon: Shield,
    title: "Accountability",
    text: "Important actions are designed to leave an audit trail, supporting responsible operations and review when it matters.",
  },
  {
    icon: HeartHandshake,
    title: "Human-centred UX",
    text: "Interfaces prioritise clarity and speed on busy floors, whether at a reception desk, a nurse station, or a shared kiosk.",
  },
] as const;

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingNav />

      {/* Hero - matches HomeLanding hero shell */}
      <section className="relative overflow-hidden kk-landing-hero">
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_-15%,hsl(var(--primary)/0.32),transparent_68%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 md:py-16 lg:py-20">
          <LandingReveal className="text-center">
            <div className="mx-auto max-w-3xl">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-primary">About QuickKlinik</p>
              <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]">
                Why we exist, and who backs the work
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-pretty text-left text-lg leading-relaxed text-foreground/80 sm:text-justify sm:text-xl">
                We are building a calm, connected workspace for outpatient care: scheduling, waiting, and dispensing in
                one picture, with professional tools kept within reach through honest, subscription-based pricing.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button asChild size="lg" className="kk-cta min-h-11 w-full min-w-[200px] sm:w-auto">
                  <Link href="/survey">
                    Get early access
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="kk-cta-outline min-h-11 w-full sm:w-auto">
                  <Link href="/">Back to home</Link>
                </Button>
              </div>
            </div>
          </LandingReveal>
        </div>
      </section>

      {/* Initiative - light band, features-style intro */}
      <section id="initiative" className="kk-landing-surface-light scroll-mt-20 px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <LandingReveal className="text-center">
            <div className="inline-flex items-center justify-center gap-2 text-primary">
              <Sparkles className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Initiative</p>
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Arwindpianist Multimedia &amp; Consulting
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-left text-base leading-relaxed text-foreground/76 sm:text-justify">
              QuickKlinik is developed as an initiative by{" "}
              <a
                href={INITIATIVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline decoration-primary/40 underline-offset-4 transition-colors hover:decoration-primary"
              >
                Arwindpianist Multimedia &amp; Consulting
              </a>
              , a practice focused on multimedia production and technology consulting. The aim is to ship focused
              products that respect users&apos; time, budgets, and operational reality, starting with healthcare teams
              who run on tight schedules and margins.
            </p>
          </LandingReveal>
          <LandingReveal delay={0.08} className="mx-auto mt-12 max-w-3xl">
            <div className="space-y-3 border-l-2 border-primary/35 pl-5">
              {[
                "Products are judged on clarity first, and busy floors do not have room for mystery navigation.",
                "Roadmaps stay grounded in how clinics actually run, not only how software is usually sold.",
                "Partnership feedback shapes what we build next, especially for outpatient workflows.",
              ].map((line) => (
                <p key={line} className="text-sm leading-relaxed text-foreground/80">
                  {line}
                </p>
              ))}
            </div>
          </LandingReveal>
        </div>
      </section>

      {/* Platform - dark band, audiences-style grid */}
      <section id="platform" className="kk-landing-surface-dark scroll-mt-20 px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <LandingReveal className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">The platform</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-background sm:text-4xl">What QuickKlinik is</h2>
            <p className="mx-auto mt-4 max-w-3xl text-left text-base leading-relaxed text-background/80 sm:text-justify">
              A clinic operations platform built around the daily journey of outpatient care: patients book or arrive,
              move through a live queue, see the right clinician, and, when needed, complete OTC or dispensary steps
              without the front desk re-explaining status every few minutes. Appointments, queue position, inventory
              touchpoints, and role-appropriate views stay aligned so staff work from one operating picture instead of
              scattered spreadsheets and ad hoc messages.
            </p>
          </LandingReveal>

          <LandingStagger className="mt-14 grid gap-10 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-12 lg:gap-x-14">
            {PILLARS.map(({ icon: Icon, title, text }) => (
              <LandingStaggerItem key={title}>
                <div className="flex gap-3.5 sm:gap-4">
                  <Icon
                    className="mt-1 h-[1.125rem] w-[1.125rem] shrink-0 text-primary"
                    strokeWidth={1.75}
                    aria-hidden
                  />
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

      {/* Mission - light band, problem-style numbered blocks */}
      <section id="mission" className="kk-landing-surface-light scroll-mt-20 px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <LandingReveal className="text-center">
            <div className="inline-flex items-center justify-center gap-2 text-primary">
              <Target className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Direction</p>
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Mission &amp; goals</h2>
            <p className="mx-auto mt-4 max-w-2xl text-left text-base leading-relaxed text-foreground/76 sm:text-justify">
              We measure success by whether teams can adopt the product quickly and keep using it without friction.
            </p>
          </LandingReveal>
          <LandingStagger className="mx-auto mt-12 max-w-3xl space-y-12">
            <LandingStaggerItem>
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-10">
                <span className="shrink-0 font-mono text-sm tabular-nums text-primary/85">01</span>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight text-foreground">Mission</h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/74">
                    Give healthcare organisations software that feels as intentional as the care they deliver, fast to
                    learn, honest to buy, and dependable in daily use.
                  </p>
                </div>
              </div>
            </LandingStaggerItem>
            <LandingStaggerItem>
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-10">
                <span className="shrink-0 font-mono text-sm tabular-nums text-primary/85">02</span>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight text-foreground">Goals</h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/74">
                    Lower the barrier to capable operations tools through a simple, easy-to-use product and a
                    subscription model that keeps costs predictable for small and growing practices, not only large
                    hospitals. That means ongoing improvements, transparent packaging, and workflows that match how real
                    clinics run, from community GP rooms to busier outpatient settings.
                  </p>
                </div>
              </div>
            </LandingStaggerItem>
          </LandingStagger>
        </div>
      </section>

      {/* Subscription - dark band, short narrative */}
      <section id="subscription" className="kk-landing-surface-dark scroll-mt-20 border-t border-background/12 px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <LandingReveal className="text-center">
            <div className="inline-flex items-center justify-center gap-2 text-primary">
              <CircleDollarSign className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Pricing philosophy</p>
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-background sm:text-4xl">Subscription, on purpose</h2>
            <p className="mx-auto mt-4 max-w-2xl text-left text-base leading-relaxed text-background/80 sm:text-justify">
              A subscription aligns our incentives with yours: continuous refinement, security-aware updates, and room
              to support partners as regulations and workflows evolve. We are committed to keeping QuickKlinik
              approachable on price so essential outpatient capabilities are not locked behind enterprise-only contracts.
            </p>
          </LandingReveal>
        </div>
      </section>

      {/* CTA - matches HomeLanding pricing section */}
      <section id="cta" className="kk-landing-surface-light scroll-mt-20 px-4 py-20 sm:px-6 sm:py-24">
        <LandingReveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Help shape QuickKlinik</h2>
          <p className="mx-auto mt-5 max-w-2xl text-left text-base leading-relaxed text-foreground/76 sm:text-justify">
            Share how your team works today. We use partner feedback to shape the roadmap. Tell us what you need first as
            we onboard early partners.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild size="lg" className="kk-cta min-h-11 w-full sm:w-auto">
              <Link href="/survey">
                Get early access
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="kk-cta-outline min-h-11 w-full sm:w-auto">
              <Link href="/survey">Complete the survey</Link>
            </Button>
          </div>
        </LandingReveal>
      </section>

      <LandingFooter />
    </div>
  );
}
