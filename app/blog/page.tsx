import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import { PostsGrid } from "@/components/blog/posts-grid";
import { cn } from "@/lib/utils";
import { getAllPosts } from "@/lib/blog";
import { syne } from "@/lib/fonts";
import { siteConfig } from "@/lib/data";
import { AdUnit } from "@/components/ad-unit";
import type { Metadata } from "next";

export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts on software engineering, web development, and building products that matter.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog | Mukul Chugh",
    description: "Thoughts on software engineering, web development, and building products that matter.",
    url: `${siteConfig.siteUrl}/blog`,
    type: "website",
  },
};

export default async function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="w-full py-12 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl flex flex-col gap-10 sm:gap-14">
        {/* Back to Home — touch-target via inline-flex + padding */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 py-2 text-[14px] text-zinc-500
                     [@media(hover:hover)]:hover:text-foreground transition-colors w-fit"
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
                syne.className,
                "tracking-tight font-black leading-[1.08]"
              )}
              style={{ fontSize: "clamp(1.6rem, 5vw, 3rem)" }}
            >
              Latest articles
            </h1>
            {/* Body — 15px muted, capped measure */}
            <p className="text-[14px] sm:text-[15px] text-zinc-500 leading-relaxed max-w-[52ch]">
              Thoughts on software engineering, web development, and building
              products that matter.
            </p>
          </div>
        </div>

        {/* Ad Unit */}
        <AdUnit adFormat="horizontal" className="my-4" />

        {/* Posts Grid */}
        <PostsGrid posts={posts} />
      </div>
    </main>
  );
}
