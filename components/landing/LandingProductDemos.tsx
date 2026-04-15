"use client";

import { Fragment } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { DeviceFrame } from "@/components/landing/DeviceFrame";
import { LandingMockupReveal, LandingReveal } from "@/components/landing/LandingMotion";
import { MiniDashboardPreview } from "@/components/landing/MiniDashboardPreview";

const DEMOS = [
  {
    view: "queue" as const,
    title: "Queue",
    caption: "Clear tokens and order so the waiting area stays calm.",
  },
  {
    view: "appointments" as const,
    title: "Schedule",
    caption: "Today’s book and arrivals in one place for reception and nurses.",
  },
  {
    view: "otc" as const,
    title: "OTC & stock",
    caption: "Dispensing and levels tied to what is happening on the floor.",
  },
];

export function LandingProductDemos() {
  return (
    <LandingReveal className="mx-auto max-w-5xl">
      <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.22em] text-background/50">
        Follow the workflow
      </p>
      <div className="flex flex-col items-stretch gap-8 md:flex-row md:items-start md:justify-center md:gap-3 lg:gap-5">
        {DEMOS.map(({ view, title, caption }, index) => (
          <Fragment key={view}>
            <div className="flex flex-1 flex-col items-center md:max-w-[220px] md:min-w-0">
              <p className="mb-1 font-mono text-xs tabular-nums text-background/45">
                {String(index + 1).padStart(2, "0")}
              </p>
              <p className="mb-4 text-center text-xs font-semibold uppercase tracking-wider text-background/90">{title}</p>
              <LandingMockupReveal className="w-full max-w-[200px]">
                <div className="kk-landing-preview-chrome w-full overflow-hidden rounded-lg">
                  <div className="aspect-[5/4] w-full">
                    <MiniDashboardPreview
                      size="compact"
                      forcedView={view}
                      interactive={false}
                      showTryCta={false}
                      className="h-full min-h-0 w-full"
                    />
                  </div>
                </div>
              </LandingMockupReveal>
              <p className="mt-4 max-w-[14rem] text-center text-sm leading-relaxed text-background/75">{caption}</p>
            </div>
            {index < DEMOS.length - 1 && (
              <>
                <div className="flex justify-center md:hidden" aria-hidden>
                  <ChevronDown className="h-5 w-5 text-background/30" strokeWidth={1.75} />
                </div>
                <div className="hidden shrink-0 items-center self-center md:flex" aria-hidden>
                  <ChevronRight className="h-6 w-6 text-background/30" strokeWidth={1.75} />
                </div>
              </>
            )}
          </Fragment>
        ))}
      </div>
    </LandingReveal>
  );
}

export function LandingProductHeroPreview() {
  return (
    <div className="mx-auto w-full max-w-[860px]">
      <div className="kk-landing-preview-chrome overflow-hidden rounded-xl">
        <div className="aspect-[16/10] w-full">
          <MiniDashboardPreview
            size="laptop"
            className="h-full min-h-0"
            interactive
            showTryCta={false}
            defaultView="dashboard"
          />
        </div>
      </div>
    </div>
  );
}

export function LandingProductHeroMobilePreview() {
  return (
    <div className="mx-auto w-full max-w-[320px]">
      <DeviceFrame variant="phone" className="drop-shadow-xl transition-transform duration-500 ease-out hover:scale-[1.01]">
        <MiniDashboardPreview
          size="phone"
          className="h-full"
          interactive
          showTryCta={false}
          defaultView="dashboard"
        />
      </DeviceFrame>
    </div>
  );
}
