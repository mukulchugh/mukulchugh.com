"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const DEFAULT_TILE = 128;

interface CanvasGrainProps {
  /** Merged onto the wrapper — override mix-blend-mode/etc per usage. The
   * `grain-overlay` class always stays so prefers-reduced-transparency
   * (see globals.css) hides every grain instance uniformly. */
  className?: string;
  /** CSS opacity applied to the whole grain layer. */
  opacity?: number;
  /** Size (px) of the square noise tile drawn once and repeated. */
  tileSize?: number;
}

/**
 * Canvas-authored grain — real per-pixel noise instead of a repeating SVG
 * dot pattern / feTurbulence filter. Rendered once to a small offscreen
 * canvas, then reused as a static, tiled CSS background — zero ongoing draw
 * cost after mount. Shared by every grain-textured surface in the app so
 * there's exactly one noise implementation instead of one per component.
 */
export function CanvasGrain({
  className,
  opacity = 0.5,
  tileSize = DEFAULT_TILE,
}: CanvasGrainProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = tileSize;
    canvas.height = tileSize;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    const imageData = ctx.createImageData(tileSize, tileSize);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const v = Math.random() * 255;
      imageData.data[i] = v;
      imageData.data[i + 1] = v;
      imageData.data[i + 2] = v;
      imageData.data[i + 3] = 14; // low, constant alpha — texture, not noise blast
    }
    ctx.putImageData(imageData, 0, 0);
    setDataUrl(canvas.toDataURL());
  }, [tileSize]);

  if (!dataUrl) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        "grain-overlay pointer-events-none absolute inset-0 mix-blend-overlay",
        className
      )}
      style={{
        backgroundImage: `url(${dataUrl})`,
        backgroundRepeat: "repeat",
        backgroundSize: `${tileSize}px ${tileSize}px`,
        opacity,
      }}
    />
  );
}
