"use client";

import { useEffect, useState } from "react";
import { BlogIndex } from "@/components/blog/blog-index";
import type { Post } from "@/lib/blog";

export default function DockWriting() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setFailed(false);
    fetch("/dock/posts.json", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load writing");
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("Invalid writing response");
        if (!controller.signal.aborted) setPosts(data);
      })
      .catch(() => {
        if (!controller.signal.aborted) setFailed(true);
      });
    return () => controller.abort();
  }, [attempt]);
  if (posts) return <BlogIndex posts={posts} />;
  return (
    <div className="space-y-4 p-6">
      <p role={failed ? "alert" : "status"}>
        {failed
          ? "Writing couldn’t load. You can retry or open the page."
          : "Loading writing…"}
      </p>
      {failed && (
        <button
          className="min-h-11 underline underline-offset-4"
          onClick={() => setAttempt((value) => value + 1)}
          type="button"
        >
          Retry
        </button>
      )}
      <a className="block min-h-11 underline underline-offset-4" href="/blog">
        Open writing page
      </a>
    </div>
  );
}
