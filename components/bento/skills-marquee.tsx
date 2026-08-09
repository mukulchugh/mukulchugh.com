"use client";

import { motion, useReducedMotion } from "motion/react";
import React, { memo } from "react";
import { skillsData } from "@/lib/data";

// Double the array for seamless loop
const ITEMS = [...skillsData, ...skillsData];

const MarqueeTrack = memo(function MarqueeTrack() {
  const shouldReduce = useReducedMotion();

  return (
    <div className="relative overflow-hidden w-full">
      {/* Left fade — uses the card token so it blends in both themes */}
      <div
        aria-hidden="true"
        className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, hsl(var(--card)) 0%, transparent 100%)",
        }}
      />
      {/* Right fade */}
      <div
        aria-hidden="true"
        className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to left, hsl(var(--card)) 0%, transparent 100%)",
        }}
      />

      <motion.div
        animate={
          shouldReduce
            ? undefined
            : {
                x: ["0%", "-50%"],
              }
        }
        aria-hidden="true"
        className="flex items-center gap-0 whitespace-nowrap"
        transition={
          shouldReduce
            ? undefined
            : {
                duration: 32,
                ease: "linear",
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
              }
        }
      >
        {ITEMS.map((skill, i) => (
          <React.Fragment key={`${skill}-${i}`}>
            <span className="ui-label select-none px-4 text-muted-foreground">
              {skill}
            </span>
            <span
              aria-hidden="true"
              className="w-px h-3 bg-foreground/20 flex-shrink-0"
            />
          </React.Fragment>
        ))}
      </motion.div>

      {/* Screenreader-friendly accessible list */}
      <span className="sr-only">Tech stack: {skillsData.join(", ")}</span>
    </div>
  );
});

export function SkillsMarquee() {
  return (
    <div className="h-full flex flex-col justify-center gap-3 py-5 px-0 relative">
      {/* Section marker */}
      <p className="ui-label px-6 text-muted-foreground">02 — Stack</p>
      <MarqueeTrack />
    </div>
  );
}
