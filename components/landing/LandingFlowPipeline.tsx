"use client";

import { ChevronDown } from "lucide-react";
import { LandingReveal, LandingStagger, LandingStaggerItem } from "@/components/landing/LandingMotion";

const STEPS = ["Book", "Arrive", "Consult", "Dispense", "Done"] as const;

export function LandingFlowPipeline() {
  return (
    <div className="mt-12 md:mt-14">
      {/* Mobile / tablet: simple list, no boxed steps */}
      <LandingStagger className="mx-auto max-w-md divide-y divide-background/12 border-t border-background/12 lg:hidden">
        {STEPS.map((step, i) => (
          <LandingStaggerItem key={step}>
            <div className="flex items-baseline justify-between gap-6 py-5">
              <span className="font-mono text-xs tabular-nums text-background/45">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-lg font-semibold tracking-tight text-background">{step}</span>
            </div>
          </LandingStaggerItem>
        ))}
      </LandingStagger>

      {/* Desktop: top rule only, no card chrome */}
      <LandingReveal className="hidden lg:block">
        <div className="mx-auto grid max-w-5xl grid-cols-5 gap-3">
          {STEPS.map((step, i) => (
            <div key={step} className="border-t border-background/25 pt-4 text-center">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-background/50">Step {i + 1}</span>
              <p className="mt-2 text-sm font-semibold tracking-tight text-background">{step}</p>
            </div>
          ))}
        </div>
        <div
          className="pointer-events-none mx-auto mt-8 h-px max-w-4xl bg-gradient-to-r from-transparent via-background/18 to-transparent"
          aria-hidden
        />
      </LandingReveal>

      <p className="mt-6 text-center text-xs text-background/45 lg:hidden">
        <ChevronDown className="mx-auto mb-1 h-4 w-4 text-background/60" aria-hidden />
        One step leads to the next
      </p>
    </div>
  );
}
