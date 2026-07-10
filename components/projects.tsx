"use client";

import { SectionHeader } from "./section-header";
import { CollapsibleList } from "./ui/collapsible-list";
import { TiltCard } from "./ui/tilt-card";
import { projectsData } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";
import { motion, useReducedMotion } from "motion/react";
import {
  IconCode,
  IconBrandGithub,
  IconExternalLink,
  IconLayoutKanban,
} from "@tabler/icons-react";

// Featured projects (index 0-1) shown as dedicated tiles; list the rest here.
const restProjects = projectsData.slice(2);

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

  return (
    <motion.li
      className="list-none"
      initial={shouldReduce ? false : { opacity: 0, y: 18, filter: "blur(5px)" }}
      whileInView={shouldReduce ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{
        type: "spring",
        stiffness: 110,
        damping: 20,
        delay: index * 0.06,
      }}
      viewport={{ once: true, amount: 0.15 }}
    >
      <TiltCard maxDeg={3} lift={5}>
      <div
        className="project-card flex h-full flex-col justify-between gap-4 rounded-2xl
                   border border-black/[0.07] bg-white p-5
                   transition-all duration-[260ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]
                   active:scale-[0.985] active:duration-[100ms]
                   [@media(hover:hover)]:hover:border-black/[0.12]"
        style={{
          boxShadow: "0 1px 2px rgba(28,25,23,0.04), 0 8px 24px -12px rgba(28,25,23,0.10), 0 24px 48px -24px rgba(28,25,23,0.06)",
        }}
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div className="w-fit rounded-lg border border-zinc-200 bg-zinc-100 p-2 text-zinc-500">
              <IconCode className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-0.5">
              {github && (
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-11 h-11 rounded-lg text-muted-foreground
                             transition-colors
                             [@media(hover:hover)]:hover:bg-black/[0.05] [@media(hover:hover)]:hover:text-foreground
                             active:bg-black/[0.07]"
                  aria-label={`${title} on GitHub`}
                >
                  <IconBrandGithub className="h-4 w-4" />
                </a>
              )}
              {demo && (
                <a
                  href={demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-11 h-11 rounded-lg text-muted-foreground
                             transition-colors
                             [@media(hover:hover)]:hover:bg-black/[0.05] [@media(hover:hover)]:hover:text-foreground
                             active:bg-black/[0.07]"
                  aria-label={`${title} demo`}
                >
                  <IconExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
          <div className="space-y-1.5">
            {/* Tile/card title — 1rem semibold tracking-tight */}
            <h3 className="text-[1rem] font-semibold tracking-tight text-zinc-950">
              {title}
            </h3>
            {/* Body scale — 14px leading-relaxed muted */}
            <p className="text-[14px] leading-relaxed text-zinc-500">
              {description}
            </p>
          </div>
        </div>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-black/[0.07] bg-black/[0.03] px-2.5 py-0.5 text-[11px] font-medium text-zinc-500
                           [@media(hover:hover)]:hover:border-zinc-400/50 [@media(hover:hover)]:hover:text-zinc-700
                           transition-colors duration-200 cursor-default select-none"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      </TiltCard>
    </motion.li>
  );
}

export default function Projects() {
  const { ref } = useSectionInView("Projects", 0.5);

  return (
    <section ref={ref} id="projects" className="scroll-mt-28 w-full p-5 sm:p-6 lg:p-8 min-w-0">
      <SectionHeader
        icon={IconLayoutKanban}
        label="Projects"
        index="04"
        title="More things I've"
        highlight="built"
        subtitle="A selection of past work, from open-source tools to full-stack apps."
        align="left"
      />
      <CollapsibleList
        items={[...restProjects]}
        initial={4}
        noun="projects"
        renderList={(visible) => (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {visible.map((project, index) => (
              <ProjectCard
                key={project.title}
                title={project.title}
                description={project.description}
                tags={project.tags}
                github={project.github}
                demo={project.demo}
                index={index}
              />
            ))}
          </ul>
        )}
      />
    </section>
  );
}
