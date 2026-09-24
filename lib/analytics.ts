import posthog from "posthog-js";

type PortfolioEvent = "dock_window_open" | "booking_open" | "booking_complete" | "email_copy" | "email_click" | "project_open" | "article_open" | "outbound_link_click";
type EventProperties = { destination?: string; link_host?: string; surface?: string };

export function analyticsAllowed(hostname: string, pathname: string, production: boolean, doNotTrack?: string | null, globalPrivacyControl?: boolean) {
  return production && ["mukulchugh.com", "www.mukulchugh.com"].includes(hostname) && !pathname.startsWith("/prototype") && doNotTrack !== "1" && doNotTrack !== "yes" && !globalPrivacyControl;
}

export function canTrack() {
  if (typeof window === "undefined") return false;
  return analyticsAllowed(window.location.hostname, window.location.pathname, process.env.NODE_ENV === "production", navigator.doNotTrack, (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl);
}

export const validGaId = (id: string) => /^G-[A-Z0-9]+$/.test(id) && !id.includes("XXXX");

/** Explicit events only: never pass contact, calendar, or form payloads here. */
export function trackPortfolioEvent(event: PortfolioEvent, properties: EventProperties = {}) {
  if (!canTrack()) return;
  const values = { ...properties, page_path: window.location.pathname };
  const analyticsWindow = window as Window & { dataLayer?: unknown[] };
  // The Next.js GA integration consumes this same queue after hydration.
  (analyticsWindow.dataLayer ??= []).push(["event", event, values]);
  if (posthog.__loaded) posthog.capture(event, values);
}

export function linkEvent(href: string, current: string): { event: PortfolioEvent; properties: EventProperties } | null {
  let url: URL;
  try { url = new URL(href, current); } catch { return null; }
  if (url.protocol === "mailto:") return { event: "email_click", properties: {} };
  if (!["http:", "https:"].includes(url.protocol)) return null;
  if (url.origin !== new URL(current).origin) return { event: "outbound_link_click", properties: { link_host: url.hostname } };
  if (url.pathname.startsWith("/projects/")) return { event: "project_open", properties: { destination: url.pathname } };
  if (url.pathname.startsWith("/blog/")) return { event: "article_open", properties: { destination: url.pathname } };
  return null;
}

export function privateUrl(value: unknown) {
  if (typeof value !== "string") return value;
  try { const url = new URL(value); return `${url.origin}${url.pathname}`; } catch { return ""; }
}
