// biome-ignore-all lint/suspicious/noTemplateCurlyInString: Self-checks intentionally pass template source as literal strings.
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { basename, join } from "node:path";
import { publicDocuments } from "../lib/public-content.ts";

function filesUnder(directory) {
  return readdirSync(directory, { recursive: true })
    .map((file) => join(directory, file))
    .filter((file) => statSync(file).isFile());
}

function templatePattern(template) {
  const name = basename(template);
  const fragments = name.split(/\$\{[^}]*\}/);
  // Fully dynamic names are resolved through publicDocuments, not an extension wildcard.
  if (fragments.length === 1 || !fragments.join("").replace(/\.[^.]+$/, ""))
    return null;
  return new RegExp(
    `^${fragments.map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join(".+")}$`
  );
}

const detailPattern = templatePattern(
  "/design/projects/${slug}-detail-${number}.png"
);
assert(detailPattern.test("openkvm-detail-1.png"));
assert(!detailPattern.test("quivly-skills-v2.png"));
assert.equal(templatePattern("/design/projects/${slug}.png"), null);

const images = new Set(publicDocuments().map(({ image }) => `public${image}`));
const source = ["app", "components", "lib", "content"]
  .flatMap(filesUnder)
  .map((file) => readFileSync(file, "utf8"))
  .join("\n");
const templates = [...source.matchAll(/`(\/[^`\n]+)`/g)]
  .map(([, template]) => templatePattern(template))
  .filter(Boolean);
const assets = new Set(filesUnder("public").sort());
let deadCount = 0;
let deadBytes = 0;

for (const file of assets) {
  if (file.endsWith(".png") && assets.has(`${file.slice(0, -4)}.webp`)) {
    console.warn(`WARN: PNG/WebP pair: ${file}`);
  }
  // ponytail: basename matching can retain false positives; use parsed references if needed.
  if (
    images.has(file) ||
    source.includes(basename(file)) ||
    templates.some((pattern) => pattern.test(basename(file))) ||
    file.startsWith("public/fonts/") ||
    file.startsWith("public/favicon.") ||
    file === "public/Thumbnail.webp"
  ) {
    continue;
  }
  const bytes = statSync(file).size;
  console.log(`DEAD: ${file} (${bytes} bytes)`);
  deadCount++;
  deadBytes += bytes;
}

console.log(
  `${deadCount ? "FAIL" : "PASS"}: ${assets.size} public files, ${deadCount} dead files, ${deadBytes} dead bytes.`
);
process.exitCode = deadCount ? 1 : 0;
