"use client";

import React, { useRef, memo } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  useReducedMotion,
} from "motion/react";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  /** How many px the button pulls toward the cursor. Default 10. */
  strength?: number;
  as?: "a" | "button";
  target?: string;
  rel?: string;
  "aria-label"?: string;
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
  const x = useSpring(rawX, { stiffness: 180, damping: 22, mass: 0.6 });
  const y = useSpring(rawY, { stiffness: 180, damping: 22, mass: 0.6 });

  // Cap displacement at `strength` px
  const tx = useTransform(x, [-strength * 5, strength * 5], [-strength, strength]);
  const ty = useTransform(y, [-strength * 5, strength * 5], [-strength, strength]);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    if (shouldReduce || !ref.current) return;
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
      ref={ref}
      className="inline-block"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={shouldReduce ? undefined : { x: tx, y: ty }}
        className="inline-block"
      >
        {Tag === "a" ? (
          <a
            href={href}
            target={target}
            rel={rel}
            onClick={onClick}
            aria-label={ariaLabel}
            className={className}
          >
            {children}
          </a>
        ) : (
          <button
            onClick={onClick}
            aria-label={ariaLabel}
            className={className}
          >
            {children}
          </button>
        )}
      </motion.div>
    </div>
  );
});
