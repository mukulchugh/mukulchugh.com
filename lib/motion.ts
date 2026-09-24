/**
 * Shared Motion tokens for premium entry animations.
 * Docs: https://motion.dev/docs/react-scroll-animations + https://motion.dev/docs/stagger
 *
 * Rules:
 * - Prefer opacity + transform for routine feedback
 * - Confine masks/light effects to authored artwork; never distort reading text
 * - Avoid layout-driven animation outside bounded, user-triggered transitions
 * - viewport.once so scroll doesn't re-trigger
 * - Always respect prefers-reduced-motion via useReducedMotion at call sites
 */

import { stagger, type Transition, type Variants } from "motion/react";

/** Soft spring — presence without bounce theater */
export const premiumSpring = {
  damping: 32,
  mass: 1,
  stiffness: 260,
  type: "spring",
} satisfies Transition;

export const softSpring: Transition = {
  damping: 30,
  mass: 0.8,
  stiffness: 300,
  type: "spring",
};

/**
 * Snappy micro-spring for small in-place state swaps (icon/label toggles,
 * e.g. a mail icon flipping to a checkmark on copy). Deliberately stiffer
 * than premiumSpring/softSpring — those are for section/tile entrances,
 * this is for an instant "acknowledge the click" swap. Previously three
 * near-identical ad-hoc versions of this same micro-swap spring had drifted
 * to slightly different numbers across the tiles that used it.
 */
export const microSpring: Transition = {
  damping: 28,
  mass: 0.5,
  stiffness: 480,
  type: "spring",
};

/** Pointer followers retain velocity when the target changes mid-flight. */
export const pointerSpring = { damping: 26, mass: 0.6, stiffness: 280 };

/** Fixed dock slots keep the pointer distance independent of icon scaling. */
export function dockProximity(pointerX: number, centerX: number) {
  return Math.max(0, 1 - Math.abs(pointerX - centerX) / 120);
}

export const fadeTransition: Transition = {
  duration: 0.16,
  ease: [0.16, 1, 0.3, 1],
  type: "tween",
};

export const viewportOnce = {
  amount: "some",
  margin: "0px 0px -32px 0px",
  once: true,
} as const;

/** Single element rise */
export const riseVariants: Variants = {
  hidden: { opacity: 0.7, y: 10 },
  visible: {
    opacity: 1,
    transition: premiumSpring,
    y: 0,
  },
};

/** Slightly stronger hero entrance */
export const heroRiseVariants: Variants = {
  hidden: { opacity: 1, y: 0 },
  visible: {
    opacity: 1,
    transition: premiumSpring,
    y: 0,
  },
};

/** Parent orchestrator — stagger children via Motion stagger() */
export const staggerContainer: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: stagger(0.035),
      when: "beforeChildren",
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: stagger(0.025),
      when: "beforeChildren",
    },
  },
};

/** Child item used inside stagger containers */
export const staggerItem: Variants = {
  hidden: { opacity: 0.7, y: 8 },
  visible: {
    opacity: 1,
    transition: softSpring,
    y: 0,
  },
};

export const fadeVariants: Variants = {
  hidden: { opacity: 0.7 },
  visible: {
    opacity: 1,
    transition: fadeTransition,
  },
};

/** Scale-in for compact tiles (location / socials) */
export const scaleInVariants: Variants = {
  hidden: { opacity: 0.7, scale: 0.995, y: 6 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: softSpring,
    y: 0,
  },
};
