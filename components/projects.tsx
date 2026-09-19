"use client";

import {
  IconArrowUpRight,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getVisibleProjects, slugifyProjectTitle } from "@/lib/projects";

const first = ["Ferry", "Tethr", "Moshi personal agent fleet"];
const projects = getVisibleProjects()
  .filter(
    (project) => !["OpenKVM", "Brik", "Quivly Skills"].includes(project.title)
  )
  .sort(
    (a, b) =>
      (first.includes(a.title) ? first.indexOf(a.title) : 3) -
      (first.includes(b.title) ? first.indexOf(b.title) : 3)
  );
const pageSize = 3;

export default function Projects() {
  const [page, setPage] = useState(0);
  const pageCount = Math.ceil(projects.length / pageSize);
  return (
    <section
      className="bento-surface min-w-0 scroll-mt-20 p-3 md:px-[1.2cqw] md:py-1"
      id="more-projects"
    >
      <div className="mb-1 flex items-center justify-between gap-2">
        <h2 className="bento-label">10 / More things I&apos;ve built</h2>
        <div className="flex items-center gap-1">
          <Button
            aria-label="Previous page"
            className="size-11 p-0 md:size-6 md:min-h-6"
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            size="unstyled"
            variant="ghost"
          >
            <IconChevronLeft size={14} />
          </Button>
          <span
            aria-live="polite"
            className="whitespace-nowrap font-mono text-[10px]"
          >
            {page + 1} / {pageCount}
          </span>
          <Button
            aria-label="Next page"
            className="size-11 p-0 md:size-6 md:min-h-6"
            disabled={page === pageCount - 1}
            onClick={() => setPage(page + 1)}
            size="unstyled"
            variant="ghost"
          >
            <IconChevronRight size={14} />
          </Button>
        </div>
      </div>
      <ul className="grid gap-2 md:grid-cols-3">
        {projects
          .slice(page * pageSize, (page + 1) * pageSize)
          .map((project) => (
            <li
              className="relative flex gap-3 border border-border p-3 md:gap-[1.5cqw] md:px-[1.1cqw] md:py-[.88cqw]"
              key={project.title}
            >
              <span
                aria-hidden="true"
                className="flex size-9 shrink-0 items-center justify-center rounded-[4px] bg-foreground font-syne text-xl font-bold text-background"
              >
                {project.title.startsWith("Quivly") ? (
                  <Image
                    alt=""
                    height={36}
                    src="/design/brand/quivly-icon.ico"
                    unoptimized
                    width={36}
                  />
                ) : (
                  project.title.charAt(0)
                )}
              </span>
              <div className="min-w-0">
                <h3 className="pr-3 text-[clamp(15px,1.55cqw,22px)] font-bold leading-tight">
                  <Link
                    href={`/projects/${slugifyProjectTitle(project.title)}`}
                  >
                    {project.title === "Moshi personal agent fleet"
                      ? "Moshi"
                      : project.title}
                    <IconArrowUpRight
                      className="absolute right-3 top-3"
                      size={17}
                    />
                  </Link>
                </h3>
                <p className="mt-1 line-clamp-2 text-[clamp(11px,1.08cqw,15px)] leading-[1.3] text-muted-foreground">
                  {project.description}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {project.tags.slice(0, 2).map((tag) => (
                    <span
                      className="border border-border px-1 py-0.5 font-mono text-[clamp(7px,.7cqw,10px)] uppercase"
                      key={tag}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          ))}
      </ul>
    </section>
  );
}
