"use client";

import { useState } from "react";
import { CometCard } from "@/components/ui/comet-card";

export function CometCompletionCard({
  name,
  cardId,
  completedLabel,
}: {
  name: string;
  cardId: string;
  completedLabel: string;
}) {
  const backgroundSrc =
    "https://images.unsplash.com/photo-1528155124528-06c125d81e89?auto=format&fit=crop&w=1200&q=80";

  return (
    <>
      <div id="completion-card" className="mx-auto w-[95%] max-w-sm sm:w-full">
        <CometCard>
          <CardBody
            name={name}
            cardId={cardId}
            completedLabel={completedLabel}
            backgroundSrc={backgroundSrc}
            className="my-6 md:my-10"
          />
        </CometCard>
      </div>

      <div className="fixed -left-[9999px] top-0 w-[380px] pointer-events-none" aria-hidden>
        <CardBody
          id="completion-card-capture"
          name={name}
          cardId={cardId}
          completedLabel={completedLabel}
          backgroundSrc={backgroundSrc}
          className="my-0"
        />
      </div>
    </>
  );
}

function CardBody({
  id,
  name,
  cardId,
  completedLabel,
  backgroundSrc,
  className,
}: {
  id?: string;
  name: string;
  cardId: string;
  completedLabel: string;
  backgroundSrc: string;
  className?: string;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      id={id}
      className={`flex w-full flex-col items-stretch rounded-[16px] border-0 bg-[#1F2121] p-3 md:p-4 ${className ?? ""}`}
      style={{ transformStyle: "preserve-3d", transform: "none", opacity: 1 }}
    >
      <div className="mx-2 flex-1">
        <div className="relative mt-2 aspect-[3/4] w-full overflow-hidden rounded-[16px]">
          {!imageLoaded ? (
            <div className="absolute inset-0 z-10 overflow-hidden rounded-[16px] bg-black/80">
              <div className="absolute inset-0 animate-pulse bg-gradient-to-b from-primary/15 via-white/5 to-accent/15" />
              <div className="absolute inset-x-4 bottom-5 space-y-2">
                <div className="h-3 w-32 rounded-full bg-white/20" />
                <div className="h-6 w-44 rounded-md bg-white/25" />
                <div className="h-3 w-52 rounded-full bg-white/20" />
              </div>
            </div>
          ) : null}
          <img
            loading="lazy"
            className="absolute inset-0 h-full w-full bg-[#000000] object-cover contrast-75 transition-opacity duration-500"
            alt="Comet card background"
            src={backgroundSrc}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
            style={{
              boxShadow: "rgba(0, 0, 0, 0.05) 0px 5px 6px 0px",
              opacity: imageLoaded ? 1 : 0.01,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--primary)/0.1)] via-black/25 to-[hsl(var(--primary)/0.1)]" />
          <div className="absolute inset-x-4 bottom-4 space-y-3 text-white">
            <p className="kk-rainbow-glow-pill inline-flex rounded-full px-3 py-1 text-[11px] font-medium text-white">
              Early Access Contributor
            </p>
            <h3
              className="text-2xl font-semibold leading-tight"
              style={{ textShadow: "0 2px 10px rgba(0, 0, 0, 0.5)" }}
            >
              Thank you, {name}.
            </h3>
            <p className="text-xs text-white/80" style={{ textShadow: "0 1px 8px rgba(0, 0, 0, 0.45)" }}>
              You are one of the first users helping shape QuickKlinik.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-2 flex flex-shrink-0 items-center justify-between p-4 font-mono text-white">
        <div>
          <div className="text-xs">QuickKlinik Survey</div>
          <div className="text-[11px] text-gray-300 opacity-80">{completedLabel}</div>
        </div>
        <div className="text-xs text-gray-300 opacity-70">#{cardId.slice(0, 8)}</div>
      </div>
      <div className="px-4 pb-4">
        <p className="break-all rounded-md border border-white/20 bg-white/5 px-2 py-1 font-mono text-[11px] text-white/85">
          {cardId}
        </p>
      </div>
    </div>
  );
}
