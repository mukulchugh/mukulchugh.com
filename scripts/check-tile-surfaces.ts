import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (file: string) =>
  readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const css = read("app/globals.css");
const border =
  css.match(/\/\* Tile edges[\s\S]*?\*\/([\s\S]*?)\/\* Broad/)?.[1] ?? "";
assert.match(border, /\.bento-surface/);
assert.match(border, /\.tile-glass/);
assert.match(border, /border: 1px solid hsl\(var\(--border\)\)/);
assert.match(border, /box-shadow: none/);
const sheen =
  css.match(/\/\* Broad,[\s\S]*?\*\/([\s\S]*?)\/\* Elevated/)?.[1] ?? "";
assert.match(sheen, /pointer-events: none/);
assert.match(sheen, /border-radius: inherit/);
assert.doesNotMatch(
  sheen,
  /box-shadow|backdrop-filter|animation|will-change|overflow:/
);
assert.match(css, /--tile-sheen: none/);
assert.match(
  css,
  /:is\(\.bento-surface, \.tile-glass\)::after\s*\{\s*display: none/
);
for (const file of [
  "components/bento/profile-tile.tsx",
  "components/bento/cta-tile.tsx",
  "components/blog/writing-section.tsx",
  "components/blog/posts-grid.tsx",
  "components/blog/related-posts.tsx",
  "app/projects/[slug]/project-visuals.tsx",
  "app/blog/[slug]/page.tsx",
]) {
  assert.match(read(file), /tile-glass/, file);
}
for (const file of ["components/ui/button.tsx", "components/ui/dock.tsx"]) {
  assert.doesNotMatch(read(file), /tile-glass/, file);
}
console.log(
  "Tile material contracts passed: real borders, static sheen, coverage and control isolation."
);
