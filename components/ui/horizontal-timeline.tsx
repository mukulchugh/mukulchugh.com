"use client";

import {
  useScroll,
  useTransform,
  motion,
  useSpring,
  MotionValue,
} from "motion/react";
import React, { useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { syne } from "@/lib/fonts";
import { useTheme } from "@/context/theme-context";

interface TimelineEntry {
  readonly title: string;
  readonly company: string;
  readonly location: string;
  readonly date: string;
  readonly description?: readonly string[];
  readonly icon: string;
}

// Timeline icon with year - centered on the line
function TimelineIcon({
  index,
  total,
  progress,
  icon,
  company,
  date,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
  icon: string;
  company: string;
  date: string;
}) {
  // Icon is visible when progress is near this index
  const iconOpacity = useTransform(
    progress,
    [
      (index - 0.3) / total,
      index / total,
      (index + 0.7) / total,
      (index + 1) / total,
    ],
    [0, 1, 1, 0]
  );

  const iconScale = useTransform(
    progress,
    [(index - 0.3) / total, index / total, (index + 0.7) / total],
    [0.8, 1, 1]
  );

  // Extract year from date string (e.g., "November 2025 - Present" -> "2025")
  const yearMatch = date.match(/\d{4}/);
  const year = yearMatch ? yearMatch[0] : "";

  return (
    <motion.div
      className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center"
      style={{ opacity: iconOpacity, scale: iconScale }}
    >
      {/* Icon circle on the line */}
      <div className="w-16 h-16 rounded-full bg-white dark:bg-neutral-900 border-4 border-purple-500 overflow-hidden flex items-center justify-center shadow-lg">
        <Image
          src={icon}
          alt={company}
          width={40}
          height={40}
          className="object-contain rounded-full"
        />
      </div>
      {/* Year label below icon */}
      <span className={cn(syne.className, "mt-3 text-lg font-bold text-neutral-500 dark:text-neutral-400")}>
        {year}
      </span>
    </motion.div>
  );
}

// Timeline card - centered below the icon
function TimelineCard({
  item,
  index,
  progress,
  total,
}: {
  item: TimelineEntry;
  index: number;
  progress: MotionValue<number>;
  total: number;
}) {
  const { theme } = useTheme();

  // Card is visible when progress is near this index
  const cardOpacity = useTransform(
    progress,
    [
      (index - 0.3) / total,
      index / total,
      (index + 0.7) / total,
      (index + 1) / total,
    ],
    [0, 1, 1, 0]
  );

  const cardY = useTransform(
    progress,
    [(index - 0.3) / total, index / total, (index + 0.7) / total],
    [20, 0, 0]
  );

  return (
    <motion.div
      className="absolute left-1/2 -translate-x-1/2 w-full max-w-lg px-4"
      style={{ opacity: cardOpacity, y: cardY }}
    >
      {/* Card - same styling as vertical timeline */}
      <div
        className={cn(
          "relative p-6 rounded-lg border shadow-none",
          theme === "light"
            ? "bg-gray-100 border-black/5"
            : "bg-white/5 border-white/10"
        )}
      >
        {/* Date */}
        <span className="text-sm text-gray-500 dark:text-gray-400 block mb-2">
          {item.date}
        </span>

        {/* Title */}
        <h3 className={cn(syne.className, "font-semibold capitalize text-xl")}>
          {item.title}
        </h3>

        {/* Company & Location */}
        <p className="font-normal text-sm text-gray-500 mt-1">
          {item.company} | {item.location}
        </p>

        {/* Description */}
        {item.description && (
          <div className="mt-4 font-normal text-gray-700 dark:text-white/75 text-sm space-y-1">
            {item.description.map((desc, idx) => (
              <p key={idx} className="mb-1">
                - {desc}
              </p>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export const HorizontalTimeline = ({
  data,
}: {
  data: readonly TimelineEntry[];
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth spring for better scroll feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Timeline progress line
  const lineWidth = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: `${data.length * 100}vh` }}
    >
      {/* Sticky container */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Timeline section - centered vertically */}
        <div className="w-full max-w-2xl mx-auto">
          {/* Timeline line */}
          <div className="relative h-[2px] mx-8">
            {/* Background line */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%]" />
            {/* Animated progress line */}
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 via-blue-500 to-transparent"
              style={{ width: lineWidth }}
            />
          </div>

          {/* Icon with year - centered on the line */}
          <div className="relative h-24 -mt-8">
            {data.map((item, index) => (
              <TimelineIcon
                key={index}
                index={index}
                total={data.length}
                progress={smoothProgress}
                icon={item.icon}
                company={item.company}
                date={item.date}
              />
            ))}
          </div>
        </div>

        {/* Card section - centered below */}
        <div className="relative w-full mt-8 h-64">
          {data.map((item, index) => (
            <TimelineCard
              key={index}
              item={item}
              index={index}
              progress={smoothProgress}
              total={data.length}
            />
          ))}
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500"
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-xs font-medium">Scroll to explore</span>
          <svg
            className="w-5 h-5 animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </div>
    </div>
  );
};
