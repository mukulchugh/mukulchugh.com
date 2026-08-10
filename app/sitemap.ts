import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.siteUrl;

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      changeFrequency: "daily",
      lastModified: new Date(),
      priority: 1.0,
      url: baseUrl,
    },
    {
      changeFrequency: "daily",
      lastModified: new Date(),
      priority: 0.9,
      url: `${baseUrl}/blog`,
    },
  ];

  const blogRoutes: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    changeFrequency: "weekly" as const,
    lastModified: new Date(post.publishedAt),
    priority: 0.8,
    url: `${baseUrl}/blog/${post.slug}`,
  }));

  return [...staticRoutes, ...blogRoutes];
}
