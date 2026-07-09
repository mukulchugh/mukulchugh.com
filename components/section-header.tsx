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
  /** @deprecated — accent is now unified; this prop is ignored */
  iconColor?: string;
  /** @deprecated — accent is now unified; this prop is ignored */
  highlightGradient?: string;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeader({
  icon: Icon,
  label,
  title,
  highlight,
  subtitle,
  className,
  align = "center",
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-40px" }}
      className={cn(
        "flex flex-col gap-3 mb-10",
        align === "center" && "items-center text-center",
        align === "left" && "items-start text-left",
        className
      )}
    >
      {/* Icon + label pill */}
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 rounded-md bg-zinc-100 border border-zinc-200 ring-0">
          <Icon className="h-4 w-4 text-zinc-500" />
        </div>
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.12em]">
          {label}
        </span>
      </div>

      {/* Title with optional highlight */}
      <h2
        className={cn(
          syne.className,
          "text-[2rem] sm:text-[2.5rem] font-bold text-foreground leading-[1.15] tracking-tight"
        )}
      >
        {title}
        {highlight && (
          <>
            {" "}
            <span className="text-foreground font-semibold">
              {highlight}
            </span>
          </>
        )}
      </h2>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-muted-foreground text-[15px] leading-relaxed max-w-[48ch] mt-1">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
