"use client";

import React from "react";
import { SectionHeader } from "./section-header";
import { projectsData } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { cn } from "@/lib/utils";
import { Box, Lock, Settings, Sparkles, Github, ExternalLink, FolderKanban } from "lucide-react";

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
    <li className={cn("list-none group", area)}>
      <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-border p-2 md:rounded-[1.5rem] md:p-3 transition-all duration-300">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={3}
        />
        {/* Multicolor gradient border on hover - matches GlowingEffect colors */}
        <div
          className="absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, #dd7bbb, #d79f1e, #5a922c, #4c7894, #dd7bbb)',
            padding: '2px',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />
        {/* Multicolor glow background effect */}
        <div
          className="absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none blur-xl"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(221, 123, 187, 0.4) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(90, 146, 44, 0.4) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(215, 159, 30, 0.4) 0%, transparent 50%), radial-gradient(circle at 30% 70%, rgba(76, 120, 148, 0.4) 0%, transparent 50%)',
          }}
        />

        <div className="relative flex h-full flex-col gap-4 rounded-xl border-[0.75px] border-border bg-background p-5 shadow-sm transition-all duration-300 group-hover:shadow-lg dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)] md:p-6">
          {/* Header with icon and links */}
          <div className="flex items-start justify-between">
            <div className="w-fit rounded-lg border-[0.75px] border-border bg-muted p-2 transition-all duration-300 group-hover:border-[#dd7bbb]/40 group-hover:bg-[#dd7bbb]/10 flex-shrink-0">
              {icon}
            </div>
            {/* Links */}
            <div className="flex items-center gap-2">
              {github && (
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-muted-foreground hover:text-[#dd7bbb] hover:bg-[#dd7bbb]/10 transition-all duration-200"
                  aria-label="View on GitHub"
                >
                  <Github className="h-4 w-4" />
                </a>
              )}
              {demo && (
                <a
                  href={demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-muted-foreground hover:text-[#5a922c] hover:bg-[#5a922c]/10 transition-all duration-200"
                  aria-label="View Demo"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col gap-3">
            <h3 className="text-lg font-semibold font-sans tracking-[-0.02em] md:text-xl text-foreground transition-colors duration-300 group-hover:text-[#dd7bbb]">
              {title}
            </h3>
            <p className="font-sans text-sm leading-relaxed md:text-base text-muted-foreground">
              {description}
            </p>
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2.5 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground border border-border/50 transition-all duration-200 group-hover:border-[#d79f1e]/30 group-hover:bg-[#d79f1e]/10"
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

const icons = [
  <Box key="box" className="h-4 w-4 text-foreground transition-colors duration-300 group-hover:text-[#dd7bbb]" />,
  <Settings key="settings" className="h-4 w-4 text-foreground transition-colors duration-300 group-hover:text-[#d79f1e]" />,
  <Lock key="lock" className="h-4 w-4 text-foreground transition-colors duration-300 group-hover:text-[#5a922c]" />,
  <Sparkles key="sparkles" className="h-4 w-4 text-foreground transition-colors duration-300 group-hover:text-[#4c7894]" />,
];

// Horizontal bento grid - rows instead of columns
const gridAreas = [
  "md:[grid-area:1/1/2/5]",   // Row 1, left (4 cols)
  "md:[grid-area:1/5/2/9]",   // Row 1, middle (4 cols)
  "md:[grid-area:1/9/2/13]",  // Row 1, right (4 cols)
  "md:[grid-area:2/1/3/13]",  // Row 2, full width (12 cols)
];

export default function Projects() {
  const { ref } = useSectionInView("Projects", 0.5);

  return (
    <section ref={ref} id="projects" className="scroll-mt-28 mb-28 px-4">
      <SectionHeader
        icon={FolderKanban}
        label="Projects"
        title="Things I've"
        highlight="built"
        subtitle="A selection of projects I've worked on, from open source tools to full-stack applications."
        iconColor="#d79f1e"
        highlightGradient="from-[#d79f1e] via-[#dd7bbb] to-[#5a922c]"
      />
      <ul className="grid grid-cols-1 auto-rows-auto gap-4 md:grid-cols-12 lg:gap-4 max-w-4xl mx-auto">
        {projectsData.map((project, index) => (
          <GridItem
            key={project.title}
            area={gridAreas[index]}
            icon={icons[index]}
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
