"use client";

import React from "react";
import { SectionHeader } from "./section-header";
import { projectsData } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { cn } from "@/lib/utils";
import {
  IconBox,
  IconLock,
  IconSettings,
  IconSparkles,
  IconBrandGithub,
  IconExternalLink,
  IconLayoutKanban,
  IconCode,
  IconPalette,
  IconLayout,
} from "@tabler/icons-react";

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  tags: readonly string[];
  github: string;
  demo: string;
}

const GridItem = ({ area, icon, title, description, tags, github, demo }: GridItemProps) => {
  return (
    <li className={cn("min-h-[14rem] list-none", area)}>
      <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-border p-2 md:rounded-[1.5rem] md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={3}
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] border-border bg-background p-6 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)]">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            {/* Header with icon and links */}
            <div className="flex items-start justify-between">
              <div className="w-fit rounded-lg border-[0.75px] border-border bg-muted p-2">
                {icon}
              </div>
              {/* Links */}
              <div className="flex items-center gap-2">
                {github && (
                  <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
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
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
                    aria-label="View Demo"
                  >
                    <IconExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-3">
              <h3 className="pt-0.5 text-xl leading-[1.375rem] font-semibold font-sans tracking-[-0.04em] md:text-2xl md:leading-[1.875rem] text-balance text-foreground">
                {title}
              </h3>
              <p className="font-sans text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] text-muted-foreground">
                {description}
              </p>
            </div>
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2.5 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground border border-border/50"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </li>
  );
};

// Project icons
const projectIcons = [
  <IconBox key="box" className="h-4 w-4 text-foreground" />,
  <IconSettings key="settings" className="h-4 w-4 text-foreground" />,
  <IconCode key="code" className="h-4 w-4 text-foreground" />,
  <IconSparkles key="sparkles" className="h-4 w-4 text-foreground" />,
  <IconLock key="lock" className="h-4 w-4 text-foreground" />,
  <IconPalette key="palette" className="h-4 w-4 text-foreground" />,
  <IconLayout key="layout" className="h-4 w-4 text-foreground" />,
];

// Bento grid layout for projects - max 2 per row
const gridAreas = [
  "md:[grid-area:1/1/2/7]",   // Row 1, left (6 cols)
  "md:[grid-area:1/7/2/13]",  // Row 1, right (6 cols)
  "md:[grid-area:2/1/3/7]",   // Row 2, left (6 cols)
  "md:[grid-area:2/7/3/13]",  // Row 2, right (6 cols)
  "md:[grid-area:3/1/4/7]",   // Row 3, left (6 cols)
  "md:[grid-area:3/7/4/13]",  // Row 3, right (6 cols)
  "md:[grid-area:4/1/5/13]",  // Row 4, full width (12 cols)
];

export default function Projects() {
  const { ref } = useSectionInView("Projects", 0.5);

  return (
    <section ref={ref} id="projects" className="scroll-mt-28 mb-28 px-4">
      <SectionHeader
        icon={IconLayoutKanban}
        label="Projects"
        title="Things I've"
        highlight="built"
        subtitle="A selection of projects I've worked on, from open source tools to full-stack applications."
        iconColor="#d79f1e"
        highlightGradient="from-[#d79f1e] via-[#dd7bbb] to-[#5a922c]"
      />
      <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 lg:gap-4 max-w-4xl mx-auto">
        {projectsData.map((project, index) => (
          <GridItem
            key={project.title}
            area={gridAreas[index]}
            icon={projectIcons[index]}
            title={project.title}
            description={project.description}
            tags={project.tags}
            github={project.github}
            demo={project.demo}
          />
        ))}
      </ul>
    </section>
  );
}
