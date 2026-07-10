import React from "react";
import { IconBrandGithub, IconExternalLink } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { syne } from "@/lib/fonts";
import type { projectsData } from "@/lib/data";

type ProjectData = (typeof projectsData)[number];

// Per-project cover config — monochrome editorial typography
const COVERS = [
  {
    // OpenKVM — deep graphite
    bgFrom: "rgb(12,12,14)",
    bgTo: "rgb(28,28,32)",
    titleColor: "rgba(255,255,255,0.92)",
    subtitleColor: "rgba(255,255,255,0.22)",
    labelBg: "bg-white/[0.08] border-white/[0.14]",
    labelColor: "text-white/55",
    categoryLabel: "macOS · Open Source",
  },
  {
    // Brik — slightly warmer graphite
    bgFrom: "rgb(18,17,15)",
    bgTo: "rgb(38,36,32)",
    titleColor: "rgba(255,255,255,0.92)",
    subtitleColor: "rgba(255,255,255,0.22)",
    labelBg: "bg-white/[0.08] border-white/[0.14]",
    labelColor: "text-white/55",
    categoryLabel: "React Native · SDK",
  },
] as const;

interface FeaturedProjectTileProps {
  project: ProjectData;
  index?: number;
}

export function FeaturedProjectTile({
  project,
  index = 0,
}: FeaturedProjectTileProps) {
  const cover = COVERS[index % COVERS.length];

  // Split title into main word and rest for hierarchy
  const titleWords = project.title.trim().split(/\s+/);
  const titleFirst = titleWords[0];
  const titleRest = titleWords.slice(1).join(" ");

  return (
    <div className="h-full flex flex-col min-h-[280px] relative overflow-hidden">

      {/* ── Editorial Cover Panel ───────────────────────── */}
      <div
        className="relative flex-shrink-0 overflow-hidden rounded-t-3xl"
        style={{
          minHeight: "152px",
          background: `linear-gradient(145deg, ${cover.bgFrom} 0%, ${cover.bgTo} 100%)`,
        }}
      >
        {/* Subtle grid texture — crisper lines at lower opacity */}
        <div
          className="absolute inset-0 opacity-[0.028]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), " +
              "linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
          aria-hidden="true"
        />

        {/* Top inner highlight on cover panel */}
        <div
          className="absolute inset-x-0 top-0 h-px pointer-events-none"
          style={{ background: "rgba(255,255,255,0.08)" }}
          aria-hidden="true"
        />

        {/* OVERSIZED typographic title — the editorial visual */}
        <div
          className="absolute inset-0 flex flex-col justify-center pl-4 sm:pl-6 pr-14 select-none pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          <span
            className={cn(
              syne.className,
              "block whitespace-nowrap font-black tracking-[-0.04em] leading-[0.95]"
            )}
            style={{
              fontSize: "clamp(20px, 4.5vw, 36px)",
              color: cover.titleColor,
            }}
          >
            {titleFirst}
          </span>
          {titleRest && (
            <span
              className={cn(
                syne.className,
                "block font-light tracking-[-0.02em] leading-[1.1] break-words min-w-0"
              )}
              style={{
                fontSize: "clamp(18px, 5vw, 40px)",
                color: cover.subtitleColor,
                wordBreak: "break-word",
                overflowWrap: "break-word",
              }}
            >
              {titleRest}
            </span>
          )}
        </div>

        {/* Category label — top-left — mono 10px unified */}
        <div className="absolute top-4 left-5">
          <span
            className={cn(
              "inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-mono uppercase tracking-[0.14em]",
              cover.labelBg,
              cover.labelColor
            )}
          >
            {cover.categoryLabel}
          </span>
        </div>

        {/* Link icons — top-right — touch target 44×44 */}
        <div className="absolute top-2 right-2 flex gap-0 z-10">
          {project.github ? (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} on GitHub`}
              className="flex items-center justify-center w-11 h-11 rounded-xl text-white/50
                         [@media(hover:hover)]:hover:text-white/90 [@media(hover:hover)]:hover:bg-white/[0.1]
                         transition-colors duration-150 active:bg-white/[0.08]"
            >
              <IconBrandGithub className="h-[15px] w-[15px]" />
            </a>
          ) : null}
          {project.demo ? (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} demo`}
              className="flex items-center justify-center w-11 h-11 rounded-xl text-white/50
                         [@media(hover:hover)]:hover:text-white/90 [@media(hover:hover)]:hover:bg-white/[0.1]
                         transition-colors duration-150 active:bg-white/[0.08]"
            >
              <IconExternalLink className="h-[15px] w-[15px]" />
            </a>
          ) : null}
        </div>

        {/* Bottom edge fade */}
        <div
          className="absolute bottom-0 inset-x-0 h-12 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.28) 0%, transparent 100%)",
          }}
          aria-hidden="true"
        />
      </div>

      {/* ── Body — description · tags ───────────────────── */}
      <div className="flex flex-col gap-3 p-4 sm:p-5 pt-3 sm:pt-4 flex-1 min-w-0">
        {/* Hairline accent */}
        <div className="h-px w-12 bg-zinc-900/20 mb-0.5" aria-hidden="true" />

        {/* Project title — tile/card title scale: ~1rem–1.125rem semibold */}
        <h3
          className={cn(
            syne.className,
            "text-[1rem] sm:text-[1.0625rem] font-bold text-zinc-950 leading-tight tracking-tight"
          )}
        >
          {project.title}
        </h3>

        {/* Description — body scale: 14px leading-relaxed muted */}
        <p className="text-[14px] text-zinc-600 leading-[1.72] flex-1 text-pretty">
          {project.description}
        </p>

        {/* Tag chips — meta scale: 11px */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 text-[11px] font-medium rounded-full
                           border border-black/[0.08] bg-black/[0.03] text-zinc-500
                           [@media(hover:hover)]:hover:border-zinc-400/60 [@media(hover:hover)]:hover:text-zinc-700
                           transition-all duration-150 cursor-default select-none"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
