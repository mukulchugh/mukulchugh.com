import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import dynamic from "next/dynamic";
import { getAllPosts } from "@/lib/blog";
import { projectsData } from "@/lib/data";
import { cn } from "@/lib/utils";
import { LocationTile, StackTile, FeaturedProjectTile } from "@/components/bento";

// ─── Client tiles (need browser hooks) ───────────────────────────────────────
const ProfileTile = dynamic(
  () => import("@/components/bento/profile-tile").then((m) => m.ProfileTile),
  { loading: () => <div className="min-h-[360px]" /> }
);

const CTATile = dynamic(
  () => import("@/components/bento/cta-tile").then((m) => m.CTATile),
  { loading: () => <div className="min-h-[220px]" /> }
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
      <div className="h-5 bg-black/[0.06] rounded w-1/3" />
      <div className="h-3.5 bg-black/[0.04] rounded w-2/3" />
      <div className="h-3.5 bg-black/[0.04] rounded w-1/2" />
    </div>
  );
}

// ─── Glass bento tile ─────────────────────────────────────────────────────────
/**
 * Dark glass card — the universal wrapper for every bento cell.
 *
 * Tokens:
 *   fill:          bg-white/[0.042]  (near-solid dark under aurora)
 *   blur:          backdrop-blur-[12px]
 *   border:        1px solid rgba(255,255,255,0.08)
 *   top highlight: inset 0 1px 0 rgba(255,255,255,0.09)
 *   shadow:        0 4px 32px rgba(0,0,0,0.28)
 *   radius:        rounded-3xl (1.5rem)
 *   hover lift:    translateY(-2px) + deeper shadow
 */
function BentoTile({
  className,
  style,
  children,
  hover = true,
}: {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  hover?: boolean;
}) {
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
    <main className="px-4 sm:px-6 pb-28 pt-2">
      <div className="mx-auto max-w-6xl">
        {/*
          ── Bento grid — 12 cols (lg) · 2 cols (sm) · 1 col (mobile) ──────────

          Desktop layout  (lg, 12 cols):
            Row 1    : Profile (col 1-8)          | Location (col 9-12)
            Row 2    : Profile continues           | Stack (col 9-12)  ← row-span-2
            Row 3    : About (col 1-8)             | Stack continues
            Row 4    : Featured Proj 1 (col 1-6)  | Featured Proj 2 (col 7-12)
            Row 5+   : All Projects (col 1-12)
            Row 6    : Blog (col 1-7)              | Experience (col 8-12)
            Row 7    : CTA (col 1-12)

          grid-auto-flow: dense packs small tiles into any open gap.
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 [grid-auto-flow:dense]">

          {/* ── 1. Profile tile — avatar · available · name · chips · socials ── */}
          <BentoTile
            hover={false}
            className="col-span-1 sm:col-span-2 lg:col-span-8 lg:row-span-2"
            style={{ background: "rgba(255,255,255,0.78)" } as React.CSSProperties}
          >
            <ProfileTile />
          </BentoTile>

          {/* ── 2. Location mini tile ─────────────────────────────────────────── */}
          <BentoTile className="col-span-1 lg:col-span-4">
            <LocationTile />
          </BentoTile>

          {/* ── 3. Stack / Tools tile — row-span-2 fills rows 2-3 on right ────── */}
          <BentoTile className="col-span-1 sm:col-span-1 lg:col-span-4 lg:row-span-2">
            <StackTile />
          </BentoTile>

          {/* ── 4. About tile ────────────────────────────────────────────────── */}
          <BentoTile
            hover={false}
            className="col-span-1 sm:col-span-2 lg:col-span-8"
            style={{ background: "rgba(255,255,255,0.78)" } as React.CSSProperties}
          >
            <About />
          </BentoTile>

          {/* ── 5. Featured project — OpenKVM ────────────────────────────────── */}
          <BentoTile className="col-span-1 lg:col-span-6">
            <FeaturedProjectTile project={projectsData[0]} index={0} />
          </BentoTile>

          {/* ── 6. Featured project — Brik ───────────────────────────────────── */}
          <BentoTile className="col-span-1 lg:col-span-6">
            <FeaturedProjectTile project={projectsData[1]} index={1} />
          </BentoTile>

          {/* ── 7. All projects tile ─────────────────────────────────────────── */}
          <BentoTile
            hover={false}
            className="col-span-1 sm:col-span-2 lg:col-span-12"
          >
            <Projects />
          </BentoTile>

          {/* ── 8. Blog tile ─────────────────────────────────────────────────── */}
          <BentoTile
            hover={false}
            className="col-span-1 sm:col-span-2 lg:col-span-7"
          >
            <BlogSection posts={posts} />
          </BentoTile>

          {/* ── 9. Experience tile ───────────────────────────────────────────── */}
          <BentoTile
            hover={false}
            className="col-span-1 sm:col-span-2 lg:col-span-5"
          >
            <Experience />
          </BentoTile>

          {/* ── 10. CTA tile — Let's work together ───────────────────────────── */}
          <BentoTile
            hover={false}
            className="col-span-1 sm:col-span-2 lg:col-span-12"
            style={{ background: "rgba(255,255,255,0.65)" } as React.CSSProperties}
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
