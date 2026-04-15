"use client";

import { useState } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";

export function CardActions({ cardId }: { cardId: string }) {
  const [msg, setMsg] = useState<string>("");

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "My QuickKlinik Early Access Card",
          text: "I completed the QuickKlinik survey.",
          url,
        });
        setMsg("Shared successfully.");
        return;
      }
      await navigator.clipboard.writeText(url);
      setMsg("Link copied to clipboard.");
    } catch {
      setMsg("Share was cancelled or unavailable.");
    }
  };

  const save = async () => {
    const node =
      document.getElementById("completion-card-capture") ??
      document.getElementById("completion-card");
    if (!node) {
      setMsg("Card not found for download.");
      return;
    }
    try {
      const rect = node.getBoundingClientRect();
      const width = Math.ceil(rect.width);
      const height = Math.ceil(rect.height);
      const exportPadding = 36;
      const dataUrl = await toPng(node, {
        cacheBust: true,
        width: width + exportPadding * 2,
        height: height + exportPadding * 2,
        canvasWidth: (width + exportPadding * 2) * 2,
        canvasHeight: (height + exportPadding * 2) * 2,
        pixelRatio: 2,
        style: {
          transform: "none",
          padding: `${exportPadding}px`,
          boxSizing: "border-box",
        },
      });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `quickklinik-card-${cardId}.png`;
      link.click();
      setMsg("Card saved to your device.");
    } catch {
      setMsg("Unable to save card image.");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button type="button" onClick={share} className="rounded-full px-6">
          Share
        </Button>
        <Button type="button" variant="outline" onClick={save} className="rounded-full px-6">
          Save to device
        </Button>
      </div>
      {msg ? <p className="text-sm text-muted-foreground">{msg}</p> : null}
    </div>
  );
}
