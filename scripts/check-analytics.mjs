import { mock } from "bun:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { cleanUrl, GA_ID, POSTHOG_PROJECT_ID } from "../lib/analytics-config";

const captured = [];
const vercelEvents = [];
const vercelViews = [];
let posthogConfig = {};
mock.module("posthog-js", () => ({
  default: {
    capture: (name, props) => captured.push([name, props]),
    captureException: () => undefined,
    init: (_token, config) => {
      posthogConfig = config;
    },
  },
}));
mock.module("@vercel/analytics", () => ({
  inject: (config) => assert.equal(config.disableAutoTrack, true),
  pageview: (props) => vercelViews.push(props),
  track: (name, props) => vercelEvents.push([name, props]),
}));
mock.module("@vercel/speed-insights", () => ({
  injectSpeedInsights: () => ({ setRoute: () => undefined }),
}));
const fakeWindow = {
  dataLayer: [],
  location: new URL("https://mukulchugh.com/?email=private@example.com#secret"),
  requestIdleCallback: (callback) => callback(),
};
Object.defineProperty(globalThis, "window", {
  configurable: true,
  value: fakeWindow,
});
Object.defineProperty(globalThis, "document", {
  configurable: true,
  value: {
    readyState: "complete",
    referrer: "https://example.com/?private=value",
  },
});
Object.defineProperty(globalThis, "navigator", {
  configurable: true,
  value: { doNotTrack: "0", globalPrivacyControl: false },
});
const analytics = await import("../lib/analytics");
assert.equal(POSTHOG_PROJECT_ID, 625_612);
assert(analytics.analyticsAllowed("mukulchugh.com", "/", true));
for (const args of [
  ["localhost", "/", true],
  ["mukulchugh.com", "/prototype/dock", true],
  ["mukulchugh.com", "/", false],
  ["mukulchugh.com", "/", true, "1"],
  ["mukulchugh.com", "/", true, null, true],
])
  assert.equal(analytics.analyticsAllowed(...args), false);
assert.equal(
  cleanUrl("https://example.com/path?q=secret#email"),
  "https://example.com/path"
);
assert.equal(cleanUrl("javascript:alert(1)"), "");
assert.deepEqual(
  analytics.linkEvent("mailto:private@example.com", fakeWindow.location.href),
  { event: "email_click", properties: {} }
);
assert.equal(
  analytics.linkEvent("javascript:alert(1)", fakeWindow.location.href),
  null
);
assert.deepEqual(
  analytics.linkEvent(
    "/projects/openkvm?token=secret",
    fakeWindow.location.href
  )?.properties,
  { destination: "/projects/openkvm" }
);
analytics.trackPageView("/");
analytics.trackPageView("/");
fakeWindow.location = new URL("https://mukulchugh.com/projects/openkvm");
analytics.trackPageView("/projects/openkvm");
fakeWindow.location = new URL("https://mukulchugh.com/");
analytics.trackPageView("/");
await new Promise((resolve) => setTimeout(resolve, 0));
assert.equal(
  vercelViews.length,
  3,
  "initial, navigation, and back; no Strict Mode duplicate"
);
assert.equal(captured.filter(([name]) => name === "$pageview").length, 3);
assert.equal(
  fakeWindow.dataLayer.filter((args) => args[1] === "page_view").length,
  3
);
assert(
  fakeWindow.dataLayer.every((args) => !Array.isArray(args)),
  "gtag uses Arguments, not arrays"
);
analytics.trackPortfolioEvent("project_open", {
  destination: "/projects/openkvm",
  surface: "slider",
  ...{ email: "private@example.com" },
});
await new Promise((resolve) => setTimeout(resolve, 0));
assert.equal(vercelEvents.length, 1);
assert(!JSON.stringify(captured).includes("private@example.com"));
assert.equal(posthogConfig.capture_pageview, false);
assert.equal(posthogConfig.api_host, "/api/analytics/posthog");
assert.equal(posthogConfig.disable_session_recording, true);
assert.equal(posthogConfig.mask_all_text, true);
const scrubbed = posthogConfig.before_send({
  event: "$web_vitals",
  properties: {
    $set: { email: "private@example.com" },
    entries: [
      { name: "https://mukulchugh.com/?email=private@example.com#secret" },
    ],
    message: "Contact private@example.com",
  },
});
assert.deepEqual(scrubbed.properties, {
  entries: [{ name: "https://mukulchugh.com/" }],
  message: "Contact [redacted]",
});

Object.defineProperty(globalThis, "navigator", {
  configurable: true,
  value: { globalPrivacyControl: true },
});
analytics.trackPortfolioEvent("email_click");
assert.equal(vercelEvents.length, 1);
const { GET, POST } = await import(
  "../app/api/analytics/google/[...path]/route"
);
const context = (path) => ({
  params: Promise.resolve({ path: path.split("/") }),
});
const originalFetch = globalThis.fetch;
const forwarded = [];
globalThis.fetch = async (url, options) => {
  forwarded.push({ options, url: String(url) });
  return new Response(null, { status: 204 });
};
try {
  const base = "https://mukulchugh.com/api/analytics/google/";
  assert.equal(
    (await GET(new Request(`${base}anything`), context("anything"))).status,
    404
  );
  assert.equal(
    (await GET(new Request(`${base}gtag/js?id=G-WRONG`), context("gtag/js")))
      .status,
    400
  );
  const query = new URLSearchParams({
    dl: "https://mukulchugh.com/?email=secret",
    en: "page_view",
    "ep.analytics_source": "portfolio",
    "ep.email": "private@example.com",
    tid: GA_ID,
    uid: "private",
  });
  assert.equal(
    (
      await POST(
        new Request(`${base}g/collect?${query}`, {
          body: "",
          headers: { authorization: "secret", cookie: "secret" },
          method: "POST",
        }),
        context("g/collect")
      )
    ).status,
    204
  );
  assert.equal(forwarded.length, 1);
  assert(!forwarded[0].url.includes("secret"));
  assert(!forwarded[0].url.includes("private"));
  assert(!JSON.stringify(forwarded[0].options).includes("secret"));
  assert.equal(new URL(forwarded[0].url).hostname, "www.google-analytics.com");
  query.delete("ep.analytics_source");
  await POST(
    new Request(`${base}g/collect?${query}`, { body: "", method: "POST" }),
    context("g/collect")
  );
  assert.equal(forwarded.length, 1, "automatic Google pageviews are discarded");
  const crossSite = new Request(`${base}g/collect?tid=${GA_ID}`, {
    headers: { origin: "https://other.example" },
  });
  assert.equal((await GET(crossSite, context("g/collect"))).status, 403);
  const oversized = new Request(`${base}g/collect?tid=${GA_ID}`, {
    body: "x".repeat(65_537),
    method: "POST",
  });
  assert.equal((await POST(oversized, context("g/collect"))).status, 413);
  const dnt = new Request(`${base}g/collect?tid=${GA_ID}`, {
    headers: { dnt: "1" },
  });
  assert.equal((await GET(dnt, context("g/collect"))).status, 204);
  assert.equal(forwarded.length, 1);
  const workerPath = "_/service_worker/69f0/sw.js";
  const worker = await GET(new Request(base + workerPath), context(workerPath));
  assert.equal(worker.status, 200);
  assert.equal(
    worker.headers.get("Service-Worker-Allowed"),
    "/api/analytics/google/_/service_worker"
  );
  assert.equal(
    forwarded[1].url,
    "https://www.googletagmanager.com/static/service_worker/69f0/sw.js"
  );
  assert.equal(
    (
      await POST(
        new Request(base + workerPath, { method: "POST" }),
        context(workerPath)
      )
    ).status,
    405
  );
  assert.equal(
    (
      await GET(
        new Request(`${base}_/service_worker/69f0/other.js`),
        context("_/service_worker/69f0/other.js")
      )
    ).status,
    404
  );
  assert.equal(forwarded.length, 2);
} finally {
  globalThis.fetch = originalFetch;
}
const { GET: posthogGet, POST: posthogPost } = await import(
  "../app/api/analytics/posthog/[...path]/route"
);
const posthogForwarded = [];
globalThis.fetch = async (url, options) => {
  posthogForwarded.push({ options, url: String(url) });
  const asset = String(url).includes("us-assets.i.posthog.com");
  return new Response(asset ? "/* sdk asset */" : '{"status":1}', {
    headers: {
      "Content-Type": asset ? "application/javascript" : "application/json",
    },
    status: 200,
  });
};
try {
  const base = "https://mukulchugh.com/api/analytics/posthog/";
  assert.equal(
    (await posthogGet(new Request(`${base}anything`), context("anything")))
      .status,
    404
  );
  assert.equal(
    (await posthogGet(new Request(`${base}e/`), context("e"))).status,
    405
  );
  assert.equal(
    (
      await posthogPost(
        new Request(`${base}e/`, {
          headers: { origin: "https://other.example" },
          method: "POST",
        }),
        context("e")
      )
    ).status,
    403
  );
  assert.equal(
    (
      await posthogPost(
        new Request(`${base}e/`, { headers: { dnt: "1" }, method: "POST" }),
        context("e")
      )
    ).status,
    204
  );
  const event = await posthogPost(
    new Request(`${base}i/v0/e/?ip=0`, {
      body: '{"event":"$pageview"}',
      headers: {
        authorization: "secret",
        "content-type": "application/json",
        cookie: "secret",
      },
      method: "POST",
    }),
    context("i/v0/e")
  );
  assert.equal(event.status, 200);
  assert.equal(posthogForwarded.length, 1);
  assert.equal(new URL(posthogForwarded[0].url).hostname, "us.i.posthog.com");
  assert(!JSON.stringify(posthogForwarded[0].options).includes("secret"));
  assert.equal(
    (
      await posthogPost(
        new Request(`${base}e/`, {
          body: "x".repeat(524_289),
          method: "POST",
        }),
        context("e")
      )
    ).status,
    413
  );
  const asset = await posthogGet(
    new Request(`${base}static/array.js`),
    context("static/array.js")
  );
  assert.equal(asset.status, 200);
  assert.equal(
    new URL(posthogForwarded[1].url).hostname,
    "us-assets.i.posthog.com"
  );
} finally {
  globalThis.fetch = originalFetch;
}
const config = await readFile("next.config.js", "utf8");
assert(!config.includes('destination: "https://us.i.posthog.com/:path*"'));
assert(config.includes("skipTrailingSlashRedirect: true"));
console.log(
  "PASS: shared analytics, three-provider dedupe, privacy gates, URL scrubbing, and bounded proxy."
);
