"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { IconArrowUpRight, IconFileText, IconCalendar } from "@tabler/icons-react";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { CalBookingModal } from "@/components/ui/cal-booking-modal";
import { useSectionInView } from "@/lib/hooks";
import { siteConfig } from "@/lib/data";
import { cn } from "@/lib/utils";
import { syne } from "@/lib/fonts";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 20 },
  },
};

export function CTATile() {
  const { ref } = useSectionInView("Contact");
  const shouldReduce = useReducedMotion();
  const [calOpen, setCalOpen] = useState(false);

  return (
    <>
      {/* ── Cal.com booking modal ── */}
      <CalBookingModal isOpen={calOpen} onClose={() => setCalOpen(false)} />

      {/*
       * ── Inverted anchor tile — zinc-950 dark background ──
       * This is the ONE strong black contrast block that gives
       * the light bento grid its focal weight (Move 5).
       */}
      <section
        ref={ref}
        id="contact"
        className="h-full min-h-[240px] scroll-mt-28 relative overflow-hidden rounded-3xl"
        style={{ background: "rgb(9,9,11)" }}
      >
        {/* Subtle noise texture on dark bg */}
        <div
          className="absolute inset-0 pointer-events-none grain-overlay opacity-[0.035]"
          aria-hidden="true"
        />

        {/* Faint radial glow — off-white, top-left — adds depth without color */}
        <div
          className="absolute -top-24 -left-24 w-[480px] h-[480px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.045) 0%, transparent 65%)",
          }}
          aria-hidden="true"
        />

        {/* Inner content — consistent padding rhythm */}
        <motion.div
          className="relative z-10 h-full flex flex-col lg:flex-row lg:items-center justify-between
                     gap-6 sm:gap-8 p-6 sm:p-8 lg:p-10"
          variants={shouldReduce ? undefined : containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {/* Left — editorial statement */}
          <div className="flex flex-col gap-3 max-w-xl">
            {/* Mono marker — unified 10px label */}
            <motion.p
              variants={shouldReduce ? undefined : itemVariants}
              className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/30"
            >
              06 — Contact
            </motion.p>

            {/* Big statement — clamp(1.6rem, 4.2vw, 2.6rem) */}
            <motion.h2
              variants={shouldReduce ? undefined : itemVariants}
              className={cn(
                syne.className,
                "font-black tracking-[-0.035em] leading-[0.95] text-white"
              )}
              style={{ fontSize: "clamp(1.6rem, 4.2vw, 2.6rem)" }}
            >
              Let&apos;s build
              <br />
              <span className="text-white/40 font-light">something</span>
              <br />
              <span className="text-white">together.</span>
            </motion.h2>

            {/* Body — 14px muted, capped measure */}
            <motion.p
              variants={shouldReduce ? undefined : itemVariants}
              className="text-[14px] text-white/40 leading-relaxed max-w-[44ch]"
            >
              Have a problem worth solving? I want to hear about it.
            </motion.p>

            {/* Email hint — meta 12px */}
            <motion.p
              variants={shouldReduce ? undefined : itemVariants}
              className="font-mono text-[12px] text-white/25 tracking-wide break-all"
            >
              {siteConfig.email.display}
            </motion.p>
          </div>

          {/* Right — CTAs — min-h 44px for touch targets */}
          <motion.div
            variants={shouldReduce ? undefined : itemVariants}
            className="flex flex-wrap items-start gap-3 flex-shrink-0"
          >
            {/* Primary — opens Cal.com booking modal
                MagneticButton no-ops on touch (pointer events handled via mouse events) */}
            <MagneticButton
              as="button"
              onClick={() => setCalOpen(true)}
              aria-label="Book a call"
              strength={shouldReduce ? 0 : 12}
              className="inline-flex items-center gap-2 px-6 py-3 min-h-[44px] rounded-full
                         bg-white text-zinc-950
                         text-[13px] font-bold tracking-tight
                         shadow-[0_4px_28px_-4px_rgba(255,255,255,0.18)]
                         [@media(hover:hover)]:hover:shadow-[0_4px_36px_-4px_rgba(255,255,255,0.28)]
                         transition-shadow duration-200
                         active:scale-[0.97]"
            >
              <IconCalendar size={15} />
              Get in touch
            </MagneticButton>

            {/* Secondary — resume */}
            <MagneticButton
              href={siteConfig.files.cv}
              as="a"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View resume"
              strength={shouldReduce ? 0 : 10}
              className="inline-flex items-center gap-2 px-6 py-3 min-h-[44px] rounded-full
                         bg-white/[0.07] border border-white/[0.14]
                         text-[13px] font-semibold text-white/80
                         [@media(hover:hover)]:hover:bg-white/[0.12]
                         [@media(hover:hover)]:hover:border-white/[0.24]
                         [@media(hover:hover)]:hover:text-white
                         transition-all duration-200
                         active:scale-[0.97]"
            >
              <IconFileText size={15} />
              View Resume
              <IconArrowUpRight size={13} className="opacity-60" />
            </MagneticButton>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
