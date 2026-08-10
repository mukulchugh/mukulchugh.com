"use client";

import dynamic from "next/dynamic";
import {
  FeaturedProjectTile,
  LocationTile,
  SocialsTile,
} from "@/components/bento";
import { Reveal } from "@/components/ui/reveal";
import { Skeleton } from "@/components/ui/skeleton";
import type { Post } from "@/lib/blog";
import { projectsData } from "@/lib/data";
import { cn } from "@/lib/utils";

const ProfileTile = dynamic(
  () => import("@/components/bento/profile-tile").then((m) => m.ProfileTile),
  { loading: () => <div className="min-h-[360px]" /> }
);

const CTATile = dynamic(
  () => import("@/components/bento/cta-tile").then((m) => m.CTATile),
  {
    loading: () => (
      <div className="min-h-[420px] sm:min-h-[480px] lg:min-h-[560px]" />
    ),
  }
);

const About = dynamic(() => import("@/components/about"), {
  loading: () => <SectionSkeleton />,
});

const Projects = dynamic(() => import("@/components/projects"), {
  loading: () => <SectionSkeleton />,
});

const BlogSection = dynamic(() => import("@/components/blog-section"), {
  loading: () => <SectionSkeleton />,
});

const Experience = dynamic(() => import("@/components/experience"), {
  loading: () => <SectionSkeleton />,
});

function SectionSkeleton({ minHeight = "400px" }: { minHeight?: string }) {
  return (
    <div className="flex flex-col gap-4 p-6" style={{ minHeight }}>
      <Skeleton className="h-2.5 w-1/4" />
      <Skeleton className="mt-3 h-7 w-2/3" />
      <Skeleton className="mt-6 h-3.5 w-1/2" />
      <Skeleton className="h-3.5 w-2/5" />
    </div>
  );
}

function BentoTile({
  className,
  style,
  children,
  hover = true,
  dark = false,
}: {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  hover?: boolean;
  dark?: boolean;
}) {
  if (dark) {
    return (
      <div
        className={cn("overflow-hidden", className)}
        style={{ borderRadius: 0, ...style }}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn("glass-tile", hover && "glass-tile-hover", className)}
      style={style}
    >
      {children}
    </div>
  );
}

/** Per-tile entry — each animates when it enters the viewport (Motion whileInView). */
function Entry({
  children,
  className,
  delay = 0,
  variant = "rise",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: "rise" | "hero" | "fade" | "scale";
}) {
  return (
    <Reveal
      className={cn("min-w-0", className)}
      delay={delay}
      variant={variant}
    >
      {children}
    </Reveal>
  );
}

export function HomeBento({ posts }: { posts: Post[] }) {
  return (
    <div className="grid min-w-0 grid-cols-1 gap-3 [grid-auto-flow:dense] sm:grid-cols-2 sm:gap-4 lg:grid-cols-12">
      <Entry
        className="col-span-1 sm:col-span-2 lg:col-span-7 lg:row-span-2"
        delay={0.02}
        variant="hero"
      >
        <BentoTile className="h-full min-w-0" hover={false}>
          <ProfileTile />
        </BentoTile>
      </Entry>

      <Entry className="col-span-1 lg:col-span-5" delay={0.08} variant="scale">
        <BentoTile className="h-full min-w-0">
          <LocationTile />
        </BentoTile>
      </Entry>

      <Entry
        className="col-span-1 sm:col-span-1 lg:col-span-5"
        delay={0.12}
        variant="scale"
      >
        <BentoTile className="h-full min-w-0" hover={false}>
          <SocialsTile />
        </BentoTile>
      </Entry>

      <Entry className="col-span-1 sm:col-span-2 lg:col-span-7 lg:row-span-2">
        <BentoTile className="h-full min-w-0" hover={false}>
          <About />
        </BentoTile>
      </Entry>

      <Entry className="col-span-1 lg:col-span-5" delay={0.04} variant="scale">
        <BentoTile className="h-full min-w-0">
          <FeaturedProjectTile index={0} project={projectsData[0]} />
        </BentoTile>
      </Entry>

      <Entry className="col-span-1 lg:col-span-5" delay={0.08} variant="scale">
        <BentoTile className="h-full min-w-0">
          <FeaturedProjectTile index={1} project={projectsData[1]} />
        </BentoTile>
      </Entry>

      <Entry className="col-span-1 sm:col-span-2 lg:col-span-12">
        <BentoTile className="h-full min-w-0" hover={false}>
          <Projects />
        </BentoTile>
      </Entry>

      <Entry className="col-span-1 sm:col-span-2 lg:col-span-12">
        <BentoTile className="h-full min-w-0" hover={false}>
          <BlogSection posts={posts} />
        </BentoTile>
      </Entry>

      <Entry className="col-span-1 sm:col-span-2 lg:col-span-12" delay={0.04}>
        <BentoTile className="h-full min-w-0" hover={false}>
          <Experience />
        </BentoTile>
      </Entry>

      <Entry className="col-span-1 sm:col-span-2 lg:col-span-12" variant="fade">
        <BentoTile className="h-full min-w-0" dark hover={false}>
          <CTATile />
        </BentoTile>
      </Entry>
    </div>
  );
}
