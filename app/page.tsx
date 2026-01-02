import dynamic from "next/dynamic";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

// Dynamic imports with Next.js for better chunk splitting
// Priority: Intro loads first (above fold), others load as user scrolls
const Intro = dynamic(() => import("@/components/intro"), {
  loading: () => <SectionSkeleton minHeight="100vh" />,
});

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

const LetsWorkTogether = dynamic(
  () => import("@/components/ui/lets-work-section").then((mod) => mod.LetsWorkTogether),
  { loading: () => <SectionSkeleton minHeight="200px" /> }
);

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
      {/* Dynamic imports handle their own loading states */}
      <Intro />
      <About />
      <Projects />
      <BlogSection />
      <Experience />
      <LetsWorkTogether />
      <SpeedInsights />
      <Analytics />
    </main>
  );
}
