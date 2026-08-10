"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import type React from "react";
import { memo, useRef } from "react";
import { Button } from "@/components/ui/button";

interface MagneticButtonProps {
  "aria-label"?: string;
  as?: "a" | "button";
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  rel?: string;
  /** How many px the button pulls toward the cursor. Default 10. */
  strength?: number;
  target?: string;
}

export const MagneticButton = memo(function MagneticButton({
  children,
  className,
  href,
  onClick,
  strength = 10,
  as: Tag = "a",
  target,
  rel,
  "aria-label": ariaLabel,
}: MagneticButtonProps) {
  const shouldReduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Raw motion values — live outside React render cycle
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Spring-physics smoothing
  const x = useSpring(rawX, { damping: 22, mass: 0.6, stiffness: 180 });
  const y = useSpring(rawY, { damping: 22, mass: 0.6, stiffness: 180 });

  // Cap displacement at `strength` px
  const tx = useTransform(
    x,
    [-strength * 5, strength * 5],
    [-strength, strength]
  );
  const ty = useTransform(
    y,
    [-strength * 5, strength * 5],
    [-strength, strength]
  );

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    if (shouldReduce || !ref.current) {
      return;
    }
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    rawX.set(e.clientX - cx);
    rawY.set(e.clientY - cy);
  }

  function handleMouseLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  return (
    <div
      className="inline-block"
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      ref={ref}
    >
      <motion.div
        className="inline-block"
        style={shouldReduce ? undefined : { x: tx, y: ty }}
      >
        {Tag === "a" ? (
          <a
            aria-label={ariaLabel}
            className={className}
            href={href}
            onClick={onClick}
            rel={rel}
            target={target}
          >
            {children}
          </a>
        ) : (
          <Button
            aria-label={ariaLabel}
            className={className}
            onClick={onClick}
            variant="ghost"
          >
            {children}
          </Button>
        )}
      </motion.div>
    </div>
  );
});
