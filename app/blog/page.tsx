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
    title: "Blog | Mukul Chugh",
    type: "website",
    url: `${siteConfig.siteUrl}/blog`,
  },
  title: "Blog",
};

export default async function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="w-full py-6 sm:py-8">
      <header className="mb-6 px-1 sm:mb-8">
        <p className="bento-label mb-4">01 / Writing</p>
        <h1 className="font-syne text-[clamp(2.5rem,6vw,5.25rem)] font-extrabold leading-[0.85] tracking-[-0.065em]">
          Writing &amp;
          <br />
          notes.
        </h1>
        <p className="mt-5 text-base tracking-[0.12em] sm:text-xl">
          Ideas. Systems. Less noise.
        </p>
      </header>
      <PostsGrid posts={posts} />
    </main>
  );
}
