"use client";

import { useEffect, useRef } from "react";

// Compile and render off the UI thread, only while visible. CSS lime is the fallback.
export function FluorescentShader({
  active,
  className,
}: {
  active: boolean;
  className: string;
}) {
  const host = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const element = host.current;
    if (
      !(
        element &&
        active &&
        "transferControlToOffscreen" in HTMLCanvasElement.prototype
      )
    )
      return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let worker: Worker | undefined;
    let canvas: HTMLCanvasElement | undefined;
    let visible = false;
    let failed = false;
    const fallback = () => {
      failed = true;
      worker?.terminate();
      worker = undefined;
      canvas?.remove();
    };
    const resize = () =>
      worker?.postMessage({
        height: Math.max(1, Math.round(element.clientHeight * 0.65)),
        type: "resize",
        width: Math.max(1, Math.round(element.clientWidth * 0.65)),
      });
    const sync = () => {
      if (
        visible &&
        !document.hidden &&
        !reduced.matches &&
        !worker &&
        !failed
      ) {
        try {
          worker = new Worker(
            new URL("./fluorescent-shader.worker.ts", import.meta.url)
          );
          worker.onerror = fallback;
          worker.onmessage = (event) => {
            if (event.data === "unavailable") fallback();
          };
          canvas = document.createElement("canvas");
          canvas.style.cssText = "width:100%;height:100%;display:block";
          const surface = canvas.transferControlToOffscreen();
          element.appendChild(canvas);
          worker.postMessage({ canvas: surface, type: "init" }, [surface]);
          resize();
        } catch {
          fallback();
        }
      }
      worker?.postMessage({
        type: "active",
        value: visible && !document.hidden && !reduced.matches,
      });
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    const sizing = new ResizeObserver(resize);
    observer.observe(element);
    sizing.observe(element);
    reduced.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      sizing.disconnect();
      reduced.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      worker?.terminate();
      canvas?.remove();
    };
  }, [active]);
  return <span aria-hidden="true" className={className} ref={host} />;
}
