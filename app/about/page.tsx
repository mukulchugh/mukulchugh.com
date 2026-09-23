import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { aboutContent, siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  description:
    "The story behind Mukul Chugh’s work across engineering, product, and design.",
  title: "About",
};

export default function AboutPage() {
  return (
    <PageShell>
      <main className="page-content">
        <article className="bento-surface grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <header>
            <Image
              alt="Mukul Chugh"
              className="mb-8 rounded-full border border-border bg-muted p-2"
              height={128}
              src={siteConfig.images.profileImage}
              width={128}
            />
            <h1 className="font-heading text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              {aboutContent.heading}
            </h1>
          </header>
          <div className="max-w-[65ch] space-y-6 text-base leading-8 text-muted-foreground">
            {aboutContent.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <div className="flex flex-wrap gap-6 pt-4 text-foreground">
              <Link
                className="inline-flex min-h-11 items-center underline underline-offset-4"
                href="/projects"
              >
                Explore my work
              </Link>
              <Link
                className="inline-flex min-h-11 items-center underline underline-offset-4"
                href="/contact"
              >
                Start a conversation
              </Link>
            </div>
          </div>
        </article>
      </main>
    </PageShell>
  );
}
