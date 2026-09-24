import {
  IconArrowLeft,
  IconArrowUpRight,
  IconBrandFirebase,
  IconBrandGithub,
  IconBrandGolang,
  IconBrandGraphql,
  IconBrandNextjs,
  IconBrandOpenSource,
  IconBrandReact,
  IconBrandStripe,
  IconBrandSwift,
  IconBrandTailwind,
  IconBrandTypescript,
  IconChartLine,
  IconCloud,
  IconCode,
  IconCpu,
  IconDatabase,
  IconDeviceDesktop,
  IconDeviceMobile,
  IconDeviceWatch,
  IconExternalLink,
  IconHeart,
  IconLock,
  IconMicrophone,
  IconNetwork,
  IconPalette,
  IconServer,
  IconStack2,
  IconUsers,
} from "@tabler/icons-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageJsonLd } from "@/components/page-json-ld";
import { PageShell } from "@/components/page-shell";
import { buttonVariants } from "@/components/ui/button";
import { projectDetails } from "@/lib/project-details";
import {
  getAllProjectSlugs,
  getProjectBySlug,
  getProjectCollection,
  getVisibleProjects,
  projectLinkLabel,
  slugifyProjectTitle,
} from "@/lib/projects";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";
import {
  HealthPrinciple,
  ProjectVisuals,
  projectReferenceAssets,
  SkillsWorkflow,
} from "./project-visuals";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

import {
  focusPanels,
  overviewBodies,
  overviewTitles,
} from "@/lib/project-editorial";

const technologyIcons: Record<string, typeof IconCode> = {
  "Agent Skills": IconStack2,
  "AI Agents": IconCpu,
  Apollo: IconNetwork,
  "Apple Watch": IconDeviceWatch,
  Audio: IconMicrophone,
  Backend: IconServer,
  Bonjour: IconNetwork,
  ChartJS: IconChartLine,
  "CoinGecko API": IconChartLine,
  Collaboration: IconUsers,
  "Core Audio": IconMicrophone,
  "Customer Success": IconUsers,
  "Design Systems": IconPalette,
  Expo: IconDeviceMobile,
  Firebase: IconBrandFirebase,
  "Full Stack": IconStack2,
  Golang: IconBrandGolang,
  "Google Cloud": IconCloud,
  Grafana: IconChartLine,
  GraphQL: IconBrandGraphql,
  HealthKit: IconHeart,
  "Human-in-the-loop": IconUsers,
  "Jetpack Compose": IconDeviceMobile,
  "Long-term Memory": IconDatabase,
  MCP: IconNetwork,
  Mobile: IconDeviceMobile,
  "Multi-Agent Systems": IconNetwork,
  macOS: IconDeviceDesktop,
  Networking: IconNetwork,
  NextJS: IconBrandNextjs,
  "Open Source": IconBrandOpenSource,
  "Private health product": IconLock,
  "Private infrastructure": IconServer,
  "Private product work": IconLock,
  "Private project": IconLock,
  "Private venture": IconLock,
  "Product Design": IconPalette,
  React: IconBrandReact,
  "React Native": IconBrandReact,
  Stripe: IconBrandStripe,
  Swift: IconBrandSwift,
  SwiftUI: IconDeviceMobile,
  TailwindCSS: IconBrandTailwind,
  TypeScript: IconBrandTypescript,
  VPS: IconServer,
  watchOS: IconDeviceWatch,
};

// Preserve the reference panels' geometry without changing canonical tags.
const technologyLayouts: Record<
  string,
  "strip" | "grid" | "stack" | "three-two" | "two-three"
> = {
  altr: "stack",
  brik: "three-two",
  "cryptomedia-cryptocurrency-tracker": "stack",
  ferry: "two-three",
  heroapp: "grid",
  "moshi-health": "stack",
  "moshi-personal-agent-fleet": "stack",
  openkvm: "strip",
  pulse: "stack",
  "quivly-agents": "grid",
  "quivly-design-language": "grid",
  "quivly-platform": "grid",
  "quivly-skills": "stack",
  "rca-tool-grafana-plugin": "grid",
  tethr: "stack",
  "zendash-global-admin-dashboard": "strip",
  zepeats: "grid",
};

export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  return pageMetadata(`/projects/${slug}`, project.title, project.description);
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  const details = projectDetails[slug];
  const collection = getProjectCollection(slug);
  const visible = collection
    ? getVisibleProjects().filter((entry) =>
        collection.slugs.some(
          (item) => item === slugifyProjectTitle(entry.title)
        )
      )
    : getVisibleProjects();
  const index = visible.findIndex((entry) => entry.title === project.title);
  const previous = index > 0 ? visible[index - 1] : null;
  const next = visible[(index + 1) % visible.length];
  const nextSlug = slugifyProjectTitle(next.title);
  const longTitle = project.title.length > 20;
  const hasLinks = Boolean(project.github || project.demo);
  const focus = focusPanels[slug];
  const skills = slug === "quivly-skills";
  const health = slug === "moshi-health";
  const technologyLayout = technologyLayouts[slug] ?? "grid";
  const technologyStack = technologyLayout === "stack";
  const technologyStrip = technologyLayout === "strip";
  const technologySplit =
    technologyLayout === "three-two" || technologyLayout === "two-three";
  const compactEnding =
    slug === "pulse" || slug === "moshi-personal-agent-fleet";
  const nextVariant =
    slug === "ferry"
      ? "lime"
      : slug === "moshi-health"
        ? "orbit"
        : slug === "altr"
          ? "type"
          : compactEnding
            ? "compact"
            : [
                  "quivly-agents",
                  "quivly-platform",
                  "quivly-design-language",
                ].includes(slug)
              ? "banner"
              : "preview";
  const fullWidthNext = ["orbit", "type", "banner"].includes(nextVariant);
  const linksFirst = slug === "openkvm" || slug === "brik";

  return (
    <PageShell>
      <main>
        <PageJsonLd
          description={project.description}
          path={`/projects/${slug}`}
          title={project.title}
          type="CreativeWork"
        />
        <div className="flex flex-col gap-3">
          <div
            className={cn(
              "grid gap-3",
              slug === "altr" ? "md:grid-cols-[.85fr_1.15fr]" : "md:grid-cols-2"
            )}
          >
            <section className="bento-surface flex flex-col p-5 sm:p-6 md:p-[1.7cqw]">
              <div className="flex items-center justify-between gap-3">
                <span className="bento-label">01 / Project</span>
                <Link
                  className="inline-flex min-h-11 items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                  href="/#projects"
                >
                  <IconArrowLeft aria-hidden="true" size={14} /> All projects
                </Link>
              </div>
              <h1
                className={cn(
                  "my-5 break-words font-bold leading-[1.1] tracking-[-.03em] md:my-[2.3cqw]",
                  longTitle
                    ? "text-[clamp(28px,4cqw,56px)]"
                    : "text-[clamp(32px,5cqw,64px)]"
                )}
              >
                {project.title}
              </h1>
              <p className="max-w-[48ch] text-[clamp(15px,1.7cqw,24px)] leading-[1.4] text-foreground/80">
                {project.description}
              </p>
              <div className="mt-auto flex flex-wrap items-center gap-3 pt-6 md:pt-[3cqw]">
                {project.github && (
                  <a
                    className={cn(
                      buttonVariants(),
                      "bg-[#caff32] text-[#111] hover:bg-[#b9ef20]"
                    )}
                    href={project.github}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <IconBrandGithub aria-hidden="true" size={18} /> View source{" "}
                    <IconArrowUpRight aria-hidden="true" size={16} />
                  </a>
                )}
                {project.demo && (
                  <a
                    className={buttonVariants({ variant: "outline" })}
                    href={project.demo}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {projectLinkLabel(project.demo)}{" "}
                    <IconExternalLink aria-hidden="true" size={16} />
                  </a>
                )}
                {!hasLinks && (
                  <span className="ui-label rounded-md border border-border px-2.5 py-1 text-muted-foreground">
                    No public links listed
                  </span>
                )}
              </div>
            </section>
            {projectReferenceAssets[slug] ? (
              <figure className="bento-surface relative min-h-[280px] overflow-hidden bg-[#111] md:min-h-[39cqw]">
                <Image
                  alt=""
                  className="object-contain"
                  fill
                  preload
                  sizes="(max-width: 767px) 96vw, 48vw"
                  src={projectReferenceAssets[slug]}
                  unoptimized={slug === "cryptomedia-cryptocurrency-tracker"}
                />
                <figcaption className="ui-label absolute left-4 top-4 max-w-[calc(100%-2rem)] rounded-md bg-black/70 px-2.5 py-1 text-white">
                  02 / Illustrative concept
                </figcaption>
              </figure>
            ) : (
              <section className="bento-surface flex min-w-0 flex-col justify-center p-6 sm:p-8">
                <h2 className="text-2xl font-semibold leading-tight tracking-[-.025em]">
                  {details.heading}
                </h2>
                <ol className="mt-8 divide-y divide-border">
                  {details.workflow.map((step, index) => (
                    <li
                      className="flex gap-4 py-4 text-base leading-relaxed"
                      key={step}
                    >
                      <span className="ui-label pt-1 text-muted-foreground">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
                <p className="mt-6 text-sm text-muted-foreground">
                  Workflow summary based on the public repository.
                </p>
              </section>
            )}
          </div>

          <div
            className={cn(
              "grid gap-3",
              focus || skills
                ? "md:grid-cols-[1.1fr_.7fr_1fr]"
                : health
                  ? "md:grid-cols-[1.6fr_1fr]"
                  : "md:grid-cols-[1.1fr_1fr]"
            )}
          >
            <section
              className={cn(
                "bento-surface relative overflow-hidden p-5 sm:p-6 md:p-[1.7cqw]",
                health &&
                  "min-h-[440px] !bg-[#101112] text-white md:min-h-[43cqw]"
              )}
            >
              {health && (
                <>
                  <Image
                    alt=""
                    className="object-cover object-right"
                    fill
                    sizes="(max-width: 767px) 95vw, 60vw"
                    src="/design/projects/moshi-health-detail-1.png"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/80 to-transparent lg:bg-gradient-to-r lg:from-black/70 lg:via-black/30" />
                </>
              )}
              <span
                className={cn(
                  "bento-label relative",
                  health && "!text-white/65"
                )}
              >
                03 / Overview
              </span>
              <h2
                className={cn(
                  "relative mb-5 mt-6 max-w-[22ch] break-words text-[clamp(24px,3cqw,40px)] font-semibold leading-[1.15] tracking-[-.025em]",
                  health && "max-w-[85%] md:max-w-[60%]"
                )}
              >
                {health
                  ? "Your health over time."
                  : (overviewTitles[slug] ?? details.heading)}
              </h2>
              <p
                className={cn(
                  "relative max-w-[56ch] text-[clamp(15px,1.5cqw,21px)] leading-[1.5] text-foreground/75",
                  health && "max-w-[85%] !text-white/80 md:max-w-[52%]"
                )}
              >
                {overviewBodies[slug] ?? details.problem}
              </p>
              {slug === "pulse" && (
                <aside className="mt-6 flex items-start gap-3 rounded-[14px] bg-[#d5ff4d] p-4 text-zinc-950">
                  <IconLock
                    aria-hidden="true"
                    className="mt-0.5 size-6 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold">Private project</p>
                    <p className="mt-1 text-sm leading-relaxed">
                      Architecture, integrations, security details, and company
                      data remain confidential.
                    </p>
                  </div>
                </aside>
              )}
              {health && (
                <p className="ui-label relative mt-6 text-white/80">
                  Illustrative concept
                </p>
              )}
            </section>
            <div className="flex min-w-0 flex-col gap-3">
              <section className="bento-surface flex flex-1 flex-col p-5 sm:p-6 md:p-[1.7cqw]">
                <h2 className="bento-label">04 / Technologies & context</h2>
                <ul
                  className={cn(
                    "mt-5 grid gap-3",
                    technologyStack
                      ? "grid-cols-1"
                      : technologyStrip
                        ? "flex-1 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
                        : technologySplit
                          ? "flex-1 grid-cols-2 lg:grid-cols-6"
                          : "flex-1 grid-cols-2"
                  )}
                >
                  {project.tags.map((tag, tagIndex) => {
                    const Icon = technologyIcons[tag] ?? IconCode;
                    return (
                      <li
                        className={cn(
                          "flex min-w-0 gap-3 text-[clamp(13px,1.2cqw,17px)] font-medium [overflow-wrap:anywhere]",
                          technologyStack
                            ? "items-center border-b border-border/60 py-3 last:border-0"
                            : technologyStrip
                              ? "min-h-32 flex-col items-center justify-center rounded-xl bg-muted/60 px-2 py-4 text-center text-[clamp(12px,1cqw,15px)]"
                              : "min-h-28 flex-col items-start justify-center rounded-xl border border-border/70 p-3 lg:flex-row lg:items-center lg:justify-start",
                          technologySplit &&
                            (technologyLayout === "three-two"
                              ? tagIndex < 3
                                ? "lg:col-span-2 lg:flex-col lg:justify-center lg:text-center"
                                : "lg:col-span-3"
                              : tagIndex < 2
                                ? "lg:col-span-3 lg:flex-col lg:justify-center lg:text-center"
                                : "lg:col-span-2 lg:flex-col lg:justify-center lg:text-center"),
                          technologyStack &&
                            slug === "moshi-personal-agent-fleet" &&
                            "rounded-xl border border-border/70 px-3 last:border md:flex-col md:items-start lg:flex-row lg:items-center"
                        )}
                        key={tag}
                      >
                        <span
                          className={cn(
                            "flex size-12 shrink-0 items-center justify-center rounded-xl bg-muted",
                            technologyStrip && "size-14 bg-transparent",
                            slug === "pulse" &&
                              "size-16 bg-foreground text-background",
                            tag === "AI Agents" &&
                              (slug === "tethr" ||
                                skills ||
                                slug === "quivly-platform") &&
                              "bg-[#caff32] text-[#111]"
                          )}
                        >
                          <Icon
                            aria-hidden="true"
                            className={cn(
                              "size-7",
                              technologyStrip && "size-9",
                              slug === "pulse" && "size-9"
                            )}
                          />
                        </span>
                        <span className="ui-label min-w-0">{tag}</span>
                      </li>
                    );
                  })}
                </ul>
              </section>
              {health && <HealthPrinciple />}
            </div>
            {skills && <SkillsWorkflow />}
            {focus && (
              <div className="flex min-w-0 flex-col gap-3">
                <section
                  className={cn(
                    "bento-surface relative flex flex-1 flex-col justify-between gap-6 overflow-hidden p-5 md:p-[1.7cqw]",
                    slug !== "tethr" && "!bg-[#caff32] text-[#111]"
                  )}
                >
                  {slug === "moshi-personal-agent-fleet" && (
                    <div className="pointer-events-none absolute bottom-0 right-0 h-[58%] w-[55%]">
                      <Image
                        alt=""
                        className="object-cover object-right"
                        fill
                        sizes="(max-width: 767px) 52vw, 18vw"
                        src="/design/projects/quivly-skills-v2.webp"
                        unoptimized
                      />
                    </div>
                  )}
                  <span className="ui-label relative opacity-80">
                    {slug === "moshi-personal-agent-fleet"
                      ? "Approach"
                      : "Focus"}
                  </span>
                  <h2
                    className={cn(
                      "relative text-[clamp(24px,2.6cqw,34px)] font-semibold leading-[1.15] tracking-[-.025em]",
                      slug === "moshi-personal-agent-fleet" && "max-w-[16ch]"
                    )}
                  >
                    {focus.title}
                  </h2>
                  <p
                    className={cn(
                      "relative text-sm leading-relaxed opacity-80",
                      slug === "moshi-personal-agent-fleet" &&
                        "ui-label max-w-[14ch] leading-relaxed"
                    )}
                  >
                    {slug === "moshi-personal-agent-fleet"
                      ? "Memory. Research. Reflection."
                      : focus.body}
                  </p>
                  {slug === "tethr" && (
                    <Image
                      alt=""
                      className="-mx-5 -mb-5 aspect-[2/1] w-[calc(100%+2.5rem)] max-w-none object-cover object-bottom md:-mx-[1.7cqw] md:-mb-[1.7cqw] md:w-[calc(100%+3.4cqw)]"
                      height={1024}
                      sizes="(max-width: 767px) 95vw, 32vw"
                      src="/design/projects/tethr-focus-recovery.png"
                      width={1536}
                    />
                  )}
                  {project.demo && (
                    <a
                      className="inline-flex min-h-11 items-center justify-between gap-3 text-sm underline underline-offset-4"
                      href={project.demo}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {projectLinkLabel(project.demo)}
                      <IconArrowUpRight aria-hidden="true" size={18} />
                    </a>
                  )}
                  {project.github && (
                    <a
                      className="inline-flex min-h-11 items-center justify-between gap-3 text-sm underline underline-offset-4"
                      href={project.github}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      View source
                      <IconArrowUpRight aria-hidden="true" size={18} />
                    </a>
                  )}
                </section>
                {slug === "moshi-personal-agent-fleet" && (
                  <section className="bento-surface p-5 md:p-[1.7cqw]">
                    <h2 className="bento-label">Project note</h2>
                    <p className="mt-5 max-w-[22ch] text-base leading-relaxed text-foreground/80">
                      A private workspace built for my own use.
                    </p>
                  </section>
                )}
              </div>
            )}
          </div>

          <section
            aria-labelledby="project-detail-heading"
            className="bento-surface p-5 sm:p-8"
          >
            <h2
              className="text-2xl font-semibold tracking-[-.025em] sm:text-3xl"
              id="project-detail-heading"
            >
              Inside the project
            </h2>
            <div className="mt-8 grid gap-8 md:grid-cols-[1.4fr_1fr]">
              <div>
                <h3 className="ui-label">Implementation</h3>
                <p className="mt-3 max-w-[65ch] text-base leading-7 text-foreground/80">
                  {details.implementation}
                </p>
                {projectReferenceAssets[slug] && (
                  <>
                    <h3 className="ui-label mt-8">The workflow</h3>
                    <ol className="mt-3 list-decimal space-y-2 pl-5 text-base leading-7 text-foreground/80">
                      {details.workflow.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                  </>
                )}
              </div>
              <div>
                <h3 className="ui-label">Scope & status</h3>
                <p className="mt-3 max-w-[65ch] text-sm leading-6 text-muted-foreground">
                  {details.boundary}
                </p>
                {details.sources.length > 0 && (
                  <>
                    <h3 className="ui-label mt-6">Public references</h3>
                    <ul className="mt-2">
                      {details.sources.map((source, index) => (
                        <li key={source}>
                          <a
                            className="inline-flex min-h-11 items-center gap-2 text-sm underline underline-offset-4"
                            href={source}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            {index === 0
                              ? "Project reference"
                              : "Implementation source"}
                            <IconArrowUpRight aria-hidden="true" size={16} />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
            {collection && (
              <nav
                aria-label="Project collection"
                className="mt-8 border-t border-border pt-6"
              >
                <h3 className="ui-label">Related work</h3>
                <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1">
                  {collection.slugs
                    .filter((item) => item !== slug)
                    .slice(0, 3)
                    .map((item) => (
                      <li key={item}>
                        <Link
                          className="inline-flex min-h-11 items-center text-sm underline underline-offset-4"
                          href={`/projects/${item}`}
                        >
                          {getProjectBySlug(item)?.title}
                        </Link>
                      </li>
                    ))}
                  <li>
                    <Link
                      className="inline-flex min-h-11 items-center text-sm underline underline-offset-4"
                      href="/projects"
                    >
                      All projects
                    </Link>
                  </li>
                </ul>
              </nav>
            )}
          </section>

          <ProjectVisuals slug={slug} />

          <div className="grid gap-3">
            <nav
              aria-label="Project navigation"
              className={cn(
                "grid gap-3",
                !(fullWidthNext || compactEnding) && "md:grid-cols-2"
              )}
            >
              <Link
                className={cn(
                  "bento-surface group relative grid overflow-hidden transition-colors hover:bg-muted",
                  nextVariant === "preview" &&
                    projectReferenceAssets[nextSlug] &&
                    "sm:grid-cols-[.55fr_1fr]",
                  nextVariant === "banner" && "sm:grid-cols-[.6fr_1.4fr]",
                  nextVariant === "lime" &&
                    "!bg-[#caff32] text-[#111] sm:grid-cols-[1.4fr_.6fr]",
                  nextVariant === "orbit" &&
                    "min-h-48 !bg-[#101112] text-white",
                  nextVariant === "type" && "min-h-44",
                  nextVariant === "compact" &&
                    "grid-cols-[72px_1fr] items-center gap-4 p-5",
                  linksFirst && "md:order-2"
                )}
                href={`/projects/${nextSlug}`}
              >
                {nextVariant !== "type" && projectReferenceAssets[nextSlug] && (
                  <div
                    className={cn(
                      "relative overflow-hidden",
                      nextVariant === "orbit"
                        ? "absolute inset-y-0 right-0 w-2/3 opacity-70"
                        : nextVariant === "compact"
                          ? "size-[72px] rounded-xl"
                          : "hidden min-h-[180px] sm:block",
                      nextVariant === "lime" && "sm:order-2"
                    )}
                  >
                    <Image
                      alt=""
                      className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none"
                      fill
                      sizes={
                        nextVariant === "compact"
                          ? "72px"
                          : "(max-width: 767px) 90vw, 35vw"
                      }
                      src={
                        nextVariant === "orbit"
                          ? "/design/contact-orbit-v2.png"
                          : projectReferenceAssets[nextSlug]
                      }
                      unoptimized={
                        nextSlug === "cryptomedia-cryptocurrency-tracker"
                      }
                    />
                  </div>
                )}
                <div
                  className={cn(
                    "relative flex min-w-0 flex-col justify-center p-5 md:p-[2cqw]",
                    nextVariant === "compact" && "!p-0",
                    nextVariant === "orbit" &&
                      "bg-gradient-to-r from-black/80 via-black/40 to-transparent sm:max-w-[65%]"
                  )}
                >
                  <span
                    className={cn(
                      "bento-label",
                      nextVariant === "orbit" && "!text-white/70",
                      nextVariant === "lime" && "!text-black/70"
                    )}
                  >
                    07 / Next project
                  </span>
                  <span className="mt-4 flex items-start justify-between gap-4">
                    <span
                      className={cn(
                        "font-heading min-w-0 break-words text-[clamp(24px,2.6cqw,36px)] font-semibold leading-[1.15] tracking-[-.025em]",
                        (fullWidthNext || nextVariant === "lime") &&
                          "text-[clamp(28px,4.5cqw,62px)]",
                        nextVariant === "compact" &&
                          "text-[clamp(20px,2cqw,28px)]"
                      )}
                    >
                      {next.title}
                    </span>
                    <IconArrowUpRight
                      aria-hidden="true"
                      className="shrink-0"
                      size={24}
                    />
                  </span>
                  {nextVariant !== "type" &&
                    nextVariant !== "compact" &&
                    nextVariant !== "orbit" && (
                      <p className="mt-3 max-w-[50ch] text-sm leading-relaxed opacity-80">
                        {next.description}
                      </p>
                    )}
                </div>
              </Link>
              <div
                className={cn(
                  "flex gap-5",
                  fullWidthNext || compactEnding
                    ? "flex-row flex-wrap items-center justify-between px-5 py-2"
                    : "bento-surface flex-col justify-between p-5 md:p-[2cqw]",
                  linksFirst && "md:order-1"
                )}
              >
                <span
                  className={cn(
                    "bento-label",
                    (fullWidthNext || compactEnding) && "sr-only"
                  )}
                >
                  08 / {hasLinks ? "Project links" : "Keep exploring"}
                </span>
                {hasLinks && (
                  <div className="grid gap-2">
                    {project.github && (
                      <a
                        className="flex min-h-12 items-center gap-3 rounded border border-border/60 px-3 py-2 text-sm hover:bg-muted"
                        href={project.github}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <IconBrandGithub
                          aria-hidden="true"
                          className="size-5 shrink-0"
                        />
                        <span className="flex-1">Source code</span>
                        <IconArrowUpRight
                          aria-hidden="true"
                          className="size-4 shrink-0"
                        />
                      </a>
                    )}
                    {project.demo && (
                      <a
                        className="flex min-h-12 items-center gap-3 rounded border border-border/60 px-3 py-2 text-sm hover:bg-muted"
                        href={project.demo}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <IconExternalLink
                          aria-hidden="true"
                          className="size-5 shrink-0"
                        />
                        <span className="flex-1">
                          {projectLinkLabel(project.demo)}
                        </span>
                        <IconArrowUpRight
                          aria-hidden="true"
                          className="size-4 shrink-0"
                        />
                      </a>
                    )}
                  </div>
                )}
                <Link
                  className="inline-flex min-h-11 items-center justify-between gap-3 text-sm underline underline-offset-4"
                  href="/projects"
                >
                  Explore all projects{" "}
                  <IconArrowUpRight aria-hidden="true" size={18} />
                </Link>
                {previous && (
                  <Link
                    className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                    href={`/projects/${slugifyProjectTitle(previous.title)}`}
                  >
                    <IconArrowLeft
                      aria-hidden="true"
                      className="shrink-0"
                      size={16}
                    />{" "}
                    Previous: {previous.title}
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </div>
      </main>
    </PageShell>
  );
}
