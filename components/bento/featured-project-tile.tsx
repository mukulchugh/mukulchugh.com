"use client";

import { IconArrowRight, IconArrowUpRight } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ProjectPeekModal } from "@/components/bento/project-peek-modal";
import { Button } from "@/components/ui/button";
import type { projectsData } from "@/lib/data";
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
    src: "/design/projects/quivly-skills-v2.png",
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
  return (
    <article
      className={cn(
        "bento-surface group relative isolate overflow-hidden",
        large
          ? "min-h-[390px] bg-[#161719] text-white md:h-[42.5cqw] md:min-h-0"
          : "min-h-[220px] md:h-[20.85cqw] md:min-h-0",
        skills && "bg-[#caff32] text-[#111]"
      )}
    >
      <Image
        alt=""
        className="pointer-events-none -z-10 object-cover"
        fill
        sizes={
          large
            ? "(max-width: 767px) 100vw, 64vw"
            : "(max-width: 639px) 100vw, 35vw"
        }
        src={art.src}
      />
      {skills && (
        <Image
          alt=""
          className="pointer-events-none absolute left-[66%] top-[43%] -z-10 w-[13%] rounded-[18%] [transform:translate(-50%,-50%)_skewY(-20deg)]"
          height={48}
          src="/design/brand/quivly-icon.ico"
          unoptimized
          width={48}
        />
      )}
      <div
        className={cn(
          "relative flex h-full flex-col",
          large ? "p-5 md:p-[2cqw]" : "p-4 md:p-[1.55cqw]"
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
              ? "04 / Featured project"
              : skills
                ? "06 / Agents"
                : "05 / Mobile"}
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
            "font-sans font-extrabold leading-[.94] tracking-[-.04em]",
            large
              ? "mt-10 whitespace-nowrap text-[clamp(34px,4.4cqw,62px)] md:mt-[4.8cqw]"
              : "mt-5 max-w-[65%] text-[clamp(24px,2.6cqw,36px)] md:mt-[1.6cqw]"
          )}
        >
          <Link href={`/projects/${slug}`}>{project.title}</Link>
        </h3>
        <p
          className={cn(
            "mt-3 leading-[1.3]",
            large
              ? "max-w-[44%] text-[clamp(12px,1.35cqw,19px)] text-white/80 md:absolute md:top-[15.8cqw] md:mt-0 md:max-w-[39%]"
              : skills
                ? "max-w-[57%] text-[clamp(10px,1.14cqw,16px)] md:mt-[.75cqw]"
                : "max-w-[48%] text-[clamp(11px,1.22cqw,17px)] md:mt-[.75cqw]"
          )}
        >
          {art.summary}
        </p>
        {large && (
          <Button
            aria-haspopup="dialog"
            className="mt-5 min-h-11 w-fit border border-white/30 bg-black/20 px-4 text-white hover:bg-white/15 md:absolute md:top-[23.25cqw] md:mt-0 md:h-[3.67cqw] md:min-h-0 md:w-[14.56cqw] md:px-2 md:text-[1.3cqw]"
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
              className="border border-current/25 px-1 py-0.5 font-mono text-[clamp(7px,.75cqw,11px)] uppercase tracking-[.05em]"
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
