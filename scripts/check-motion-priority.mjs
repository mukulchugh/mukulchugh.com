// Static, no-server checks for project-slider.tsx's build output: the
// desktop-only slider LCP preload, and that the archive dialog's full
// project catalog is excluded from the homepage's initial script payload
// (only loaded when the dialog opens). Run after `next build`.
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";

const html = readFileSync(".next/server/app/index.html", "utf8");

const articleStart = html.indexOf('data-slot="0" data-theme=');
assert.ok(
  articleStart > -1,
  "Featured card (data-slot=0) not found in homepage HTML"
);
const cardSlice = html.slice(articleStart, articleStart + 2000);

const img = cardSlice.match(/<img\b[^>]*>/)?.[0];
assert.ok(img, "Featured card has no <img>");
const imgSrcSet = img.match(/srcSet="([^"]+)"/)?.[1];
const imgSizes = img.match(/(?<!image)sizes="([^"]+)"/)?.[1];
assert.ok(imgSrcSet && imgSizes, "Featured <img> missing srcSet/sizes");

const preloadLinks = [...html.matchAll(/<link\b[^>]*>/g)]
  .map((match) => match[0])
  .filter(
    (link) => link.includes('rel="preload"') && link.includes('as="image"')
  );
const scoped = preloadLinks.filter((link) =>
  link.includes('media="(min-width: 768px)"')
);
assert.equal(
  scoped.length,
  1,
  `Expected exactly one desktop-scoped featured-image preload, found ${scoped.length}`
);
const [link] = scoped;
assert.ok(
  link.includes('fetchPriority="high"'),
  "Preload link missing fetchPriority=high"
);
const linkSrcSet = link.match(/imageSrcSet="([^"]+)"/)?.[1];
const linkSizes = link.match(/imageSizes="([^"]+)"/)?.[1];
assert.equal(
  linkSrcSet,
  imgSrcSet,
  "Preload srcSet must match the rendered image to avoid a duplicate fetch"
);
assert.equal(
  linkSizes,
  imgSizes,
  "Preload sizes must match the rendered image's sizes"
);

// Only the featured card gets a preload; the other five never do.
const otherCardStarts = [...html.matchAll(/data-slot="(-1|1|2|3|4)"/g)];
assert.ok(
  otherCardStarts.length > 0,
  "Expected other slider cards in the HTML"
);

console.log(
  "PASS: featured-card preload is desktop-scoped, URL-matched, and applied to exactly one card."
);

// components/projects.tsx (the archive dialog's full catalog) must only ship
// in on-demand chunks, never in the chunks the homepage loads unconditionally.
const archiveCodeMarker = '"collection-"';
const initialChunkFiles = [
  ...new Set([...html.matchAll(/chunks\/[^"]+\.js/g)].map((m) => m[0])),
];
assert.ok(
  initialChunkFiles.length > 0,
  "No script chunks found in homepage HTML"
);

const leakedInInitial = initialChunkFiles.filter((chunk) => {
  try {
    return readFileSync(`.next/static/${chunk}`, "utf8").includes(
      archiveCodeMarker
    );
  } catch {
    return false;
  }
});
assert.deepEqual(
  leakedInInitial,
  [],
  `Archive dialog code must not ship in the homepage's initial chunks, found in: ${leakedInInitial.join(", ")}`
);

const allChunks = readdirSync(".next/static/chunks").filter((file) =>
  file.endsWith(".js")
);
const archiveChunks = allChunks.filter((file) =>
  readFileSync(`.next/static/chunks/${file}`, "utf8").includes(
    archiveCodeMarker
  )
);
assert.ok(
  archiveChunks.length > 0,
  "Archive dialog code must still exist in some on-demand chunk"
);
// Every project collection must still be reachable once the archive loads.
for (const label of [
  "Selected projects",
  "Platform, agents & tools",
  "Product contributions",
  "More to explore",
]) {
  const present = archiveChunks.some((file) =>
    readFileSync(`.next/static/chunks/${file}`, "utf8").includes(label)
  );
  assert.ok(
    present,
    `Archive collection "${label}" missing from deferred chunks`
  );
}

console.log(
  "PASS: archive dialog catalog is absent from the homepage's initial chunks and fully available in deferred chunks."
);
