"use client";

/**
 * Adapted from Manu Arora's Aceternity UI World Map:
 * https://ui.aceternity.com/components/world-map
 * https://ui.aceternity.com/registry/world-map.json
 * Aceternity License: https://ui.aceternity.com/licence
 * Modified for this portfolio end product; not a standalone component offering.
 * Geography: dotted-map 3.1.0, MIT, copyright Basile Bruneau.
 * Uses dotted-map's own projection for accurate pin alignment.
 */
import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { worldMapData } from "./world-map-data";

// Precomputed geography avoids shipping the country polygons or running their
// point-in-polygon calculations in the visitor's browser.
const { india, sanFrancisco } = worldMapData;
const connection = `M ${sanFrancisco.x} ${sanFrancisco.y} Q ${(sanFrancisco.x + india.x) / 2} ${Math.min(sanFrancisco.y, india.y) - 15} ${india.x} ${india.y}`;
const locations = [sanFrancisco, india];

export function WorldMap() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { amount: 0.5, once: true });
  const reducedMotion = useReducedMotion();
  const animate = inView && reducedMotion === false;

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none h-full w-full select-none"
      focusable="false"
      ref={ref}
      viewBox={`0 0 ${worldMapData.width} ${worldMapData.height}`}
    >
      <path
        className="stroke-foreground/20"
        d={worldMapData.dots}
        fill="none"
        strokeLinecap="round"
        strokeWidth="0.48"
      />
      <path
        className="stroke-foreground/20"
        d={connection}
        fill="none"
        strokeWidth="0.35"
      />
      <motion.path
        animate={{ pathLength: animate ? [0, 1] : 1 }}
        className="stroke-primary"
        d={connection}
        fill="none"
        initial={false}
        strokeLinecap="round"
        strokeWidth="0.6"
        transition={{ duration: animate ? 1.6 : 0, ease: "easeOut" }}
      />
      {locations.map((point) => (
        <g key={point.x}>
          <circle
            className="fill-primary/20"
            cx={point.x}
            cy={point.y}
            r="2.5"
          />
          <circle
            className="fill-primary stroke-foreground/50"
            cx={point.x}
            cy={point.y}
            r="1.1"
            strokeWidth="0.25"
          />
        </g>
      ))}
    </svg>
  );
}
