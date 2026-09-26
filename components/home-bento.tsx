"use client";

import About from "@/components/about";
import { BrandBar, LocationTile, ProfileTile } from "@/components/bento";
import { type Project, ProjectSlider } from "@/components/bento/project-slider";
import BlogSection from "@/components/blog-section";
import { ContactSection } from "@/components/contact/contact-section";
import Experience from "@/components/experience";
import { Rebound } from "@/components/rebound/rebound";
import type { Post } from "@/lib/blog";
import { useSectionInView } from "@/lib/hooks";

export function HomeBento({
  posts,
  showcase,
}: {
  posts: Post[];
  showcase: Project[];
}) {
  const { ref } = useSectionInView("Projects");
  return (
    <div className="home-design flex min-w-0 flex-col gap-3">
      <div className="-mb-3">
        <BrandBar />
      </div>
      <div className="bento-hero-grid">
        <ProfileTile />
        <div className="bento-hero-side">
          <Rebound />
          <LocationTile />
        </div>
      </div>
      <section
        aria-label="Featured projects"
        className="min-w-0 scroll-mt-20"
        id="projects"
        ref={ref}
      >
        <h2 className="sr-only">Featured projects</h2>
        <ProjectSlider projects={showcase} />
      </section>
      <div className="grid items-stretch gap-3 md:grid-cols-[1.2fr_1fr]">
        <About />
        <Experience />
      </div>
      <BlogSection posts={posts} />
      <ContactSection id="contact" />
    </div>
  );
}
