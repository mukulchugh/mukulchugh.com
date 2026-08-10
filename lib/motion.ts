/**
 * Shared Motion tokens for premium entry animations.
 * Docs: https://motion.dev/docs/react-scroll-animations + https://motion.dev/docs/stagger
 *
 * Rules:
 * - Animate only opacity + transform (GPU-friendly)
 * - Never animate filter/blur/width/height/top/left
 * - viewport.once so scroll doesn't re-trigger
 * - Always respect prefers-reduced-motion via useReducedMotion at call sites
 */

import { stagger, type Transition, type Variants } from "motion/react";

/** Soft spring — presence without bounce theater */
export const premiumSpring: Transition = {
  damping: 22,
  mass: 0.9,
  stiffness: 120,
  type: "spring",
};

export const softSpring: Transition = {
  damping: 26,
  mass: 0.85,
  stiffness: 160,
  type: "spring",
};

/**
 * Snappy micro-spring for small in-place state swaps (icon/label toggles,
 * e.g. a mail icon flipping to a checkmark on copy). Deliberately stiffer
 * than premiumSpring/softSpring — those are for section/tile entrances,
 * this is for an instant "acknowledge the click" swap. Previously three
 * near-identical ad-hoc versions of this same micro-swap spring had drifted
 * to slightly different numbers across cta-tile.tsx and socials-tile.tsx.
 */
export const microSpring: Transition = {
  damping: 24,
  stiffness: 320,
  type: "spring",
};

export const viewportOnce = {
  amount: 0.18,
  margin: "0px 0px -8% 0px",
  once: true,
} as const;

/** Single element rise */
export const riseVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    transition: premiumSpring,
    y: 0,
  },
};

/** Slightly stronger hero entrance */
export const heroRiseVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    transition: { ...premiumSpring, damping: 20, stiffness: 110 },
    y: 0,
  },
};

/** Parent orchestrator — stagger children via Motion stagger() */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: stagger(0.07, { startDelay: 0.04 }),
      when: "beforeChildren",
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: stagger(0.05, { startDelay: 0.02 }),
      when: "beforeChildren",
    },
  },
};

/** Child item used inside stagger containers */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    transition: softSpring,
    y: 0,
  },
};

export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
};

/** Scale-in for compact tiles (location / socials) */
export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.985, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: softSpring,
    y: 0,
  },
};
