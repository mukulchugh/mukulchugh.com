import About from "@/components/about";
import BlogSection from "@/components/blog-section";
import Experience from "@/components/experience";
import Intro from "@/components/intro";
import Projects from "@/components/projects";
import { LetsWorkTogether } from "@/components/ui/lets-work-section";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

export default function Home() {
  return (
    <main className="flex flex-col items-center px-4">
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
