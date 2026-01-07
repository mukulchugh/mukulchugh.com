"use client";

import { SectionHeader } from "./section-header";
import { projectsData } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { cn } from "@/lib/utils";
import {
  IconBox,
  IconSettings,
  IconCode,
  IconSparkles,
  IconLock,
  IconBrandGithub,
  IconExternalLink,
  IconLayoutKanban,
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

const GridItem = ({
  area,
  icon,
  title,
  description,
  tags,
  github,
  demo,
}: GridItemProps) => {
  return (
    <li className={cn("min-h-[14rem] list-none", area)}>
      <div className="relative h-full rounded-2xl border border-border/50 p-2">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={3}
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border border-border/50 bg-background p-6">
          {/* Top Section */}
          <div className="flex flex-1 flex-col gap-4">
            {/* Header with icon and links */}
            <div className="flex items-start justify-between">
              <div className="w-fit rounded-lg border border-border/50 bg-muted p-2.5">
                {icon}
              </div>
              <div className="flex items-center gap-1">
                {github && (
                  <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
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
                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    aria-label="View Demo"
                  >
                    <IconExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
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

const projectIcons = [
  <IconBox key="1" className="h-4 w-4 text-foreground" />,
  <IconSettings key="2" className="h-4 w-4 text-foreground" />,
  <IconCode key="3" className="h-4 w-4 text-foreground" />,
  <IconSparkles key="4" className="h-4 w-4 text-foreground" />,
  <IconLock key="5" className="h-4 w-4 text-foreground" />,
  <IconBox key="6" className="h-4 w-4 text-foreground" />,
  <IconCode key="7" className="h-4 w-4 text-foreground" />,
];

const gridAreas = [
  "md:[grid-area:1/1/2/7]",
  "md:[grid-area:1/7/2/13]",
  "md:[grid-area:2/1/3/7]",
  "md:[grid-area:2/7/3/13]",
  "md:[grid-area:3/1/4/7]",
  "md:[grid-area:3/7/4/13]",
  "md:[grid-area:4/1/5/13]",
];

export default function Projects() {
  const { ref } = useSectionInView("Projects", 0.5);

  return (
    <section ref={ref} id="projects" className="mb-28 scroll-mt-28 px-4">
      <SectionHeader
        icon={IconLayoutKanban}
        label="Projects"
        title="Things I've"
        highlight="built"
        subtitle="A selection of projects I've worked on, from open source tools to full-stack applications."
        iconColor="#d79f1e"
        highlightGradient="from-[#d79f1e] via-[#dd7bbb] to-[#5a922c]"
      />
      <ul className="mx-auto grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-12">
        {projectsData.map((project, index) => (
          <GridItem
            key={project.title}
            area={gridAreas[index] || ""}
            icon={projectIcons[index] || projectIcons[0]}
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
