"use client";

import type { Icon } from "@tabler/icons-react";
import { motion, useReducedMotion } from "motion/react";
import { premiumSpring, softSpring, viewportOnce } from "@/lib/motion";
import { SECTION_TITLE } from "@/lib/typography";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  align?: "left" | "center";
  className?: string;
  highlight?: string;
  /** @deprecated — accent is now unified; this prop is ignored */
  highlightGradient?: string;
  icon: Icon;
  /** @deprecated — accent is now unified; this prop is ignored */
  iconColor?: string;
  /** Monospace index marker e.g. "02" — rendered as "02 — Label" */
  index?: string;
  label: string;
  subtitle?: string;
  title: string;
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

  if (shouldReduceMotion) {
    return (
      <div
        className={cn(
          "mb-8 flex flex-col gap-2.5",
          align === "center" && "items-center text-center",
          align === "left" && "items-start text-left",
          className
        )}
      >
        <p className="ui-label text-muted-foreground">
          {index ? `${index} — ` : ""}
          {label}
        </p>
        <div
          aria-hidden="true"
          className={cn(
            "h-px bg-foreground/[0.07]",
            align === "center" ? "w-16 self-center" : "w-10 self-start"
          )}
        />
        <h2
          className={cn(
            "font-syne font-black leading-[1.05] tracking-[-0.04em] text-balance text-foreground break-words min-w-0"
          )}
          style={{ fontSize: SECTION_TITLE }}
        >
          {title}
          {highlight && (
            <>
              {" "}
              <span className="font-light text-muted-foreground">
                {highlight}
              </span>
            </>
          )}
        </h2>
        {subtitle && (
          <p className="mt-0.5 max-w-[60ch] text-[14px] leading-[1.7] text-pretty text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "mb-8 flex flex-col gap-2.5",
        align === "center" && "items-center text-center",
        align === "left" && "items-start text-left",
        className
      )}
    >
      <motion.p
        className="ui-label text-muted-foreground"
        initial={{ opacity: 0, y: 8 }}
        transition={{ ...premiumSpring, delay: 0 }}
        viewport={viewportOnce}
        whileInView={{ opacity: 1, y: 0 }}
      >
        {index ? `${index} — ` : ""}
        {label}
      </motion.p>

      <motion.div
        aria-hidden="true"
        className={cn(
          "h-px bg-foreground/[0.07]",
          align === "center" ? "w-16 self-center" : "w-10 self-start"
        )}
        initial={{ scaleX: 0 }}
        style={{ transformOrigin: align === "center" ? "center" : "left" }}
        transition={{ ...premiumSpring, delay: 0.06 }}
        viewport={viewportOnce}
        whileInView={{ scaleX: 1 }}
      />

      <motion.h2
        className={cn(
          "font-syne font-black leading-[1.05] tracking-[-0.04em] text-balance text-foreground break-words min-w-0"
        )}
        initial={{ opacity: 0, y: 14 }}
        style={{ fontSize: SECTION_TITLE }}
        transition={{ ...premiumSpring, delay: 0.12 }}
        viewport={viewportOnce}
        whileInView={{ opacity: 1, y: 0 }}
      >
        {title}
        {highlight && (
          <>
            {" "}
            <span className="font-light text-muted-foreground">
              {highlight}
            </span>
          </>
        )}
      </motion.h2>

      {subtitle && (
        <motion.p
          className="mt-0.5 max-w-[60ch] text-[14px] leading-[1.7] text-pretty text-muted-foreground"
          initial={{ opacity: 0, y: 10 }}
          transition={{ ...softSpring, delay: 0.18 }}
          viewport={viewportOnce}
          whileInView={{ opacity: 1, y: 0 }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
