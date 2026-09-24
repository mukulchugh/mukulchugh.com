"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { canTrack, linkEvent, trackPortfolioEvent, validGaId } from "@/lib/analytics";

export function AnalyticsWrapper({ gaId }: { gaId: string }) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!canTrack()) return;
    const analyticsWindow = window as Window & { dataLayer?: unknown[] };
    const queue = (analyticsWindow.dataLayer ??= []);
    // Configure privacy before Google's config command; no advertising features.
    queue.push(["consent", "default", { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "granted" }]);
    queue.push(["set", { allow_google_signals: false, allow_ad_personalization_signals: false }]);
    setShouldLoad(true);
    const clicked = (event: MouseEvent) => {
      if (!(event.target instanceof Element) || event.defaultPrevented || event.button !== 0) return;
      const link = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;
      const action = linkEvent(link.href, window.location.href);
      if (action) trackPortfolioEvent(action.event, action.properties);
    };
    document.addEventListener("click", clicked);
    return () => document.removeEventListener("click", clicked);
  }, []);

  if (!shouldLoad || pathname.startsWith("/prototype")) {
    return null;
  }

  return (
    <>
      {validGaId(gaId) && <GoogleAnalytics gaId={gaId} />}
      <Analytics />
      <SpeedInsights />
    </>
  );
}
