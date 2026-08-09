"use client";

import { IconMapPin } from "@tabler/icons-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import Image from "next/image";
import type React from "react";
import { useRef } from "react";
import { siteConfig } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";
import { cn } from "@/lib/utils";

// Spring config for the name clip-reveal
const nameLineSpring = {
  damping: 20,
  stiffness: 120,
  type: "spring" as const,
};

// Quick spring for avatar/pill/chips
const quickSpring = {
  damping: 22,
  stiffness: 140,
  type: "spring" as const,
};

// Container that staggers children
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.05,
      staggerChildren: 0.08,
    },
  },
};

// Chip/label items fade+rise
const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    transition: quickSpring,
    y: 0,
  },
};

// Clip-reveal: text rises up from below the overflow-hidden container
const nameLineVariants = {
  hidden: { opacity: 0, y: "105%" },
  visible: {
    opacity: 1,
    transition: nameLineSpring,
    y: "0%",
  },
};

// Role label + descriptor: blur-rise after name
const blurRiseVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    transition: { damping: 22, stiffness: 120, type: "spring" as const },
    y: 0,
  },
};

export function ProfileTile() {
  const { ref } = useSectionInView("Home", 0.5);
  const shouldReduceMotion = useReducedMotion();
  const tileRef = useRef<HTMLElement>(null);

  // Scroll-linked subtle parallax on the hero name
  const { scrollY } = useScroll();
  const rawY = useTransform(scrollY, [0, 400], [0, -14]);
  // Spring-smooth the scroll value; skip on reduced motion
  const springY = useSpring(rawY, { damping: 18, stiffness: 60 });

  // Immediate-visible variants (reduced motion path)
  const reducedItem = { opacity: 1, y: 0 };

  return (
    <section
      className="h-full min-h-[360px] p-5 sm:p-6 lg:p-8 flex flex-col gap-5 sm:gap-6 scroll-mt-28"
      id="home"
      ref={(node) => {
        // Assign both refs
        (ref as React.RefCallback<HTMLElement>)(node);
        (tileRef as React.MutableRefObject<HTMLElement | null>).current = node;
      }}
    >
      {/* Top row: Avatar + Available pill */}
      <motion.div
        animate="visible"
        className="flex items-start justify-between gap-4"
        initial={shouldReduceMotion ? reducedItem : "hidden"}
        variants={shouldReduceMotion ? undefined : containerVariants}
      >
        <motion.div variants={shouldReduceMotion ? undefined : itemVariants}>
          {/* Avatar */}
          <div
            className="avatar-ring relative w-[60px] h-[60px] sm:w-[68px] sm:h-[68px] rounded-2xl overflow-hidden flex-shrink-0
                       bg-gradient-to-br from-muted to-muted"
          >
            <Image
              alt={siteConfig.name}
              className="w-full h-full object-cover"
              height={68}
              priority
              src={siteConfig.images.profileImage}
              width={68}
            />
          </div>
        </motion.div>

        <motion.div variants={shouldReduceMotion ? undefined : itemVariants}>
          {/* Available pill */}
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                       bg-emerald-50 border border-emerald-200
                       dark:bg-emerald-500/10 dark:border-emerald-400/25
                       ui-label text-emerald-600 dark:text-emerald-400
                       whitespace-nowrap"
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
            </span>
            Available
          </span>
        </motion.div>
      </motion.div>

      {/* ── Editorial headline block ── */}
      <motion.div
        className="flex flex-col gap-2.5"
        // Scroll-linked parallax on whole name block; clamp keeps it from overflowing
        style={shouldReduceMotion ? undefined : { y: springY }}
      >
        {/* Monospace role marker */}
        <motion.p
          animate={shouldReduceMotion ? false : blurRiseVariants.visible}
          className="ui-label text-muted-foreground"
          initial={shouldReduceMotion ? false : blurRiseVariants.hidden}
          // Small delay so it follows after name starts
          transition={
            shouldReduceMotion
              ? undefined
              : { ...blurRiseVariants.visible.transition, delay: 0.05 }
          }
        >
          01 — Product Engineer
        </motion.p>

        {/* Oversized name headline — clip reveal line by line */}
        <div
          aria-label="Mukul Chugh"
          className={cn(
            "font-syne",
            "font-black tracking-[-0.05em] leading-[0.90] text-foreground"
          )}
          style={{ fontSize: "clamp(2rem, 8vw, 4.25rem)" }}
        >
          {/* Line 1: "Mukul" */}
          <div className="overflow-hidden">
            <motion.span
              animate="visible"
              className="block"
              initial={shouldReduceMotion ? false : "hidden"}
              variants={shouldReduceMotion ? undefined : nameLineVariants}
            >
              Mukul
            </motion.span>
          </div>
          {/* Line 2: "Chugh" — slightly delayed */}
          <div className="overflow-hidden">
            <motion.span
              animate="visible"
              className="block text-muted-foreground font-light"
              initial={shouldReduceMotion ? false : "hidden"}
              transition={
                shouldReduceMotion
                  ? undefined
                  : { ...nameLineSpring, delay: 0.1 }
              }
              variants={shouldReduceMotion ? undefined : nameLineVariants}
            >
              Chugh
            </motion.span>
          </div>
        </div>

        {/* Role descriptor — blur-rise after name */}
        <motion.p
          animate={shouldReduceMotion ? false : blurRiseVariants.visible}
          className="text-[14px] sm:text-[15px] text-muted-foreground leading-[1.7] max-w-[42ch]"
          initial={shouldReduceMotion ? false : blurRiseVariants.hidden}
          transition={
            shouldReduceMotion
              ? undefined
              : { ...blurRiseVariants.visible.transition, delay: 0.22 }
          }
        >
          Founding Engineer at{" "}
          <span className="text-foreground/90 font-medium">Quivly</span>
          {" — "}
          building end-to-end across mobile, full-stack, and AI.
        </motion.p>
      </motion.div>

      {/* Hairline divider */}
      <motion.div
        animate={shouldReduceMotion ? false : { scaleX: 1 }}
        aria-hidden="true"
        className="h-px bg-foreground/[0.06] w-full"
        initial={shouldReduceMotion ? false : { originX: 0, scaleX: 0 }}
        style={{ transformOrigin: "left" }}
        transition={
          shouldReduceMotion
            ? undefined
            : { damping: 20, delay: 0.32, stiffness: 90, type: "spring" }
        }
      />

      {/* Chips row — pushed to bottom */}
      <motion.div
        animate="visible"
        className="flex flex-col gap-3 mt-auto"
        initial={shouldReduceMotion ? false : "hidden"}
        // Start after name fully in
        transition={{ delayChildren: 0.36, staggerChildren: 0.07 }}
        variants={shouldReduceMotion ? undefined : containerVariants}
      >
        {/* Location + tag chips */}
        <motion.div
          className="flex flex-wrap gap-2"
          variants={shouldReduceMotion ? undefined : itemVariants}
        >
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                       bg-foreground/[0.04] border border-border
                       text-[12px] text-muted-foreground
                       [@media(hover:hover)]:hover:border-border [@media(hover:hover)]:hover:text-foreground/80
                       transition-colors duration-200 cursor-default select-none"
          >
            <IconMapPin
              className="text-muted-foreground flex-shrink-0"
              size={11}
            />
            India · SF hours
          </span>
          {(["Full-Stack", "Mobile", "Product"] as const).map((tag) => (
            <span
              className="px-3 py-1 rounded-full bg-foreground/[0.04] border border-border
                         text-[12px] text-muted-foreground
                         [@media(hover:hover)]:hover:border-border [@media(hover:hover)]:hover:text-foreground/80
                         transition-colors duration-200 cursor-default select-none"
              key={tag}
            >
              {tag}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
