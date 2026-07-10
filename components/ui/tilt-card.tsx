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

import React, { useRef, useCallback, useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Max tilt angle in degrees (default 3.5) */
  maxDeg?: number;
  /** Spring stiffness (default 200) */
  stiffness?: number;
  /** Spring damping (default 26) */
  damping?: number;
  /** Lift on hover in px (default 4) */
  lift?: number;
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
  const [isPointer, setIsPointer] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setIsPointer(mq.matches);
    // No cleanup needed — one-shot read
  }, []);

  // Normalised pointer position [-1, 1] — MotionValues never go through React state
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rawLift = useMotionValue(0);

  // Spring-smooth
  const springX = useSpring(rawX, { stiffness, damping });
  const springY = useSpring(rawY, { stiffness, damping });
  const springLift = useSpring(rawLift, { stiffness, damping });

  // Map to rotation and lift transforms
  const rotateY = useTransform(springX, [-1, 1], [-maxDeg, maxDeg]);
  const rotateX = useTransform(springY, [-1, 1], [maxDeg, -maxDeg]);
  const translateY = useTransform(springLift, [0, 1], [0, -lift]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
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
      ref={ref}
      className={className}
      style={{
        ...style,
        rotateX,
        rotateY,
        y: translateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}
