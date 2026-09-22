import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import About from "@/components/about";

export const metadata: Metadata = {
  robots: { follow: false, index: false },
  title: "About · isolated preview",
};

export default function Page() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <main className="mx-auto w-[calc(100%-2rem)] max-w-3xl pb-36 pt-8 sm:pt-14">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          About, in isolation.
        </h1>
        <Link
          className="inline-flex min-h-11 items-center underline underline-offset-4"
          href="/#about"
        >
          Back to portfolio
        </Link>
      </header>
      <div className="[container-type:inline-size]">
        <About />
      </div>
      <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
        The finalized About section, shared with the homepage.
      </p>
    </main>
  );
}
