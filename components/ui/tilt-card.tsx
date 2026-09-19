"use client";

/**
 * TiltCard — spring-physics pointer-tilt wrapper.
 *
 * Rules:
 * - Uses useMotionValue + useSpring for all pointer tracking (NEVER useState in mousemove)
 * - Only activates on @media(hover:hover) — no effect on touch devices
 *   (checked via matchMedia once on mount; stable thereafter)
 * - useReducedMotion guard: renders children with no transform
 * - Animates only transform — no layout props
 */

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import type React from "react";
import { useCallback, useRef, useSyncExternalStore } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  /** Spring damping (default 26) */
  damping?: number;
  /** Lift on hover in px (default 4) */
  lift?: number;
  /** Max tilt angle in degrees (default 3.5) */
  maxDeg?: number;
  /** Spring stiffness (default 200) */
  stiffness?: number;
  style?: React.CSSProperties;
}

export function TiltCard({
  children,
  className,
  style,
  maxDeg = 3.5,
  stiffness = 200,
  damping = 26,
  lift = 4,
}: TiltCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Detect pointer device once (matchMedia; stable, no rAF/mousemove)
  const isPointer = useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia("(hover: hover) and (pointer: fine)");
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(hover: hover) and (pointer: fine)").matches,
    () => false
  );

  // Normalised pointer position [-1, 1] — MotionValues never go through React state
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rawLift = useMotionValue(0);

  // Spring-smooth
  const springX = useSpring(rawX, { damping, stiffness });
  const springY = useSpring(rawY, { damping, stiffness });
  const springLift = useSpring(rawLift, { damping, stiffness });

  // Map to rotation and lift transforms
  const rotateY = useTransform(springX, [-1, 1], [-maxDeg, maxDeg]);
  const rotateX = useTransform(springY, [-1, 1], [maxDeg, -maxDeg]);
  const translateY = useTransform(springLift, [0, 1], [0, -lift]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) {
        return;
      }
      const rect = ref.current.getBoundingClientRect();
      rawX.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
      rawY.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
      rawLift.set(1);
    },
    [rawX, rawY, rawLift]
  );

  const handleMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
    rawLift.set(0);
  }, [rawX, rawY, rawLift]);

  // No tilt on reduced-motion or touch devices
  if (shouldReduceMotion || !isPointer) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      ref={ref}
      style={{
        ...style,
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        y: translateY,
      }}
    >
      {children}
    </motion.div>
  );
}
