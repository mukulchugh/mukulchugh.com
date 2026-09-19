import assert from "node:assert/strict";
import { hiddenProjectTitles } from "../lib/data";
import {
  getAllProjectSlugs,
  getProjectBySlug,
  getVisibleProjects,
  projectLinkLabel,
  slugifyProjectTitle,
} from "../lib/projects";

const projects = getVisibleProjects();
const slugs = getAllProjectSlugs();
assert.equal(
  new Set(slugs).size,
  projects.length,
  "Project routes must be unique"
);
for (const project of projects) {
  assert.equal(getProjectBySlug(slugifyProjectTitle(project.title)), project);
  assert.ok(!hiddenProjectTitles.has(project.title));
  assert.ok(project.description.trim());
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
  ["https://example.com/?next=https://npmjs.com/package/foo", "View demo"],
  ["https://github.com.example.com/a/b/releases", "View demo"],
  ["not a URL", "View demo"],
]) {
  assert.equal(projectLinkLabel(url), label);
}
console.log(
  `Checked ${projects.length} visible project routes, hidden records, and destination labels.`
);
