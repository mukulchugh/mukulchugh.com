import Script from "next/script";
import { siteConfig } from "@/lib/data";

export const GoogleAdSense = () => {
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${siteConfig.analytics.googleAdsenseId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
};
