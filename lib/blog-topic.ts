import {
  IconApple,
  IconCompass,
  IconGitBranch,
  IconNotes,
  IconRobot,
  IconServer2,
} from "@tabler/icons-react";
import type { ComponentType, CSSProperties } from "react";

// Retained purely as a stable per-family label key (e.g. for the project
// page's "eyebrow" text) — the cover itself now draws a single constellation
// motif for every family, so this no longer selects a draw routine.
export type PatternKind =
  | "circuit"
  | "dots"
  | "graph"
  | "grid"
  | "path"
  | "tree";

interface TopicFamily {
  /** Canvas-space RGB triplet — used to tint the constellation lines and the
   * icon watermark so each topic reads as a distinct hue, not just a distinct
   * shape. */
  accent: readonly [number, number, number];
  icon: ComponentType<{
    "aria-hidden"?: boolean | "true" | "false";
    className?: string;
    color?: string;
    size?: number;
    strokeWidth?: number;
    style?: CSSProperties;
  }>;
  match: RegExp;
  pattern: PatternKind;
  /** CSS color for the corner ambient glow behind the card. */
  tint: string;
}

// Topic families — each post's tags map to one, driving the accent color,
// the watermark icon, and the constellation line tint. A post always falls
// into a family (FALLBACK_FAMILY below covers anything unmatched), so a
// cover is never "undressed."
export const TOPIC_FAMILIES: TopicFamily[] = [
  {
    accent: [147, 130, 255],
    icon: IconRobot,
    match: /agent|ai|llm|rag|mcp|chat/i,
    pattern: "graph",
    tint: "rgba(147,130,255,0.32)",
  },
  {
    accent: [96, 180, 255],
    icon: IconApple,
    match: /ios|macos|watchos|swift|mobile|react native/i,
    pattern: "grid",
    tint: "rgba(96,180,255,0.3)",
  },
  {
    // Infrastructure/Performance/DevOps — server + database flavored.
    accent: [110, 230, 180],
    icon: IconServer2,
    match:
      /infrastructure|performance|devops|postgres|database|scaling|latency|deployment/i,
    pattern: "circuit",
    tint: "rgba(110,230,180,0.28)",
  },
  {
    // Developer Tools/Architecture/Git — kept visually distinct from the
    // infra family above (different icon + hue) even though both are
    // "engineering" in a loose sense.
    accent: [94, 234, 212],
    icon: IconGitBranch,
    match:
      /developer tools|architecture|\bgit\b|tooling|version control|open source/i,
    pattern: "tree",
    tint: "rgba(94,234,212,0.28)",
  },
  {
    accent: [255, 180, 110],
    icon: IconCompass,
    match: /career|product|portfolio/i,
    pattern: "path",
    tint: "rgba(255,180,110,0.3)",
  },
];

// Anything that doesn't match a known family still gets a designed cover,
// never a blank slate or a bare initial letter.
const FALLBACK_FAMILY: TopicFamily = {
  accent: [180, 180, 190],
  icon: IconNotes,
  match: /(?:)/,
  pattern: "dots",
  tint: "rgba(180,180,190,0.22)",
};

export function hashTitle(title: string): number {
  let h = 0;
  for (let i = 0; i < title.length; i++) {
    h = (h * 31 + title.charCodeAt(i)) >>> 0;
  }
  return h;
}

export function topicFamilyFor(tagNames: readonly string[]): TopicFamily {
  const joined = tagNames.join(" ");
  return (
    TOPIC_FAMILIES.find((family) => family.match.test(joined)) ??
    FALLBACK_FAMILY
  );
}

// A small curated accent palette for contexts with no topic to match against
// (e.g. experience-card company names) — kept separate from TOPIC_FAMILIES
// so arbitrary seed text still gets real color variety instead of collapsing
// onto the fallback gray.
const SEED_ACCENT_COLORS = [
  "rgb(147,130,255)",
  "rgb(96,180,255)",
  "rgb(110,230,180)",
  "rgb(94,234,212)",
  "rgb(255,180,110)",
  "rgb(255,140,170)",
  "rgb(140,220,255)",
] as const;

/** Deterministic accent color for a card — same input always gets the same color. */
export function accentColorFor(seedText: string): string {
  return SEED_ACCENT_COLORS[hashTitle(seedText) % SEED_ACCENT_COLORS.length];
}

/** Content-true accent: matches a card's tags to its topic family's hue when possible, falls back to a seeded hash otherwise. */
export function accentColorForTags(tagNames: readonly string[]): string {
  const [r, g, b] = topicFamilyFor(tagNames).accent;
  return `rgb(${r},${g},${b})`;
}

/** mulberry32 — tiny seeded PRNG so each post's generative pattern is deterministic. */
export function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d_2b_79_f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
}
