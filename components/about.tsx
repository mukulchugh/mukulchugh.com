"use client";

import { aboutContent } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";

export default function About() {
  const { ref } = useSectionInView("About");
  return (
    <section
      className="bento-surface min-w-0 scroll-mt-20 p-5 md:p-[1.7cqw]"
      id="about"
      ref={ref}
    >
      <div className="relative flex justify-between">
        <span className="bento-label">07 / About</span>
        <span
          aria-hidden="true"
          className="bento-marginalia absolute -top-2 right-0 max-w-[24%] text-right !text-[7px]"
        >
          Same curiosity.
          <br />
          Bigger surface area.
        </span>
      </div>
      <h2 className="mt-3 font-sans text-[clamp(24px,3.4cqw,48px)] font-extrabold leading-[.98] tracking-[-.04em] md:mt-[1.2cqw]">
        <span className="block whitespace-nowrap">Engineer turned</span>
        <span className="block whitespace-nowrap">generalist.</span>
      </h2>
      <div className="mt-3 space-y-1 text-[clamp(12px,1.1cqw,16px)] leading-[1.4] text-muted-foreground md:mt-[1cqw]">
        <p>{aboutContent.paragraphs[1]}</p>
        <p>
          Right now I&apos;m a Founding Engineer at Quivly.ai, building
          AI-powered products alongside the CTO. Before that, I built mobile
          products at Swiggy and shipped across mobile, web, and internal
          tooling at Zenduty until its acquisition.
        </p>
        <details className="pt-1">
          <summary className="w-fit cursor-pointer text-foreground underline underline-offset-4">
            More about me
          </summary>
          <div className="space-y-2 pt-2">
            {[
              aboutContent.paragraphs[0],
              aboutContent.paragraphs[2],
              ...aboutContent.paragraphs.slice(3),
            ].map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </details>
      </div>
    </section>
  );
}
