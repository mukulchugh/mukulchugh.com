import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const pages = readdirSync(".next/server/app", { recursive: true }).filter(
  (file) => file.endsWith(".html")
);
let references = 0;
for (const page of pages) {
  const html = readFileSync(join(".next/server/app", page), "utf8");
  for (const [, asset] of html.matchAll(
    /(?:src|href)="\/_next\/(static\/[^"?]+)(?:\?[^"]*)?"/g
  )) {
    assert(
      existsSync(join(".next", asset)),
      `${page} references missing build asset: ${asset}`
    );
    references++;
  }
}
console.log(
  `PASS: ${references} generated asset references across ${pages.length} pages exist.`
);
