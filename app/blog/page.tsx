import Link from "next/link";
import { PostsGrid } from "@/components/blog/posts-grid";
import { PageJsonLd } from "@/components/page-json-ld";
import { PageOnly } from "@/components/page-shell";
import { getAllPosts } from "@/lib/blog";
import { publicPages, staticMetadata } from "@/lib/seo";

export const revalidate = 3600; // Revalidate every hour

export const metadata = staticMetadata("/blog");

export default async function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="w-full py-6 sm:py-8">
      <PageJsonLd
        description={publicPages["/blog"].description}
        path="/blog"
        title={publicPages["/blog"].title}
        type="CollectionPage"
      />
      <PageOnly>
        <header className="mb-6 px-1 sm:mb-8">
          <h1 className="max-w-[16ch] text-balance font-sans text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-[1.1] tracking-[-0.035em]">
            Notes from the work.
          </h1>
          <p className="mt-5 max-w-[55ch] text-base leading-relaxed text-muted-foreground">
            On engineering, product, and building software.
          </p>
        </header>
      </PageOnly>
      <PostsGrid posts={posts} />
      <details className="mt-8 rounded-[14px] border border-border p-5 sm:p-6">
        <summary className="cursor-pointer text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
          Browse all articles
        </summary>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                className="inline-flex min-h-11 items-center text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                href={`/blog/${post.slug}`}
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </details>
    </main>
  );
}
