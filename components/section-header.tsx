"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { syne } from "@/lib/fonts";
import { motion, useReducedMotion } from "motion/react";
import type { Icon } from "@tabler/icons-react";

interface SectionHeaderProps {
  icon: Icon;
  label: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  /** Monospace index marker e.g. "02" — rendered as "02 — Label" */
  index?: string;
  /** @deprecated — accent is now unified; this prop is ignored */
  iconColor?: string;
  /** @deprecated — accent is now unified; this prop is ignored */
  highlightGradient?: string;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeader({
  label,
  title,
  highlight,
  subtitle,
  index,
  className,
  align = "center",
}: SectionHeaderProps) {
  const shouldReduceMotion = useReducedMotion();

  // Spring config for the hairline draw
  const hairlineSpring = {
    type: "spring" as const,
    stiffness: 100,
    damping: 20,
    delay: 0.08,
  };

  // Spring for the heading blur-rise
  const headingSpring = {
    type: "spring" as const,
    stiffness: 110,
    damping: 20,
    delay: 0.18,
  };

  // Spring for subtitle
  const subtitleSpring = {
    type: "spring" as const,
    stiffness: 110,
    damping: 22,
    delay: 0.26,
  };

  if (shouldReduceMotion) {
    // Reduced motion: render everything at final state instantly
    return (
      <div
        className={cn(
          "flex flex-col gap-2.5 mb-8",
          align === "center" && "items-center text-center",
          align === "left" && "items-start text-left",
          className
        )}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-400">
          {index ? `${index} — ` : ""}{label}
        </p>
        <div
          className={cn(
            "h-px bg-zinc-900/[0.07]",
            align === "center" ? "w-16 self-center" : "w-10 self-start"
          )}
          aria-hidden="true"
        />
        <h2
          className={cn(
            syne.className,
            "font-black text-zinc-950 leading-[1.05] tracking-[-0.04em] break-words min-w-0 text-balance"
          )}
          style={{ fontSize: "clamp(1.4rem, 3.4vw, 2.1rem)" }}
        >
          {title}
          {highlight && (
            <>
              {" "}
              <span className="text-zinc-400 font-light">{highlight}</span>
            </>
          )}
        </h2>
        {subtitle && (
          <p className="text-zinc-500 text-[14px] leading-[1.7] max-w-[60ch] mt-0.5 text-pretty">
            {subtitle}
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-2.5 mb-8",
        align === "center" && "items-center text-center",
        align === "left" && "items-start text-left",
        className
      )}
    >
      {/* 1. Mono index label — fades + slides in first */}
      <motion.p
        className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-400"
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0 }}
      >
        {index ? `${index} — ` : ""}{label}
      </motion.p>

      {/* 2. Hairline — draws from left (scaleX 0→1) */}
      <motion.div
        className={cn(
          "h-px bg-zinc-900/[0.07]",
          align === "center" ? "w-16 self-center" : "w-10 self-start"
        )}
        aria-hidden="true"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={hairlineSpring}
        style={{ transformOrigin: align === "center" ? "center" : "left" }}
      />

      {/* 3. Heading — blur-rise after hairline */}
      <motion.h2
        className={cn(
          syne.className,
          "font-black text-zinc-950 leading-[1.05] tracking-[-0.04em] break-words min-w-0 text-balance"
        )}
        style={{ fontSize: "clamp(1.4rem, 3.4vw, 2.1rem)" }}
        initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.15 }}
        transition={headingSpring}
      >
        {title}
        {highlight && (
          <>
            {" "}
            <span className="text-zinc-400 font-light">{highlight}</span>
          </>
        )}
      </motion.h2>

      {/* 4. Subtitle — blur-rise last */}
      {subtitle && (
        <motion.p
          className="text-zinc-500 text-[14px] leading-[1.7] max-w-[60ch] mt-0.5 text-pretty"
          initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.15 }}
          transition={subtitleSpring}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
