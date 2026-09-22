"use client";

import { IconArrowRight, IconArrowUpRight } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ProjectPeekModal } from "@/components/bento/project-peek-modal";
import { Button } from "@/components/ui/button";
import type { projectsData } from "@/lib/data";
import { projectArtwork } from "@/lib/project-artwork";
import { slugifyProjectTitle } from "@/lib/projects";
import { cn } from "@/lib/utils";

const featuredArt = {
  Brik: {
    src: "/design/brik-featured-reference.png",
    summary:
      "Build native widgets, Live Activities, and Dynamic Island experiences with React Native.",
  },
  OpenKVM: {
    src: "/design/openkvm-featured-reference.png",
    summary:
      "An open-source macOS menu bar app that shares one keyboard and mouse between two Macs.",
  },
  "Quivly Skills": {
    src: "/design/projects/quivly-skills-v2.webp",
    summary:
      "A curated, production-ready collection of agent skills for customer engineering teams.",
  },
} as const;

export function FeaturedProjectTile({
  project,
  index = 0,
}: {
  project: (typeof projectsData)[number];
  index?: number;
}) {
  const [open, setOpen] = useState(false);
  const returnFocus = useRef<HTMLButtonElement | null>(null);
  const large = index === 0;
  const skills = project.title === "Quivly Skills";
  const slug = slugifyProjectTitle(project.title);
  const art = featuredArt[project.title as keyof typeof featuredArt];
  const artwork = projectArtwork[slug];
  return (
    <article
      className={cn(
        "bento-surface group relative isolate overflow-hidden",
        large
          ? "min-h-[390px] bg-[#161719] text-white lg:h-[42.5cqw] lg:min-h-0"
          : "min-h-[220px] lg:h-[20.85cqw] lg:min-h-0",
        !large && "text-[#111]"
      )}
      style={{ backgroundColor: artwork?.background }}
    >
      <Image
        alt=""
        className={cn(
          "pointer-events-none -z-10 object-cover",
          large && "home-project-art"
        )}
        fill
        sizes={
          large
            ? "(max-width: 767px) 100vw, 64vw"
            : "(max-width: 639px) 100vw, 35vw"
        }
        src={artwork?.src ?? art.src}
        unoptimized
      />
      <div
        className={cn(
          "relative flex h-full flex-col",
          large ? "p-5 lg:p-[2cqw]" : "p-4 lg:p-[1.55cqw]"
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <span
            className={cn(
              "bento-label",
              large ? "!text-white/80" : "!text-[#35382d]"
            )}
          >
            {large
              ? "Featured project"
              : skills
                ? "Agent tools"
                : "Mobile development"}
          </span>
          {large ? (
            <span className="bento-label !text-white/80">Open source</span>
          ) : (
            <Link
              aria-label={`View ${project.title} project`}
              className="absolute right-1 top-1 flex size-11 items-center justify-center"
              href={`/projects/${slug}`}
            >
              <IconArrowUpRight size={20} />
            </Link>
          )}
        </div>
        <h3
          className={cn(
            "font-sans font-semibold leading-[1.12] tracking-[-.025em]",
            large
              ? "mt-10 text-[clamp(34px,4cqw,56px)] lg:mt-[4.8cqw]"
              : "mt-5 max-w-[65%] text-[clamp(24px,2.3cqw,32px)] lg:mt-[1.6cqw]"
          )}
        >
          <Link href={`/projects/${slug}`}>{project.title}</Link>
        </h3>
        <p
          className={cn(
            "mt-3 leading-[1.5]",
            large
              ? "max-w-[44%] text-[clamp(14px,1.14cqw,16px)] text-white/80 lg:absolute lg:top-[15.8cqw] lg:mt-0 lg:max-w-[39%]"
              : skills
                ? "max-w-[57%] text-sm lg:mt-[.75cqw]"
                : "max-w-[48%] text-sm lg:mt-[.75cqw]"
          )}
        >
          {art.summary}
        </p>
        {large && (
          <Button
            aria-haspopup="dialog"
            className="mt-5 min-h-11 w-fit border border-white/30 bg-black/20 px-4 text-white hover:bg-white/15 lg:absolute lg:top-[23.25cqw] lg:mt-0 lg:h-[3.67cqw] lg:min-h-0 lg:w-[14.56cqw] lg:px-2 lg:text-[1.3cqw]"
            onClick={() => setOpen(true)}
            ref={returnFocus}
            variant="ghost"
          >
            View project
            <IconArrowRight size={16} />
          </Button>
        )}
        <div
          className={cn(
            "mt-auto flex flex-wrap gap-1 pt-2",
            !large && "max-w-[65%]"
          )}
        >
          {project.tags.slice(0, large ? 4 : 2).map((tag) => (
            <span
              className="ui-label [&:not(:last-child)]:after:mx-2 [&:not(:last-child)]:after:content-['·']"
              key={tag}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <ProjectPeekModal
        cover={{
          bgFrom: "#111",
          bgTo: "#222",
          categoryLabel: project.tags.slice(0, 2).join(" · "),
          labelBg: "bg-white/10",
          labelColor: "text-white/70",
          titleColor: "white",
        }}
        onOpenChange={setOpen}
        open={open}
        project={project}
        returnFocus={returnFocus}
      />
    </article>
  );
}
