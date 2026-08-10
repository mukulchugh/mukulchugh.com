import {
  IconArrowLeft,
  IconBrandGithub,
  IconExternalLink,
  IconLock,
  IconTag,
} from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CanvasGrain } from "@/components/canvas-grain";
import { buttonVariants } from "@/components/ui/button";
import { accentColorForTags, topicFamilyFor } from "@/lib/blog-topic";
import { siteConfig } from "@/lib/data";
import {
  getAllProjectSlugs,
  getProjectBySlug,
  getVisibleProjects,
  slugifyProjectTitle,
} from "@/lib/projects";
import { PAGE_TITLE } from "@/lib/typography";
import { cn } from "@/lib/utils";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

// Human-readable label per generative-pattern family — purely presentational,
// derived from the same tag-matching used by CoverCanvas/PostCover.
const PATTERN_LABELS: Partial<Record<string, string>> = {
  circuit: "Engineering & Infrastructure",
  graph: "AI & Agents",
  grid: "Mobile & Platform",
  path: "Product & Career",
};

function withAlpha(rgb: string, alpha: number): string {
  return rgb.replace("rgb(", "rgba(").replace(")", `, ${alpha})`);
}

// The hero graphic is the project's own name, not a generative pattern —
// per the owner's direction, project thumbnails/covers should be
// text-forward. Using just the first word keeps the display type legible
// at oversized sizes even for longer, multi-word titles.
function heroWordFor(title: string): string {
  const [first] = title.trim().split(/\s+/);
  return first ?? title;
}

// Splits a description into its lead sentence (pull-quote treatment) and the
// remaining sentence(s), if any — a restructuring of the existing copy, not
// new content. Falls back to the whole string as the lead when there's only
// one sentence.
function splitLeadSentence(description: string): {
  lead: string;
  rest: string | null;
} {
  const match = description.match(/^(.*?[.!?])\s+(.*)$/s);
  if (!match) {
    return { lead: description, rest: null };
  }
  return { lead: match[1], rest: match[2] };
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
        "group flex flex-1 flex-col gap-2 rounded-none border border-border p-5",
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

  const accent = accentColorForTags(project.tags);
  const accentSoft = withAlpha(accent, 0.4);
  const family = topicFamilyFor(project.tags);
  const eyebrow =
    (family && PATTERN_LABELS[family.pattern]) || "Independent project";
  const { lead, rest } = splitLeadSentence(project.description);
  const heroWord = heroWordFor(project.title);
  const isOpenSource = Boolean(project.github);
  const hasDemo = Boolean(project.demo);

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

        {/* Eyebrow — topic family + position in the project set, both derived from real data */}
        <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="inline-flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-none"
              style={{ background: accent }}
            />
            <span className="ui-label text-muted-foreground">{eyebrow}</span>
          </span>
          <span className="ui-label text-muted-foreground/40">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(visible.length).padStart(2, "0")}
          </span>
        </div>

        <h1
          className={cn(
            "font-syne",
            "mb-5 break-words font-black leading-[1.08] tracking-tight text-foreground"
          )}
          style={{ fontSize: PAGE_TITLE }}
        >
          {project.title}
        </h1>

        {/* Status meta — directly derivable from github/demo presence, no invented facts */}
        <div className="mb-10 flex flex-wrap items-center gap-3 sm:gap-6 text-[12px] text-muted-foreground">
          <div className="flex items-center gap-2">
            {isOpenSource ? (
              <IconBrandGithub className="h-3.5 w-3.5" />
            ) : (
              <IconLock className="h-3.5 w-3.5" />
            )}
            <span>{isOpenSource ? "Open source" : "Closed source"}</span>
          </div>
          <div className="flex items-center gap-2">
            <IconExternalLink className="h-3.5 w-3.5" />
            <span>{hasDemo ? "Live demo available" : "No public demo"}</span>
          </div>
        </div>

        <div className="relative mb-12 aspect-[16/7] overflow-hidden rounded-none border border-border">
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(150deg, #0a0a0c 0%, #1c1c20 100%)",
            }}
          />
          {/* Topic tint — same recipe as PostCover's hero, reflects the project's subject */}
          {family && (
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(120% 90% at 15% 100%, ${family.tint} 0%, transparent 60%)`,
              }}
            />
          )}
          <div
            aria-hidden="true"
            className="absolute -top-24 -left-24 h-[420px] w-[420px] rounded-none"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.06) 0%, transparent 62%)",
            }}
          />
          {/* Per-project accent glow — content-seeded, same convention as the homepage project grid */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -bottom-16 h-64 w-64 rounded-none opacity-[0.16] blur-3xl"
            style={{ background: accent }}
          />
          <CanvasGrain />

          {/* Text-forward hero mark — the project's own name is the visual,
              in place of the blog's generative constellation pattern (per
              the owner's direction: projects use type, not pattern-art).
              Oversized font-syne wordmark, gradient-tinted with the topic
              accent, clipped by the banner's overflow-hidden so long titles
              bleed off the trailing edge instead of shrinking to fit. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-center overflow-hidden pl-5 pr-2 sm:pl-8"
          >
            <span
              className={cn(
                "font-syne",
                "block whitespace-nowrap font-black leading-[0.85] tracking-[-0.045em]"
              )}
              style={{
                backgroundClip: "text",
                backgroundImage: `linear-gradient(115deg, ${accent} 0%, ${accentSoft} 60%, rgba(255,255,255,0.12) 100%)`,
                color: "transparent",
                fontSize: "clamp(3.25rem, 13vw, 8.5rem)",
                WebkitBackgroundClip: "text",
              }}
            >
              {heroWord}
            </span>
          </div>

          {/* Bottom fade for readability — matches PostCover's hero treatment */}
          <div
            aria-hidden="true"
            className="absolute bottom-0 inset-x-0 h-16 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.25) 0%, transparent 100%)",
            }}
          />

          {/* Topic badge — top-right, reuses the same eyebrow label shown above the title */}
          <span
            className="absolute top-3 right-3 inline-flex items-center gap-1
                       px-2 py-0.5 rounded-none
                       bg-white/[0.1] border border-white/[0.15] backdrop-blur-sm
                       ui-label text-white/70"
          >
            <IconTag aria-hidden="true" className="h-2.5 w-2.5" />
            {eyebrow}
          </span>

          {/* Source status — bottom-left, same slot as PostCover's read-time label,
              filled with the same real github/demo-derived fact used in the meta row below */}
          <span className="ui-label absolute bottom-3 left-4 inline-flex items-center gap-1 text-white/50">
            {isOpenSource ? (
              <IconBrandGithub aria-hidden="true" className="h-2.5 w-2.5" />
            ) : (
              <IconLock aria-hidden="true" className="h-2.5 w-2.5" />
            )}
            {isOpenSource ? "Open source" : "Closed source"}
          </span>
        </div>

        {/* Pull-quote — the description's lead sentence, restructured for hierarchy */}
        <blockquote
          className="mb-6 max-w-[62ch] border-l-2 pl-5 sm:pl-6"
          style={{ borderColor: accentSoft }}
        >
          <p
            className={cn(
              "font-syne",
              "text-[1.375rem] font-medium leading-[1.35] tracking-tight text-foreground text-pretty sm:text-[1.625rem]"
            )}
          >
            {lead}
          </p>
        </blockquote>

        {rest && (
          <p className="mb-12 max-w-[62ch] text-[16px] leading-[1.8] text-foreground/75 text-pretty">
            {rest}
          </p>
        )}

        {project.tags.length > 0 && (
          <section className="mb-8 rounded-none border border-border p-5 sm:p-6">
            <h2 className="ui-label mb-5 text-muted-foreground">Stack</h2>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
              {project.tags.map((tag, i) => (
                <li className="flex items-center gap-2.5" key={tag}>
                  <span className="ui-label tabular-nums text-muted-foreground/35">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[13px] font-medium text-foreground/85">
                    {tag}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {(project.github || project.demo) && (
          <div className="mb-16 flex flex-wrap gap-3">
            {project.github && (
              <a
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "rounded-none"
                )}
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
                className={cn(
                  buttonVariants({ variant: "secondary" }),
                  "rounded-none"
                )}
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
