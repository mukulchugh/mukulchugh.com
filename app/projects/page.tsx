import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import Projects from "@/components/projects";

export const metadata: Metadata = {
  alternates: { canonical: "/projects" },
  description:
    "Products, tools, and experiments by Mukul Chugh, with the work behind them.",
  title: "Projects",
};

export default function ProjectsPage() {
  return (
    <PageShell>
      <main className="page-content">
        <header className="mb-10">
          <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-6xl">
            The work.
          </h1>
          <p className="mt-4 max-w-[60ch] text-base leading-7 text-muted-foreground">
            Products, tools, and experiments. Explore the details behind each.
          </p>
        </header>
        <section
          aria-label="Project collections"
          className="bento-surface p-6 sm:p-10"
        >
          <h2 className="sr-only">Project collections</h2>
          <Projects />
        </section>
      </main>
    </PageShell>
  );
}
