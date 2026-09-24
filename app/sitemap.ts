import type { MetadataRoute } from "next";
import { publicDocuments } from "@/lib/public-content";
import { absoluteUrl, socialImage } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return publicDocuments().map((doc) => ({
    url: absoluteUrl(doc.path),
    ...(doc.updatedAt || doc.publishedAt
      ? { lastModified: doc.updatedAt || doc.publishedAt }
      : {}),
    images: [socialImage(doc.path)],
  }));
}
