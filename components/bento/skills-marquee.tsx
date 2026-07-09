"use client";

import React, { memo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { skillsData } from "@/lib/data";

// Double the array for seamless loop
const ITEMS = [...skillsData, ...skillsData];

const MarqueeTrack = memo(function MarqueeTrack() {
  const shouldReduce = useReducedMotion();

  return (
    <div className="relative overflow-hidden w-full">
      {/* Left fade */}
      <div
        className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, hsl(40 30% 98%) 0%, transparent 100%)",
        }}
        aria-hidden="true"
      />
      {/* Right fade */}
      <div
        className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to left, hsl(40 30% 98%) 0%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      <motion.div
        className="flex items-center gap-0 whitespace-nowrap"
        animate={
          shouldReduce
            ? undefined
            : {
                x: ["0%", "-50%"],
              }
        }
        transition={
          shouldReduce
            ? undefined
            : {
                duration: 32,
                ease: "linear",
                repeat: Infinity,
                repeatType: "loop",
              }
        }
        aria-hidden="true"
      >
        {ITEMS.map((skill, i) => (
          <React.Fragment key={`${skill}-${i}`}>
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400 px-4 select-none">
              {skill}
            </span>
            <span
              className="w-px h-3 bg-zinc-300 flex-shrink-0"
              aria-hidden="true"
            />
          </React.Fragment>
        ))}
      </motion.div>

      {/* Screenreader-friendly accessible list */}
      <span className="sr-only">
        Tech stack: {skillsData.join(", ")}
      </span>
    </div>
  );
});

export function SkillsMarquee() {
  return (
    <div className="h-full flex flex-col justify-center gap-3 py-5 px-0 relative">
      {/* Section marker */}
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-400 px-6">
        02 — Stack
      </p>
      <MarqueeTrack />
    </div>
  );
}
