import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import dynamic from "next/dynamic";
import { getAllPosts } from "@/lib/blog";
import { projectsData } from "@/lib/data";
import { cn } from "@/lib/utils";
import {
  LocationTile,
  FeaturedProjectTile,
  SocialsTile,
} from "@/components/bento";

// ─── Client tiles (need browser hooks) ───────────────────────────────────────
const ProfileTile = dynamic(
  () => import("@/components/bento/profile-tile").then((m) => m.ProfileTile),
  { loading: () => <div className="min-h-[400px]" /> }
);

const CTATile = dynamic(
  () => import("@/components/bento/cta-tile").then((m) => m.CTATile),
  { loading: () => <div className="min-h-[240px]" /> }
);

// ─── Lazy section components (deferred below fold) ───────────────────────────
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

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SectionSkeleton({ minHeight = "400px" }: { minHeight?: string }) {
  return (
    <div className="p-8 animate-pulse space-y-4" style={{ minHeight }}>
      <div className="h-3 bg-black/[0.05] rounded w-1/4" />
      <div className="h-8 bg-black/[0.05] rounded w-2/3 mt-3" />
      <div className="h-3.5 bg-black/[0.03] rounded w-1/2 mt-6" />
      <div className="h-3.5 bg-black/[0.03] rounded w-2/5" />
    </div>
  );
}

// ─── Glass bento tile ─────────────────────────────────────────────────────────
/**
 * Light glass card — universal wrapper for bento cells.
 *
 * Tokens:
 *   fill:          warm white translucent gradient
 *   blur:          backdrop-blur-[16px]
 *   border:        1px solid rgba(20,20,40,0.06)
 *   top highlight: inset 0 1px 0 rgba(255,255,255,0.70)
 *   outer shadow:  soft diffuse light gray
 *   radius:        rounded-3xl (1.5rem)
 *   hover lift:    translateY(-3px) + hairline border darken
 */
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
    // Inverted tile — zinc-950 bg, no glass treatment
    return (
      <div
        className={cn(
          "rounded-3xl overflow-hidden",
          className
        )}
        style={style}
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

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const posts = getAllPosts().slice(0, 6);

  return (
    <main className="px-3 sm:px-5 lg:px-6 pb-24 sm:pb-28 pt-2 overflow-x-hidden">
      <div className="mx-auto max-w-7xl min-w-0">
        {/*
          ── Bento grid — 12 cols (lg) · 2 cols (sm) · 1 col (mobile) ──────────

          Desktop layout  (lg, 12 cols):
            Row 1    : Profile (col 1-8)          | Location (col 9-12)
            Row 2    : Profile continues           | Stack (col 9-12)  ← row-span-2
            Row 3    : About (col 1-8)             | Stack continues
            Row 4    : [MARQUEE — full width]
            Row 5    : Featured Proj 1 (col 1-6)  | Featured Proj 2 (col 7-12)
            Row 6    : All Projects (col 1-12)
            Row 7    : Blog (col 1-7)              | Experience (col 8-12)
            Row 8    : CTA (col 1-12)  — DARK ANCHOR
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 [grid-auto-flow:dense]">

          {/* ── 1. Profile tile — HERO ────────────────────────────────────── */}
          <BentoTile
            hover={false}
            className="col-span-1 sm:col-span-2 lg:col-span-8 lg:row-span-2"
            style={{ background: "rgba(255,255,255,0.80)" } as React.CSSProperties}
          >
            <ProfileTile />
          </BentoTile>

          {/* ── 2. Location mini tile ─────────────────────────────────────── */}
          <BentoTile className="col-span-1 lg:col-span-4">
            <LocationTile />
          </BentoTile>

          {/* ── 3. Socials — brand-colored, single-row top-right ─────────── */}
          <BentoTile
            hover={false}
            className="col-span-1 sm:col-span-1 lg:col-span-4"
          >
            <SocialsTile />
          </BentoTile>

          {/* ── 4. About tile — full width ────────────────────────────────── */}
          <BentoTile
            hover={false}
            className="col-span-1 sm:col-span-2 lg:col-span-12"
            style={{ background: "rgba(255,255,255,0.80)" } as React.CSSProperties}
          >
            <About />
          </BentoTile>

          {/* ── 6. Featured project — OpenKVM ────────────────────────────── */}
          <BentoTile className="col-span-1 lg:col-span-6">
            <FeaturedProjectTile project={projectsData[0]} index={0} />
          </BentoTile>

          {/* ── 7. Featured project — Brik ───────────────────────────────── */}
          <BentoTile className="col-span-1 lg:col-span-6">
            <FeaturedProjectTile project={projectsData[1]} index={1} />
          </BentoTile>

          {/* ── 8. All projects tile ─────────────────────────────────────── */}
          <BentoTile
            hover={false}
            className="col-span-1 sm:col-span-2 lg:col-span-12"
          >
            <Projects />
          </BentoTile>

          {/* ── 9. Blog tile ─────────────────────────────────────────────── */}
          <BentoTile
            hover={false}
            className="col-span-1 sm:col-span-2 lg:col-span-7"
          >
            <BlogSection posts={posts} />
          </BentoTile>

          {/* ── 10. Experience tile ──────────────────────────────────────── */}
          <BentoTile
            hover={false}
            className="col-span-1 sm:col-span-2 lg:col-span-5"
          >
            <Experience />
          </BentoTile>

          {/* ── 11. CTA tile — DARK INK ANCHOR (Move 5) ─────────────────── */}
          <BentoTile
            dark={true}
            hover={false}
            className="col-span-1 sm:col-span-2 lg:col-span-12"
          >
            <CTATile />
          </BentoTile>

        </div>
      </div>
      <SpeedInsights />
      <Analytics />
    </main>
  );
}
