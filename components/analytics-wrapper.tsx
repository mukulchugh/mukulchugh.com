"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useEffect, useState } from "react";

export function AnalyticsWrapper({ gaId }: { gaId: string }) {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Defer analytics until after first paint / interaction window
    const timer = window.setTimeout(() => setShouldLoad(true), 2500);
    return () => window.clearTimeout(timer);
  }, []);

  if (!shouldLoad) {
    return null;
  }

  return (
    <>
      <GoogleAnalytics gaId={gaId} />
      <Analytics />
      <SpeedInsights />
    </>
  );
}
