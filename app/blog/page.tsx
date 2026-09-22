import type { Metadata } from "next";
import { PostsGrid } from "@/components/blog/posts-grid";
import { getAllPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/data";

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
    title: "Writing | Mukul Chugh",
    type: "website",
    url: `${siteConfig.siteUrl}/blog`,
  },
  title: "Writing",
};

export default async function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="w-full py-6 sm:py-8">
      <header className="mb-6 px-1 sm:mb-8">
        <h1 className="max-w-[16ch] text-balance font-sans text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-[1.1] tracking-[-0.035em]">
          Notes from the work.
        </h1>
        <p className="mt-5 max-w-[55ch] text-base leading-relaxed text-muted-foreground">
          On engineering, product, and building software.
        </p>
      </header>
      <PostsGrid posts={posts} />
    </main>
  );
}
