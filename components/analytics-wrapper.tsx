"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import { useEffect, useState } from "react";

export function AnalyticsWrapper({ gaId }: { gaId: string }) {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Defer analytics loading until after initial page load
    // This improves LCP and reduces main thread blocking time
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, 2000); // Load after 2 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!shouldLoad) return null;

  return <GoogleAnalytics gaId={gaId} />;
}
