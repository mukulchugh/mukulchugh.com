"use client";

import About from "@/components/about";
import {
  BrandBar,
  CTATile,
  FeaturedProjectTile,
  LocationTile,
  ProfileTile,
} from "@/components/bento";
import { HeroArtwork } from "@/components/bento/profile-tile";
import BlogSection from "@/components/blog-section";
import Experience from "@/components/experience";
import Projects from "@/components/projects";
import type { Post } from "@/lib/blog";
import { useSectionInView } from "@/lib/hooks";
import { getVisibleProjects } from "@/lib/projects";

export function HomeBento({ posts }: { posts: Post[] }) {
  const { ref } = useSectionInView("Projects");
  const featured = getVisibleProjects().filter((project) =>
    ["OpenKVM", "Brik", "Quivly Skills"].includes(project.title)
  );
  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="-mb-3">
        <BrandBar />
      </div>
      <div className="bento-hero-grid">
        <ProfileTile />
        <div className="bento-hero-side">
          <HeroArtwork />
          <LocationTile />
        </div>
      </div>
      <section
        aria-label="Featured projects"
        className="grid scroll-mt-20 gap-3 md:grid-cols-[1.845fr_1fr]"
        id="projects"
        ref={ref}
      >
        <FeaturedProjectTile index={0} project={featured[0]} />
        <div className="grid min-w-0 gap-3 sm:grid-cols-2 md:grid-cols-1">
          {featured.slice(1).map((project, index) => (
            <FeaturedProjectTile
              index={index + 1}
              key={project.title}
              project={project}
            />
          ))}
        </div>
      </section>
      <div className="grid gap-3 md:grid-cols-[1.39fr_1fr_.375fr]">
        <About />
        <Experience />
        <aside
          aria-hidden="true"
          className="bento-surface hidden items-end bg-foreground/[.065] p-[2.5cqw] md:flex"
        >
          <p className="font-mono text-[clamp(10px,1.3cqw,18px)] uppercase leading-[1.5] tracking-[.08em]">
            Same
            <br />
            tools
            <br />
            different
            <br />
            problems
            <br />
            still
            <br />
            human
          </p>
        </aside>
      </div>
      <BlogSection posts={posts} />
      <Projects />
      <CTATile />
    </div>
  );
}
