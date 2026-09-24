import { inject, pageview, track } from "@vercel/analytics";
import { injectSpeedInsights } from "@vercel/speed-insights";
import type { PostHog } from "posthog-js";
import {
  cleanUrl,
  GA_ID,
  GOOGLE_PROXY,
  POSTHOG_PROXY,
  POSTHOG_TOKEN,
  portfolioEvents,
} from "./analytics-config";

type PortfolioEvent = (typeof portfolioEvents)[number];
type EventProperties = {
  destination?: string;
  link_host?: string;
  surface?: string;
};
let initialized = false;
let previousPath: string | undefined;
let speedInsights: ReturnType<typeof injectSpeedInsights>;
let posthogReady: Promise<PostHog | undefined> | undefined;

export function analyticsAllowed(
  hostname: string,
  pathname: string,
  production: boolean,
  doNotTrack?: string | null,
  globalPrivacyControl?: boolean
) {
  return (
    production &&
    ["mukulchugh.com", "www.mukulchugh.com"].includes(hostname) &&
    !pathname.startsWith("/prototype") &&
    doNotTrack !== "1" &&
    doNotTrack !== "yes" &&
    !globalPrivacyControl
  );
}
export function canTrack() {
  if (typeof window === "undefined") return false;
  return analyticsAllowed(
    window.location.hostname,
    window.location.pathname,
    process.env.NODE_ENV === "production",
    navigator.doNotTrack,
    (navigator as Navigator & { globalPrivacyControl?: boolean })
      .globalPrivacyControl
  );
}
export const validGaId = (id: string) =>
  /^G-[A-Z0-9]+$/.test(id) && !id.includes("XXXX");
export const privateUrl = (value: unknown) =>
  typeof value === "string" ? cleanUrl(value) : value;

// Performance events carry URLs inside nested entries, not just $current_url.
export function scrubAnalyticsUrls(value: unknown, depth = 0): unknown {
  if (depth > 12) return null;
  if (typeof value === "string") {
    if (/^https?:\/\//.test(value)) return cleanUrl(value);
    return value.replace(
      /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,
      "[redacted]"
    );
  }
  if (Array.isArray(value))
    return value.map((item) => scrubAnalyticsUrls(item, depth + 1));
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        scrubAnalyticsUrls(item, depth + 1),
      ])
    );
  return value;
}

// Google expects Arguments objects, not arrays, in the dataLayer command queue.
function gtag(..._args: unknown[]) {
  const target = window as Window & { dataLayer?: unknown[] };
  target.dataLayer ??= [];
  // biome-ignore lint/complexity/noArguments: gtag's documented queue requires Arguments objects.
  target.dataLayer.push(arguments);
}
function safely(send: () => void) {
  try {
    send();
  } catch {
    /* Analytics must never interrupt navigation or booking. */
  }
}

function capturePostHog(send: (sdk: PostHog) => void) {
  void posthogReady?.then((sdk) => {
    if (sdk && canTrack()) safely(() => send(sdk));
  });
}

/** All provider initialization lives here; no SDK calls in UI components. */
export function initializeAnalytics() {
  if (initialized || !canTrack()) return;
  initialized = true;
  safely(() => {
    gtag("consent", "default", {
      ad_personalization: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      analytics_storage: "granted",
    });
    gtag("js", new Date());
    if (validGaId(GA_ID))
      gtag("config", GA_ID, {
        allow_ad_personalization_signals: false,
        allow_google_signals: false,
        page_location: cleanUrl(window.location.href),
        page_referrer: cleanUrl(document.referrer),
        send_page_view: false,
        server_container_url: window.location.origin + GOOGLE_PROXY,
      });
  });
  posthogReady = new Promise<void>((resolve) => {
    const idle = () => {
      if ("requestIdleCallback" in window)
        window.requestIdleCallback(() => resolve(), { timeout: 1000 });
      else setTimeout(resolve, 0);
    };
    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });
  })
    .then(async () => {
      if (!(canTrack() && POSTHOG_TOKEN.startsWith("phc_"))) return;
      const { default: posthog } = await import("posthog-js");
      posthog.init(POSTHOG_TOKEN, {
        api_host: POSTHOG_PROXY,
        autocapture: {
          css_selector_ignorelist: [
            ".ph-no-capture",
            ".ph-no-autocapture",
            "[data-ph-no-autocapture]",
            "form",
            "[data-analytics-private]",
          ],
          dom_event_allowlist: ["click"],
          element_allowlist: ["a", "button"],
        },
        before_send: (event) => {
          if (!(event && canTrack())) return null;
          for (const key of [
            "$current_url",
            "$initial_current_url",
            "$session_entry_url",
            "$referrer",
            "$initial_referrer",
          ]) {
            if (key in event.properties)
              event.properties[key] = privateUrl(event.properties[key]);
          }
          for (const key of ["$set", "$set_once", "$el_text", "$element_text"])
            delete event.properties[key];
          event.properties = scrubAnalyticsUrls(
            event.properties
          ) as typeof event.properties;
          return event;
        },
        capture_dead_clicks: true,
        capture_exceptions: false,
        capture_heatmaps: true,
        capture_pageleave: true,
        capture_pageview: false,
        capture_performance: { network_timing: false, web_vitals: true },
        defaults: "2026-05-30",
        disable_capture_url_hashes: true,
        disable_session_recording: true,
        disable_surveys: true,
        enable_recording_console_log: false,
        ip: false,
        mask_all_element_attributes: true,
        mask_all_text: true,
        mask_personal_data_properties: true,
        person_profiles: "never",
        respect_dnt: true,
        ui_host: "https://us.posthog.com",
      });
      return posthog;
    })
    .catch(() => undefined);
  const config = process.env.NEXT_PUBLIC_VERCEL_OBSERVABILITY_CLIENT_CONFIG;
  safely(() =>
    inject(
      {
        beforeSend: (event) =>
          canTrack() ? { ...event, url: cleanUrl(event.url) } : null,
        disableAutoTrack: true,
        framework: "next",
      },
      config
    )
  );
  safely(() => {
    speedInsights = injectSpeedInsights(
      {
        beforeSend: (event) =>
          canTrack() ? { ...event, url: cleanUrl(event.url) } : null,
        framework: "next",
      },
      config
    );
  });
}

/** One committed navigation, one pageview per provider (including Strict Mode). */
export function trackPageView(pathname: string) {
  if (!canTrack()) {
    previousPath = undefined;
    return;
  }
  initializeAnalytics();
  const path = pathname.split(/[?#]/)[0];
  if (previousPath === path) return;
  const referrer = previousPath
    ? window.location.origin + previousPath
    : cleanUrl(document.referrer);
  previousPath = path;
  const location = window.location.origin + path;
  const route = path.replace(/^\/(blog|projects)\/[^/]+$/, "/$1/[slug]");
  safely(() =>
    gtag("event", "page_view", {
      analytics_source: "portfolio",
      page_location: location,
      page_path: path,
      page_referrer: referrer,
      send_to: GA_ID,
    })
  );
  capturePostHog((posthog) =>
    posthog.capture("$pageview", {
      $current_url: location,
      $pathname: path,
      $referrer: referrer,
    })
  );
  safely(() => pageview({ path, route }));
  safely(() => speedInsights?.setRoute(route));
}

/** Explicit business events only. Never pass form or calendar payloads. */
export function trackPortfolioEvent(
  event: PortfolioEvent,
  properties: EventProperties = {}
) {
  if (!(canTrack() && portfolioEvents.includes(event))) return;
  initializeAnalytics();
  const values: Record<string, string> = {
    page_path: window.location.pathname,
  };
  // Runtime allowlist also protects against accidental object spreading at call sites.
  for (const key of ["destination", "link_host", "surface"] as const) {
    const value = properties[key];
    if (typeof value === "string" && /^[a-zA-Z0-9/_.-]{1,160}$/.test(value))
      values[key] = value;
  }
  safely(() =>
    gtag("event", event, {
      ...values,
      analytics_source: "portfolio",
      page_location: cleanUrl(window.location.href),
      send_to: GA_ID,
    })
  );
  capturePostHog((posthog) => posthog.capture(event, values));
  safely(() => track(event, values));
}
export function reportPageError() {
  trackPortfolioEvent("page_error", { surface: "error-boundary" });
  if (canTrack())
    capturePostHog((posthog) =>
      posthog.captureException(new Error("Portfolio page failed to render"))
    );
}
export function linkEvent(
  href: string,
  current: string
): { event: PortfolioEvent; properties: EventProperties } | null {
  let url: URL;
  try {
    url = new URL(href, current);
  } catch {
    return null;
  }
  if (url.protocol === "mailto:")
    return { event: "email_click", properties: {} };
  if (!["http:", "https:"].includes(url.protocol)) return null;
  if (url.origin !== new URL(current).origin)
    return {
      event: "outbound_link_click",
      properties: { link_host: url.hostname },
    };
  if (url.pathname.startsWith("/projects/"))
    return { event: "project_open", properties: { destination: url.pathname } };
  if (url.pathname.startsWith("/blog/"))
    return { event: "article_open", properties: { destination: url.pathname } };
  return null;
}
