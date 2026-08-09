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

/**
 * The one motif every cover uses: a loose node-and-edge constellation,
 * seeded by the post's own title so the layout is unique per post and
 * stable across visits. Nodes are crisp white — the vertices read like
 * stars; edges are drawn in the topic's accent hue so the mesh carries the
 * category's color identity even though every post shares the same shape
 * language. Earlier iterations tried five different pattern "kinds" (grid,
 * circuit, tree, path, dots) to signal topic — only this one ever read as
 * intentional rather than as noise, so it's now the only one.
 */
function drawConstellation(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  rand: () => number,
  accent: readonly [number, number, number]
) {
  const [r, g, b] = accent;
  ctx.imageSmoothingEnabled = true;
  ctx.lineWidth = 1.3;

  const count = 8 + Math.floor(rand() * 4);
  const points = Array.from({ length: count }, () => ({
    x: w * 0.06 + rand() * w * 0.88,
    y: h * 0.1 + rand() * h * 0.8,
  }));

  const threshold = w * 0.34;
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const dx = points[i].x - points[j].x;
      const dy = points[i].y - points[j].y;
      const dist = Math.hypot(dx, dy);
      if (dist < threshold) {
        ctx.strokeStyle = `rgba(${r},${g},${b},${0.55 * (1 - dist / threshold)})`;
        ctx.beginPath();
        ctx.moveTo(points[i].x, points[i].y);
        ctx.lineTo(points[j].x, points[j].y);
        ctx.stroke();
      }
    }
  }

  ctx.fillStyle = "rgba(255,255,255,0.92)";
  for (const p of points) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    ctx.fill();
    // A faint accent halo behind each node so the color reads even where
    // no edge passes close by.
    ctx.fillStyle = `rgba(${r},${g},${b},0.35)`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.92)";
  }
}

/**
 * Generative post cover — a topic-seeded constellation drawn once to an
 * offscreen cache (no per-frame cost while idle), with a cheap pointer-
 * following highlight blitted on top only while the card is actively
 * hovered.
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
      drawConstellation(bctx, width, height, rand, family.accent);
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

interface StaticCoverPatternProps {
  className?: string;
  tags: readonly string[];
  title: string;
}

/**
 * Non-interactive per-post pattern for the dense homepage tile and related-
 * posts cards — the same topic-seeded `drawConstellation` as CoverCanvas,
 * but a pure one-time draw: no pointer listeners, no rAF loop, nothing runs
 * after the initial (and any resize) paint.
 */
export function StaticCoverPattern({
  className,
  tags,
  title,
}: StaticCoverPatternProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const family = topicFamilyFor(tags);
    const seed = hashTitle(title);

    function draw() {
      if (!canvas) {
        return;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = rect.width;
      const height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);
      // Fresh PRNG per draw so a resize repaint reproduces the exact same
      // layout instead of continuing the stateful generator's sequence.
      drawConstellation(ctx, width, height, mulberry32(seed), family.accent);
      ctx.restore();
    }

    const ro = new ResizeObserver(draw);
    ro.observe(canvas);
    draw();

    return () => {
      ro.disconnect();
    };
  }, [tags, title]);

  return (
    <canvas
      aria-hidden="true"
      className={cn("absolute inset-0 h-full w-full", className)}
      ref={canvasRef}
      tabIndex={-1}
    />
  );
}
