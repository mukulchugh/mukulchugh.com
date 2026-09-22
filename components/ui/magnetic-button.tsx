"use client";

import { motion, useSpring } from "motion/react";
import {
  memo,
  type PointerEvent,
  type ReactNode,
  useEffect,
  useRef,
} from "react";
import { Button } from "@/components/ui/button";
import { microSpring, pointerSpring } from "@/lib/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

interface MagneticButtonProps {
  "aria-label"?: string;
  as?: "a" | "button";
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
  href?: string;
  onClick?: () => void;
  rel?: string;
  strength?: number;
  target?: string;
}

export const MagneticButton = memo(function MagneticButton({
  children,
  className,
  href,
  onClick,
  strength = 6,
  fullWidth = false,
  as: Tag = "a",
  target,
  rel,
  "aria-label": ariaLabel,
}: MagneticButtonProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, pointerSpring);
  const y = useSpring(0, pointerSpring);

  useEffect(() => {
    if (reduce || strength <= 0) {
      x.jump(0);
      y.jump(0);
    }
  }, [reduce, strength, x, y]);

  function reset() {
    x.set(0);
    y.set(0);
  }
  function follow(event: PointerEvent<HTMLDivElement>) {
    if (
      reduce ||
      strength <= 0 ||
      event.pointerType !== "mouse" ||
      !ref.current
    )
      return;
    const bounds = ref.current.getBoundingClientRect();
    // Measure the stationary wrapper, not the moving button: no feedback jitter.
    x.set(
      Math.max(
        -1,
        Math.min(1, ((event.clientX - bounds.left) / bounds.width) * 2 - 1)
      ) * strength
    );
    y.set(
      Math.max(
        -1,
        Math.min(1, ((event.clientY - bounds.top) / bounds.height) * 2 - 1)
      ) * strength
    );
  }

  return (
    <div
      className={fullWidth ? "block w-full" : "inline-block"}
      onBlur={reset}
      onPointerCancel={reset}
      onPointerLeave={reset}
      onPointerMove={follow}
      ref={ref}
    >
      <motion.div
        className={fullWidth ? "block w-full" : "inline-block"}
        style={{ x, y }}
      >
        {Tag === "a" ? (
          <motion.a
            aria-label={ariaLabel}
            className={className}
            href={href}
            onClick={onClick}
            rel={rel}
            target={target}
            transition={microSpring}
            whileTap={reduce ? undefined : { scale: 0.97 }}
          >
            {children}
          </motion.a>
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
