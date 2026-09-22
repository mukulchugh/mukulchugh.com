"use client";

import { gsap } from "gsap";
import { motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { type Ball, stepBall } from "./physics";

const targets = [
  { label: "Idea", x: 0.22, y: 0.34 },
  { label: "Craft", x: 0.72, y: 0.25 },
  { label: "Impact", x: 0.48, y: 0.6 },
];
// Prototype only. Motion owns the ball; GSAP owns target feedback, never the same transform.
export function TensionStudy() {
  const stage = useRef<HTMLDivElement>(null);
  const targetNodes = useRef<Array<HTMLDivElement | null>>([]);
  const connected = useRef(new Set<number>());
  const [shots, setShots] = useState(0);
  const hint = useId();
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState("idle");
  const [hits, setHits] = useState(0);
  const [message, setMessage] = useState("");
  const phaseRef = useRef("idle");
  const frame = useRef(0);
  const origin = useRef({ pointerX: 0, pointerY: 0, x: 0, y: 0 });
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const anchorX = useMotionValue(0);
  const anchorY = useMotionValue(0);
  const feedback = useRef<gsap.core.Tween[]>([]);
  const tether = useTransform(
    [x, y, anchorX, anchorY],
    ([px, py, ax, ay]) =>
      `M${Number(ax) - 9} ${ay} L${px} ${py} L${Number(ax) + 9} ${ay}`
  );

  function state(next: string) {
    phaseRef.current = next;
    setPhase(next);
  }
  function stop() {
    cancelAnimationFrame(frame.current);
  }
  function reset() {
    stop();
    const bounds = stage.current?.getBoundingClientRect();
    if (!bounds) return;
    x.set(bounds.width * 0.64);
    y.set(bounds.height * 0.72);
    state("idle");
    setMessage("");
  }
  function begin(pointerX = 0, pointerY = 0) {
    stop();
    origin.current = { pointerX, pointerY, x: x.get(), y: y.get() };
    anchorX.set(x.get());
    anchorY.set(y.get());
    state("aiming");
    setMessage("");
  }
  function pull(dx: number, dy: number) {
    const bounds = stage.current?.getBoundingClientRect();
    if (!bounds) return;
    const limit = Math.min(70, bounds.width * 0.19);
    const distance = Math.hypot(dx, dy);
    const resisted =
      distance <= limit
        ? distance
        : limit + ((distance - limit) * 12) / (12 + distance - limit);
    const scale = resisted / (distance || 1);
    x.set(
      Math.max(24, Math.min(bounds.width - 24, origin.current.x + dx * scale))
    );
    y.set(
      Math.max(24, Math.min(bounds.height - 24, origin.current.y + dy * scale))
    );
  }
  function connect(index: number) {
    if (connected.current.has(index)) return;
    connected.current.add(index);
    setHits(connected.current.size);
    setMessage(
      connected.current.size === 3
        ? "All connected. Nicely done."
        : `${targets[index].label} connected. ${connected.current.size} of 3.`
    );
    const node = targetNodes.current[index];
    if (node && !reduced)
      feedback.current.push(
        gsap.fromTo(
          node,
          { scale: 1.22 },
          { duration: 0.45, ease: "back.out(1.4)", overwrite: true, scale: 1 }
        )
      );
  }
  function fire() {
    if (phaseRef.current !== "aiming") return;
    const bounds = stage.current?.getBoundingClientRect();
    if (!bounds) return;
    const vx = (origin.current.x - x.get()) * 9;
    const vy = (origin.current.y - y.get()) * 9;
    if (Math.hypot(vx, vy) < 25) {
      state("idle");
      return;
    }
    setShots((count) => count + 1);
    // Targets are gates, not solid obstacles. Only the playfield walls reflect the ball.
    const box = { bottom: -100, left: -200, right: -100, top: -200 };
    const ball: Ball = { vx, vy, x: x.get(), y: y.get() };
    state("flight");
    let last = performance.now();
    let age = 0;
    function tick(now: number) {
      const delta = Math.min((now - last) / 1000, 0.032);
      last = now;
      age += delta;
      const steps = Math.max(1, Math.ceil(delta * 240));
      for (let i = 0; i < steps; i++) {
        stepBall(ball, bounds!.width, bounds!.height, box, delta / steps);
        targets.forEach((target, index) => {
          if (
            Math.hypot(
              ball.x - target.x * bounds!.width,
              ball.y - target.y * bounds!.height
            ) < 30
          )
            connect(index);
        });
      }
      x.set(ball.x);
      y.set(ball.y);
      if (Math.hypot(ball.vx, ball.vy) < 10 || age > 6) {
        state("idle");
        return;
      }
      frame.current = requestAnimationFrame(tick);
    }
    if (reduced) {
      // Same trajectory and scoring, resolved without visible travel.
      for (let i = 0; i < 1440; i++) {
        stepBall(ball, bounds.width, bounds.height, box, 1 / 240);
        targets.forEach((target, index) => {
          if (
            Math.hypot(
              ball.x - target.x * bounds.width,
              ball.y - target.y * bounds.height
            ) < 30
          )
            connect(index);
        });
      }
      x.set(ball.x);
      y.set(ball.y);
      state("idle");
      return;
    }
    frame.current = requestAnimationFrame(tick);
  }

  useEffect(() => {
    const observer = new ResizeObserver(reset);
    if (stage.current) observer.observe(stage.current);
    const pause = () => {
      if (document.hidden) reset();
    };
    document.addEventListener("visibilitychange", pause);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", pause);
      stop();
      for (const tween of feedback.current) tween.kill();
    };
  }, []);
  useEffect(() => {
    if (reduced) reset();
  }, [reduced]);

  return (
    <section
      aria-label="Make the connection prototype"
      className="tile-glass relative min-h-[430px] overflow-hidden rounded-[14px] bg-[#141414] text-white"
      data-hits={hits}
      data-phase={phase}
    >
      <div className="px-6 pt-6">
        <p className="mb-3 text-[10px] uppercase tracking-[.2em] text-white/60">
          A little room to play
        </p>
        <h2 className="text-[clamp(28px,3cqw,42px)] font-semibold leading-[1.08] tracking-[-.025em]">
          Make the connection.
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-white/65">
          An idea is a start. What you connect it to matters.
        </p>
      </div>
      <div
        className="relative mx-3 mt-4 h-[220px] rounded-[10px] border border-white/10 bg-white/[.025]"
        ref={stage}
      >
        {targets.map((target, index) => (
          <div
            className="pointer-events-none absolute -ml-6 -mt-6 flex size-12 items-center justify-center rounded-full border border-white/25"
            key={target.label}
            ref={(node) => {
              targetNodes.current[index] = node;
            }}
            style={{
              background: connected.current.has(index)
                ? "#caff32"
                : "transparent",
              color: connected.current.has(index) ? "#141414" : "#ffffff99",
              left: `${target.x * 100}%`,
              top: `${target.y * 100}%`,
            }}
          >
            <span className="text-xs">
              {connected.current.has(index) ? "✓" : `0${index + 1}`}
            </span>
            <span className="absolute top-[52px] text-[9px] uppercase tracking-[.16em] text-white/65">
              {target.label}
            </span>
          </div>
        ))}
        {phase === "aiming" && (
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            <motion.path
              d={tether}
              fill="none"
              stroke="#ffffff80"
              strokeWidth="1.5"
            />
          </svg>
        )}
        <motion.div
          className="absolute left-0 top-0 -ml-[22px] -mt-[22px]"
          style={{ x, y }}
        >
          <Button
            aria-describedby={hint}
            aria-label="Catapult"
            className="h-11 w-11 touch-none cursor-grab rounded-full p-0 hover:bg-transparent focus-visible:ring-[#caff32] focus-visible:ring-offset-[#141414] active:cursor-grabbing"
            onBlur={() => {
              if (phaseRef.current === "aiming") reset();
            }}
            onClick={(event) => {
              if (event.detail === 0) {
                if (phaseRef.current === "aiming") fire();
                else begin();
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                reset();
                return;
              }
              if (
                phaseRef.current !== "aiming" ||
                !event.key.startsWith("Arrow")
              )
                return;
              event.preventDefault();
              const dx = x.get() - origin.current.x;
              const dy = y.get() - origin.current.y;
              pull(
                dx +
                  (event.key === "ArrowRight"
                    ? 10
                    : event.key === "ArrowLeft"
                      ? -10
                      : 0),
                dy +
                  (event.key === "ArrowDown"
                    ? 10
                    : event.key === "ArrowUp"
                      ? -10
                      : 0)
              );
            }}
            onLostPointerCapture={() => {
              if (phaseRef.current === "aiming") reset();
            }}
            onPointerCancel={reset}
            onPointerDown={(event) => {
              if (!event.isPrimary || event.button !== 0) return;
              begin(event.clientX, event.clientY);
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={(event) => {
              if (event.currentTarget.hasPointerCapture(event.pointerId))
                pull(
                  event.clientX - origin.current.pointerX,
                  event.clientY - origin.current.pointerY
                );
            }}
            onPointerUp={(event) => {
              if (!event.currentTarget.hasPointerCapture(event.pointerId))
                return;
              fire();
              event.currentTarget.releasePointerCapture(event.pointerId);
            }}
            render={<button type="button" />}
            size="icon"
            variant="ghost"
          >
            <span className="pointer-events-none size-6 rounded-full bg-[#caff32]" />
          </Button>
        </motion.div>
      </div>
      <div className="flex items-center justify-between gap-3 px-6 py-3">
        <p className="text-[10px] uppercase tracking-[.12em] text-white/70">
          {hits === 3
            ? "All connected."
            : phase === "aiming"
              ? "Release to launch"
              : "Pull to aim"}{" "}
          <span className="ml-2 text-white/50">
            {hits}/3 · {shots} shots
          </span>
        </p>
        <Button
          className="text-xs text-white/70 hover:bg-white/10 hover:text-white"
          onClick={() => {
            reset();
            connected.current.clear();
            for (const tween of feedback.current) tween.kill();
            feedback.current = [];
            gsap.set(targetNodes.current.filter(Boolean), {
              clearProps: "transform",
            });
            setHits(0);
            setShots(0);
          }}
          variant="ghost"
        >
          {hits === 3 ? "Replay" : "Reset"}
        </Button>
      </div>
      <p className="sr-only" id={hint}>
        Pull and release to launch. Keyboard: Enter to aim, arrows to pull,
        Enter to launch, Escape to reset.
      </p>
      <p aria-live="polite" className="sr-only">
        {message}
      </p>
    </section>
  );
}
