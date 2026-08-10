"use client";

import {
  IconArrowUpRight,
  IconBrandGithub,
  IconExternalLink,
} from "@tabler/icons-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, useState } from "react";
import { ProjectPeekModal } from "@/components/bento/project-peek-modal";
import type { projectsData } from "@/lib/data";
import { TILE_DISPLAY } from "@/lib/typography";
import { cn } from "@/lib/utils";

type ProjectData = (typeof projectsData)[number];

// Per-project cover config — monochrome editorial typography
const COVERS = [
  {
    // OpenKVM — deep graphite
    bgFrom: "rgb(12,12,14)",
    bgTo: "rgb(28,28,32)",
    categoryLabel: "macOS · Open Source",
    labelBg: "bg-white/[0.08] border-white/[0.14]",
    labelColor: "text-white/55",
    subtitleColor: "rgba(255,255,255,0.22)",
    titleColor: "rgba(255,255,255,0.92)",
  },
  {
    // Brik — slightly lighter graphite
    bgFrom: "rgb(17,17,17)",
    bgTo: "rgb(37,37,37)",
    categoryLabel: "React Native · SDK",
    labelBg: "bg-white/[0.08] border-white/[0.14]",
    labelColor: "text-white/55",
    subtitleColor: "rgba(255,255,255,0.22)",
    titleColor: "rgba(255,255,255,0.92)",
  },
  {
    // Ferry — cool slate
    bgFrom: "rgb(14,15,17)",
    bgTo: "rgb(30,32,36)",
    categoryLabel: "macOS · watchOS",
    labelBg: "bg-white/[0.08] border-white/[0.14]",
    labelColor: "text-white/55",
    subtitleColor: "rgba(255,255,255,0.22)",
    titleColor: "rgba(255,255,255,0.92)",
  },
  {
    // Quivly Skills — warm graphite
    bgFrom: "rgb(16,14,12)",
    bgTo: "rgb(34,30,28)",
    categoryLabel: "AI Agents · Open Source",
    labelBg: "bg-white/[0.08] border-white/[0.14]",
    labelColor: "text-white/55",
    subtitleColor: "rgba(255,255,255,0.22)",
    titleColor: "rgba(255,255,255,0.92)",
  },
] as const;

interface FeaturedProjectTileProps {
  index?: number;
  project: ProjectData;
}

export function FeaturedProjectTile({
  project,
  index = 0,
}: FeaturedProjectTileProps) {
  const cover = COVERS[index % COVERS.length];
  const shouldReduceMotion = useReducedMotion();
  const tileRef = useRef<HTMLDivElement>(null);
  const [peekOpen, setPeekOpen] = useState(false);

  // Scroll-linked parallax for the oversized wordmark
  // Tracks the tile element itself so each card gets its own scroll context
  const { scrollYProgress } = useScroll({
    offset: ["start end", "end start"],
    target: tileRef,
  });

  // Clamp displacement to ≤24px; spring-smooth
  const rawY = useTransform(scrollYProgress, [0, 1], [16, -16]);
  const springY = useSpring(rawY, { damping: 20, stiffness: 50 });

  // Whisper scale for cover art on hover — subtle (1 → 1.025)
  // Cover scale on hover (no useMotionValue — use Tailwind group-hover via CSS)
  // We drive this via CSS transition to avoid JS motion on hover for cover art

  return (
    <div
      className="h-full flex flex-col min-h-[200px] relative overflow-hidden group"
      ref={tileRef}
    >
      {/* ── Editorial Cover Panel ───────────────────────── */}
      <div
        className="relative flex-shrink-0 overflow-hidden rounded-t-none"
        style={{
          background: `linear-gradient(145deg, ${cover.bgFrom} 0%, ${cover.bgTo} 100%)`,
          minHeight: "168px",
        }}
      >
        {/* Subtle grid texture — crisper lines at lower opacity */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.028]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), " +
              "linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />

        {/* Top inner highlight on cover panel */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px pointer-events-none"
          style={{ background: "rgba(255,255,255,0.08)" }}
        />

        {/* OVERSIZED typographic title — the editorial visual, with scroll parallax
            Whisper scale on hover: 1 → 1.025, purely CSS transition (no JS in loop) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 flex flex-col justify-center pl-4 sm:pl-6 pr-14 select-none pointer-events-none overflow-hidden
                     [@media(hover:hover)]:group-hover:scale-[1.025]
                     transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]"
        >
          <motion.div style={shouldReduceMotion ? undefined : { y: springY }}>
            {/* Single line, single weight — every tile's title reads at the
                same visual size regardless of word count (a two-word title
                split into bold+light lines looked uneven next to the
                single-word tiles in the compact 2x2 grid). */}
            <span
              className={cn(
                "font-syne",
                "block truncate font-black tracking-[-0.04em] leading-[0.95]"
              )}
              style={{
                color: cover.titleColor,
                fontSize: TILE_DISPLAY,
              }}
            >
              {project.title}
            </span>
          </motion.div>
        </div>

        {/* Category label — top-left — mono 10px unified */}
        <div className="absolute top-4 left-5">
          <span
            className={cn(
              "ui-label inline-flex items-center rounded-none border px-2.5 py-0.5",
              cover.labelBg,
              cover.labelColor
            )}
          >
            {cover.categoryLabel}
          </span>
        </div>

        {/* Link icons — top-right — touch target 44×44
            stopPropagation prevents bubbling to the cover link */}
        <div className="absolute top-2 right-2 flex gap-0 z-20">
          {project.github ? (
            <a
              aria-label={`${project.title} on GitHub`}
              className="flex items-center justify-center w-11 h-11 rounded-none text-white/50
                         [@media(hover:hover)]:hover:text-white/90 [@media(hover:hover)]:hover:bg-white/[0.1]
                         transition-colors duration-150 active:bg-white/[0.08]"
              href={project.github}
              onClick={(e) => e.stopPropagation()}
              rel="noopener noreferrer"
              target="_blank"
            >
              <IconBrandGithub className="h-[15px] w-[15px]" />
            </a>
          ) : null}
          {project.demo ? (
            <a
              aria-label={`${project.title} demo`}
              className="flex items-center justify-center w-11 h-11 rounded-none text-white/50
                         [@media(hover:hover)]:hover:text-white/90 [@media(hover:hover)]:hover:bg-white/[0.1]
                         transition-colors duration-150 active:bg-white/[0.08]"
              href={project.demo}
              onClick={(e) => e.stopPropagation()}
              rel="noopener noreferrer"
              target="_blank"
            >
              <IconExternalLink className="h-[15px] w-[15px]" />
            </a>
          ) : null}
        </div>

        {/* ── "View project" hover reveal ─────────────────────────────────
            Fades + slides up from the bottom edge on hover (desktop only).
            The entire cover is a button that opens the "peek" preview modal
            (not a direct external link anymore — that behavior now lives as
            a secondary action inside the peek). The icon links above still
            call e.stopPropagation() so they keep opening externally without
            also triggering the peek.
            Touch devices: always visible at low opacity as a static affordance.
            Reduced motion: static, no translate. */}
        <button
          aria-haspopup="dialog"
          aria-label={`Preview ${project.title} project`}
          className="absolute inset-0 z-10 flex cursor-pointer items-end justify-start p-4"
          onClick={() => setPeekOpen(true)}
          type="button"
        >
          {/* Pill affordance */}
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none",
              "bg-white/[0.12] border border-white/[0.18] backdrop-blur-sm",
              "text-[11px] font-semibold text-white/80 tracking-tight",
              // Touch devices: show at low opacity always (not hover-only)
              "opacity-[0.55]",
              // Desktop hover: fade+slide reveal
              shouldReduceMotion
                ? ""
                : [
                    // Start below, translate up on hover
                    "translate-y-2",
                    "[@media(hover:hover)]:group-hover:translate-y-0",
                    "[@media(hover:hover)]:group-hover:opacity-100",
                    "transition-[opacity,transform] duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
                  ].join(" ")
            )}
          >
            View project
            <IconArrowUpRight size={11} />
          </span>
        </button>

        {/* Bottom edge fade */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 inset-x-0 h-12 pointer-events-none z-[5]"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.28) 0%, transparent 100%)",
          }}
        />
      </div>

      {/* ── Body — description · tags ───────────────────── */}
      <div className="flex flex-col gap-3 p-4 sm:p-5 pt-3 sm:pt-4 flex-1 min-w-0">
        {/* Hairline accent */}
        <div aria-hidden="true" className="h-px w-12 bg-foreground/20 mb-0.5" />

        {/* Project title — tile/card title scale: ~1rem–1.125rem semibold */}
        <h3
          className={cn(
            "font-syne",
            "text-[13px] sm:text-[14px] font-bold text-foreground leading-tight tracking-tight"
          )}
        >
          {project.title}
        </h3>

        {/* Description — truncated to 2 lines, compact sidebar context */}
        <p className="text-[12.5px] text-muted-foreground leading-[1.6] flex-1 text-pretty line-clamp-2">
          {project.description}
        </p>

        {/* Tag chips — meta scale: 11px */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {project.tags.map((tag) => (
              <span
                className="ui-label rounded-none px-2.5 py-0.5
                           border border-border bg-foreground/[0.04] text-muted-foreground
                           [@media(hover:hover)]:hover:border-border [@media(hover:hover)]:hover:text-foreground/80
                           transition-[color,border-color] duration-150 cursor-default select-none"
                key={tag}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <ProjectPeekModal
        cover={cover}
        onOpenChange={setPeekOpen}
        open={peekOpen}
        project={project}
      />
    </div>
  );
}
