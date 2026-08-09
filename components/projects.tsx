"use client";

import {
  IconBrandGithub,
  IconChevronLeft,
  IconChevronRight,
  IconCode,
  IconExternalLink,
  IconLayoutKanban,
} from "@tabler/icons-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { accentColorForTags } from "@/lib/blog-topic";
import { hiddenProjectTitles, projectsData } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";
import { slugifyProjectTitle } from "@/lib/projects";
import { SectionHeader } from "./section-header";
import { Button } from "./ui/button";

// Featured projects (index 0-1) shown as dedicated tiles; list the rest here.
const restProjects = projectsData
  .slice(2)
  .filter(({ title }) => !hiddenProjectTitles.has(title));

const PAGE_SIZE = 4;

function ProjectCard({
  title,
  description,
  tags,
  github,
  demo,
  index,
}: {
  title: string;
  description: string;
  tags: readonly string[];
  github: string;
  demo: string;
  index: number;
}) {
  const shouldReduce = useReducedMotion();
  const accent = accentColorForTags(tags);

  return (
    <motion.li
      className="list-none"
      initial={shouldReduce ? false : { opacity: 0, y: 18 }}
      transition={{
        damping: 20,
        delay: index * 0.06,
        stiffness: 110,
        type: "spring",
      }}
      viewport={{ amount: 0.12, once: true }}
      whileInView={shouldReduce ? undefined : { opacity: 1, y: 0 }}
    >
      <div
        className="project-card relative flex h-full flex-col justify-between gap-4 overflow-hidden rounded-2xl
                   border border-border bg-card p-5
                   transition-transform duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]
                   active:scale-[0.985] active:duration-100
                   [@media(hover:hover)]:hover:border-border"
      >
        {/* Subtle ambient glow, tinted per project — content-seeded, not decorative noise */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-[0.10] blur-2xl [@media(hover:hover)]:group-hover:opacity-[0.16]"
          style={{ background: accent }}
        />

        <div className="relative flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div
              className="w-fit rounded-lg border border-border bg-muted p-2 text-muted-foreground"
              style={{ boxShadow: `0 0 24px -8px ${accent}` }}
            >
              <IconCode className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-0.5">
              {github && (
                <a
                  aria-label={`${title} on GitHub`}
                  className="flex items-center justify-center w-11 h-11 rounded-lg text-muted-foreground
                             transition-colors
                             [@media(hover:hover)]:hover:bg-foreground/[0.06] [@media(hover:hover)]:hover:text-foreground
                             active:bg-foreground/[0.08]"
                  href={github}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <IconBrandGithub className="h-4 w-4" />
                </a>
              )}
              {demo && (
                <a
                  aria-label={`${title} demo`}
                  className="flex items-center justify-center w-11 h-11 rounded-lg text-muted-foreground
                             transition-colors
                             [@media(hover:hover)]:hover:bg-foreground/[0.06] [@media(hover:hover)]:hover:text-foreground
                             active:bg-foreground/[0.08]"
                  href={demo}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <IconExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
          <div className="space-y-1.5">
            {/* Tile/card title — 1rem semibold tracking-tight */}
            <h3 className="text-[1rem] font-semibold tracking-tight text-foreground">
              <Link
                className="[@media(hover:hover)]:hover:underline [@media(hover:hover)]:hover:underline-offset-2"
                href={`/projects/${slugifyProjectTitle(title)}`}
              >
                {title}
              </Link>
            </h3>
            {/* Body scale — 14px leading-relaxed muted */}
            <p className="text-[14px] leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                className="ui-label rounded-full border border-border bg-foreground/[0.04] px-2.5 py-0.5 text-muted-foreground
                           [@media(hover:hover)]:hover:border-border [@media(hover:hover)]:hover:text-foreground/80
                           transition-colors duration-200 cursor-default select-none"
                key={tag}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.li>
  );
}

export default function Projects() {
  const { ref } = useSectionInView("Projects", 0.5);
  const shouldReduce = useReducedMotion();
  const pageCount = Math.ceil(restProjects.length / PAGE_SIZE);
  const [page, setPage] = useState(0);
  const pageItems = restProjects.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE
  );

  return (
    <section
      className="scroll-mt-28 w-full p-5 sm:p-6 lg:p-8 min-w-0"
      id="projects"
      ref={ref}
    >
      <SectionHeader
        align="left"
        highlight="built"
        icon={IconLayoutKanban}
        index="04"
        label="Projects"
        subtitle="Public work is linked. Selected private product work is described without exposing confidential code or company details."
        title="More things I've"
      />
      <motion.ul
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
        initial={shouldReduce ? false : { opacity: 0, y: 12 }}
        key={page}
        transition={{ damping: 24, stiffness: 160, type: "spring" }}
      >
        {pageItems.map((project, index) => (
          <ProjectCard
            demo={project.demo}
            description={project.description}
            github={project.github}
            index={index}
            key={project.title}
            tags={project.tags}
            title={project.title}
          />
        ))}
      </motion.ul>

      {pageCount > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <Button
            aria-label="Previous page"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            size="sm"
            type="button"
            variant="secondary"
          >
            <IconChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-mono text-[12px] tabular-nums text-muted-foreground">
            Page {page + 1} of {pageCount}
          </span>
          <Button
            aria-label="Next page"
            disabled={page === pageCount - 1}
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            size="sm"
            type="button"
            variant="secondary"
          >
            <IconChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </section>
  );
}
