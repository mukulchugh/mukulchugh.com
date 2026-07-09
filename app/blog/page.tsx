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
    <main className="w-full py-20">
      <div className="container mx-auto px-4 max-w-4xl flex flex-col gap-14">
        {/* Back to Home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <IconArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="flex w-full flex-col sm:flex-row sm:justify-between sm:items-center gap-8">
          <div className="flex flex-col gap-3">
            <h1
              className={cn(
                syne.className,
                "text-[2rem] md:text-[3rem] tracking-tight font-bold leading-[1.15]"
              )}
            >
              Latest articles
            </h1>
            <p className="text-[15px] text-muted-foreground leading-relaxed max-w-[52ch]">
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
