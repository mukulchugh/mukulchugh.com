import Image from "next/image";
import Link from "next/link";
import { PageJsonLd } from "@/components/page-json-ld";
import { PageOnly, PageShell } from "@/components/page-shell";
import { aboutContent, siteConfig } from "@/lib/data";
import { publicPages, staticMetadata } from "@/lib/seo";

export const metadata = staticMetadata("/about");

export default function AboutPage() {
  return (
    <PageShell>
      <main className="page-content">
        <PageJsonLd
          description={publicPages["/about"].description}
          path="/about"
          title={publicPages["/about"].title}
          type="ProfilePage"
        />
        <article className="bento-surface grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <header>
            <Image
              alt="Mukul Chugh"
              className="mb-8 rounded-full border border-border bg-muted p-2"
              height={128}
              src={siteConfig.images.profileImage}
              width={128}
            />
            <PageOnly>
              <h1 className="font-heading text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                {aboutContent.heading}
              </h1>
            </PageOnly>
          </header>
          <div className="max-w-[65ch] space-y-6 text-base leading-8 text-muted-foreground">
            {aboutContent.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <PageOnly>
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
            </PageOnly>
          </div>
        </article>
      </main>
    </PageShell>
  );
}
