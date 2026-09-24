import posthog from "posthog-js";
import { canTrack, privateUrl } from "@/lib/analytics";

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

// Production only. No fallback to an unrelated project's token or region.
if (canTrack() && token?.startsWith("phc_") && host?.startsWith("https://")) {
  posthog.init(token, {
    api_host: host,
    defaults: "2026-05-30",
    capture_pageview: "history_change",
    capture_pageleave: true,
    autocapture: false,
    capture_dead_clicks: false,
    capture_exceptions: false,
    disable_session_recording: true,
    disable_surveys: true,
    enable_heatmaps: false,
    person_profiles: "never",
    respect_dnt: true,
    ip: false,
    advanced_disable_flags: true,
    disable_capture_url_hashes: true,
    before_send: (event) => {
      if (!event || !canTrack()) return null;
      for (const key of ["$current_url", "$initial_current_url", "$session_entry_url", "$referrer", "$initial_referrer"]) {
        if (key in event.properties) event.properties[key] = privateUrl(event.properties[key]);
      }
      return event;
    },
  });
}
