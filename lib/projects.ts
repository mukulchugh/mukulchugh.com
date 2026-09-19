import { hiddenProjectTitles, projectsData } from "@/lib/data";

export type ProjectData = (typeof projectsData)[number];

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
