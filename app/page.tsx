import React, { Suspense } from "react";

const About = React.lazy(() => import("@/components/about"));
const Experience = React.lazy(() => import("@/components/experience"));
const Intro = React.lazy(() => import("@/components/intro"));
const Projects = React.lazy(() => import("@/components/projects"));
const SectionDivider = React.lazy(() => import("@/components/section-divider"));
const Skills = React.lazy(() => import("@/components/skills"));
import { LetsWorkTogether } from "@/components/ui/lets-work-section";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

export default function Home() {
  return (
    <main className="flex flex-col items-center px-4">
      <Suspense fallback={<div>Loading...</div>}>
        <Intro />
        <SectionDivider />
        <About />
        <Projects />
        <Skills />
        <Experience />
        <LetsWorkTogether />
        <SpeedInsights />
        <Analytics />
      </Suspense>
    </main>
  );
}
