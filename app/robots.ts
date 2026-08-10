import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/data";

export default function robots(): MetadataRoute.Robots {
  return {
    host: siteConfig.siteUrl,
    rules: [
      {
        allow: "/",
        disallow: ["/api/", "/_next/", "/private/"],
        userAgent: "*",
      },
      {
        allow: "/",
        crawlDelay: 0,
        userAgent: ["Googlebot", "Bingbot"],
      },
      {
        allow: ["/blog/", "/"], // Allow AI crawling for better AI search results
        userAgent: "GPTBot", // OpenAI's crawler
      },
    ],
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
  };
}
