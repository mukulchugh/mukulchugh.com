import { HomeBento } from "@/components/home-bento";
import { getAllPosts } from "@/lib/blog";

export default function Home() {
  const posts = getAllPosts();

  return (
    <main className="overflow-x-hidden px-3 pb-24 pt-2 sm:px-5 sm:pb-28 lg:px-6">
      <div className="mx-auto w-full min-w-0 max-w-7xl">
        <HomeBento posts={posts} />
      </div>
    </main>
  );
}
