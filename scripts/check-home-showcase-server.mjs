import { readFileSync } from "node:fs";
import path from "node:path";
import ts from "typescript";

// The seven curated showcase cards (art/background/description/tags, filtered
// from the full ~30-project catalog) must be generated on the server and
// passed down as plain props, not recomputed by the client home-bento bundle.
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

// Verify the real generated client output, not just source text: the chunks
// Next.js actually ships for home-bento.tsx must not contain the server-only
// showcase-generation function, however it got there.
const manifestPath = ".next/server/app/page_client-reference-manifest.js";
let manifest;
try {
  manifest = readFileSync(manifestPath, "utf8");
} catch {
  failures.push(`${manifestPath}: missing — run \`next build\` first`);
}
if (manifest) {
  const entry = manifest.match(
    /"\[project\]\/components\/home-bento\.tsx":(\{[^}]*\})/
  );
  if (entry) {
    const { chunks } = JSON.parse(entry[1]);
    const shipped = chunks
      .map((chunk) =>
        readFileSync(
          path.join(".next/static", chunk.replace("/_next/static", "")),
          "utf8"
        )
      )
      .join("\n");
    if (shipped.includes("getShowcaseProjects")) {
      failures.push(
        "generated home-bento.tsx chunks: must not contain getShowcaseProjects"
      );
    }
  } else {
    failures.push(
      `${manifestPath}: no client-reference entry for home-bento.tsx`
    );
  }
}

// Verify the shared-data boundary itself (lib/data.ts vs. lib/project-catalog.ts):
// resolve every import reachable from the homepage's lib/data.ts consumers and
// confirm the full project catalog module is never one of them. This catches
// a regression (e.g. a re-added `import { projectsData } from "@/lib/data"`)
// that a chunk-content check alone would miss whenever the catalog is already
// legitimately bundled elsewhere (the project archive dialog needs it too).
const dataPath = "lib/data.ts";
const dataSource = readFileSync(dataPath, "utf8");
if (/\bprojectsData\b|\bhiddenProjectTitles\b/.test(dataSource)) {
  failures.push(
    `${dataPath}: must not export projectsData/hiddenProjectTitles — keep the full catalog in lib/project-catalog.ts`
  );
}

const homepageDataConsumers = [
  "components/about.tsx",
  "components/experience/experience-tile.tsx",
];
function resolveImport(specifier, importer) {
  let base;
  if (specifier.startsWith("@/")) {
    base = specifier.slice(2);
  } else if (specifier.startsWith(".")) {
    base = path.join(path.dirname(importer), specifier);
  } else {
    return;
  }
  return ["", ".ts", ".tsx"]
    .map((suffix) => path.normalize(base + suffix))
    .find((file) => {
      try {
        readFileSync(file, "utf8");
        return true;
      } catch {
        return false;
      }
    });
}
function importsOf(file) {
  const source = ts.createSourceFile(
    file,
    readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest
  );
  const specifiers = [];
  function visit(node) {
    if (
      ts.isImportDeclaration(node) &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      const target = resolveImport(node.moduleSpecifier.text, file);
      if (target) specifiers.push(target);
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  return specifiers;
}
function reaches(start, target) {
  const seen = new Set();
  const stack = [start];
  while (stack.length) {
    const file = stack.pop();
    if (file === target) return true;
    if (seen.has(file)) continue;
    seen.add(file);
    stack.push(...importsOf(file));
  }
  return false;
}
for (const consumer of homepageDataConsumers) {
  if (reaches(consumer, "lib/project-catalog.ts")) {
    failures.push(
      `${consumer}: must not transitively import lib/project-catalog.ts (the full project catalog)`
    );
  }
}

if (failures.length) {
  console.error(`FAIL:\n${failures.join("\n")}`);
  process.exitCode = 1;
} else {
  console.log(
    "PASS: showcase generation stays server-side, home-bento only receives seven-card props, and the homepage's shared-data path excludes the full project catalog."
  );
}
