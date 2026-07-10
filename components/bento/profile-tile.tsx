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
import { motion, useReducedMotion } from "motion/react";
import { useSectionInView } from "@/lib/hooks";
import { useActiveSectionContext } from "@/context/active-section-context";
import { siteConfig, introSocialLinks } from "@/lib/data";
import { cn } from "@/lib/utils";
import { syne } from "@/lib/fonts";

const iconMap: Record<string, React.ElementType> = {
  IconBrandLinkedin,
  IconBrandGithub,
  IconBrandX,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 20 },
  },
};

export function ProfileTile() {
  const { ref } = useSectionInView("Home", 0.5);
  const { setActiveSection, setTimeOfLastClick } = useActiveSectionContext();
  const shouldReduceMotion = useReducedMotion();

  const handleContactClick = React.useCallback(() => {
    setActiveSection("Contact");
    setTimeOfLastClick(Date.now());
  }, [setActiveSection, setTimeOfLastClick]);

  return (
    <section
      ref={ref}
      id="home"
      className="h-full min-h-[360px] p-5 sm:p-6 lg:p-8 flex flex-col gap-5 sm:gap-6 scroll-mt-28"
    >
      {/* Top row: Avatar + Available pill */}
      <motion.div
        className="flex items-start justify-between gap-4"
        variants={shouldReduceMotion ? undefined : containerVariants}
        initial="hidden"
        animate="visible"
        viewport={{ once: true, amount: 0.15 }}
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
        variants={shouldReduceMotion ? undefined : containerVariants}
        initial="hidden"
        animate="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        {/* Monospace role marker — unified 10px mono label */}
        <motion.p
          variants={shouldReduceMotion ? undefined : itemVariants}
          className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-400"
        >
          01 — Product Engineer
        </motion.p>

        {/* Oversized name headline — unified Display scale */}
        <motion.h1
          variants={shouldReduceMotion ? undefined : itemVariants}
          className={cn(
            syne.className,
            "font-black tracking-[-0.05em] leading-[0.90] text-zinc-950"
          )}
          style={{ fontSize: "clamp(2rem, 8vw, 4.25rem)" }}
        >
          Mukul
          <br />
          <span className="text-zinc-400 font-light">Chugh</span>
        </motion.h1>

        {/* Role descriptor — unified body scale, capped measure */}
        <motion.p
          variants={shouldReduceMotion ? undefined : itemVariants}
          className="text-[14px] sm:text-[15px] text-zinc-600 leading-[1.7] max-w-[42ch]"
        >
          Founding Engineer at{" "}
          <span className="text-zinc-800 font-medium">Quivly</span>
          {" — "}
          building end-to-end across mobile, full-stack, and AI.
        </motion.p>
      </motion.div>

      {/* Hairline divider */}
      <div className="h-px bg-zinc-900/[0.06] w-full" aria-hidden="true" />

      {/* Chips row — pushed to bottom */}
      <motion.div
        className="flex flex-col gap-3 mt-auto"
        variants={shouldReduceMotion ? undefined : containerVariants}
        initial="hidden"
        animate="visible"
        viewport={{ once: true, amount: 0.15 }}
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
