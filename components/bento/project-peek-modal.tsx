"use client";

import {
  IconArrowUpRight,
  IconBrandGithub,
  IconExternalLink,
} from "@tabler/icons-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import type { projectsData } from "@/lib/data";
import { slugifyProjectTitle } from "@/lib/projects";
import { cn } from "@/lib/utils";

type ProjectData = (typeof projectsData)[number];

// Subset of the tile's per-project cover config needed to keep the peek's
// cover treatment visually continuous with the tile it was opened from,
// without importing the full COVERS array (kept local to the tile file).
export interface ProjectPeekCover {
  bgFrom: string;
  bgTo: string;
  categoryLabel: string;
  labelBg: string;
  labelColor: string;
  titleColor: string;
}

interface ProjectPeekModalProps {
  cover: ProjectPeekCover;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  project: ProjectData;
}

// "Peek" preview — a lightweight step between the compact tile and the full
// /projects/[slug] page. Shows the untruncated description and every tag,
// and carries the direct external-link behavior that used to live on the
// tile's cover click (now a secondary action here, next to the primary
// "View full project" internal nav) — per the base Dialog primitive already
// used by cv-modal.tsx / expandable-card.tsx, not a new modal system.
export function ProjectPeekModal({
  project,
  cover,
  open,
  onOpenChange,
}: ProjectPeekModalProps) {
  const slug = slugifyProjectTitle(project.title);

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent
        className="modal-shadow flex max-h-[calc(100dvh-2rem)] w-full flex-col gap-0 overflow-hidden rounded-none p-0 sm:max-w-[min(32rem,calc(100%-4rem))]"
        showCloseButton
      >
        {/* Larger version of the tile's editorial cover treatment */}
        <div
          className="relative flex-shrink-0 overflow-hidden"
          style={{
            background: `linear-gradient(145deg, ${cover.bgFrom} 0%, ${cover.bgTo} 100%)`,
            minHeight: "160px",
          }}
        >
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

          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-center pl-5 pr-16 sm:pl-7"
          >
            <span
              className="font-syne block truncate font-black tracking-[-0.04em] leading-[0.95]"
              style={{
                color: cover.titleColor,
                fontSize: "clamp(2rem, 9vw, 3.25rem)",
              }}
            >
              {project.title}
            </span>
          </div>

          <div
            aria-hidden="true"
            className="absolute bottom-0 inset-x-0 h-12 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.28) 0%, transparent 100%)",
            }}
          />
        </div>

        {/* Body — full description, all tags, actions */}
        <div className="flex flex-col gap-5 overflow-y-auto p-6 sm:p-7">
          <DialogTitle
            className={cn(
              "font-syne",
              "text-xl font-bold text-foreground sm:text-2xl"
            )}
          >
            {project.title}
          </DialogTitle>

          <DialogDescription className="text-[14px] leading-[1.7] text-foreground/75 text-pretty">
            {project.description}
          </DialogDescription>

          {project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  className="ui-label rounded-none px-2.5 py-0.5
                             border border-border bg-foreground/[0.04] text-muted-foreground"
                  key={tag}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <Link
              className={cn(buttonVariants({ size: "sm" }), "rounded-none")}
              href={`/projects/${slug}`}
            >
              View full project
              <IconArrowUpRight data-icon="inline-end" />
            </Link>
            {project.github && (
              <a
                className={cn(
                  buttonVariants({ size: "sm", variant: "outline" }),
                  "rounded-none"
                )}
                href={project.github}
                rel="noopener noreferrer"
                target="_blank"
              >
                <IconBrandGithub data-icon="inline-start" />
                GitHub
              </a>
            )}
            {project.demo && (
              <a
                className={cn(
                  buttonVariants({ size: "sm", variant: "outline" }),
                  "rounded-none"
                )}
                href={project.demo}
                rel="noopener noreferrer"
                target="_blank"
              >
                <IconExternalLink data-icon="inline-start" />
                Demo
              </a>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
