"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CalendarClock,
  ClipboardList,
  Package,
  TimerReset,
  Activity,
  ShieldCheck,
  Users,
  CircleDollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeviceFrame } from "@/components/landing/DeviceFrame";
import { MiniDashboardPreview } from "@/components/landing/MiniDashboardPreview";

type StorySceneId =
  | "hero"
  | "problem"
  | "solution"
  | "showcase"
  | "feature-appointments"
  | "feature-queue"
  | "feature-otc"
  | "feature-inventory"
  | "flow"
  | "scale"
  | "pricing"
  | "cta";

const DASHBOARD_VIEW_MAP: Record<StorySceneId, "dashboard" | "appointments" | "queue" | "otc"> = {
  hero: "dashboard",
  problem: "dashboard",
  solution: "dashboard",
  showcase: "dashboard",
  "feature-appointments": "appointments",
  "feature-queue": "queue",
  "feature-otc": "otc",
  "feature-inventory": "otc",
  flow: "dashboard",
  scale: "dashboard",
  pricing: "dashboard",
  cta: "dashboard",
};

const SCENE_ORDER: StorySceneId[] = [
  "hero",
  "problem",
  "solution",
  "showcase",
  "feature-appointments",
  "feature-queue",
  "feature-otc",
  "feature-inventory",
  "flow",
  "scale",
  "pricing",
  "cta",
];

const SCENE_TONE: Record<StorySceneId, "hero" | "pain" | "solution" | "product" | "feature-a" | "feature-b" | "cta"> =
  {
    hero: "hero",
    problem: "pain",
    solution: "solution",
    showcase: "product",
    "feature-appointments": "feature-a",
    "feature-queue": "feature-b",
    "feature-otc": "feature-a",
    "feature-inventory": "feature-b",
    flow: "feature-a",
    scale: "feature-b",
    pricing: "feature-a",
    cta: "cta",
  };

export function NarrativeStory() {
  const [activeScene, setActiveScene] = useState<StorySceneId>("hero");

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-story-step]"));
    if (!elements.length) return;
    let rafId = 0;

    const updateActiveScene = () => {
      const viewportCenter = window.innerHeight * 0.5;
      let nearestScene: StorySceneId = "hero";
      let nearestDistance = Number.POSITIVE_INFINITY;

      for (const step of elements) {
        const rect = step.getBoundingClientRect();
        const stepCenter = rect.top + rect.height / 2;
        const distance = Math.abs(stepCenter - viewportCenter);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          const scene = step.getAttribute("data-scene") as StorySceneId | null;
          if (scene) nearestScene = scene;
        }
      }

      setActiveScene((prev) => (prev === nearestScene ? prev : nearestScene));
      rafId = 0;
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(updateActiveScene);
    };

    updateActiveScene();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  const showcaseView = DASHBOARD_VIEW_MAP[activeScene];
  const tone = SCENE_TONE[activeScene];

  return (
    <main className="kk-story-shell overflow-x-hidden">
      <section className="kk-story-stage-wrap">
        <div className="kk-story-stage" data-tone={tone}>
          <div key={activeScene} className="kk-story-panel">
            {renderScene(activeScene, showcaseView)}
          </div>
        </div>
        <div className="kk-story-track">
          {SCENE_ORDER.map((scene) => (
            <div
              key={scene}
              data-story-step
              data-scene={scene}
              className="kk-story-step"
              aria-hidden
            />
          ))}
        </div>
      </section>
    </main>
  );
}

function renderScene(
  scene: StorySceneId,
  showcaseView: "dashboard" | "appointments" | "queue" | "otc"
) {
  if (scene === "hero") {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="kk-story-reveal is-active mx-auto max-w-3xl text-center">
          <p className="mb-4 inline-flex items-center rounded-full border border-border/80 bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground">
            Built for clinics and hospitals
          </p>
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Your clinic. Without the waiting.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Appointments, queue, and medicine pickup in one system your staff and patients can actually follow.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="kk-cta min-h-11">
              <Link href="/survey">Get Early Access</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="kk-cta-outline min-h-11">
              <Link href="/survey">See Demo</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (scene === "problem") {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="kk-story-reveal is-active">
          <p className="text-sm font-semibold text-destructive/80">What clinics deal with daily</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Patients keep waiting. Staff keep firefighting.
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              "Patients wait with no idea when their turn is.",
              "Staff juggle queue, payments, and medicine at once.",
              "Simple OTC purchases still take too long.",
            ].map((item, idx) => (
              <div key={item} className="rounded-2xl bg-card/65 p-5 shadow-sm">
                <p className="text-xs font-semibold text-muted-foreground">0{idx + 1}</p>
                <p className="mt-2 text-base font-semibold leading-snug">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (scene === "solution") {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="kk-story-reveal is-active max-w-3xl">
          <p className="text-sm font-semibold text-primary">The solution</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            One clear flow from booking to medicine collection.
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            QuickKlinik brings your appointments, queue, and medicine dispensing into one flow.
          </p>
        </div>
      </div>
    );
  }

  if (
    scene === "showcase" ||
    scene === "feature-appointments" ||
    scene === "feature-queue" ||
    scene === "feature-otc" ||
    scene === "feature-inventory"
  ) {
    const featureMeta: Partial<
      Record<
        StorySceneId,
        { title: string; desc: string; icon: React.ComponentType<{ className?: string }> }
      >
    > = {
      showcase: {
        title: "See the clinic moving in real time.",
        desc: "Track waiting patients, appointments, and medicine stock from one dashboard view.",
        icon: Activity,
      },
      "feature-appointments": {
        title: "Appointments that patients actually show up for.",
        desc: "Send clearer slots and reduce no-shows before they congest your day.",
        icon: CalendarClock,
      },
      "feature-queue": {
        title: "Patients know exactly when it's their turn.",
        desc: "No more crowding at the counter asking for queue updates.",
        icon: ClipboardList,
      },
      "feature-otc": {
        title: "OTC checkout no longer blocks your front desk.",
        desc: "Simple medicine purchases move faster without interrupting consultations.",
        icon: TimerReset,
      },
      "feature-inventory": {
        title: "Inventory updates as medicine moves.",
        desc: "Spot low stock earlier and avoid last-minute scramble.",
        icon: Package,
      },
    };

    const meta = featureMeta[scene]!;
    const Icon = meta.icon!;

    return (
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.25fr_1fr] lg:items-start">
        <div className="relative">
          <DeviceFrame
            variant="laptop"
            className="rounded-lg shadow-[0_12px_34px_rgb(0,0,0,0.14),0_6px_16px_rgb(0,0,0,0.08)]"
          >
            <MiniDashboardPreview size="laptop" interactive={false} forcedView={showcaseView} showTryCta={false} />
          </DeviceFrame>
        </div>
        <div className="kk-story-reveal is-active space-y-3 lg:pt-14">
          <Icon className="h-6 w-6 text-primary" />
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{meta.title}</h2>
          <p className="text-base text-muted-foreground">{meta.desc}</p>
        </div>
      </div>
    );
  }

  if (scene === "flow") {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="kk-story-reveal is-active">
          <p className="text-sm font-semibold text-primary">How it works</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Book to Arrive to See Doctor to Collect Medicine to Leave
          </h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-5">
            {["Book", "Arrive", "See Doctor", "Collect Medicine", "Leave"].map((step, idx) => (
              <div key={step} className="rounded-2xl bg-card/75 p-4 text-center shadow-sm">
                <p className="text-xs text-muted-foreground">Step {idx + 1}</p>
                <p className="mt-1 text-sm font-semibold">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (scene === "scale") {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="kk-story-reveal is-active max-w-4xl">
          <p className="text-sm font-semibold text-primary">Scalability and integration</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Start with one clinic. Expand to ten.</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[Users, Activity, ShieldCheck].map((I, idx) => (
              <div key={idx} className="rounded-2xl bg-card/75 p-4 text-sm shadow-sm">
                <I className="mb-2 h-5 w-5 text-primary" />
                <p className="font-semibold">
                  {idx === 0 ? "Multi-branch ready" : idx === 1 ? "Hardware friendly" : "API ready"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (scene === "pricing") {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="kk-story-reveal is-active max-w-3xl">
          <p className="text-sm font-semibold text-primary">Pricing</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Flexible pricing for clinics of all sizes.
          </h2>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-card/80 px-3 py-2 text-sm shadow-sm">
            <CircleDollarSign className="h-4 w-4 text-primary" />
            Launching soon.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <div className="kk-story-reveal is-active mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Run your clinic without the chaos.</h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
          Let your staff focus on care, not queue confusion.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="kk-cta min-h-11">
            <Link href="/survey">Get Early Access</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="kk-cta-outline min-h-11">
            <Link href="/survey">Take Survey</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
