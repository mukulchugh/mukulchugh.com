"use client";

import { useEffect, useRef } from "react";
import { siteConfig } from "@/lib/data";

interface AdUnitProps {
  adSlot?: string;
  adFormat?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export function AdUnit({
  adSlot,
  adFormat = "auto",
  className = "",
}: AdUnitProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isAdPushed = useRef(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      return;
    }

    if (isAdPushed.current) {
      return;
    }

    const timer = setTimeout(() => {
      try {
        if (window.adsbygoogle && adRef.current) {
          window.adsbygoogle.push({});
          isAdPushed.current = true;
        }
      } catch (err) {
        console.error("AdSense error:", err);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (process.env.NODE_ENV !== "production") {
    return (
      <div className={`bg-neutral-100 dark:bg-neutral-800 border border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg p-4 text-center text-sm text-neutral-500 ${className}`}>
        Ad Placeholder (only shown in production)
      </div>
    );
  }

  return (
    <div className={`ad-container ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle block"
        data-ad-client={siteConfig.analytics.googleAdsenseId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
}
