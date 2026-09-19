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
import { BrandBar } from "@/components/bento/brand-bar";
import { CTATile } from "@/components/bento/cta-tile";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/lib/data";
import {
  getAllProjectSlugs,
  getProjectBySlug,
  getVisibleProjects,
  projectLinkLabel,
  slugifyProjectTitle,
} from "@/lib/projects";
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

// Editorial headings describe the existing public record, not outcomes or metrics.
const overviewTitles: Record<string, string> = {
  altr: "A product direction in progress.",
  brik: "One codebase. Native surfaces.",
  "cryptomedia-cryptocurrency-tracker": "Markets and your watchlist.",
  ferry: "Your Watch. Your Mac microphone.",
  heroapp: "From idea to a working app.",
  "moshi-health": "Reflection over time.",
  "moshi-personal-agent-fleet": "A personal workspace for thinking and doing.",
  openkvm: "One keyboard. Two Macs.",
  pulse: "One gateway across the team’s tools.",
  "quivly-agents": "From context to operational work.",
  "quivly-design-language": "A shared language for product.",
  "quivly-platform": "Product surfaces and the systems behind them.",
  "quivly-skills": "Skills for the work after the sale.",
  "rca-tool-grafana-plugin": "Helping engineers find the why.",
  tethr: "Agents propose. People decide.",
  "zendash-global-admin-dashboard": "One dashboard. Many teams.",
  zepeats: "From browsing to delivery.",
};

const focusPanels: Record<string, { title: string; body: string }> = {
  "cryptomedia-cryptocurrency-tracker": {
    body: "Live market data from CoinGecko. A personal watchlist backed by Firebase.",
    title: "Explore the project.",
  },
  "moshi-personal-agent-fleet": {
    body: "Memory. Research. Reflection. A private workspace built for my own use.",
    title: "A more thoughtful you.",
  },
  tethr: {
    body: "Agents propose attributable changes. People retain the final decision.",
    title: "Propose. Review. Release.",
  },
};

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

export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };
  return {
    alternates: { canonical: `/projects/${slug}` },
    description: project.description,
    openGraph: {
      description: project.description,
      title: project.title,
      type: "website",
      url: `${siteConfig.siteUrl}/projects/${slug}`,
    },
    title: project.title,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  const visible = getVisibleProjects();
  const index = visible.findIndex((entry) => entry.title === project.title);
  const previous = index > 0 ? visible[index - 1] : null;
  const next = visible[(index + 1) % visible.length];
  const nextSlug = slugifyProjectTitle(next.title);
  const longTitle = project.title.length > 20;
  const hasLinks = Boolean(project.github || project.demo);
  const focus = focusPanels[slug];
  const skills = slug === "quivly-skills";
  const health = slug === "moshi-health";

  return (
    <main className="bento-page">
      <BrandBar />
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
                "my-5 break-words font-extrabold leading-[1.02] tracking-[-.04em] md:my-[2.3cqw]",
                longTitle
                  ? "text-[clamp(30px,4.5cqw,64px)]"
                  : "text-[clamp(30px,5.4cqw,74px)]"
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
                <span className="border border-border px-3 py-2 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                  No public links listed
                </span>
              )}
            </div>
          </section>
          <figure className="bento-surface relative min-h-[280px] overflow-hidden bg-[#111] md:min-h-[39cqw]">
            <Image
              alt=""
              className="object-contain"
              fill
              preload
              sizes="(max-width: 767px) 96vw, 48vw"
              src={projectReferenceAssets[slug]}
            />
            <figcaption className="absolute left-4 top-4 rounded-sm bg-black/70 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-white">
              02 / Illustrative concept
            </figcaption>
          </figure>
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
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
              </>
            )}
            <span
              className={cn("bento-label relative", health && "!text-white/65")}
            >
              03 / Overview
            </span>
            <h2
              className={cn(
                "relative mb-5 mt-6 max-w-[18ch] break-words text-[clamp(26px,3.3cqw,46px)] font-extrabold leading-[1.02] tracking-[-.04em]",
                health && "max-w-[85%] md:max-w-[60%]"
              )}
            >
              {health
                ? "A personal view of your health over time."
                : overviewTitles[slug]}
            </h2>
            <p
              className={cn(
                "relative max-w-[56ch] text-[clamp(15px,1.5cqw,21px)] leading-[1.5] text-foreground/75",
                health && "max-w-[85%] !text-white/80 md:max-w-[52%]"
              )}
            >
              {project.description}
            </p>
            {health && (
              <p className="relative mt-6 font-mono text-[9px] uppercase tracking-wider text-white/60">
                Illustrative concept
              </p>
            )}
          </section>
          <div className="flex min-w-0 flex-col gap-3">
            <section className="bento-surface flex-1 p-5 sm:p-6 md:p-[1.7cqw]">
              <h2 className="bento-label">04 / Technologies & context</h2>
              <ul
                className={cn(
                  "mt-5 grid gap-2",
                  focus || skills || health ? "grid-cols-1" : "grid-cols-2"
                )}
              >
                {project.tags.map((tag) => {
                  const Icon = technologyIcons[tag] ?? IconCode;
                  return (
                    <li
                      className="flex min-h-14 min-w-0 items-center gap-3 border-b border-border/60 py-2 text-[clamp(13px,1.2cqw,17px)] font-medium [overflow-wrap:anywhere] last:border-0"
                      key={tag}
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded bg-muted">
                        <Icon aria-hidden="true" className="size-5" />
                      </span>
                      {tag}
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
                      src="/design/projects/quivly-skills-v2.png"
                    />
                  </div>
                )}
                <span className="relative font-mono text-[10px] uppercase tracking-wide opacity-65">
                  {slug === "moshi-personal-agent-fleet" ? "Approach" : "Focus"}
                </span>
                <h2
                  className={cn(
                    "relative text-[clamp(26px,3.3cqw,46px)] font-extrabold leading-[1.02] tracking-[-.04em]",
                    slug === "moshi-personal-agent-fleet" && "max-w-[8ch]"
                  )}
                >
                  {focus.title}
                </h2>
                <p
                  className={cn(
                    "relative text-sm leading-relaxed opacity-80",
                    slug === "moshi-personal-agent-fleet" &&
                      "max-w-[10ch] font-mono text-xs uppercase leading-relaxed"
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

        <ProjectVisuals slug={slug} />

        <nav
          aria-label="Project navigation"
          className="grid gap-3 md:grid-cols-[2fr_1fr]"
        >
          <Link
            className="bento-surface group grid overflow-hidden transition-colors hover:bg-muted sm:grid-cols-[.55fr_1fr]"
            href={`/projects/${nextSlug}`}
          >
            <div className="relative hidden min-h-[190px] overflow-hidden sm:block">
              <Image
                alt=""
                className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none"
                fill
                sizes="30vw"
                src={projectReferenceAssets[nextSlug]}
              />
            </div>
            <div className="flex min-w-0 flex-col justify-center p-5 md:p-[2cqw]">
              <span className="bento-label">07 / Next project</span>
              <span className="mt-4 flex items-start justify-between gap-4">
                <span className="min-w-0 break-words text-[clamp(24px,2.6cqw,36px)] font-extrabold leading-[1.1] tracking-tight">
                  {next.title}
                </span>
                <IconArrowUpRight
                  aria-hidden="true"
                  className="shrink-0"
                  size={24}
                />
              </span>
            </div>
          </Link>
          <div className="bento-surface flex flex-col justify-between gap-5 p-5 md:p-[2cqw]">
            <span className="bento-label">
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
              href="/#projects"
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
        <CTATile />
      </div>
    </main>
  );
}
