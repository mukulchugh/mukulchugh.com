"use client";

import { useEffect, useState } from "react";

const TILE = 128;

/**
 * Canvas-authored grain — real per-pixel noise instead of a repeating SVG
 * dot pattern. Rendered once to a small offscreen canvas, then reused as a
 * static, tiled CSS background — zero ongoing draw cost after mount.
 */
export function CanvasGrain() {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = TILE;
    canvas.height = TILE;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    const imageData = ctx.createImageData(TILE, TILE);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const v = Math.random() * 255;
      imageData.data[i] = v;
      imageData.data[i + 1] = v;
      imageData.data[i + 2] = v;
      imageData.data[i + 3] = 14; // low, constant alpha — texture, not noise blast
    }
    ctx.putImageData(imageData, 0, 0);
    setDataUrl(canvas.toDataURL());
  }, []);

  if (!dataUrl) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: `url(${dataUrl})`,
        backgroundRepeat: "repeat",
        backgroundSize: `${TILE}px ${TILE}px`,
        mixBlendMode: "overlay",
        opacity: 0.5,
      }}
    />
  );
}
