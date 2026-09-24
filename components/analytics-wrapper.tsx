"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";
import {
  canTrack,
  initializeAnalytics,
  linkEvent,
  trackPageView,
  trackPortfolioEvent,
  validGaId,
} from "@/lib/analytics";
import { GA_ID, GOOGLE_PROXY } from "@/lib/analytics-config";

export function AnalyticsWrapper() {
  const [enabled, setEnabled] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    initializeAnalytics();
    setEnabled(canTrack());
    trackPageView(pathname);
  }, [pathname]);

  useEffect(() => {
    const clicked = (event: MouseEvent) => {
      if (!(event.target instanceof Element) || event.button !== 0) return;
      if (event.target.closest("[data-analytics-private], .ph-no-capture"))
        return;
      const link = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;
      // Next Link prevents default browser navigation; that is still a real click.
      const action = linkEvent(link.href, window.location.href);
      if (action) trackPortfolioEvent(action.event, action.properties);
    };
    document.addEventListener("click", clicked);
    return () => document.removeEventListener("click", clicked);
  }, []);

  // next/third-parties doesn't expose custom transport or disable-auto-pageview config.
  return enabled && validGaId(GA_ID) ? (
    <Script
      id="portfolio-google-analytics"
      src={`${GOOGLE_PROXY}/gtag/js?id=${GA_ID}`}
      strategy="afterInteractive"
    />
  ) : null;
}
