import assert from "node:assert/strict";
import { serve } from "bun";
import { chromium } from "playwright";
import { GET } from "../app/api/analytics/google/[...path]/route";

// Use the real proxy headers with an inert worker, never live analytics writes.
const originalFetch = globalThis.fetch;
globalThis.fetch = async () =>
  new Response("/* inert scope regression fixture */");
const server = serve({
  fetch(request) {
    const path = new URL(request.url).pathname;
    if (path.endsWith("/sw.js"))
      return GET(request, {
        params: Promise.resolve({
          path: ["_", "service_worker", "test", "sw.js"],
        }),
      });
    return new Response("<!doctype html><title>Worker scope check</title>", {
      headers: { "Content-Type": "text/html" },
    });
  },
  port: 0,
});
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto(server.url.href);
  const scope = await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.register(
      "/api/analytics/google/_/service_worker/test/sw.js",
      { scope: "/api/analytics/google/_/service_worker" }
    );
    await registration.unregister();
    return new URL(registration.scope).pathname;
  });
  assert.equal(scope, "/api/analytics/google/_/service_worker");
  console.log("Google proxy: browser accepts the exact service-worker scope.");
} finally {
  await browser.close();
  server.stop(true);
  globalThis.fetch = originalFetch;
}
