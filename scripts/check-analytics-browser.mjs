// Run with Bun. Uses a disposable browser and intercepts ALL analytics writes.
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { gunzipSync } from "node:zlib";
import { build } from "bun";
import { chromium } from "playwright";
import { GET as googleProxy } from "../app/api/analytics/google/[...path]/route";

const result = await build({
  define: {
    "process.env": "{}",
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  entrypoints: ["analytics-fixture"],
  format: "esm",
  plugins: [
    {
      name: "analytics-fixture",
      setup(builder) {
        builder.onResolve({ filter: /^analytics-fixture$/ }, () => ({
          namespace: "fixture",
          path: "entry",
        }));
        builder.onLoad({ filter: /.*/, namespace: "fixture" }, () => ({
          contents: `import * as analytics from ${JSON.stringify(resolve("lib/analytics.ts"))}; import posthog from ${JSON.stringify(resolve("node_modules/posthog-js"))}; window.__tracking = analytics; window.__posthog = posthog;`,
          loader: "ts",
        }));
      },
    },
  ],
  target: "browser",
});
assert(result.success, result.logs.join("\n"));
const bundle = await result.outputs[0].text();
const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({ serviceWorkers: "block" });
  const page = await context.newPage();
  const google = [];
  const posthog = [];
  const externalWrites = [];
  const failures = [];
  const warnings = [];
  const requests = [];
  const issues = [];
  const audit = await context.newCDPSession(page);
  await audit.send("Audits.enable");
  audit.on("Audits.issueAdded", ({ issue }) => issues.push(issue));
  page.on("pageerror", (error) => failures.push(error.message));
  page.on("console", (message) => {
    warnings.push(message.text().replace(/phc_[A-Za-z0-9_-]+/g, "[token]"));
  });
  await context.route("**/*", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    requests.push(
      `${request.method()} ${url.hostname}${url.pathname.replace(/phc_[A-Za-z0-9_-]+/g, "[token]")}`
    );
    if (url.origin !== "https://mukulchugh.com") {
      if (request.method() !== "GET" || url.pathname.includes("collect"))
        externalWrites.push(url.hostname + url.pathname);
      return route.abort();
    }
    if (
      url.pathname === "/api/analytics/google/gtag/js" ||
      url.pathname.includes("/google/_/service_worker/")
    ) {
      const response = await googleProxy(new Request(url), {
        params: Promise.resolve({
          path: url.pathname.replace("/api/analytics/google/", "").split("/"),
        }),
      });
      assert.equal(response.status, 200);
      return route.fulfill({
        body: await response.text(),
        headers: Object.fromEntries(response.headers),
        status: response.status,
      });
    }
    if (url.pathname.startsWith("/api/analytics/google/")) {
      const hits = request.postData()?.split("\n") || [""];
      for (const line of hits) {
        const hit = new URLSearchParams(url.searchParams);
        for (const [key, value] of new URLSearchParams(line))
          hit.set(key, value);
        google.push(Object.fromEntries(hit));
      }
      return route.fulfill({ status: 204 });
    }
    if (url.pathname.startsWith("/api/analytics/posthog/")) {
      if (request.method() === "POST" && !url.pathname.includes("flags")) {
        const buffer = request.postDataBuffer();
        try {
          const raw =
            buffer?.[0] === 31
              ? gunzipSync(buffer).toString()
              : buffer?.toString();
          const payload = JSON.parse(raw || "null");
          posthog.push(
            ...(Array.isArray(payload) ? payload : payload?.batch || [payload])
          );
        } catch {
          posthog.push({ undecoded: true });
        }
        return route.fulfill({ json: { status: 1 }, status: 200 });
      }
      if (url.pathname.includes("flags"))
        return route.fulfill({
          json: { featureFlagPayloads: {}, featureFlags: {} },
        });
      const upstream = new URL(
        url.pathname.replace("/api/analytics/posthog", "") + url.search,
        "https://us-assets.i.posthog.com"
      );
      const response = await fetch(upstream, {
        signal: AbortSignal.timeout(10_000),
      });
      return route.fulfill({
        body: await response.text(),
        contentType:
          response.headers.get("content-type") || "application/javascript",
        status: response.status,
      });
    }
    if (url.pathname.startsWith("/_vercel/"))
      return route.fulfill({
        body: "/* no vendor writes during fixture verification */",
        contentType: "application/javascript",
      });
    return route.fulfill({
      body: "<!doctype html><html><head><title>Analytics verification</title></head><body><h1>Isolated tracking test</h1></body></html>",
      contentType: "text/html",
    });
  });
  await page.goto("https://mukulchugh.com/?email=private@example.com#secret");
  await page.addScriptTag({ content: bundle, type: "module" });
  await page
    .waitForFunction(() => Boolean(window.__tracking), undefined, {
      timeout: 5000,
    })
    .catch((error) => {
      console.error("Browser errors:", failures);
      throw error;
    });
  await page.evaluate(() => {
    const initialize = window.__posthog.init.bind(window.__posthog);
    window.__posthog.init = (token, config) =>
      initialize(token, { ...config, opt_out_useragent_filter: true });
    window.__tracking.initializeAnalytics();
    // Test-only: PostHog correctly filters navigator.webdriver in automation.
    // Production keeps its bot filter enabled; all fixture writes are intercepted.
    window.__posthog.set_config({ opt_out_useragent_filter: true });
    window.__tracking.trackPageView("/");
    window.__tracking.trackPageView("/");
    const script = document.createElement("script");
    script.src = "/api/analytics/google/gtag/js?id=G-VTWNXFFM1L";
    document.head.appendChild(script);
  });
  await page.waitForTimeout(2000);
  await page.evaluate(() => {
    history.pushState({}, "", "/projects/openkvm");
    window.__tracking.trackPageView("/projects/openkvm");
    window.__tracking.trackPortfolioEvent("project_open", {
      destination: "/projects/openkvm",
      surface: "fixture",
    });
  });
  await page.waitForTimeout(6500);
  const pageviews = google.filter(
    (hit) =>
      hit.en === "page_view" && hit["ep.analytics_source"] === "portfolio"
  );
  if (pageviews.length !== 2)
    console.log(
      JSON.stringify({
        externalWrites,
        failures,
        google,
        queue: await page.evaluate(() =>
          (window.dataLayer || []).map((item) => Array.from(item))
        ),
        requests,
      })
    );
  assert.equal(pageviews.length, 2, "two manually dispatched Google pageviews");
  assert.equal(google.filter((hit) => hit.en === "project_open").length, 1);
  assert(
    pageviews.every((hit) => !(hit.dl.includes("?") || hit.dl.includes("#")))
  );
  if (!posthog.some((hit) => hit?.event === "$pageview"))
    console.log(
      JSON.stringify({
        failures,
        posthogShapes: posthog.map((hit) => Object.keys(hit || {})),
        requests,
        state: await page.evaluate(() => ({
          canTrack: window.__tracking.canTrack(),
          flags: window.__posthog._flags,
          loaded: window.__posthog.__loaded,
          optedOut: window.__posthog.has_opted_out_capturing(),
          queue: window.__posthog._requestQueue?.queue?.length,
        })),
        warnings,
      })
    );
  assert.equal(
    posthog.filter((hit) => hit?.event === "$pageview").length,
    2,
    "two PostHog SDK pageviews"
  );
  assert.equal(
    posthog.filter((hit) => hit?.event === "project_open").length,
    1
  );
  assert(
    !JSON.stringify(posthog).includes("private@example.com"),
    "query PII never leaves PostHog"
  );
  const vaq = await page.evaluate(() => window.vaq || []);
  assert.equal(vaq.filter(([name]) => name === "pageview").length, 2);
  assert.equal(vaq.filter(([name]) => name === "event").length, 1);
  assert.deepEqual(
    externalWrites,
    [],
    "all attempted browser analytics writes are same-origin"
  );
  assert.deepEqual(failures, []);
  console.log("Browser issue codes:", [
    ...new Set(issues.map((issue) => issue.code)),
  ]);
  console.log(
    "Worker resources:",
    requests.filter((request) => request.includes("service_worker"))
  );
  console.log(
    "PASS: real Google + PostHog browser SDKs, native Vercel queue, same-origin requests, no duplicate pageviews; writes intercepted."
  );
} finally {
  await browser.close();
}
