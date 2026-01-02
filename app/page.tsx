import React, { Suspense } from "react";

const About = React.lazy(() => import("@/components/about"));
const BlogSection = React.lazy(() => import("@/components/blog-section"));
const Experience = React.lazy(() => import("@/components/experience"));
const Intro = React.lazy(() => import("@/components/intro"));
const Projects = React.lazy(() => import("@/components/projects"));
import { LetsWorkTogether } from "@/components/ui/lets-work-section";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

function SectionSkeleton({ minHeight = "400px" }: { minHeight?: string }) {
  return (
    <section className="w-full max-w-4xl mb-20 scroll-mt-28" style={{ minHeight }}>
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-800 rounded w-1/3" />
        <div className="h-4 bg-gray-800 rounded w-2/3" />
        <div className="h-4 bg-gray-800 rounded w-1/2" />
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="flex flex-col items-center px-4">
      <Suspense fallback={<SectionSkeleton minHeight="100vh" />}>
        <Intro />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <About />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <Projects />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <BlogSection />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <Experience />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <LetsWorkTogether />
      </Suspense>
      <SpeedInsights />
      <Analytics />
    </main>
  );
}
