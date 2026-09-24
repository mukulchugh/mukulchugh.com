import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const publicPages = {
  "/": {
    description: siteConfig.siteDescription,
    heading: "Creating digital experiences for humans.",
    title: siteConfig.siteTitle,
  },
  "/about": {
    description:
      "The story behind Mukul Chugh’s work across engineering, product, and design.",
    heading: "The longer story.",
    title: "About",
  },
  "/blog": {
    description:
      "Notes on engineering, product, and the craft of building software that earns its keep.",
    heading: "Notes from the work.",
    title: "Writing",
  },
  "/contact": {
    description:
      "Start a conversation with Mukul Chugh. Book a short call or get in touch by email.",
    heading: "What should we make next?",
    title: "Contact",
  },
  "/experience": {
    description:
      "Mukul Chugh’s work history across engineering, product, and design.",
    heading: "Experience",
    title: "Experience",
  },
  "/privacy": {
    description:
      "How this personal portfolio handles messages, bookings, analytics and browser privacy preferences.",
    heading: "Privacy.",
    title: "Privacy",
  },
  "/projects": {
    description:
      "Products, tools, and experiments by Mukul Chugh, with the work behind them.",
    heading: "The work.",
    title: "Projects",
  },
} as const;

export const absoluteUrl = (path: string) =>
  new URL(path, siteConfig.siteUrl).href;
export const markdownPath = (path: string) =>
  path === "/" ? "/index.md" : `${path}.md`;
export const socialImage = (path: string) =>
  absoluteUrl(`/og/${path === "/" ? "home" : path.slice(1)}.png`);

export function pageMetadata(
  path: string,
  title: string,
  description: string,
  publishedAt?: string,
  updatedAt?: string
): Metadata {
  const displayTitle = path === "/" ? title : `${title} | ${siteConfig.name}`;
  const image = {
    alt: displayTitle,
    height: 630,
    type: "image/png",
    url: socialImage(path),
    width: 1200,
  };
  return {
    alternates: {
      canonical: absoluteUrl(path),
      types: {
        "application/rss+xml": absoluteUrl("/blog/rss.xml"),
        "text/markdown": absoluteUrl(markdownPath(path)),
      },
    },
    description,
    openGraph: {
      description,
      images: [image],
      locale: "en_US",
      siteName: siteConfig.name,
      title: displayTitle,
      url: absoluteUrl(path),
      ...(publishedAt
        ? {
            publishedTime: publishedAt,
            type: "article",
            ...(updatedAt ? { modifiedTime: updatedAt } : {}),
            authors: [absoluteUrl("/about")],
          }
        : { type: "website" }),
    },
    title: { absolute: displayTitle },
    twitter: {
      card: "summary_large_image",
      creator: "@themukulchugh",
      description,
      images: [image],
      title: displayTitle,
    },
  };
}

export function staticMetadata(path: keyof typeof publicPages) {
  const page = publicPages[path];
  return pageMetadata(path, page.title, page.description);
}
