"use client";

import { motion } from "motion/react";
import { softSpring, viewportOnce } from "@/lib/motion";
import { SECTION_TITLE } from "@/lib/typography";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  align?: "left" | "center";
  className?: string;
  highlight?: string;
  subtitle?: string;
  title: string;
}

export function SectionHeader({
  title,
  highlight,
  subtitle,
  className,
  align = "center",
}: SectionHeaderProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={cn(
        "mb-8 flex flex-col gap-3",
        align === "center"
          ? "items-center text-center"
          : "items-start text-left",
        className
      )}
      initial={reduce ? false : { opacity: 0.7, y: 8 }}
      transition={softSpring}
      viewport={viewportOnce}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <h2
        className="font-syne font-extrabold leading-[1.05] tracking-[-0.04em] text-balance text-foreground break-words min-w-0"
        style={{ fontSize: SECTION_TITLE }}
      >
        {title}
        {highlight && (
          <>
            {" "}
            <span className="font-normal text-muted-foreground">
              {highlight}
            </span>
          </>
        )}
      </h2>
      {subtitle && (
        <p className="max-w-[60ch] text-base leading-[1.7] text-pretty text-muted-foreground">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
