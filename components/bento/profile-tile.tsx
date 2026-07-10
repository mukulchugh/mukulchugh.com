"use client";

import Image from "next/image";
import React from "react";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
  IconMail,
  IconMapPin,
} from "@tabler/icons-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useSpring,
} from "motion/react";
import { useSectionInView } from "@/lib/hooks";
import { useActiveSectionContext } from "@/context/active-section-context";
import { siteConfig, introSocialLinks } from "@/lib/data";
import { cn } from "@/lib/utils";
import { syne } from "@/lib/fonts";
import { useRef } from "react";

const iconMap: Record<string, React.ElementType> = {
  IconBrandLinkedin,
  IconBrandGithub,
  IconBrandX,
};

// Spring config for the name clip-reveal
const nameLineSpring = {
  type: "spring" as const,
  stiffness: 120,
  damping: 20,
};

// Quick spring for avatar/pill/chips
const quickSpring = {
  type: "spring" as const,
  stiffness: 140,
  damping: 22,
};

// Container that staggers children
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

// Chip/label items fade+rise
const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: quickSpring,
  },
};

// Clip-reveal: text rises up from below the overflow-hidden container
const nameLineVariants = {
  hidden: { y: "105%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: nameLineSpring,
  },
};

// Role label + descriptor: blur-rise after name
const blurRiseVariants = {
  hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 120, damping: 22 },
  },
};

export function ProfileTile() {
  const { ref } = useSectionInView("Home", 0.5);
  const { setActiveSection, setTimeOfLastClick } = useActiveSectionContext();
  const shouldReduceMotion = useReducedMotion();
  const tileRef = useRef<HTMLElement>(null);

  // Scroll-linked subtle parallax on the hero name
  const { scrollY } = useScroll();
  const rawY = useTransform(scrollY, [0, 400], [0, -14]);
  // Spring-smooth the scroll value; skip on reduced motion
  const springY = useSpring(rawY, { stiffness: 60, damping: 18 });

  const handleContactClick = React.useCallback(() => {
    setActiveSection("Contact");
    setTimeOfLastClick(Date.now());
  }, [setActiveSection, setTimeOfLastClick]);

  // Immediate-visible variants (reduced motion path)
  const reducedItem = { opacity: 1, y: 0, filter: "blur(0px)" };

  return (
    <section
      ref={(node) => {
        // Assign both refs
        (ref as React.RefCallback<HTMLElement>)(node);
        (tileRef as React.MutableRefObject<HTMLElement | null>).current = node;
      }}
      id="home"
      className="h-full min-h-[360px] p-5 sm:p-6 lg:p-8 flex flex-col gap-5 sm:gap-6 scroll-mt-28"
    >
      {/* Top row: Avatar + Available pill */}
      <motion.div
        className="flex items-start justify-between gap-4"
        variants={shouldReduceMotion ? undefined : containerVariants}
        initial={shouldReduceMotion ? reducedItem : "hidden"}
        animate="visible"
      >
        <motion.div variants={shouldReduceMotion ? undefined : itemVariants}>
          {/* Avatar */}
          <div
            className="relative w-[60px] h-[60px] sm:w-[68px] sm:h-[68px] rounded-2xl overflow-hidden flex-shrink-0
                       bg-gradient-to-br from-zinc-100 to-zinc-200"
            style={{
              boxShadow: "0 0 0 1px rgba(20,20,40,0.08), 0 1px 2px rgba(28,25,23,0.06), 0 6px 20px -8px rgba(28,25,23,0.14)",
            }}
          >
            <Image
              src={siteConfig.images.profileImage}
              alt={siteConfig.name}
              width={68}
              height={68}
              priority
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        <motion.div variants={shouldReduceMotion ? undefined : itemVariants}>
          {/* Available pill */}
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                       bg-emerald-50 border border-emerald-200
                       text-[11px] font-semibold text-emerald-600 uppercase tracking-[0.1em]
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
          className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-400"
          initial={shouldReduceMotion ? false : blurRiseVariants.hidden}
          animate={shouldReduceMotion ? false : blurRiseVariants.visible}
          // Small delay so it follows after name starts
          transition={shouldReduceMotion ? undefined : { ...blurRiseVariants.visible.transition, delay: 0.05 }}
        >
          01 — Product Engineer
        </motion.p>

        {/* Oversized name headline — clip reveal line by line */}
        <div
          className={cn(
            syne.className,
            "font-black tracking-[-0.05em] leading-[0.90] text-zinc-950"
          )}
          style={{ fontSize: "clamp(2rem, 8vw, 4.25rem)" }}
          aria-label="Mukul Chugh"
        >
          {/* Line 1: "Mukul" */}
          <div className="overflow-hidden">
            <motion.span
              className="block"
              variants={shouldReduceMotion ? undefined : nameLineVariants}
              initial={shouldReduceMotion ? false : "hidden"}
              animate="visible"
            >
              Mukul
            </motion.span>
          </div>
          {/* Line 2: "Chugh" — slightly delayed */}
          <div className="overflow-hidden">
            <motion.span
              className="block text-zinc-400 font-light"
              variants={shouldReduceMotion ? undefined : nameLineVariants}
              initial={shouldReduceMotion ? false : "hidden"}
              animate="visible"
              transition={
                shouldReduceMotion
                  ? undefined
                  : { ...nameLineSpring, delay: 0.10 }
              }
            >
              Chugh
            </motion.span>
          </div>
        </div>

        {/* Role descriptor — blur-rise after name */}
        <motion.p
          className="text-[14px] sm:text-[15px] text-zinc-600 leading-[1.7] max-w-[42ch]"
          initial={shouldReduceMotion ? false : blurRiseVariants.hidden}
          animate={shouldReduceMotion ? false : blurRiseVariants.visible}
          transition={
            shouldReduceMotion
              ? undefined
              : { ...blurRiseVariants.visible.transition, delay: 0.22 }
          }
        >
          Founding Engineer at{" "}
          <span className="text-zinc-800 font-medium">Quivly</span>
          {" — "}
          building end-to-end across mobile, full-stack, and AI.
        </motion.p>
      </motion.div>

      {/* Hairline divider */}
      <motion.div
        className="h-px bg-zinc-900/[0.06] w-full"
        aria-hidden="true"
        initial={shouldReduceMotion ? false : { scaleX: 0, originX: 0 }}
        animate={shouldReduceMotion ? false : { scaleX: 1 }}
        transition={
          shouldReduceMotion
            ? undefined
            : { type: "spring", stiffness: 90, damping: 20, delay: 0.32 }
        }
        style={{ transformOrigin: "left" }}
      />

      {/* Chips row — pushed to bottom */}
      <motion.div
        className="flex flex-col gap-3 mt-auto"
        variants={shouldReduceMotion ? undefined : containerVariants}
        initial={shouldReduceMotion ? false : "hidden"}
        animate="visible"
        // Start after name fully in
        transition={{ delayChildren: 0.36, staggerChildren: 0.07 }}
      >
        {/* Location + tag chips */}
        <motion.div
          variants={shouldReduceMotion ? undefined : itemVariants}
          className="flex flex-wrap gap-2"
        >
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                       bg-black/[0.03] border border-black/[0.06]
                       text-[12px] text-zinc-500
                       [@media(hover:hover)]:hover:border-black/[0.12] [@media(hover:hover)]:hover:text-zinc-700
                       transition-colors duration-200 cursor-default select-none"
          >
            <IconMapPin size={11} className="text-zinc-400 flex-shrink-0" />
            India · SF hours
          </span>
          {(["Full-Stack", "Mobile", "Product"] as const).map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full bg-black/[0.03] border border-black/[0.06]
                         text-[12px] text-zinc-500
                         [@media(hover:hover)]:hover:border-black/[0.12] [@media(hover:hover)]:hover:text-zinc-700
                         transition-colors duration-200 cursor-default select-none"
            >
              {tag}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
