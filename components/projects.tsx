"use client";

import { SectionHeader } from "./section-header";
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
  return (
    <motion.li
      className="list-none"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: index * 0.06,
      }}
      viewport={{ once: true, amount: 0.15 }}
    >
      <div
        className="flex h-full flex-col justify-between gap-4 rounded-2xl
                   border border-black/[0.08] bg-white p-5
                   shadow-[0_1px_2px_rgba(24,24,27,0.04),0_10px_30px_-14px_rgba(24,24,27,0.12)]
                   transition-all duration-300
                   hover:border-black/[0.16] hover:-translate-y-1
                   hover:shadow-[0_2px_4px_rgba(24,24,27,0.05),0_18px_40px_-16px_rgba(24,24,27,0.18)]"
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
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-black/[0.05] hover:text-foreground"
                  aria-label="View on GitHub"
                >
                  <IconBrandGithub className="h-4 w-4" />
                </a>
              )}
              {demo && (
                <a
                  href={demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-black/[0.05] hover:text-foreground"
                  aria-label="View demo"
                >
                  <IconExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-semibold tracking-tight text-zinc-950">
              {title}
            </h3>
            <p className="text-[13.5px] leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-black/[0.08] bg-black/[0.04] px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
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

  return (
    <section ref={ref} id="projects" className="scroll-mt-28 w-full p-6 sm:p-8">
      <SectionHeader
        icon={IconLayoutKanban}
        label="Projects"
        index="04"
        title="More things I've"
        highlight="built"
        subtitle="A selection of past work, from open-source tools to full-stack apps."
        align="left"
      />
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {restProjects.map((project, index) => (
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
    </section>
  );
}
