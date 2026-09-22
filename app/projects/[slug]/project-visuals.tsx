import {
  IconArrowRight,
  IconChartBar,
  IconCode,
  IconFileText,
  IconHeartbeat,
  IconHome,
  IconLayersIntersect,
  IconMessages,
  IconSearch,
  IconSettings,
  IconSitemap,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { projectArtwork } from "@/lib/project-artwork";

// Explicit assets keep reference selection deterministic across builds.
export const projectReferenceAssets: Record<string, string> = {
  altr: "/design/projects/altr-reference.png",
  brik: "/design/projects/brik-reference.png",
  "cryptomedia-cryptocurrency-tracker":
    "/design/projects/cryptomedia-cryptocurrency-tracker-reference.webp",
  ferry: "/design/projects/ferry-reference.png",
  heroapp: "/design/projects/heroapp-reference.png",
  "moshi-health": "/design/projects/moshi-health-reference.png",
  "moshi-personal-agent-fleet":
    "/design/projects/moshi-personal-agent-fleet-reference.png",
  openkvm: "/design/projects/openkvm-reference.png",
  pulse: "/design/projects/pulse-reference.png",
  "quivly-agents": "/design/projects/quivly-agents-reference.png",
  "quivly-design-language":
    "/design/projects/quivly-design-language-reference.png",
  "quivly-platform": "/design/projects/quivly-platform-reference.png",
  "quivly-skills": "/design/projects/quivly-skills-reference.png",
  "rca-tool-grafana-plugin":
    "/design/projects/rca-tool-grafana-plugin-reference.png",
  tethr: "/design/projects/tethr-reference.png",
  "zendash-global-admin-dashboard":
    "/design/projects/zendash-global-admin-dashboard-reference.png",
  zepeats: "/design/projects/zepeats-reference.png",
  ...Object.fromEntries(
    Object.entries(projectArtwork).map(([slug, art]) => [slug, art.src])
  ),
};

const panel =
  "tile-glass relative flex min-h-[280px] min-w-0 flex-col overflow-hidden rounded-[14px] border border-white/10 bg-[#101112] p-5 text-white sm:p-6 md:min-h-[27cqw] md:p-[2cqw]";
const glass =
  "rounded-lg border border-white/20 bg-[#17191b] bg-gradient-to-br from-white/10 to-white/[0.02] p-3 sm:p-4";
const label = "ui-label text-white/80";

function Visual({
  title,
  children,
  light = false,
}: {
  title: string;
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <figure
      className={`${panel} ${light ? "!border-border !bg-[#f4f4f2] !text-[#111]" : ""}`}
    >
      <figcaption className={`${label} ${light ? "!text-black/60" : ""}`}>
        {title}
      </figcaption>
      <div className="flex flex-1 flex-col justify-center py-6">{children}</div>
      <p className={`${label} ${light ? "!text-black/60" : ""}`}>
        Illustrative concept
      </p>
    </figure>
  );
}

function Artwork({
  slug,
  title,
  src,
}: {
  slug: string;
  title: string;
  src?: string;
}) {
  return (
    <figure className="tile-glass flex min-w-0 flex-col overflow-hidden rounded-[14px] border border-border bg-[#101112] text-white">
      <figcaption className="flex flex-wrap items-center justify-between gap-2 px-5 py-4 text-xs">
        <span>{title}</span>
        <span className="ui-label text-white/80">Illustrative concept</span>
      </figcaption>
      <Image
        alt=""
        className="h-auto w-full"
        height={1024}
        sizes="(max-width: 767px) 95vw, 48vw"
        src={src ?? projectReferenceAssets[slug]}
        width={1536}
      />
    </figure>
  );
}

export function ProjectVisuals({ slug }: { slug: string }) {
  let content: ReactNode;
  switch (slug) {
    case "openkvm":
    case "brik":
    case "ferry":
    case "heroapp":
    case "zepeats":
    case "altr":
    case "pulse":
      content = [1, 2].map((number) => (
        <Artwork
          key={number}
          slug={slug}
          src={`/design/projects/${slug}-detail-${number}.png`}
          title={
            number === 1
              ? "05 / Visual exploration"
              : "06 / Another perspective"
          }
        />
      ));
      break;
    case "quivly-agents":
      content = (
        <>
          <Visual title="05 / Context to operational work">
            <div className="relative grid grid-cols-[1fr_.8fr_1fr] items-center gap-3 py-6">
              <svg
                aria-hidden="true"
                className="absolute inset-0 h-full w-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 400 240"
              >
                <path
                  d="M80 60C160 60 130 120 200 120M80 180C160 180 130 120 200 120"
                  stroke="white"
                  strokeOpacity=".45"
                />
                <path
                  d="M200 120C270 120 250 60 320 60M200 120C270 120 250 180 320 180"
                  stroke="#caff32"
                />
              </svg>
              <div className="relative space-y-10">
                {[
                  { Icon: IconUser, text: "Customer context" },
                  { Icon: IconFileText, text: "Product context" },
                ].map(({ text, Icon }) => (
                  <div className={`${glass} !p-3 text-xs`} key={text}>
                    <Icon aria-hidden="true" className="mb-2 size-5" />
                    {text}
                  </div>
                ))}
              </div>
              <div className="relative flex min-w-0 flex-col items-center gap-3 rounded-xl border border-[#caff32]/60 bg-[#252b18] px-2 py-5 text-center text-xs">
                <Image
                  alt=""
                  className="rounded-xl bg-[#caff32] p-1.5"
                  height={42}
                  src="/design/brand/quivly-icon.ico"
                  unoptimized
                  width={42}
                />
                Quivly agents
              </div>
              <div className="relative space-y-10">
                {[
                  { Icon: IconSettings, text: "Operational work" },
                  { Icon: IconUsers, text: "Teams" },
                ].map(({ text, Icon }) => (
                  <div className={`${glass} !p-3 text-xs`} key={text}>
                    <Icon
                      aria-hidden="true"
                      className="mb-2 size-5 text-[#caff32]"
                    />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </Visual>
          <Visual title="06 / People, context, agents">
            <div className="flex items-center justify-center px-2 py-10 [perspective:800px]">
              {[
                { Icon: IconUser, name: "People" },
                { Icon: IconFileText, name: "Context" },
                { Icon: null, name: "Quivly agents" },
                { Icon: IconSettings, name: "Work" },
                { Icon: IconUsers, name: "Teams" },
              ].map(({ name, Icon }, index) => (
                <div
                  className={`relative -ml-2 flex h-36 min-w-0 flex-1 flex-col items-center justify-center gap-4 rounded-xl border bg-gradient-to-br from-white/15 to-[#17191b] first:ml-0 sm:h-44 ${index === 2 ? "z-10 border-[#caff32] !from-[#687a27]" : "border-white/35"}`}
                  key={name}
                  style={{
                    transform: `rotateY(-28deg) translateY(${Math.abs(index - 2) * 8}px)`,
                  }}
                >
                  {Icon ? (
                    <Icon aria-hidden="true" className="size-8 text-white/90" />
                  ) : (
                    <Image
                      alt="Quivly"
                      className="h-auto w-10 rounded-xl bg-[#caff32] p-1.5"
                      height={48}
                      src="/design/brand/quivly-icon.ico"
                      unoptimized
                      width={48}
                    />
                  )}
                  <span className="text-[10px]">
                    {name === "Quivly agents" ? "Agents" : name}
                  </span>
                </div>
              ))}
            </div>
          </Visual>
        </>
      );
      break;
    case "tethr":
      content = (
        <>
          <Visual title="05 / Attributable revisions">
            <div className="grid grid-cols-3 gap-5 py-5 [perspective:900px]">
              {["Plan v1", "Plan v2", "Plan v3"].map((name, i) => (
                <div
                  className={`${glass} relative min-w-0 !px-2 sm:!px-4 ${i === 2 ? "!border-[#caff32]/70 !from-[#caff32]/15" : ""}`}
                  key={name}
                  style={{ transform: "rotateY(-12deg)" }}
                >
                  <p className="text-xs sm:text-base">{name}</p>
                  <div aria-hidden="true" className="my-8 space-y-3">
                    {["w-full", "w-3/4", "w-5/6", "w-1/2"].map((width) => (
                      <div
                        className={`h-1 rounded ${width} ${i === 2 ? "bg-[#caff32]/70" : "bg-white/25"}`}
                        key={width}
                      />
                    ))}
                  </div>
                  <IconUser
                    aria-hidden="true"
                    className="size-5 text-white/60"
                  />
                  {i < 2 && (
                    <IconArrowRight
                      aria-hidden="true"
                      className="absolute -right-[19px] top-1/2 size-4 text-white/70"
                    />
                  )}
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm text-white/60">
              Agents propose. People retain the release decision.
            </p>
          </Visual>
          <Artwork
            slug={slug}
            src="/design/projects/tethr-detail-2.png"
            title="Human judgment in the loop."
          />
        </>
      );
      break;
    case "rca-tool-grafana-plugin":
    case "zendash-global-admin-dashboard":
    case "cryptomedia-cryptocurrency-tracker":
      content = [1, 2].map((number) => (
        <Artwork
          key={number}
          slug={slug}
          src={`/design/projects/${slug}-detail-${number}-recovery.png`}
          title={number === 1 ? "05 / Overview concept" : "06 / Detail concept"}
        />
      ));
      break;
    case "quivly-design-language":
      content = (
        <>
          <Visual title="05 / Component studies">
            <div className="grid grid-cols-[32px_1fr_.65fr] gap-3 rounded-xl border border-white/15 bg-[#141617] p-3 sm:grid-cols-[48px_1fr_.75fr]">
              <div className="flex flex-col items-center gap-5 border-r border-white/10 pr-2">
                <Image
                  alt="Quivly"
                  className="mb-3 rounded-md bg-[#caff32] p-1"
                  height={28}
                  src="/design/brand/quivly-icon.ico"
                  unoptimized
                  width={28}
                />
                {[IconHome, IconSearch, IconLayersIntersect, IconSettings].map(
                  (Icon) => (
                    <Icon
                      aria-hidden="true"
                      className="size-4 text-white/70"
                      key={Icon.displayName}
                    />
                  )
                )}
              </div>
              <div className="min-w-0 space-y-4">
                <div className="rounded bg-[#caff32] px-3 py-3 text-center text-xs font-medium text-black">
                  Primary action
                </div>
                <div className="rounded border border-white/35 px-3 py-3 text-center text-xs">
                  Secondary action
                </div>
                <div className="rounded border border-white/20 px-3 py-3 text-xs text-white/50">
                  Text field
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex h-5 w-9 items-center justify-end rounded-full bg-[#caff32] px-1">
                    <span className="size-3 rounded-full bg-white" />
                  </span>
                  <span className="rounded-full border border-white/20 px-2 py-1 text-[10px]">
                    Label
                  </span>
                  <span className="rounded-full border border-[#caff32]/40 px-2 py-1 text-[10px] text-[#caff32]">
                    Label
                  </span>
                </div>
                <div className="grid grid-cols-3 overflow-hidden rounded border border-white/25 text-center text-[10px]">
                  {["Tab 1", "Tab 2", "Tab 3"].map((tab, index) => (
                    <span
                      className={`py-2 ${index === 0 ? "bg-[#caff32] text-black" : ""}`}
                      key={tab}
                    >
                      {tab}
                    </span>
                  ))}
                </div>
              </div>
              <div className={`${glass} min-w-0 !p-2`}>
                <div className="flex aspect-square items-center justify-center rounded bg-white/10">
                  <IconLayersIntersect
                    aria-hidden="true"
                    className="size-12 text-white/25"
                  />
                </div>
                <div className="mt-5 h-2 w-3/4 rounded bg-white/25" />
                <div className="mt-3 h-2 rounded bg-white/10" />
                <div className="mt-3 h-2 w-2/3 rounded bg-white/10" />
                <div className="mt-6 flex items-center gap-2">
                  <IconUser
                    aria-hidden="true"
                    className="size-5 shrink-0 text-white/50"
                  />
                  <span className="h-2 w-1/2 rounded bg-white/20" />
                </div>
              </div>
            </div>
          </Visual>
          <Artwork
            slug={slug}
            src="/design/projects/quivly-design-language-detail-2.png"
            title="06 / Visual language"
          />
        </>
      );
      break;
    case "moshi-personal-agent-fleet":
      content = (
        <>
          <Visual title="05 / A personal thinking workspace">
            <div className="relative grid grid-cols-[1fr_.7fr_1fr] items-center gap-3 py-4">
              <svg
                aria-hidden="true"
                className="absolute inset-0 h-full w-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 400 300"
              >
                <ellipse
                  cx="200"
                  cy="150"
                  rx="165"
                  ry="85"
                  stroke="white"
                  strokeOpacity=".25"
                  transform="rotate(-24 200 150)"
                />
                <ellipse
                  cx="200"
                  cy="150"
                  rx="165"
                  ry="60"
                  stroke="white"
                  strokeOpacity=".2"
                  transform="rotate(26 200 150)"
                />
                <path
                  d="M70 55Q135 65 200 150M70 150H330M70 245Q140 235 200 150M330 55Q260 60 200 150M330 245Q260 240 200 150"
                  stroke="white"
                  strokeOpacity=".35"
                />
              </svg>
              <div className="relative space-y-5">
                {[
                  {
                    detail: "Long-term context",
                    Icon: IconFileText,
                    name: "Memory",
                  },
                  { detail: "Agentic work", Icon: IconSitemap, name: "Agents" },
                  {
                    detail: "A personal workspace",
                    Icon: IconSettings,
                    name: "Tools",
                  },
                ].map(({ name, detail, Icon }) => (
                  <div className={`${glass} !p-3`} key={name}>
                    <Icon aria-hidden="true" className="mb-2 size-5" />
                    <p className="text-xs">{name}</p>
                    <p className="mt-1 text-[10px] leading-snug text-white/65">
                      {detail}
                    </p>
                  </div>
                ))}
              </div>
              <div className="relative mx-auto flex aspect-square w-full items-center justify-center rounded-full border border-white/60 bg-[radial-gradient(circle_at_30%_20%,#a9acaf,#25282b_35%,#080a0b_65%,#81858a)] text-sm">
                You
              </div>
              <div className="relative space-y-5">
                {[
                  {
                    detail: "Research and reflection",
                    Icon: IconSearch,
                    name: "Research",
                  },
                  { detail: "Messaging", Icon: IconMessages, name: "Messages" },
                  {
                    detail: "Operational data",
                    Icon: IconChartBar,
                    name: "Operations",
                  },
                ].map(({ name, detail, Icon }) => (
                  <div className={`${glass} !p-3`} key={name}>
                    <Icon aria-hidden="true" className="mb-2 size-5" />
                    <p className="text-xs">{name}</p>
                    <p className="mt-1 text-[10px] leading-snug text-white/65">
                      {detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Visual>
          <Visual title="06 / Space to think">
            <div className="flex items-center py-9 [perspective:900px]">
              <div className="relative z-10 flex h-52 w-[30%] shrink-0 flex-col justify-center rounded-xl border border-[#caff32]/65 bg-gradient-to-br from-[#333a28] to-[#101112] p-3 font-mono text-[11px] leading-loose [transform:rotateY(-18deg)]">
                Capture
                <br />
                Think
                <br />
                Research
                <br />
                Act
                <br />
                Reflect
                <br />
                Repeat
              </div>
              {[
                { Icon: IconFileText, name: "Memory" },
                { Icon: IconSearch, name: "Research" },
                { Icon: IconSitemap, name: "Agents" },
                { Icon: IconMessages, name: "Messages" },
                { Icon: IconChartBar, name: "Operations" },
              ].map(({ name, Icon }, index) => (
                <div
                  className="-ml-3 flex min-w-0 flex-1 items-center justify-center rounded-xl border border-white/30 bg-gradient-to-br from-[#626567] to-[#16181a]"
                  key={name}
                  style={{
                    height: 192 - index * 13,
                    transform: "rotateY(-22deg)",
                    zIndex: 5 - index,
                  }}
                >
                  <Icon aria-hidden="true" className="size-6 text-white/85" />
                  <span className="sr-only">{name}</span>
                </div>
              ))}
            </div>
          </Visual>
        </>
      );
      break;
    case "quivly-skills":
      content = (
        <>
          <figure className={`${panel} !p-0`}>
            <Image
              alt=""
              className="object-cover"
              fill
              sizes="(max-width: 767px) 95vw, 48vw"
              src="/design/projects/quivly-skills-detail-2.png"
            />
            <Image
              alt="Quivly"
              className="absolute left-[58%] top-[38%] rounded-xl bg-[#caff32] p-2"
              height={48}
              src="/design/brand/quivly-icon.ico"
              unoptimized
              width={48}
            />
            <figcaption className="ui-label absolute bottom-5 left-5 text-white/80">
              06 / Illustrative concept
            </figcaption>
          </figure>
          <Visual light title="07 / About this project">
            <h3 className="max-w-[14ch] text-[clamp(28px,3.3cqw,44px)] font-semibold leading-[1.12] tracking-[-0.025em]">
              Open source
              <br />
              by design.
            </h3>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-black/65">
              A curated collection for customer engineering, post-sales, and
              customer success.
            </p>
            <div className="mt-6 flex items-center gap-3 text-black/70">
              <IconCode aria-hidden="true" />
              Open source
            </div>
          </Visual>
        </>
      );
      break;
    case "quivly-platform":
      content = (
        <>
          <Visual title="05 / Product surfaces">
            <div className="relative mx-auto h-64 w-full max-w-sm [perspective:900px]">
              <div className="absolute bottom-3 left-[27%] h-[85%] w-[52%] rotate-[-8deg] rounded-xl border border-white/40 bg-white/5" />
              <div className="absolute bottom-0 left-[18%] h-[76%] w-[68%] rounded-xl border border-white/40 bg-gradient-to-br from-white/10 to-white/[0.02] [transform:rotateY(-20deg)]" />
              <div className="absolute bottom-5 left-[8%] flex h-[50%] w-[30%] items-center justify-center rounded-xl border border-white/60 bg-gradient-to-br from-white/25 to-[#151719] [transform:rotateY(-20deg)]">
                <IconUser
                  aria-hidden="true"
                  className="size-12 text-white/90"
                />
              </div>
              <div className="absolute right-[5%] top-[24%] flex h-[46%] w-[40%] flex-col justify-center gap-3 rounded-xl border border-[#caff32] bg-gradient-to-br from-[#caff32]/60 to-[#252d1c] p-5 [transform:rotateY(-20deg)]">
                <span className="h-2 w-4/5 rounded bg-white/90" />
                <span className="h-2 rounded bg-white/90" />
                <span className="h-2 w-3/5 rounded bg-white/90" />
              </div>
            </div>
            <p className="text-sm text-white/80">
              Interfaces for thoughtful work.
            </p>
          </Visual>
          <Artwork
            slug={slug}
            src="/design/projects/quivly-platform-detail-2.png"
            title="Product and engineering, together."
          />
        </>
      );
      break;
    default:
      return null;
  }
  return (
    <section
      aria-label="Project visual explorations"
      className="grid items-stretch gap-3 md:grid-cols-2"
    >
      {content}
    </section>
  );
}

export function SkillsWorkflow() {
  const concepts = [
    { icon: IconHeartbeat, title: "Health reviews" },
    { icon: IconChartBar, title: "Churn signals" },
    { icon: IconUsers, title: "Customer onboarding" },
    { icon: IconMessages, title: "Account insights" },
  ];
  return (
    <Visual title="05 / Customer workflows">
      <div className="relative grid grid-cols-2 gap-3 [perspective:900px]">
        {concepts.map(({ title, icon: Icon }, index) => (
          <div
            className={`${glass} flex min-h-36 flex-col gap-3 ${index > 1 ? "justify-end" : "justify-start"}`}
            key={title}
          >
            <Icon aria-hidden="true" className="size-6 text-white/80" />
            <span className="max-w-[10ch] text-xs leading-snug sm:text-sm">
              {title}
            </span>
          </div>
        ))}
        <div className="absolute left-1/2 top-1/2 z-10 flex min-h-28 w-[46%] -translate-x-1/2 -translate-y-1/2 rotate-[-3deg] flex-col justify-center gap-3 rounded-lg border border-[#caff32]/90 bg-gradient-to-br from-[#819d20]/95 to-[#283209]/95 p-4 shadow-[0_10px_40px_#0009]">
          <IconFileText aria-hidden="true" className="size-6 text-[#caff32]" />
          <span className="text-sm font-medium leading-tight">
            QBR preparation
          </span>
        </div>
      </div>
    </Visual>
  );
}

export function HealthPrinciple() {
  return (
    <figure className="tile-glass relative min-h-52 overflow-hidden rounded-[14px] bg-[#caff32] p-5 text-black md:min-h-[20cqw]">
      <div className="absolute inset-y-4 right-0 w-[52%] overflow-hidden">
        <Image
          alt=""
          className="object-contain object-right"
          fill
          sizes="(max-width: 767px) 95vw, 38vw"
          src="/design/projects/moshi-health-detail-2.png"
        />
      </div>
      <figcaption className="ui-label relative">
        05 / Design principle
      </figcaption>
      <h3 className="relative mt-6 max-w-[10ch] text-[clamp(24px,2.6cqw,34px)] font-semibold leading-[1.15] tracking-[-0.025em]">
        Your data.
        <br />
        Your story.
      </h3>
      <p className="relative mt-3 max-w-[52%] text-sm">
        Tools for reflection, not diagnosis.
      </p>
      <span className="ui-label absolute bottom-3 right-3">
        Illustrative concept
      </span>
    </figure>
  );
}
