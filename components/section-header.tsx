"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { syne } from "@/lib/fonts";
import { motion } from "motion/react";
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      viewport={{ once: true, amount: 0.15 }}
      className={cn(
        "flex flex-col gap-2.5 mb-8",
        align === "center" && "items-center text-center",
        align === "left" && "items-start text-left",
        className
      )}
    >
      {/* Monospace editorial marker — 10px, unified mono label scale */}
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-400">
        {index ? `${index} — ` : ""}{label}
      </p>

      {/* Hairline under marker */}
      <div
        className={cn(
          "h-px bg-zinc-900/[0.07]",
          align === "center" ? "w-16 self-center" : "w-10 self-start"
        )}
        aria-hidden="true"
      />

      {/* Section title — unified Section Heading scale: clamp(1.4rem, 3.4vw, 2.1rem) */}
      <h2
        className={cn(
          syne.className,
          "font-black text-zinc-950 leading-[1.08] tracking-[-0.03em] break-words min-w-0"
        )}
        style={{ fontSize: "clamp(1.4rem, 3.4vw, 2.1rem)" }}
      >
        {title}
        {highlight && (
          <>
            {" "}
            <span className="text-zinc-400 font-light">
              {highlight}
            </span>
          </>
        )}
      </h2>

      {/* Subtitle — unified body scale, capped measure */}
      {subtitle && (
        <p className="text-muted-foreground text-[14px] leading-relaxed max-w-[60ch] mt-0.5">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
