import React from "react";
import {
  IconBrandGithub,
  IconExternalLink,
  IconCpu,
  IconBrandReact,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { syne } from "@/lib/fonts";
import type { projectsData } from "@/lib/data";

type ProjectData = (typeof projectsData)[number];

// Per-project cover configuration — gradient colours + icon + monogram
const COVERS = [
  {
    // OpenKVM — deep graphite, hardware feel
    gradient:
      "linear-gradient(135deg, rgba(24,24,27,0.92) 0%, rgba(39,39,42,0.85) 45%, rgba(63,63,70,0.75) 100%)",
    mesh:
      "radial-gradient(circle at 20% 80%, rgba(82,82,91,0.40) 0%, transparent 55%), " +
      "radial-gradient(circle at 82% 18%, rgba(24,24,27,0.55) 0%, transparent 50%)",
    labelColor: "text-white/60",
    labelBg: "bg-white/[0.08] border-white/[0.14]",
    icon: <IconCpu className="h-8 w-8 text-white/70" />,
    accentLine: "from-white/20 via-zinc-400/10 to-transparent",
  },
  {
    // Brik — warm graphite, UI feel
    gradient:
      "linear-gradient(135deg, rgba(39,39,42,0.90) 0%, rgba(63,63,70,0.80) 45%, rgba(82,82,91,0.65) 100%)",
    mesh:
      "radial-gradient(circle at 78% 75%, rgba(113,113,122,0.35) 0%, transparent 52%), " +
      "radial-gradient(circle at 18% 22%, rgba(39,39,42,0.50) 0%, transparent 50%)",
    labelColor: "text-white/60",
    labelBg: "bg-white/[0.08] border-white/[0.14]",
    icon: <IconBrandReact className="h-8 w-8 text-white/70" />,
    accentLine: "from-white/20 via-zinc-400/10 to-transparent",
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
  // Build monogram from up to 2 words
  const words = project.title.trim().split(/\s+/);
  const monogram =
    words.length >= 2
      ? words[0][0] + words[1][0]
      : project.title.slice(0, 2);

  return (
    <div className="h-full flex flex-col min-h-[260px] relative overflow-hidden">

      {/* ── Cover panel ────────────────────────────────────────── */}
      <div className="relative h-[156px] flex-shrink-0 overflow-hidden rounded-t-3xl">
        {/* Gradient background */}
        <div className="absolute inset-0" style={{ background: cover.gradient }} />
        {/* Mesh radials */}
        <div
          className="absolute inset-0"
          style={{ backgroundImage: cover.mesh }}
        />
        {/* Subtle grid lines */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), " +
              "linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Large monogram as texture — very subtle */}
        <div
          className="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
          aria-hidden="true"
        >
          <span
            className="font-black leading-none tracking-tighter"
            style={{ fontSize: "120px", color: "rgba(255,255,255,0.055)" }}
          >
            {monogram}
          </span>
        </div>
        {/* Centred icon badge */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center
                       bg-white/[0.09] border border-white/[0.14]
                       shadow-xl shadow-black/30 backdrop-blur-sm"
          >
            {cover.icon}
          </div>
        </div>
        {/* "Featured" label — top-left */}
        <div className="absolute top-3.5 left-4">
          <span
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-semibold uppercase tracking-[0.12em]",
              cover.labelBg,
              cover.labelColor
            )}
          >
            Featured
          </span>
        </div>
        {/* Link icons — top-right */}
        <div className="absolute top-2.5 right-3 flex gap-0.5">
          {project.github ? (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} on GitHub`}
              className="p-2 rounded-xl text-white/50 hover:text-white/90 hover:bg-white/[0.1]
                         transition-colors duration-150"
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
              className="p-2 rounded-xl text-white/50 hover:text-white/90 hover:bg-white/[0.1]
                         transition-colors duration-150"
            >
              <IconExternalLink className="h-[15px] w-[15px]" />
            </a>
          ) : null}
        </div>
        {/* Bottom fade into tile body */}
        <div
          className="absolute bottom-0 inset-x-0 h-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.20) 0%, transparent 100%)",
          }}
        />
      </div>

      {/* ── Body — title · description · tags ───────────────── */}
      <div className="flex flex-col gap-3 p-5 sm:p-6 pt-4 flex-1">
        {/* Accent line */}
        <div
          className={cn(
            "h-px w-16 bg-gradient-to-r mb-1",
            cover.accentLine
          )}
          aria-hidden="true"
        />
        <h3
          className={cn(
            syne.className,
            "text-[1.0625rem] font-bold text-foreground leading-tight tracking-tight"
          )}
        >
          {project.title}
        </h3>
        <p className="text-[13px] text-muted-foreground leading-[1.72] flex-1">
          {project.description}
        </p>

        {/* Tag chips */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 text-[11px] font-medium rounded-full
                           border border-black/[0.08] bg-black/[0.03] text-muted-foreground
                           hover:border-zinc-400/60 hover:text-zinc-700
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
