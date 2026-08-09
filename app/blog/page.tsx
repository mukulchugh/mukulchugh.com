import { IconArrowLeft } from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PostsGrid } from "@/components/blog/posts-grid";
import { getAllPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/data";
import { cn } from "@/lib/utils";

export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
  alternates: {
    canonical: "/blog",
  },
  description:
    "Notes on engineering, product, and the craft of building software that earns its keep.",
  openGraph: {
    description:
      "Notes on engineering, product, and the craft of building software that earns its keep.",
    title: "Blog | Mukul Chugh",
    type: "website",
    url: `${siteConfig.siteUrl}/blog`,
  },
  title: "Blog",
};

export default async function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="w-full py-12 sm:py-20">
      <div className="container mx-auto flex max-w-6xl flex-col gap-10 px-4 sm:gap-14 sm:px-6">
        {/* Back to Home — touch-target via inline-flex + padding */}
        <Link
          className="inline-flex items-center gap-2 py-2 text-[14px] text-muted-foreground
                     [@media(hover:hover)]:hover:text-foreground transition-colors w-fit"
          href="/"
        >
          <IconArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="flex w-full flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
          <div className="flex flex-col gap-3">
            {/* Blog page title — section heading scale */}
            <h1
              className={cn(
                "font-syne",
                "tracking-tight font-black leading-[1.08]"
              )}
              style={{ fontSize: "clamp(1.6rem, 5vw, 3rem)" }}
            >
              Latest articles
            </h1>
            {/* Body — 15px muted, capped measure */}
            <p className="text-[14px] sm:text-[15px] text-muted-foreground leading-relaxed max-w-[52ch]">
              Notes on engineering, product, and the craft of building software
              that earns its keep.
            </p>
          </div>
        </div>

        {/* Posts Grid */}
        <PostsGrid posts={posts} />
      </div>
    </main>
  );
}
