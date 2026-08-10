// HeroBackground — CSS aurora + canvas-authored grain.
// WebGL dithering was continuous GPU work under every frosted tile and caused scroll jank;
// the grain here is a canvas draw that runs exactly once on mount, then sits as a static
// tiled background image — same cost profile as a CSS pattern, richer than one.
"use client";

import { CanvasGrain } from "@/components/canvas-grain";

export function HeroBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[var(--hero-base)] transition-colors duration-300"
    >
      <div className="aurora-blob aurora-blob-1" />
      <div className="aurora-blob aurora-blob-2" />
      <div className="aurora-blob aurora-blob-3" />
      <div className="aurora-blob aurora-blob-4" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_65%_at_50%_0%,transparent_0%,var(--hero-veil)_100%)]" />
      <CanvasGrain />
    </div>
  );
}
