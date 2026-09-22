import { HomeBento } from "@/components/home-bento";
import { getAllPosts } from "@/lib/blog";

export default function Home() {
  const posts = getAllPosts();

  return (
    <main>
      <div className="bento-page">
        <HomeBento posts={posts} />
      </div>
    </main>
  );
}
