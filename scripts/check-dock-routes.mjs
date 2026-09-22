import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const data = readFileSync("lib/data.ts", "utf8");
const navigation = data
  .split("export const links = [")[1]
  .split("] as const")[0];
const routes = [...navigation.matchAll(/hash: "([^"]+)"/g)].map(
  (match) => match[1]
);
assert.deepEqual(routes, [
  "/",
  "/about",
  "/projects",
  "/blog",
  "/experience",
  "/contact",
]);
for (const route of routes) {
  assert.ok(
    existsSync(`app${route === "/" ? "" : route}/page.tsx`),
    `Missing page: ${route}`
  );
}
const dock = readFileSync("components/navigation/dock-navigation.tsx", "utf8");
assert.ok(!dock.includes('href="/#'));
// biome-ignore lint/suspicious/noTemplateCurlyInString: Match the route implementation literally.
assert.ok(dock.includes("pathname.startsWith(`${href}/`)"));
console.log(
  "All six dock destinations have dedicated pages; no dock hash links."
);
