import { IconArrowLeft, IconArrowUpRight } from "@tabler/icons-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { buttonVariants } from "@/components/ui/button";
import { experiencesData, siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  alternates: { canonical: "/experience" },
  description:
    "Mukul Chugh’s work history across engineering, product, and design.",
  openGraph: {
    description: "My work across engineering, product, and design.",
    title: "Experience | Mukul Chugh",
    type: "website",
    url: `${siteConfig.siteUrl}/experience`,
  },
  title: "Experience",
};

export default function ExperiencePage() {
  return (
    <PageShell>
      <main className="page-content">
        <header className="mb-8 px-1 sm:mb-12">
          <Link
            className="mb-5 inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            href="/#experience"
          >
            <IconArrowLeft aria-hidden="true" size={16} /> Back to overview
          </Link>
          <h1 className="text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-[1.1] tracking-[-0.035em]">
            Experience
          </h1>
          <p className="mt-4 max-w-[55ch] text-base leading-relaxed text-muted-foreground">
            My work across engineering, product, and design.
          </p>
        </header>
        <ol aria-label="Work history" className="space-y-3">
          {experiencesData.map((experience) => (
            <li key={experience.company}>
              <article className="bento-surface grid min-w-0 gap-6 p-5 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-12">
                <div className="min-w-0">
                  <Image
                    alt=""
                    className="mb-5 size-12 rounded-lg bg-white p-1.5 object-contain"
                    height={48}
                    src={experience.icon}
                    unoptimized
                    width={48}
                  />
                  <h2 className="text-xl font-semibold leading-snug tracking-tight sm:text-2xl">
                    {experience.company}
                  </h2>
                  <p className="mt-2 text-base leading-relaxed">
                    {experience.title}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {experience.date}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {experience.location}
                  </p>
                </div>
                <ul className="max-w-[70ch] list-disc space-y-3 pl-5 text-base leading-relaxed text-muted-foreground marker:text-foreground/40">
                  {experience.description.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            className={buttonVariants({ variant: "outline" })}
            href="/projects"
          >
            View selected work <IconArrowUpRight aria-hidden="true" />
          </Link>
          <Link className={buttonVariants()} href="/contact">
            Get in touch <IconArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </main>
    </PageShell>
  );
}
