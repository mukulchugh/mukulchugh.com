import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/data";

export default function robots(): MetadataRoute.Robots {
  return {
    host: siteConfig.siteUrl,
    rules: {
      allow: "/",
      disallow: ["/api/", "/private/", "/prototype/"],
      userAgent: "*",
    },
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
  };
}
