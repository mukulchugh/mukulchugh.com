import Image from "next/image";
import Link from "next/link";
import { siteConfig, links } from "@/lib/data";
import { syne } from "@/lib/fonts";

/**
 * BrandBar — the old sticky header, folded into the bento grid as a slim
 * full-width top tile: logo + wordmark on the left, section nav on the right.
 */
export function BrandBar() {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3.5 sm:px-6">
      <Link href="/" className="flex items-center gap-2.5" aria-label="Home">
        <Image
          src={siteConfig.images.logoLight}
          alt={siteConfig.name}
          width={26}
          height={26}
          className="h-6 w-6 object-contain"
        />
        <span
          className={`${syne.className} text-sm font-bold tracking-tight text-zinc-900`}
        >
          {siteConfig.name}
        </span>
      </Link>

      <nav className="hidden items-center gap-0.5 sm:flex">
        {links
          .filter((l) => l.name !== "Home")
          .map((l) => (
            <Link
              key={l.name}
              href={l.hash}
              className="rounded-full px-3 py-1.5 text-[13px] font-medium text-zinc-500 transition-colors hover:bg-black/[0.04] hover:text-zinc-900"
            >
              {l.name}
            </Link>
          ))}
      </nav>
    </div>
  );
}
