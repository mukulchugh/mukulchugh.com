import { hiddenProjectTitles, projectsData } from "@/lib/project-catalog";
import { projectArtwork } from "@/lib/project-artwork";

export type ProjectData = (typeof projectsData)[number];

// Owner-curated showcase order, independent of the complete project collection.
export const showcaseProjectSlugs = [
  "openkvm",
  "brik",
  "ctxr",
  "setu",
  "quivly-skills",
  "altr",
  "tethr",
];

export function getShowcaseProjects() {
  const summaries: Record<string, string> = {
    brik: "Build native widgets, Live Activities, and Dynamic Island experiences with React Native.",
    openkvm:
      "An open-source macOS menu bar app that shares one keyboard and mouse between two Macs.",
    "quivly-skills":
      "A curated, production-ready collection of agent skills for customer engineering teams.",
  };
  return showcaseProjectSlugs.flatMap((slug) => {
    const project = getProjectBySlug(slug);
    if (!project) return [];
    const artwork = projectArtwork[slug];
    return [
      {
        art: artwork?.src ?? null,
        background: artwork?.background ?? "#191b1d",
        description: summaries[slug] ?? project.description,
        slug,
        tags: [...project.tags],
        title: project.title,
        tone: artwork?.tone ?? "dark",
      },
    ];
  });
}

// Collections are editorial relationships, independent of featured placement.
export const projectCollections = [
  {
    description:
      "Tools, systems, and products developed beyond a single brief.",
    id: "independent",
    slugs: [
      "openkvm",
      "brik",
      "ctxr",
      "altr",
      "tethr",
      "agent-workflow-skills",
      "hermes-memory",
      "ferry",
      "moshi-personal-agent-fleet",
      "moshi-health",
      "heroapp",
    ],
    title: "Selected projects",
  },
  {
    description:
      "Connected work across product, agents, and design systems. Four private workstreams and one public skills collection.",
    id: "quivly",
    slugs: [
      "quivly-platform",
      "quivly-agents",
      "pulse",
      "quivly-design-language",
      "quivly-skills",
      "setu",
    ],
    title: "Platform, agents & tools",
  },
  {
    description:
      "End-to-end product and engineering contributions within a team, beyond the interface alone.",
    id: "zenduty",
    slugs: ["rca-tool-grafana-plugin", "zendash-global-admin-dashboard"],
    title: "Product contributions",
  },
  {
    description:
      "Focused utilities, websites, and earlier application projects.",
    id: "archive",
    slugs: [
      "memo",
      "github-profile-explorer",
      "eil-conference",
      "hostville",
      "gym-center",
      "cryptomedia-cryptocurrency-tracker",
      "zepeats",
    ],
    title: "More to explore",
  },
] as const;

export function getProjectCollection(slug: string) {
  return projectCollections.find((collection) =>
    collection.slugs.some((entry) => entry === slug)
  );
}

/** Label destinations honestly; releases and packages are not live demos. */
export function projectLinkLabel(href: string): string {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return "View demo";
  }
  const host = url.hostname.replace(/^www\./, "");
  if (host === "github.com" && url.pathname.split("/")[3] === "releases")
    return "Download release";
  if (host === "npmjs.com") return "View package";
  if (host === "figma.com") return "View design";
  if (host === "expo.dev") return "View Expo project";
  if (host === "altr.run" || host === "tethr.cc") return "Visit website";
  return "View demo";
}

export function slugifyProjectTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getVisibleProjects(): ProjectData[] {
  return projectsData.filter(
    (project) => !hiddenProjectTitles.has(project.title)
  );
}

export function getAllProjectSlugs(): string[] {
  return getVisibleProjects().map((project) =>
    slugifyProjectTitle(project.title)
  );
}

export function getProjectBySlug(slug: string): ProjectData | undefined {
  return getVisibleProjects().find(
    (project) => slugifyProjectTitle(project.title) === slug
  );
}
