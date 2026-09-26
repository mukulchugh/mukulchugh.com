import { HomeBento } from "@/components/home-bento";
import { getAllPosts } from "@/lib/blog";
import { getShowcaseProjects } from "@/lib/projects";

export default function Home() {
  const posts = getAllPosts();
  const showcase = getShowcaseProjects();

  return (
    <main>
      <div className="bento-page">
        <HomeBento posts={posts} showcase={showcase} />
      </div>
    </main>
  );
}
