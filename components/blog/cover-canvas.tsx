"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { hashTitle, mulberry32, topicFamilyFor } from "@/lib/blog-topic";
import { cn } from "@/lib/utils";

interface CoverCanvasProps {
  className?: string;
  tags: readonly string[];
  title: string;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Each pattern is seeded by the post's own title hash, so a given post
// always renders the same layout — unique per post, stable across visits.
function drawPattern(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  rand: () => number,
  kind: "circuit" | "dots" | "graph" | "grid" | "path"
) {
  ctx.strokeStyle = "rgba(255,255,255,0.16)";
  ctx.fillStyle = "rgba(255,255,255,0.55)";

  if (kind === "graph") {
    // AI/agents — a loose node graph, edges only between near neighbors.
    const count = 9 + Math.floor(rand() * 4);
    const points = Array.from({ length: count }, () => ({
      x: rand() * w,
      y: rand() * h,
    }));
    ctx.lineWidth = 1;
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const dist = Math.hypot(dx, dy);
        const threshold = w * 0.32;
        if (dist < threshold) {
          ctx.globalAlpha = 1 - dist / threshold;
          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(points[j].x, points[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
    for (const p of points) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (kind === "grid") {
    // Mobile/platform — a loose app-icon grid, some cells skipped.
    const cols = 6;
    const rows = 4;
    const cw = w / cols;
    const ch = h / rows;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (rand() > 0.55) {
          continue;
        }
        const jitter = 3;
        const x = c * cw + cw * 0.2 + (rand() - 0.5) * jitter;
        const y = r * ch + ch * 0.2 + (rand() - 0.5) * jitter;
        const size = Math.min(cw, ch) * 0.42;
        ctx.globalAlpha = 0.45 + rand() * 0.3;
        roundRect(ctx, x, y, size, size, 4);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  } else if (kind === "circuit") {
    // Engineering/infra — an orthogonal trace with via dots at turns.
    let x = rand() * w * 0.2;
    let y = rand() * h;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    const steps = 10;
    for (let i = 0; i < steps; i++) {
      if (rand() > 0.5) {
        x += (w / steps) * (0.6 + rand() * 0.8);
      } else {
        y = Math.max(4, Math.min(h - 4, y + (rand() - 0.5) * h * 0.5));
      }
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  } else if (kind === "path") {
    // Career/product — a single flowing route with waypoints.
    ctx.lineWidth = 1.4;
    const p0 = { x: w * 0.05, y: h * (0.3 + rand() * 0.4) };
    const p1 = { x: w * 0.4, y: h * rand() };
    const p2 = { x: w * 0.7, y: h * rand() };
    const p3 = { x: w * 0.95, y: h * (0.3 + rand() * 0.4) };
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
    ctx.stroke();
    for (const p of [p0, p1, p2, p3]) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.4, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    const cell = 18;
    ctx.globalAlpha = 0.4;
    for (let x = 0; x < w; x += cell) {
      for (let y = 0; y < h; y += cell) {
        ctx.beginPath();
        ctx.arc(x + 2, y + 2, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }
}

/**
 * Generative post cover — a topic-seeded pattern drawn once to an offscreen
 * cache (no per-frame cost while idle), with a cheap pointer-following
 * highlight blitted on top only while the card is actively hovered.
 */
export function CoverCanvas({ title, tags, className }: CoverCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const family = topicFamilyFor(tags);
    const rand = mulberry32(hashTitle(title));
    const base = document.createElement("canvas");
    let dpr = 1;
    let width = 0;
    let height = 0;
    let rafId: number | null = null;
    let pointer: { x: number; y: number } | null = null;

    function drawBase() {
      const bctx = base.getContext("2d");
      if (!bctx) {
        return;
      }
      bctx.clearRect(0, 0, base.width, base.height);
      bctx.save();
      bctx.scale(dpr, dpr);
      drawPattern(bctx, width, height, rand, family?.pattern ?? "dots");
      bctx.restore();
    }

    function paint() {
      const ctx = canvas?.getContext("2d");
      if (!(ctx && canvas)) {
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(base, 0, 0);
      if (pointer) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        const gradient = ctx.createRadialGradient(
          pointer.x * dpr,
          pointer.y * dpr,
          0,
          pointer.x * dpr,
          pointer.y * dpr,
          130 * dpr
        );
        gradient.addColorStop(0, "rgba(255,255,255,0.12)");
        gradient.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
      }
    }

    function resize() {
      if (!canvas) {
        return;
      }
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      base.width = width * dpr;
      base.height = height * dpr;
      drawBase();
      paint();
    }

    function schedulePaint() {
      if (rafId !== null) {
        return;
      }
      rafId = requestAnimationFrame(() => {
        rafId = null;
        paint();
      });
    }

    function onMove(e: PointerEvent) {
      if (shouldReduce || !canvas) {
        return;
      }
      const rect = canvas.getBoundingClientRect();
      pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      schedulePaint();
    }

    function onLeave() {
      pointer = null;
      schedulePaint();
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    return () => {
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [title, tags, shouldReduce]);

  return (
    <canvas
      aria-hidden="true"
      className={cn("absolute inset-0 h-full w-full", className)}
      ref={canvasRef}
      tabIndex={-1}
    />
  );
}
