"use client";

import React from "react";
import Link from "next/link";
import { IconMail, IconFileText, IconArrowUpRight } from "@tabler/icons-react";
import { useSectionInView } from "@/lib/hooks";
import { siteConfig } from "@/lib/data";
import { cn } from "@/lib/utils";
import { syne } from "@/lib/fonts";

export function CTATile() {
  const { ref } = useSectionInView("Contact");

  return (
    <section
      ref={ref}
      id="contact"
      className="h-full p-8 sm:p-10 lg:p-12 flex flex-col items-center justify-center
                 gap-6 text-center min-h-[220px] scroll-mt-28"
    >
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-2xl bg-zinc-100 border border-zinc-200
                   flex items-center justify-center shadow-inner shadow-zinc-900/5"
      >
        <IconMail className="h-5 w-5 text-zinc-500" aria-hidden="true" />
      </div>

      {/* Heading + sub */}
      <div className="space-y-2 max-w-lg">
        <h2
          className={cn(
            syne.className,
            "text-2xl sm:text-3xl font-bold tracking-tight text-foreground"
          )}
        >
          Let&apos;s work together
        </h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed max-w-[46ch] mx-auto">
          Have a project in mind? I&apos;d love to hear about it — drop a line or
          pull up my resume.
        </p>
      </div>

      {/* CTAs */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {/* Primary — ink filled */}
        <a
          href={`mailto:${siteConfig.email.display}`}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full
                     bg-zinc-900 hover:bg-zinc-800
                     text-white text-sm font-semibold
                     shadow-[0_4px_20px_-4px_rgba(24,24,27,0.20)]
                     transition-all duration-200 hover:-translate-y-0.5"
        >
          <IconMail size={15} />
          Get in touch
        </a>

        {/* Secondary — outlined */}
        <a
          href={siteConfig.files.cv}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full
                     bg-black/[0.04] border border-black/[0.10]
                     text-sm font-semibold text-foreground
                     hover:bg-black/[0.07] hover:border-black/[0.16]
                     transition-all duration-200 hover:-translate-y-0.5"
        >
          <IconFileText size={15} />
          View Resume
          <IconArrowUpRight size={13} className="opacity-60" />
        </a>
      </div>

      {/* Email hint */}
      <p className="text-[11px] text-muted-foreground/60 tracking-wide">
        {siteConfig.email.display}
      </p>
    </section>
  );
}
