import { HomeBento } from "@/components/home-bento";
import { getAllPosts } from "@/lib/blog";

export default function Home() {
  const posts = getAllPosts();

  return (
    <main className="dock-safe-bottom overflow-x-hidden px-3 pt-2 sm:px-5 lg:px-6">
      <div className="mx-auto w-full min-w-0 max-w-[1400px]">
        <HomeBento posts={posts} />
      </div>
    </main>
  );
}
