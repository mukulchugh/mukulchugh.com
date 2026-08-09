import {
  IconApple,
  IconCompass,
  IconGitBranch,
  IconRobot,
  IconServer2,
} from "@tabler/icons-react";
import type { ComponentType } from "react";

export type PatternKind =
  | "circuit"
  | "dots"
  | "graph"
  | "grid"
  | "path"
  | "tree";

interface TopicFamily {
  icon: ComponentType<{
    color?: string;
    size?: number;
    strokeWidth?: number;
  }>;
  match: RegExp;
  pattern: PatternKind;
  tint: string;
}

// Topic families — each post's primary tag maps to one, driving the accent
// tint, the mark, and (in interactive covers) the generative pattern shape.
export const TOPIC_FAMILIES: TopicFamily[] = [
  {
    icon: IconRobot,
    match: /agent|ai|llm|rag|mcp|chat/i,
    pattern: "graph",
    tint: "rgba(147,130,255,0.16)",
  },
  {
    icon: IconApple,
    match: /ios|macos|watchos|swift|mobile|react native/i,
    pattern: "grid",
    tint: "rgba(96,180,255,0.14)",
  },
  {
    // Infrastructure/Performance/DevOps — server + database flavored.
    icon: IconServer2,
    match:
      /infrastructure|performance|devops|postgres|database|scaling|latency|deployment/i,
    pattern: "circuit",
    tint: "rgba(110,230,180,0.13)",
  },
  {
    // Developer Tools/Architecture/Git — tooling flavored, kept visually
    // distinct from the infra family above (different icon + pattern kind)
    // even though both used to share one regex.
    icon: IconGitBranch,
    match:
      /developer tools|architecture|\bgit\b|tooling|version control|open source/i,
    pattern: "tree",
    tint: "rgba(94,234,212,0.14)",
  },
  {
    icon: IconCompass,
    match: /career|product|portfolio/i,
    pattern: "path",
    tint: "rgba(255,180,110,0.15)",
  },
];

export function hashTitle(title: string): number {
  let h = 0;
  for (let i = 0; i < title.length; i++) {
    h = (h * 31 + title.charCodeAt(i)) >>> 0;
  }
  return h;
}

export function topicFamilyFor(tagNames: readonly string[]) {
  const joined = tagNames.join(" ");
  return TOPIC_FAMILIES.find((family) => family.match.test(joined));
}

// A small curated accent palette — used wherever a card needs a unique-but-tasteful
// color touch (project cards, experience avatars) beyond the topic tints above.
// Order mirrors TOPIC_FAMILIES so accentColorForTags below stays index-aligned.
const ACCENT_COLORS = [
  "rgb(147,130,255)", // violet — agents/AI
  "rgb(96,180,255)", // blue — mobile/platform
  "rgb(110,230,180)", // green — infrastructure/performance
  "rgb(94,234,212)", // teal — developer tools/architecture/git
  "rgb(255,180,110)", // amber — career/product
  "rgb(255,140,170)", // rose
  "rgb(140,220,255)", // cyan
] as const;

/** Deterministic accent color for a card — same input always gets the same color. */
export function accentColorFor(seedText: string): string {
  return ACCENT_COLORS[hashTitle(seedText) % ACCENT_COLORS.length];
}

/** Content-true accent: matches a card's tags to its topic family's hue when possible, falls back to a seeded hash otherwise. */
export function accentColorForTags(tagNames: readonly string[]): string {
  const joined = tagNames.join(" ");
  const familyIndex = TOPIC_FAMILIES.findIndex((family) =>
    family.match.test(joined)
  );
  return familyIndex >= 0
    ? ACCENT_COLORS[familyIndex % ACCENT_COLORS.length]
    : accentColorFor(joined);
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
