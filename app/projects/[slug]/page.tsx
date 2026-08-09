import {
  IconArrowLeft,
  IconBrandGithub,
  IconExternalLink,
} from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CoverCanvas } from "@/components/blog/cover-canvas";
import { CanvasGrain } from "@/components/canvas-grain";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/lib/data";
import {
  getAllProjectSlugs,
  getProjectBySlug,
  getVisibleProjects,
  slugifyProjectTitle,
} from "@/lib/projects";
import { cn } from "@/lib/utils";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    alternates: { canonical: `/projects/${slug}` },
    description: project.description,
    openGraph: {
      description: project.description,
      title: project.title,
      type: "website",
      url: `${siteConfig.siteUrl}/projects/${slug}`,
    },
    title: `${project.title} | ${siteConfig.name}`,
  };
}

function NavCard({
  title,
  slug,
  direction,
}: {
  direction: "prev" | "next";
  slug: string;
  title: string;
}) {
  const isPrev = direction === "prev";
  return (
    <Link
      className={cn(
        "group flex flex-1 flex-col gap-2 rounded-xl border border-border p-5",
        "min-h-[44px] transition-colors duration-150",
        "[@media(hover:hover)]:hover:border-border [@media(hover:hover)]:hover:bg-muted",
        isPrev ? "items-start" : "items-end text-right"
      )}
      href={`/projects/${slug}`}
    >
      <span className="ui-label text-muted-foreground">
        {isPrev ? "← Previous" : "Next →"}
      </span>
      <span
        className={cn(
          "font-syne",
          "text-[15px] font-semibold text-foreground leading-snug line-clamp-2"
        )}
      >
        {title}
      </span>
    </Link>
  );
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const visible = getVisibleProjects();
  const index = visible.findIndex((p) => p.title === project.title);
  const prev = index > 0 ? visible[index - 1] : null;
  const next = index < visible.length - 1 ? visible[index + 1] : null;

  return (
    <main className="w-full py-12 sm:py-20 lg:py-28">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6">
        <Link
          className="mb-10 inline-flex items-center gap-2 py-2 text-[14px] text-muted-foreground
                     transition-colors [@media(hover:hover)]:hover:text-foreground"
          href="/#projects"
        >
          <IconArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>

        {project.tags.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <Badge key={t} variant="secondary">
                {t}
              </Badge>
            ))}
          </div>
        )}

        <h1
          className={cn(
            "font-syne",
            "mb-6 break-words font-black leading-[1.08] tracking-tight text-foreground"
          )}
          style={{ fontSize: "clamp(1.6rem, 5vw, 3rem)" }}
        >
          {project.title}
        </h1>

        <div className="relative mb-10 aspect-[16/7] overflow-hidden rounded-2xl">
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(150deg, #0a0a0c 0%, #1c1c20 100%)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute -top-24 -left-24 h-[420px] w-[420px] rounded-full"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.06) 0%, transparent 62%)",
            }}
          />
          <CanvasGrain />
          <CoverCanvas tags={project.tags} title={project.title} />
        </div>

        <p className="mb-8 max-w-[68ch] text-[16px] leading-[1.8] text-foreground/80">
          {project.description}
        </p>

        {(project.github || project.demo) && (
          <div className="mb-16 flex flex-wrap gap-3">
            {project.github && (
              <a
                className="inline-flex items-center gap-2 rounded-full border border-border
                           bg-foreground/[0.03] px-4 py-2 text-[13px] font-medium text-foreground/80
                           transition-colors [@media(hover:hover)]:hover:bg-foreground/[0.06] [@media(hover:hover)]:hover:text-foreground"
                href={project.github}
                rel="noopener noreferrer"
                target="_blank"
              >
                <IconBrandGithub className="h-4 w-4" />
                View source
              </a>
            )}
            {project.demo && (
              <a
                className="inline-flex items-center gap-2 rounded-full border border-border
                           bg-foreground/[0.03] px-4 py-2 text-[13px] font-medium text-foreground/80
                           transition-colors [@media(hover:hover)]:hover:bg-foreground/[0.06] [@media(hover:hover)]:hover:text-foreground"
                href={project.demo}
                rel="noopener noreferrer"
                target="_blank"
              >
                <IconExternalLink className="h-4 w-4" />
                View demo
              </a>
            )}
          </div>
        )}

        {(prev || next) && (
          <nav
            aria-label="Project navigation"
            className="flex flex-col gap-3 border-t border-border pt-8 sm:flex-row"
          >
            {prev ? (
              <NavCard
                direction="prev"
                slug={slugifyProjectTitle(prev.title)}
                title={prev.title}
              />
            ) : (
              <div aria-hidden="true" className="hidden flex-1 sm:block" />
            )}
            {next ? (
              <NavCard
                direction="next"
                slug={slugifyProjectTitle(next.title)}
                title={next.title}
              />
            ) : (
              <div aria-hidden="true" className="hidden flex-1 sm:block" />
            )}
          </nav>
        )}
      </div>
    </main>
  );
}
