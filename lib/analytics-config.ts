// Public ingestion identifiers, not account credentials. Never put a personal API key here.
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-VTWNXFFM1L";
export const POSTHOG_PROJECT_ID = 625_612;
export const POSTHOG_TOKEN =
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN ||
  "phc_pqjFYCRDrJ5Pxp3P6ADkZZ7tcQotdr9Jk6C9uVFwX6Ef"; // ggignore: public browser ingestion token
export const POSTHOG_PROXY = "/api/analytics/posthog";
export const GOOGLE_PROXY = "/api/analytics/google";

export const portfolioEvents = [
  "dock_window_open",
  "booking_open",
  "booking_ready",
  "booking_failed",
  "booking_complete",
  "email_copy",
  "email_click",
  "project_open",
  "article_open",
  "outbound_link_click",
  "game_start",
  "game_fullscreen",
  "page_error",
] as const;

export function cleanUrl(value: string) {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol)
      ? `${url.origin}${url.pathname}`
      : "";
  } catch {
    return "";
  }
}
