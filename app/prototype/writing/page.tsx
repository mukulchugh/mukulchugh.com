import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WritingSection } from "@/components/blog/writing-section";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  robots: { follow: false, index: false },
  title: "Writing · isolated preview",
};

export default function Page() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <main className="bento-page pb-36 pt-8 sm:pt-14">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          Writing, in isolation.
        </h1>
        <Link
          className="inline-flex min-h-11 items-center underline underline-offset-4"
          href="/#blog"
        >
          Back to portfolio
        </Link>
      </header>
      <div className="home-design [container-type:inline-size]">
        <WritingSection posts={getAllPosts()} />
      </div>
    </main>
  );
}
