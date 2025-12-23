"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { syne } from "@/lib/fonts";
import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  icon: LucideIcon;
  label: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  iconColor?: string;
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
  iconColor = "#dd7bbb",
  highlightGradient = "from-[#dd7bbb] via-[#d79f1e] to-[#5a922c]",
  className,
  align = "center",
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className={cn(
        "flex flex-col gap-4 mb-10",
        align === "center" && "items-center text-center",
        align === "left" && "items-start text-left",
        className
      )}
    >
      {/* Icon and Label */}
      <div className="flex items-center gap-3">
        <div
          className="p-2 rounded-lg border"
          style={{
            backgroundColor: `${iconColor}10`,
            borderColor: `${iconColor}20`,
          }}
        >
          <Icon className="h-5 w-5" style={{ color: iconColor }} />
        </div>
        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
      </div>

      {/* Title with optional highlight */}
      <h2
        className={cn(
          syne.className,
          "text-3xl sm:text-4xl font-bold text-foreground leading-tight"
        )}
      >
        {title}
        {highlight && (
          <>
            {" "}
            <span
              className={cn(
                "bg-gradient-to-r bg-clip-text text-transparent",
                highlightGradient
              )}
            >
              {highlight}
            </span>
          </>
        )}
      </h2>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
