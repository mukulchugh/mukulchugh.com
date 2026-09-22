import assert from "node:assert/strict";

const base = new URL(process.argv[2] ?? "http://localhost:3000");
assert.ok(["localhost", "127.0.0.1"].includes(base.hostname));
const response = await fetch(base);
assert.equal(response.status, 200);
const html = await response.text();
for (const text of [
  "Creating",
  "digital",
  "experiences",
  "for humans",
  "View work",
  "For the playful ones.",
  "Rebound air hockey",
]) {
  assert.ok(html.includes(text), `Homepage must render ${text}`);
}
const artwork = await fetch(new URL("/design/rebound-v1/rink-tall.png", base));
assert.equal(artwork.status, 200);
assert.match(artwork.headers.get("content-type") ?? "", /image/);
console.log("Approved bento hero and local artwork contract passed.");
