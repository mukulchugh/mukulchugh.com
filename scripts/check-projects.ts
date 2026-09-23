import assert from "node:assert/strict";
import { hiddenProjectTitles } from "../lib/data";
import { projectDetails } from "../lib/project-details";
import {
  getAllProjectSlugs,
  getProjectBySlug,
  getVisibleProjects,
  projectCollections,
  projectLinkLabel,
  showcaseProjectSlugs,
  slugifyProjectTitle,
} from "../lib/projects";

const projects = getVisibleProjects();
assert.deepEqual(showcaseProjectSlugs, [
  "openkvm",
  "brik",
  "ctxr",
  "setu",
  "quivly-skills",
  "altr",
  "tethr",
]);
for (const slug of showcaseProjectSlugs)
  assert.ok(getProjectBySlug(slug), `Showcase project exists: ${slug}`);
assert.equal(getProjectBySlug("setu")?.github, "");
assert.equal(getProjectBySlug("setu")?.demo, "");
assert.deepEqual(projectDetails.setu.sources, []);
const slugs = getAllProjectSlugs();
const groupedSlugs = projectCollections.flatMap((collection) => [
  ...collection.slugs,
]);
assert.equal(
  new Set(groupedSlugs).size,
  groupedSlugs.length,
  "Each project belongs to one collection"
);
assert.deepEqual(
  [...groupedSlugs].sort(),
  [...slugs].sort(),
  "Every visible project has a collection"
);
for (const slug of slugs) {
  const detail = projectDetails[slug];
  assert.ok(detail, `Case study content: ${slug}`);
  assert.ok(
    detail.implementation.length > 80,
    `Implementation detail: ${slug}`
  );
  assert.ok(detail.boundary.length > 40, `Honest scope: ${slug}`);
  assert.equal(detail.workflow.length, 3, `Workflow: ${slug}`);
}
assert.equal(
  new Set(slugs).size,
  projects.length,
  "Project routes must be unique"
);
for (const project of projects) {
  assert.equal(getProjectBySlug(slugifyProjectTitle(project.title)), project);
  assert.ok(!hiddenProjectTitles.has(project.title));
  assert.ok(project.description.trim());
  assert.ok(project.summary.trim(), `Index summary: ${project.title}`);
  assert.ok(project.summary.length <= 100, `Concise summary: ${project.title}`);
  assert.ok(project.summary.length < project.description.length);
  for (const href of [project.github, project.demo].filter(Boolean)) {
    assert.equal(new URL(href).protocol, "https:");
  }
}
for (const title of hiddenProjectTitles) {
  assert.equal(getProjectBySlug(slugifyProjectTitle(title)), undefined);
}
assert.equal(getProjectBySlug("unknown-project"), undefined);
for (const [url, label] of [
  ["https://github.com/mukulchugh/OpenKVM/releases/latest", "Download release"],
  ["https://www.npmjs.com/package/@brik/react-native", "View package"],
  ["https://www.figma.com/file/example", "View design"],
  ["https://expo.dev/@mukulchugh/zepeats", "View Expo project"],
  ["https://altr.run", "Visit website"],
  ["https://tethr.cc", "Visit website"],
  ["https://example.com/?next=https://npmjs.com/package/foo", "View demo"],
  ["https://github.com.example.com/a/b/releases", "View demo"],
  ["not a URL", "View demo"],
]) {
  assert.equal(projectLinkLabel(url), label);
}
console.log(
  `Checked ${projects.length} visible project routes, hidden records, and destination labels.`
);
