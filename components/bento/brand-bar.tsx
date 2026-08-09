"use client";

import Link from "next/link";
import { ThemeLogo } from "@/components/theme-logo";
import { links, siteConfig } from "@/lib/data";

/**
 * BrandBar — the old sticky header, folded into the bento grid as a slim
 * full-width top tile: logo + wordmark on the left, section nav on the right.
 */
export function BrandBar() {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3.5 sm:px-6">
      <Link aria-label="Home" className="flex items-center gap-2.5" href="/">
        <ThemeLogo className="h-6 w-6" height={26} width={26} />
        <span
          className={
            "font-syne text-sm font-bold tracking-tight text-foreground"
          }
        >
          {siteConfig.name}
        </span>
      </Link>

      <nav className="hidden items-center gap-0.5 sm:flex">
        {links
          .filter((l) => l.name !== "Home")
          .map((l) => (
            <Link
              className="rounded-full px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-foreground/[0.05] hover:text-foreground"
              href={l.hash}
              key={l.name}
            >
              {l.name}
            </Link>
          ))}
      </nav>
    </div>
  );
}
