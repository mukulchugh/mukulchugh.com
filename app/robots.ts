import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/data";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/private/"],
      },
      {
        userAgent: ["Googlebot", "Bingbot"],
        allow: "/",
        crawlDelay: 0,
      },
      {
        userAgent: "GPTBot", // OpenAI's crawler
        allow: ["/blog/", "/"], // Allow AI crawling for better AI search results
      },
    ],
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
    host: siteConfig.siteUrl,
  };
}
