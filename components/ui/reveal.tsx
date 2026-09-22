"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import {
  fadeVariants,
  heroRiseVariants,
  riseVariants,
  scaleInVariants,
  staggerContainer,
  staggerContainerFast,
  staggerItem,
  viewportOnce,
} from "@/lib/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const visibleWithoutMotion = {
  opacity: 1,
  scale: 1,
  transition: { duration: 0 },
  y: 0,
};

type RevealVariant = "rise" | "hero" | "fade" | "scale";

const variantMap = {
  fade: fadeVariants,
  hero: heroRiseVariants,
  rise: riseVariants,
  scale: scaleInVariants,
} as const;

type RevealProps = {
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
  /** Delay in seconds when not using a stagger parent */
  delay?: number;
};

/**
 * Scroll-triggered entry for a single block.
 * Motion docs: whileInView + viewport.once (react-scroll-animations).
 */
export function Reveal({
  children,
  className,
  variant = "rise",
  delay = 0,
}: RevealProps) {
  const reduce = useReducedMotion();

  const base = variantMap[variant];
  const variants =
    delay > 0
      ? {
          hidden: base.hidden,
          visible: {
            ...(typeof base.visible === "object" ? base.visible : {}),
            transition: {
              ...((typeof base.visible === "object" &&
                base.visible &&
                "transition" in base.visible &&
                base.visible.transition) ||
                {}),
              delay,
            },
          },
        }
      : base;

  return (
    <motion.div
      animate={reduce ? visibleWithoutMotion : undefined}
      className={className}
      initial={reduce ? false : "hidden"}
      variants={variants}
      viewport={viewportOnce}
      whileInView={reduce ? undefined : "visible"}
    >
      {children}
    </motion.div>
  );
}

type RevealGroupProps = {
  children: ReactNode;
  className?: string;
  fast?: boolean;
};

/** Parent that staggers RevealItem children (docs: motion.dev/docs/stagger). */
export function RevealGroup({
  children,
  className,
  fast = false,
}: RevealGroupProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      animate={reduce ? visibleWithoutMotion : undefined}
      className={className}
      initial={reduce ? false : "hidden"}
      variants={fast ? staggerContainerFast : staggerContainer}
      viewport={viewportOnce}
      whileInView={reduce ? undefined : "visible"}
    >
      {children}
    </motion.div>
  );
}

type RevealItemProps = {
  children: ReactNode;
  className?: string;
};

export function RevealItem({ children, className }: RevealItemProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      animate={reduce ? visibleWithoutMotion : undefined}
      className={className}
      variants={staggerItem}
    >
      {children}
    </motion.div>
  );
}
