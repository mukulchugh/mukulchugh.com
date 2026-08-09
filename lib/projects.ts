import { hiddenProjectTitles, projectsData } from "@/lib/data";

export type ProjectData = (typeof projectsData)[number];

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
