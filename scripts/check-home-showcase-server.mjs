import { readFileSync } from "node:fs";

// Showcase card metadata (art/background/description/tags for all projects,
// not just the 7 featured) must be generated on the server and passed down
// as plain props, not recomputed by the client home-bento bundle.
const pagePath = "app/page.tsx";
const bentoPath = "components/home-bento.tsx";
const page = readFileSync(pagePath, "utf8");
const bento = readFileSync(bentoPath, "utf8");

const failures = [];

if (page.includes('"use client"')) {
  failures.push(`${pagePath}: must stay a server component`);
}
if (!/getShowcaseProjects\(\)/.test(page)) {
  failures.push(`${pagePath}: must call getShowcaseProjects() on the server`);
}
if (!/<HomeBento[^>]*\bshowcase=\{showcase\}/.test(page)) {
  failures.push(`${pagePath}: must pass showcase={showcase} to HomeBento`);
}
if (/getShowcaseProjects/.test(bento)) {
  failures.push(
    `${bentoPath}: must not import/call getShowcaseProjects in the client bundle`
  );
}
if (!/showcase\s*:\s*Project\[\]/.test(bento)) {
  failures.push(`${bentoPath}: must accept a showcase: Project[] prop`);
}
if (!/<ProjectSlider projects=\{showcase\}/.test(bento)) {
  failures.push(`${bentoPath}: must forward showcase to ProjectSlider`);
}

if (failures.length) {
  console.error(`FAIL:\n${failures.join("\n")}`);
  process.exitCode = 1;
} else {
  console.log(
    "PASS: showcase generation stays server-side and home-bento only receives card props."
  );
}
